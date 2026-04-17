import { describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../configs/app", () => ({
  __esModule: true,
  default: {
    jwt_secret: "test-secret-for-unit-tests",
    jwt_access_token_expiration: "1h"
  }
}));

import { createAuthService } from "./auth";

describe("createAuthService", () => {
  const auth = createAuthService();

  it("signs and verifies an access token with userId", () => {
    const token = auth.signAccessToken({ userId: 7 });
    const decoded = auth.verifyAccessToken(token) as { userId: number } | null;
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(7);
  });

  it("verifyAccessToken returns null for malformed token", () => {
    expect(auth.verifyAccessToken("not-a-jwt")).toBeNull();
  });

  it("verifyAccessToken returns null for token signed with another secret", () => {
    const wrong = jwt.sign({ userId: 1 }, "other-secret", { expiresIn: "1h" });
    expect(auth.verifyAccessToken(wrong)).toBeNull();
  });

  it("comparePassword returns true when hash matches", () => {
    const hash = bcrypt.hashSync("correct-horse", 8);
    expect(auth.comparePassword("correct-horse", hash)).toBe(true);
  });

  it("comparePassword returns false when hash does not match", () => {
    const hash = bcrypt.hashSync("secret", 8);
    expect(auth.comparePassword("wrong", hash)).toBe(false);
  });
});
