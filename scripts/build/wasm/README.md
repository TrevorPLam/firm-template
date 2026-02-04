---
title: WebAssembly Build Pipeline
description: Repeatable steps for building and packaging WASM modules.
---

# WebAssembly Build Pipeline

## Overview

Use the scripts in this folder to keep WASM artifacts consistent across apps and
packages. The pipeline is designed to be reproducible in CI and local builds.

## Local Build

```bash
pnpm exec wasm-pack build --target web --out-dir dist
```

## Packaging Checklist

- Output `.wasm` bundles into `public/wasm/` for app consumption.
- Generate a worker bundle when CPU-heavy tasks must stay off the main thread.
- Verify that `WASM_MODULE_PATH` matches the deployed artifact location.

## CI Notes

- Run this pipeline before deployment steps.
- Cache WASM build outputs where possible to reduce build time.
