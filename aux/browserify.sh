#!/bin/sh

set -ex

SRC=./index.js
DST=docs/js/build
MODULE=logscale-stat

webpack-cli "$SRC" --mode development -o "$DST"
mv "$DST"/main.js "$DST"/"$MODULE".js

webpack-cli "$SRC" --mode production -o "$DST"
mv "$DST"/main.js "$DST"/"$MODULE".min.js

