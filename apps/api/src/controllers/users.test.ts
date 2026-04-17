import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Response } from "express";

jest.mock("../services/index", () => ({
  usersService: {
    getUserDetails: jest.fn()
  }
}));

import { usersService } from "../services/index";
import usersController from "./users";

const getUserDetails = jest.mocked(usersService.getUserDetails);

function createMockRes() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { json, status, res: { status, json } as unknown as Response };
}

describe("usersController detailedUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns FORBIDDEN when uid does not match authenticated user", async () => {
    const { res, status, json } = createMockRes();
    const req = { params: { uid: "2" }, userId: 1 } as never;
    await usersController.detailedUsers(req, res);
    expect(getUserDetails).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Forbidden"
      })
    );
  });

  it("calls getUserDetails when uid matches authenticated user", async () => {
    getUserDetails.mockResolvedValue({
      id: 5,
      name: "A",
      email: "a@b.c",
      password: null,
      token: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      deletedAt: null
    });
    const { res, status, json } = createMockRes();
    const req = { params: { uid: "5" }, userId: 5 } as never;
    await usersController.detailedUsers(req, res);
    expect(getUserDetails).toHaveBeenCalledWith(5);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: expect.objectContaining({ id: 5, name: "A" })
      })
    );
  });
});
