#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install

echo "Checking yt-dlp installation..."
if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "Installing yt-dlp..."
  # Pin to a specific vetted version for supply chain security
  pip install yt-dlp==2024.12.13
fi

# Ensure yt-dlp is available before proceeding
if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "Error: yt-dlp is not on PATH after pip installation."
  exit 1
fi

echo "yt-dlp version:"
yt-dlp --version

# Install ffmpeg (needed by yt-dlp for audio conversion)
echo "Installing ffmpeg..."
apt-get update && apt-get install -y --no-install-recommends ffmpeg || true

echo "Build complete"
