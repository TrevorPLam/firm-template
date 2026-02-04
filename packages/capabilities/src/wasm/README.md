# WebAssembly Integration

High-performance WebAssembly integration for performance-critical computations with automatic fallbacks to JavaScript.

## Overview

This package provides a production-ready **TypeScript infrastructure layer** for integrating WebAssembly modules into your application. 

> **Note**: This implementation includes TypeScript wrappers and JavaScript fallbacks that demonstrate the API design. Actual WASM binary compilation requires Rust (with wasm-pack) or C/C++ (with Emscripten). The current version uses optimized JavaScript implementations to simulate WASM behavior.

**Features:**

- 🚀 **Performance-critical operations**: Image processing and complex mathematical calculations
- 🔄 **Automatic fallbacks**: Graceful degradation to JavaScript when WASM is unavailable
- 🎯 **Browser compatibility detection**: Smart detection of WASM features and browser support
- ⚡ **Lazy loading**: Load WASM modules on-demand with caching
- 📊 **Performance benchmarking**: Compare WASM vs JavaScript implementations
- 🛡️ **Type-safe**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
pnpm add @repo/capabilities
```

## Quick Start

```typescript
import { 
  resizeImage, 
  matrixMultiply, 
  getCompatibility 
} from '@repo/capabilities/wasm'

// Check browser compatibility
const compat = getCompatibility()
console.log('WASM supported:', compat.wasmSupported)

// Resize an image (automatically uses WASM if available)
const resized = await resizeImage(imageData, {
  width: 800,
  height: 600,
  mode: 'contain'
})

// Perform matrix multiplication
const result = await matrixMultiply(matrixA, matrixB)
```

## Features

### Image Processing

High-performance image operations with multiple filter types:

```typescript
import { 
  resizeImage, 
  compressImage, 
  applyImageFilter 
} from '@repo/capabilities/wasm'

// Resize
const resized = await resizeImage(imageData, {
  width: 1920,
  height: 1080,
  mode: 'cover',
  aspectRatio: true,
  quality: 85
})

// Compress
const compressed = await compressImage(imageData, {
  quality: 80,
  format: 'webp'
})

// Apply filters
const filtered = await applyImageFilter(imageData, {
  filter: 'grayscale',
  intensity: 75
})
```

**Supported filters:**
- `grayscale` - Convert to grayscale
- `sepia` - Apply sepia tone
- `blur` - Gaussian blur
- `sharpen` - Sharpen edges
- `brightness` - Adjust brightness
- `contrast` - Adjust contrast
- `invert` - Invert colors
- `saturate` - Adjust saturation

### Mathematical Calculations

Complex calculations optimized with WASM:

```typescript
import { 
  matrixMultiply, 
  fft, 
  linearRegression,
  kmeansClustering 
} from '@repo/capabilities/wasm'

// Matrix multiplication
const result = await matrixMultiply(
  { rows: 100, cols: 100, data: new Float64Array(10000) },
  { rows: 100, cols: 100, data: new Float64Array(10000) }
)

// Fast Fourier Transform
const { real, imag } = await fft(
  { length: 1024, data: new Float64Array(1024) },
  { inverse: false, normalize: true }
)

// Linear regression
const regression = await linearRegression(
  { length: 100, data: xData },
  { length: 100, data: yData }
)
console.log('R-squared:', regression.rSquared)

// K-means clustering
const clusters = await kmeansClustering(
  { rows: 1000, cols: 10, data: dataPoints },
  5, // number of clusters
  100 // max iterations
)
```

### Browser Compatibility

Detect WebAssembly support and features:

```typescript
import { 
  detectWasmSupport,
  getCompatibilityReport,
  shouldUseWasm,
  getFeatureFlags
} from '@repo/capabilities/wasm'

// Get detailed compatibility info
const compat = detectWasmSupport()
console.log(compat)
// {
//   wasmSupported: true,
//   streamingSupported: true,
//   simdSupported: true,
//   threadsSupported: false,
//   browser: 'chrome',
//   version: '120'
// }

// Get human-readable report
console.log(getCompatibilityReport(compat))

// Check if WASM should be used
const useWasm = shouldUseWasm(compat, 'auto')

// Get feature flags
const features = getFeatureFlags('prefer-wasm')
console.log('Recommended:', features.recommendedImpl)
```

### Fallback Strategies

Control how the system handles WASM availability:

```typescript
import { resizeImage } from '@repo/capabilities/wasm'

// Auto mode (default) - Uses WASM on well-supported browsers
await resizeImage(imageData, options, { 
  fallback: 'auto' 
})

// Always prefer WASM if available
await resizeImage(imageData, options, { 
  fallback: 'prefer-wasm' 
})

// Always use JavaScript
await resizeImage(imageData, options, { 
  fallback: 'always-js' 
})

// Require WASM (throws if unavailable)
await resizeImage(imageData, options, { 
  fallback: 'always-wasm' 
})
```

### Lazy Loading

WASM modules are loaded on-demand and cached:

```typescript
import { 
  LazyWasmModule,
  preloadWasmModule,
  clearModuleCache,
  getCacheStats
} from '@repo/capabilities/wasm'

// Preload a module for faster first use
await preloadWasmModule('/wasm/image-processing.wasm')

// Create a custom lazy module
const module = new LazyWasmModule('custom', '1.0.0', {
  url: '/wasm/custom.wasm',
  streaming: true,
  memory: { initial: 256, maximum: 1024 }
})

// Load when needed
await module.ensureLoaded()
const fn = module.getFunction('process_data')

// Check cache
const stats = getCacheStats()
console.log('Cached modules:', stats.urls)

// Clear cache if needed
clearModuleCache()
```

### Performance Benchmarking

Compare WASM vs JavaScript performance:

```typescript
import { 
  runBenchmarkSuite,
  benchmarkImageResize,
  formatBenchmarkResults,
  compareImplementations
} from '@repo/capabilities/wasm'

// Run full benchmark suite
const results = await runBenchmarkSuite({
  iterations: 100,
  warmup: 10,
  compareWithJS: true
})

console.log(formatBenchmarkResults(results))
// Performance Benchmark Results
// ================================================================================
// 
// imageResize:
//   WASM: 12.34ms (81 ops/s)
//   JS:   45.67ms (22 ops/s)
//   Speedup: 3.70x (270.0% faster)

// Benchmark specific operations
const resizeBench = await benchmarkImageResize({
  iterations: 50,
  dataSize: 2048,
  compareWithJS: true
})

// Custom benchmarks
const custom = await compareImplementations(
  'custom-operation',
  async () => { /* WASM implementation */ },
  async () => { /* JS implementation */ },
  { iterations: 100 }
)
```

## Configuration

Configure WASM through environment variables:

```bash
# Enable/disable WASM
WASM_ENABLED=true

# Path to WASM modules
WASM_MODULE_PATH=/public/wasm/

# Worker path for off-main-thread execution
WASM_WORKER_PATH=/workers/wasm-worker.js

# Enable debug logging
WASM_DEBUG=true

# Target environment
WASM_TARGET=browser
```

Access configuration in code:

```typescript
import { getWasmConfig, validateWasmConfig } from '@repo/capabilities/wasm'

const config = getWasmConfig()
const issues = validateWasmConfig(config)

if (issues.length > 0) {
  console.error('Configuration issues:', issues)
}
```

## Architecture

### Module Structure

```
wasm/
├── types.ts                 # TypeScript type definitions
├── loader.ts               # WASM module loader with caching
├── index.ts                # Main exports
├── config/
│   └── index.ts           # Configuration management
├── modules/
│   ├── image-processing.ts # Image operations
│   └── calculations.ts     # Mathematical computations
├── benchmarks/
│   └── performance.ts      # Performance testing
└── fallback/
    └── compatibility.ts    # Browser detection & fallbacks
```

### Design Principles

1. **Graceful Degradation**: Always provide JavaScript fallbacks
2. **Performance First**: Use WASM for compute-intensive tasks
3. **Type Safety**: Comprehensive TypeScript types
4. **Memory Efficiency**: Proper memory management with typed arrays
5. **Browser Compatibility**: Support major browsers (Chrome 69+, Firefox 62+, Safari 14+)

## Best Practices

### 1. Use Appropriate Data Sizes

WASM overhead makes it beneficial primarily for large datasets:

```typescript
// ✅ Good - Large image (WASM shines)
await resizeImage(largeImageData, options) // 4096x4096

// ⚠️ Consider - Small image (overhead may not be worth it)
await resizeImage(smallImageData, options, { 
  fallback: 'auto' // Let system decide
})
```

### 2. Preload Critical Modules

Reduce latency for critical operations:

```typescript
// At app initialization
import { preloadWasmModule } from '@repo/capabilities/wasm'

await preloadWasmModule('/wasm/image-processing.wasm')
await preloadWasmModule('/wasm/calculations.wasm')
```

### 3. Handle Errors Gracefully

Always handle potential WASM errors:

```typescript
import { WasmError } from '@repo/capabilities/wasm'

try {
  await resizeImage(imageData, options, { 
    fallback: 'always-wasm' 
  })
} catch (error) {
  if (error instanceof WasmError) {
    console.error('WASM error:', error.type, error.message)
    // Handle WASM-specific error
  }
}
```

### 4. Monitor Performance

Use benchmarks to validate WASM benefits:

```typescript
// In development, benchmark your specific use case
const benchmark = await compareImplementations(
  'my-operation',
  () => wasmImplementation(),
  () => jsImplementation(),
  { iterations: 100 }
)

// Only use WASM if it provides meaningful speedup
if (benchmark.speedup < 1.5) {
  console.warn('WASM provides minimal benefit, consider JS-only')
}
```

### 5. Memory Management

Be mindful of memory usage with large operations:

```typescript
// Process large datasets in chunks
async function processLargeImage(largeImageData) {
  const chunkSize = 2048
  const chunks = splitIntoChunks(largeImageData, chunkSize)
  
  const results = []
  for (const chunk of chunks) {
    const processed = await resizeImage(chunk, options)
    results.push(processed)
  }
  
  return mergeChunks(results)
}
```

## Limitations & Known Issues

### Current Implementation

This is a **TypeScript infrastructure layer** that demonstrates the API design. Actual WASM binary compilation requires:

- Rust with `wasm-pack` or `wasm-bindgen`
- C/C++ with Emscripten
- AssemblyScript

The current implementation uses JavaScript fallbacks to simulate WASM behavior.

### Browser Support

- **Minimum versions**: Chrome 69+, Firefox 62+, Safari 14+, Edge 79+
- **SIMD**: Chrome 91+, Firefox 89+, Safari 16.4+
- **Threads**: Requires cross-origin isolation (COOP/COEP headers)

### Performance Considerations

- WASM has startup overhead (compilation + instantiation)
- Small operations may be faster in pure JavaScript
- Memory copies between JS and WASM have overhead
- Optimal for CPU-intensive tasks with large datasets

## Future Enhancements

- [ ] Actual WASM binary implementations in Rust
- [ ] SIMD optimizations for supported operations
- [ ] Multi-threaded processing with Workers
- [ ] GPU acceleration via WebGPU fallback
- [ ] Additional image formats (AVIF, JPEG XL)
- [ ] More mathematical operations (PCA, neural networks)
- [ ] Streaming processing for large files

## Examples

### Example 1: Image Thumbnail Generation

```typescript
import { resizeImage, compressImage } from '@repo/capabilities/wasm'

async function generateThumbnail(
  imageData: ImageData,
  size: number
): Promise<Uint8Array> {
  // Resize to thumbnail size
  const resized = await resizeImage(imageData, {
    width: size,
    height: size,
    mode: 'cover'
  })
  
  // Compress with high quality
  const compressed = await compressImage(resized, {
    format: 'webp',
    quality: 85
  })
  
  return compressed
}
```

### Example 2: Batch Image Processing

```typescript
async function batchProcessImages(
  images: ImageData[]
): Promise<ImageData[]> {
  return Promise.all(
    images.map(img => 
      applyImageFilter(img, { 
        filter: 'grayscale', 
        intensity: 100 
      })
    )
  )
}
```

### Example 3: Data Analysis Pipeline

```typescript
import { matrixMultiply, linearRegression } from '@repo/capabilities/wasm'

async function analyzeData(
  features: Matrix,
  labels: Vector
) {
  // Normalize features
  const normalized = await matrixMultiply(
    features,
    normalizationMatrix
  )
  
  // Perform regression
  const regression = await linearRegression(
    { length: normalized.rows, data: normalized.data },
    labels
  )
  
  return {
    coefficients: regression.coefficients,
    accuracy: regression.rSquared
  }
}
```

## Testing

Test your WASM integration:

```typescript
import { detectWasmSupport, getCompatibility } from '@repo/capabilities/wasm'

describe('WASM Integration', () => {
  it('should detect WASM support', () => {
    const compat = detectWasmSupport()
    expect(compat.wasmSupported).toBeDefined()
  })
  
  it('should fallback to JS when needed', async () => {
    const result = await resizeImage(imageData, options, {
      fallback: 'always-js'
    })
    expect(result).toBeDefined()
  })
})
```

## Contributing

When adding new WASM functionality:

1. Add TypeScript types to `types.ts`
2. Implement both WASM and JS versions
3. Add fallback logic in the module
4. Create benchmarks for performance validation
5. Update this README with examples
6. Add tests for both implementations

## License

See the repository root LICENSE file.

## Resources

- [WebAssembly.org](https://webassembly.org/)
- [MDN WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [wasm-bindgen Book](https://rustwasm.github.io/wasm-bindgen/)
- [Emscripten Documentation](https://emscripten.org/)
