import { describe, expect, it } from "vitest";
import { signupUrl } from "./updates";

describe("the sign-up link", () => {
  it("is null when it is not set", () => {
    expect(signupUrl("")).toBeNull();
    expect(signupUrl(undefined)).toBeNull();
  });

  it("accepts an https Flodesk link", () => {
    expect(signupUrl("https://my.flodesk.com/abc123")).toBe("https://my.flodesk.com/abc123");
    expect(signupUrl("https://flodesk.com/x")).toBe("https://flodesk.com/x");
  });

  it("refuses anything that is not an https link on flodesk.com", () => {
    expect(signupUrl("http://my.flodesk.com/abc")).toBeNull();
    expect(signupUrl("https://evil.example.com/flodesk.com")).toBeNull();
    expect(signupUrl("https://notflodesk.com/abc")).toBeNull();
    expect(signupUrl("javascript:alert(1)")).toBeNull();
    expect(signupUrl("not a url")).toBeNull();
  });
});
