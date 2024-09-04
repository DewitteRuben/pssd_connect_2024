#!/bin/bash

git -C $LOCAL_DIR pull || { echo "Failed to pull"; exit 1; }