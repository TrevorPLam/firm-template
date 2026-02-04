---
title: WebAssembly Integration Guide
description: Configuration, build pipeline, and runtime guidelines for WASM modules.
---

# WebAssembly Integration Guide

## Overview

WebAssembly (WASM) is used for performance-critical workloads that benefit from
near-native execution in the browser or server runtime.

## Environment Configuration

```bash
# .env.local (example)
WASM_ENABLED=false
WASM_MODULE_PATH=/wasm/module.wasm
WASM_WORKER_PATH=/wasm/worker.js
WASM_DEBUG=false
WASM_TARGET=browser
```

## Config Helper (Example)

```ts
import { getWasmConfig } from '@repo/capabilities/wasm'

const wasmConfig = getWasmConfig()

// Use wasmConfig to control module loading + feature flags.
console.log(wasmConfig.enabled, wasmConfig.modulePath)
```

## Build Pipeline Notes

- Generate `.wasm` artifacts in `scripts/build/wasm` to keep bundles consistent.
- Provide a worker bundle when modules perform CPU-heavy work.
- Run benchmarks after each pipeline change to track regressions.

See [`scripts/build/wasm/README.md`](../../scripts/build/wasm/README.md) for the
current build checklist and commands.

Run `scripts/build/wasm/build.sh` to generate the default web-targeted bundle.

## Operational Checklist

- Validate browser compatibility before enabling WASM.
- Provide JS fallbacks for unsupported environments.
- Track performance improvements and error rates.
