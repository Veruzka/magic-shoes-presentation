#!/bin/sh
# Makes the small web copy of every sound original.
#
#   npm run sound:web
#
# Reads the untouched originals in sounds/<category>/<role>/ and writes an
# AAC (.m4a) copy with the same name to public/sounds/<category>/<role>/.
# Only new or changed originals are converted, so it's safe to run any time.
# Uses afconvert, which is built into every Mac (nothing to install).
# The app loads only the web copies, listed in sounds.json.
set -e
cd "$(dirname "$0")/../.."
made=0; skipped=0
for src in $(find sounds -type f \( -iname '*.wav' -o -iname '*.aif' -o -iname '*.aiff' -o -iname '*.mp3' -o -iname '*.flac' -o -iname '*.m4a' \)); do
  out="public/${src%.*}.m4a"
  if [ -f "$out" ] && ! [ "$src" -nt "$out" ]; then skipped=$((skipped + 1)); continue; fi
  mkdir -p "$(dirname "$out")"
  # AAC at 128 kbps, the format's quality setting at its best (127).
  afconvert -f m4af -d aac -b 128000 -q 127 "$src" "$out"
  echo "made  $out  ($(du -h "$src" | cut -f1) -> $(du -h "$out" | cut -f1))"
  made=$((made + 1))
done
# Web copies whose original is gone (renamed or deleted): list them, don't delete.
if [ -d public/sounds ]; then
  for web in $(find public/sounds -type f -name '*.m4a'); do
    base="${web#public/}"; base="${base%.m4a}"
    ls "$base".* >/dev/null 2>&1 || echo "orphan $web  (no original; delete it if it's not needed)"
  done
fi
echo "done: $made made, $skipped already up to date"
