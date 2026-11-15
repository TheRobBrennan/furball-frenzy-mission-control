import { describe, expect, it } from "vitest";
import { caseLabel, hashTarget } from "./binder";

describe("caseLabel", () => {
  it("says Open the case the first time", () => {
    expect(caseLabel(true, false)).toBe("Open the case");
  });
  it("says Reopen the case once it has been opened and closed again", () => {
    expect(caseLabel(true, true)).toBe("Reopen the case");
  });
  it("says Close the case while it is open", () => {
    expect(caseLabel(false, true)).toBe("Close the case");
    expect(caseLabel(false, false)).toBe("Close the case");
  });
});

describe("hashTarget", () => {
  const ids = ["launch-sites", "the-brief", "classified", "origin-stories"];
  it("returns a section to open and scroll to", () => {
    expect(hashTarget("#origin-stories", ids)).toBe("origin-stories");
    expect(hashTarget("classified", ids)).toBe("classified");
  });
  it("resolves an older id to its new name", () => {
    expect(hashTarget("#stories", ids)).toBe("origin-stories");
    expect(hashTarget("#crew", ids)).toBe("launch-sites");
    expect(hashTarget("#story", ids)).toBe("the-brief");
  });
  it("ignores an empty hash, the cover, and the footer", () => {
    expect(hashTarget("", ids)).toBeNull();
    expect(hashTarget("#", ids)).toBeNull();
    expect(hashTarget("#top", ids)).toBeNull();
    expect(hashTarget("#footer", ids)).toBeNull();
  });
  it("ignores a hash that names nothing on the page", () => {
    expect(hashTarget("#nope", ids)).toBeNull();
  });
});
