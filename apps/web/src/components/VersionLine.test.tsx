// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import VersionLine from "@/components/VersionLine";
import { REPO_URL, getVersionInfo } from "@/lib/version";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("footer version card", () => {
  it("shows the version and links to the repository", () => {
    render(<VersionLine />);

    expect(screen.getByTestId("version-line").textContent).toContain(`v${getVersionInfo().version}`);
    expect(screen.getByTitle("View the repository on GitHub").getAttribute("href")).toBe(REPO_URL);
  });

  it("shows the release timestamp and commit when provided by the build", async () => {
    const commit = "1234567890abcdef";
    vi.stubEnv("NEXT_PUBLIC_GIT_HASH", commit);
    vi.stubEnv("NEXT_PUBLIC_BUILD_TIME", "2026-11-25T21:00:00Z");
    render(<VersionLine />);

    expect(await screen.findByText(/^Released \d{4}\.\d{2}\.\d{2} @ /)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: commit.slice(0, 7) })).toHaveAttribute("href", `${REPO_URL}/commit/${commit}`);
  });

  it.each(["dev", "invalid"])("omits the release line for %s build metadata", (value) => {
    vi.stubEnv("NEXT_PUBLIC_BUILD_TIME", value);
    render(<VersionLine />);

    expect(screen.queryByText(/^Released /)).not.toBeInTheDocument();
  });
});
