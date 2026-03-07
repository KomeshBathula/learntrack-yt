#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install

# Install yt-dlp via pip (Python is available on Render's Node runtime)
echo "Installing yt-dlp..."
pip install yt-dlp

# Install ffmpeg (needed by yt-dlp for audio conversion)
echo "Installing ffmpeg..."
apt-get update && apt-get install -y --no-install-recommends ffmpeg || true

echo "yt-dlp version:"
yt-dlp --version || echo "yt-dlp installed via pip"

echo "Build complete"
