#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install

# Create a bin directory for binaries
mkdir -p bin

# 1. Install yt-dlp
echo "Installing yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ./bin/yt-dlp
chmod +x ./bin/yt-dlp

# 2. Install FFmpeg (Static Build)
echo "Installing FFmpeg..."
# Download a lightweight static build of ffmpeg
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz
tar -xf ffmpeg.tar.xz
# Move the binary to our bin folder (find the folder it created)
find . -name "ffmpeg" -type f -exec cp {} ./bin/ \;
# Cleanup
rm -rf ffmpeg.tar.xz ffmpeg-*-amd64-static

echo "Binaries installed to ./bin"
ls -l ./bin
