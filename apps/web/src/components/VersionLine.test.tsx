// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import VersionLine from "@/components/VersionLine";
import { REPO_URL, getVersionInfo } from "@/lib/version";

afterEach(cleanup);

describe("footer version card", () => {
  it("shows the version and links to the repository", () => {
    render(<VersionLine />);

    expect(screen.getByTestId("version-line").textContent).toContain(`v${getVersionInfo().version}`);
    expect(screen.getByTitle("View the repository on GitHub").getAttribute("href")).toBe(REPO_URL);
  });
});
