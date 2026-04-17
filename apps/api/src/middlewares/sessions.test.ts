import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../services/index", () => ({
  authService: {
    verifyAccessToken: jest.fn()
  }
}));

import { authService } from "../services/index";
import { session } from "./sessions";

const verifyAccessToken = jest.mocked(authService.verifyAccessToken);

function createMockRes() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { json, status, res: { status, json } as unknown as Response };
}

describe("session middleware", () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    verifyAccessToken.mockReset();
  });

  it("responds UNAUTHORIZED when both tokens are missing", async () => {
    const { res, status } = createMockRes();
    const req = { headers: {} } as Request;
    await session(req as never, res, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds UNAUTHORIZED when access token is missing but refresh is present", async () => {
    const { res, status } = createMockRes();
    const req = { headers: { "x-refresh-token": "refresh-only" } } as unknown as Request;
    await session(req as never, res, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds UNAUTHORIZED when verifyAccessToken returns null", async () => {
    verifyAccessToken.mockReturnValue(null);
    const { res, status } = createMockRes();
    const req = {
      headers: { "x-access-token": "bad", "x-refresh-token": "r" }
    } as unknown as Request;
    await session(req as never, res, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds UNAUTHORIZED when payload has no userId", async () => {
    verifyAccessToken.mockReturnValue({ id: 1 });
    const { res, status } = createMockRes();
    const req = { headers: { "x-access-token": "tok" } } as unknown as Request;
    await session(req as never, res, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("sets userId and calls next when token is valid", async () => {
    verifyAccessToken.mockReturnValue({ userId: 42 });
    const { res } = createMockRes();
    const req = { headers: { "x-access-token": "valid" } } as Record<string, unknown>;
    await session(req as never, res, next);
    expect((req as { userId?: number }).userId).toBe(42);
    expect(next).toHaveBeenCalled();
  });
});
