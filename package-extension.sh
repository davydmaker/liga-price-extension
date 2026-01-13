#!/bin/bash

VERSION=$(grep '"version"' extension/manifest.json | cut -d'"' -f4)
OUTPUT_FILE="ligaprice-extension-v${VERSION}.zip"

echo "Packaging LigaPrice v${VERSION}..."

cd extension
zip -r "../${OUTPUT_FILE}" . \
  -x "docs/*" \
  -x ".git/*" \
  -x "*.DS_Store" \
  -x "PACKAGING.md" \
  -x "*.md" \
  -x ".gitignore" \
  -x "LICENSE"

cd ..

if [ -f "${OUTPUT_FILE}" ]; then
    SIZE=$(du -h "${OUTPUT_FILE}" | cut -f1)
    echo "Package created successfully!"
    echo "File: ${OUTPUT_FILE}"
    echo "Size: ${SIZE}"
    echo ""
    echo "Next steps:"
    echo "   1. Visit: https://chrome.google.com/webstore/devconsole"
    echo "   2. Upload file: ${OUTPUT_FILE}"
    echo "   3. Chrome Web Store will generate your private key automatically"
else
    echo "Error creating package"
    exit 1
fi
