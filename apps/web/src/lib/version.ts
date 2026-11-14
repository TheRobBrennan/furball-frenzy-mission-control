import pkg from "../../package.json";

// The release version comes from package.json, which the version-bump workflow updates on every
// merge to main. The commit and the deploy time are baked in when the Docker image is built
// (see the web Dockerfile), so a deployed page shows the commit it was built from and when.
// Local development shows "dev" and no time.
export const REPO_URL =
  "https://github.com/TheRobBrennan/furball-frenzy-mission-control";

export type VersionInfo = {
  version: string;
  gitHash: string | null;
  deployedAt: string | null;
};

const unset = (value: string | undefined) =>
  !value || value === "dev" || value === "unknown" ? null : value;

export function getVersionInfo(): VersionInfo {
  return {
    version: pkg.version,
    gitHash: unset(process.env.NEXT_PUBLIC_GIT_HASH),
    deployedAt: unset(process.env.NEXT_PUBLIC_BUILD_TIME),
  };
}
