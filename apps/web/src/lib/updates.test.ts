import { afterEach, describe, expect, it } from "vitest";
import { FLODESK_FORM_ID, formId, loadFlodesk, showForm } from "./updates";

type W = Window & { fd?: ((...a: unknown[]) => void) & { q?: unknown[][] }; FlodeskObject?: string };

afterEach(() => {
  delete (window as W).fd;
  delete (window as W).FlodeskObject;
  document.head.querySelectorAll("script[src*='flodesk']").forEach((s) => s.remove());
});

describe("the Flodesk form", () => {
  it("uses the form id from the embed code, can be overridden, and can be turned off", () => {
    expect(formId("")).toBe(FLODESK_FORM_ID);
    expect(formId(undefined)).toBe(FLODESK_FORM_ID);
    expect(formId("abcdef1234567890abcdef12")).toBe("abcdef1234567890abcdef12");
    expect(formId("none")).toBeNull();
    expect(formId("<script>")).toBeNull();
  });

  it("loads Flodesk's script from assets.flodesk.com only, once, as a module and a fallback", () => {
    loadFlodesk();
    loadFlodesk();
    const srcs = [...document.head.querySelectorAll("script")].map((s) => s.src).filter((s) => s.includes("flodesk"));
    expect(srcs).toHaveLength(2);
    expect(srcs[0]).toMatch(/^https:\/\/assets\.flodesk\.com\/universal\.mjs\?v=\d+$/);
    expect(srcs[1]).toMatch(/^https:\/\/assets\.flodesk\.com\/universal\.js\?v=\d+$/);
    expect((window as W).FlodeskObject).toBe("fd");
  });

  it("asks Flodesk to show the form in the container, queued until its script arrives", () => {
    showForm("abc123abc123abc123abc123", "fd-box");
    expect((window as W).fd?.q).toEqual([[ "form", { formId: "abc123abc123abc123abc123", containerEl: "#fd-box" } ]]);
  });

  it("sends nothing to Flodesk until asked", () => {
    expect(document.head.querySelectorAll("script[src*='flodesk']")).toHaveLength(0);
    expect((window as W).fd).toBeUndefined();
  });
});
