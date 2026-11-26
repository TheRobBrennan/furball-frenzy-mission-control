#!/usr/bin/env bash
# Watch Furball Frenzy events arrive in the terminal with PostHog's viewer, posthog-live.
# https://posthog.com/docs/activity#terminal-live-events-posthog-live
# Extra arguments pass through, for example: npm run posthog:live -- --event-type mission_scene_viewed
set -euo pipefail

project_id=768669
# Pinned build and its published SHA-256, so a changed download is refused. Bump both together.
release=posthog-live-20261104-192555

case "$(uname -s)-$(uname -m)" in
  Darwin-arm64) asset=posthog-live-darwin-arm64; sha=a187ccd05c8a6eb7c85f2c49a96f16eade322de382851c8f8f13e68e69f34b13 ;;
  Darwin-x86_64) asset=posthog-live-darwin-amd64; sha=189281f76a936dea47858968c6cdfb2bff542da355388217b1c35053d0628d7d ;;
  Linux-aarch64 | Linux-arm64) asset=posthog-live-linux-arm64; sha=ee9681e9b19a8f1f3347e54b3e2190d8cff10f38b63dc4fe7a313ae116b1b363 ;;
  Linux-x86_64) asset=posthog-live-linux-amd64; sha=3a46f580e1a7c2486fba2d1c50558437632e91dd10a655382cc020a43ed6d49a ;;
  *) echo "posthog-live has no build for $(uname -s) $(uname -m)" >&2; exit 1 ;;
esac

root="$(cd "$(dirname "$0")/.." && pwd)"
bin="$root/.tools/$release/$asset"

checksum() {
  if command -v sha256sum >/dev/null; then sha256sum "$1"; else shasum -a 256 "$1"; fi | cut -d' ' -f1
}

if [[ ! -x "$bin" || "$(checksum "$bin")" != "$sha" ]]; then
  mkdir -p "$(dirname "$bin")"
  echo "Downloading $asset from the PostHog GitHub release $release"
  curl -fsSL "https://github.com/PostHog/posthog/releases/download/$release/$asset" -o "$bin.part"
  if [[ "$(checksum "$bin.part")" != "$sha" ]]; then
    rm -f "$bin.part"
    echo "Checksum mismatch, refusing to run the download" >&2
    exit 1
  fi
  chmod +x "$bin.part"
  mv "$bin.part" "$bin"
fi

# The viewer caches one sign-in for a week. Set aside one that belongs to a different project.
config="$HOME/.posthog/livestream.json"
if [[ -f "$config" ]] && grep -q '"team_id"' "$config" && ! grep -Eq "\"team_id\": *$project_id([^0-9]|$)" "$config"; then
  mv "$config" "$config.bak"
  echo "Saved sign-in was for another project, moved to $config.bak"
fi
if [[ ! -f "$config" ]]; then
  echo "Before authorizing, switch PostHog to the Furball Frenzy project: https://us.posthog.com/project/$project_id/home"
fi

exec "$bin" --host https://us.posthog.com "$@"
