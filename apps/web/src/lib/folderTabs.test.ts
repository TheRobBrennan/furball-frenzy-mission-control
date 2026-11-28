import { afterEach, describe, expect, it } from "vitest";
import { rememberFolded, sectionTabs, wereFolded } from "./folderTabs";

afterEach(() => window.sessionStorage.clear());

describe("folder tabs", () => {
  it("remembers they were folded, until they have fanned out again", () => {
    expect(wereFolded()).toBe(false);
    rememberFolded(true);
    expect(wereFolded()).toBe(true);
    rememberFolded(false);
    expect(wereFolded()).toBe(false);
    expect(sectionTabs).toHaveLength(4);
  });
});
