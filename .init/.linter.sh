#!/bin/bash
cd /home/kavia/workspace/code-generation/app-store-platform-215276-215292/app_store_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

