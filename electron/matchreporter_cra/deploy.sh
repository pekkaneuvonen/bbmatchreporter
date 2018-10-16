#!/bin/sh
npm run build
rm -rf ../../matchreporter_backend/build
cp -r build ../../matchreporter_backend/