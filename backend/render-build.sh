#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install

echo "Installing/Updating yt-dlp to latest version to bypass YouTube bot blocks..."
pip install -U yt-dlp

# Ensure yt-dlp is available before proceeding
if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "Error: yt-dlp is not on PATH after pip installation."
  exit 1
fi

echo "yt-dlp version:"
yt-dlp --version

# We no longer install ffmpeg here. The Render Node runtime has a read-only OS filesystem,
# so apt-get fails. Instead, we configure yt-dlp to download raw audio without converting,
# which avoids the need for ffmpeg entirely.
echo "Build complete"
