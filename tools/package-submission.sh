#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
RMS_SOURCE="$ROOT_DIR/Mirrorwake.rms"
RMS_RELEASE="$DIST_DIR/Mirrorwake-Garrison-2026-v0.3.2.rms"
ARCHIVE="$DIST_DIR/Mirrorwake-Garrison-2026-v0.3.2.zip"
SCREENSHOT_DIR="$ROOT_DIR/submission/screenshots"
SCREENSHOTS=(
    "$SCREENSHOT_DIR/01-captureage-overview.png"
    "$SCREENSHOT_DIR/02-smile-and-nose.png"
    "$SCREENSHOT_DIR/03-ear-start.png"
    "$SCREENSHOT_DIR/04-hybrid-routes.png"
)

node "$ROOT_DIR/tools/validate-rms.mjs"

for screenshot in "${SCREENSHOTS[@]}"; do
    if [[ ! -s "$screenshot" ]]; then
        printf 'Missing required in-game screenshot: %s\n' "$screenshot" >&2
        exit 1
    fi
    if [[ "$(file -b --mime-type "$screenshot")" != "image/png" ]]; then
        printf 'Required screenshot is not a PNG: %s\n' "$screenshot" >&2
        exit 1
    fi
done

mkdir -p "$DIST_DIR"
cp "$RMS_SOURCE" "$RMS_RELEASE"

zip -j -X -FS "$ARCHIVE" \
    "$RMS_SOURCE" \
    "$ROOT_DIR/submission/discord-submission.txt" \
    "${SCREENSHOTS[@]}"

unzip -t "$ARCHIVE"
printf 'Built %s\n' "$RMS_RELEASE"
printf 'Built %s\n' "$ARCHIVE"
