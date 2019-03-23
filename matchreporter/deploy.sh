#!/bin/sh
npm run build
rm -rf ../../../bbmatchreporter/build
cp -r build ../../../bbmatchreporter/