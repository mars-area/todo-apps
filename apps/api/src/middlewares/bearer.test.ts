import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../configs/app", () => ({
  __esModule: true,
  default: {
    bearer_token: "expected-api-bearer"
  }
}));

import bearer from "./bearer";

function createMockRes() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { json, status, res: { status, json } as unknown as Response };
}

function baseReq(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    socket: { remoteAddress: "127.0.0.1" },
    ...overrides
  } as Request;
}

describe("bearer middleware", () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("responds UNAUTHORIZED when Authorization header is missing", async () => {
    const { res, status } = createMockRes();
    const req = baseReq({ headers: { "x-forwarded-for": "10.0.0.1" } });
    await bearer(req, res, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds UNAUTHORIZED when bearer token does not match config", async () => {
    const { res, status } = createMockRes();
    const req = baseReq({
      headers: {
        authorization: "Bearer wrong-token",
        "x-forwarded-for": "10.0.0.2"
      }
    });
    await bearer(req, res, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds UNAUTHORIZED when IP cannot be determined", async () => {
    const { res, status } = createMockRes();
    const req = baseReq({
      headers: { authorization: "Bearer expected-api-bearer" },
      socket: {} as unknown as Request["socket"]
    });
    await bearer(req, res, next);
    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("sets ipAddress from x-forwarded-for and calls next when token is valid", async () => {
    const { res } = createMockRes();
    const req = baseReq({
      headers: {
        authorization: "Bearer expected-api-bearer",
        "x-forwarded-for": "203.0.113.1, 10.0.0.1"
      }
    }) as Request & { ipAddress?: string };
    await bearer(req, res, next);
    expect(req.ipAddress).toBe("203.0.113.1");
    expect(next).toHaveBeenCalled();
  });

  it("uses socket.remoteAddress when x-forwarded-for is absent", async () => {
    const { res } = createMockRes();
    const req = baseReq({
      headers: { authorization: "Bearer expected-api-bearer" },
      socket: { remoteAddress: "::1" } as unknown as Request["socket"]
    }) as Request & { ipAddress?: string };
    await bearer(req, res, next);
    expect(req.ipAddress).toBe("::1");
    expect(next).toHaveBeenCalled();
  });
});
