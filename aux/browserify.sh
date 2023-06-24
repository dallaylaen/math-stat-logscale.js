#!/bin/sh

set -ex

DST=docs/js/build

compile() {
  webpack-cli "$1" --mode development -o "$DST"
  mv -f "$DST"/main.js "$DST/$2".js

  webpack-cli "$1" --mode production -o "$DST"
  mv -f "$DST"/main.js "$DST/$2".min.js
}

compile ./index.js stats-logscale


