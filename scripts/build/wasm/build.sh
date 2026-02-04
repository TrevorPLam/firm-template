#!/usr/bin/env bash
set -euo pipefail

# Build the WASM bundle for web targets.
# Adjust the package path once wasm sources are available.

pnpm exec wasm-pack build --target web --out-dir dist
