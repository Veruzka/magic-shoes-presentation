#!/bin/sh
# Runs one of the image tools in this folder (written in Swift, using Apple's
# built-in image tools). Builds it the first time, then reuses the build.
#
#   sh tools/images/run.sh cutout  <in.png> <out.png>
#   sh tools/images/run.sh outline <image.png> [step]
#   sh tools/images/run.sh bands   <image.png> row|col <number>
# (or the npm shortcuts: npm run image:cutout -- in.png out.png, etc.)
#
# Setup quirk: the newest macOS toolkit (SDK) on this Mac doesn't match the
# installed Swift, so we use MacOSX26.5.sdk. Override with SWIFT_SDK=/path if needed.
set -e
tool="$1"; shift
here="$(cd "$(dirname "$0")" && pwd)"
sdk="${SWIFT_SDK:-/Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk}"
bin="$here/.build/$tool"
mkdir -p "$here/.build"
if [ ! -x "$bin" ] || [ "$here/$tool.swift" -nt "$bin" ]; then
  swiftc -sdk "$sdk" "$here/$tool.swift" -o "$bin"
fi
"$bin" "$@"
