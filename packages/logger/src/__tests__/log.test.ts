import { describe, it, expect, jest } from "@jest/globals";
import { log } from "..";

jest.spyOn(global.console, "log");

describe("@repo/logger", () => {
  it("prints a message", () => {
    log.info("hello");
    expect(console.log).toHaveBeenCalled();
  });
});
