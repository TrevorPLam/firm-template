# Image Optimization

Comprehensive image optimization system with CDN integration, lazy loading, placeholders, and performance monitoring.

## Features

- **CDN Integration**: Cloudinary and ImageKit support with automatic transformations
- **Lazy Loading**: Advanced IntersectionObserver-based lazy loading with placeholders
- **Image Processing**: Client-side and server-side image transformations
- **Placeholder Strategies**: LQIP, Blurhash, color extraction, and SVG placeholders
- **Performance Monitoring**: Real-time image loading metrics and optimization recommendations
- **Responsive Images**: Automatic srcset generation and picture element creation
- **Modern Formats**: WebP and AVIF support with automatic format selection

## Installation

```bash
npm install @firm/capabilities
```

## Quick Start

### Auto-Initialize with Defaults

```typescript
import { autoInitImageOptimization } from '@firm/capabilities/images'

const optimizer = autoInitImageOptimization({
  lazyLoading: true,
  placeholder: 'lqip',
  monitoring: true,
})

// Images with data-src attribute will be automatically lazy loaded
```

### Cloudinary Integration

```typescript
import { createCloudinaryService } from '@firm/capabilities/images'

const cloudinary = createCloudinaryService({
  provider: 'cloudinary',
  cloudName: 'your-cloud-name',
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  secure: true,
})

// Get optimized image URL
const url = cloudinary.getImageUrl('sample.jpg', {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 80,
  format: 'webp',
})

// Generate responsive srcset
const srcset = cloudinary.generateSrcSet({
  src: 'sample.jpg',
  breakpoints: [320, 640, 768, 1024, 1280],
  transformations: {
    crop: 'fill',
    gravity: 'auto',
    quality: 80,
  },
})
```

### ImageKit Integration

```typescript
import { createImageKitService } from '@firm/capabilities/images'

const imagekit = createImageKitService({
  provider: 'imagekit',
  urlEndpoint: 'https://ik.imagekit.io/your-id',
  publicKey: 'your-public-key',
  privateKey: 'your-private-key',
})

// Get optimized image URL
const url = imagekit.getImageUrl('/sample.jpg', {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 80,
  format: 'webp',
})
```

### Lazy Loading

```typescript
import { createLazyLoader } from '@firm/capabilities/images'

const loader = createLazyLoader({
  rootMargin: '50px',
  threshold: 0.01,
  placeholder: 'blur',
  fadeInDuration: 300,
})

// Observe all images with data-src attribute
loader.observeAll('img[data-src]')

// HTML:
// <img
//   data-src="image.jpg"
//   data-lqip="data:image/jpeg;base64,..."
//   alt="Description"
// />
```

### Generate Placeholders

```typescript
import {
  generateLQIPFromUrl,
  generateBlurhashFromUrl,
  extractDominantColor,
} from '@firm/capabilities/images'

// Generate LQIP
const lqip = await generateLQIPFromUrl('image.jpg', 10)
console.log('LQIP:', lqip) // data:image/jpeg;base64,...

// Generate Blurhash
const blurhash = await generateBlurhashFromUrl('image.jpg', { x: 4, y: 3 })
console.log('Blurhash:', blurhash) // L9Hmv6

// Extract dominant color
const color = await extractDominantColor('image.jpg')
console.log('Color:', color) // rgb(45, 78, 123)
```

### Image Processing

```typescript
import { createImageProcessor } from '@firm/capabilities/images'

const processor = createImageProcessor({
  maxConcurrency: 5,
  defaultQuality: 80,
  progressive: true,
})

// Process image
const blob = await processor.processImage('image.jpg', {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 85,
  format: 'webp',
  sharpen: 1,
})

// Download processed image
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = 'optimized.webp'
link.click()
```

### Performance Monitoring

```typescript
import { createImagePerformanceMonitor } from '@firm/capabilities/images'

const monitor = createImagePerformanceMonitor()

// Subscribe to metrics updates
monitor.subscribe((metrics) => {
  console.log('Images loaded:', metrics.imagesLoaded)
  console.log('Average load time:', metrics.averageLoadTime)
  console.log('Bytes transferred:', metrics.bytesTransferred)
})

// Generate performance report
const report = monitor.generateReport()
console.log('Performance Score:', report.score)
console.log('Recommendations:', report.recommendations)
```

## Advanced Usage

### Complete Image Optimization System

```typescript
import { createImageOptimizer } from '@firm/capabilities/images'

const optimizer = createImageOptimizer({
  cdn: {
    provider: 'cloudinary',
    config: {
      provider: 'cloudinary',
      cloudName: 'your-cloud-name',
      apiKey: 'your-api-key',
      apiSecret: 'your-api-secret',
    },
  },
  lazyLoading: {
    rootMargin: '100px',
    placeholder: 'blur',
  },
  placeholder: {
    strategy: 'lqip',
    lqipQuality: 10,
  },
  monitoring: true,
})

// Get optimized URL
const url = optimizer.getOptimizedUrl('sample.jpg', {
  width: 800,
  quality: 80,
  format: 'webp',
})

// Generate responsive images
const picture = optimizer.generatePicture({
  src: 'sample.jpg',
  breakpoints: [320, 640, 1024],
  formats: ['avif', 'webp', 'jpeg'],
  sizes: '(max-width: 768px) 100vw, 50vw',
})

// Upload image
const result = await optimizer.uploadImage({
  file: imageFile,
  folder: 'products',
  transformations: {
    width: 1200,
    quality: 85,
    format: 'webp',
  },
})
```

### Responsive Picture Element

```typescript
const cloudinary = createCloudinaryService(config)

const picture = cloudinary.generatePictureElement({
  src: 'hero.jpg',
  breakpoints: [320, 640, 768, 1024, 1280, 1920],
  formats: ['avif', 'webp', 'jpeg'],
  sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px',
  transformations: {
    crop: 'fill',
    gravity: 'auto',
    quality: 80,
  },
  lazy: true,
})

// Render in React/JSX:
/*
<picture>
  {picture.sources.map((source, i) => (
    <source
      key={i}
      srcSet={source.srcset}
      type={source.type}
      sizes={source.sizes}
    />
  ))}
  <img {...picture.img} alt="Hero image" />
</picture>
*/
```

### Batch Image Processing

```typescript
const processor = createImageProcessor()

const images = [
  { source: 'image1.jpg', transformations: { width: 800, format: 'webp' } },
  { source: 'image2.jpg', transformations: { width: 800, format: 'webp' } },
  { source: 'image3.jpg', transformations: { width: 800, format: 'webp' } },
]

const optimized = await processor.batchProcess(images)

// Upload all optimized images
for (let i = 0; i < optimized.length; i++) {
  await optimizer.uploadImage({
    file: optimized[i],
    folder: 'optimized',
  })
}
```

## Best Practices

### 1. Use Modern Image Formats

```typescript
// Serve WebP/AVIF with JPEG fallback
const picture = cloudinary.generatePictureElement({
  src: 'image.jpg',
  breakpoints: [640, 1024, 1920],
  formats: ['avif', 'webp', 'jpeg'],
})

// Modern formats can save 30-50% file size
```

### 2. Implement Lazy Loading

```typescript
// Lazy load images below the fold
const loader = createLazyLoader({
  rootMargin: '50px', // Start loading 50px before viewport
  threshold: 0.01,
  placeholder: 'blur',
})

loader.observeAll('img[data-src]')

// Preload critical images
import { preloadPriorityImages } from '@firm/capabilities/images'
preloadPriorityImages('img[data-priority]')
```

### 3. Optimize for Different Devices

```typescript
// Mobile-optimized
const mobileUrl = cloudinary.getImageUrl('hero.jpg', {
  width: 640,
  quality: 75,
  format: 'webp',
  dpr: 2, // Retina displays
})

// Desktop-optimized
const desktopUrl = cloudinary.getImageUrl('hero.jpg', {
  width: 1920,
  quality: 80,
  format: 'webp',
  dpr: 1,
})
```

### 4. Use Placeholders

```typescript
// Generate placeholders at build time
const lqip = await generateLQIPFromUrl('image.jpg', 10)
const color = await extractDominantColor('image.jpg')

// Use in HTML
/*
<img
  data-src="image.jpg"
  data-lqip="${lqip}"
  data-color="${color}"
  style="background-color: ${color}"
  alt="Description"
/>
*/
```

### 5. Monitor Performance

```typescript
const monitor = createImagePerformanceMonitor()

// Track metrics
monitor.subscribe((metrics) => {
  // Send to analytics
  analytics.track('image_performance', {
    load_time: metrics.averageLoadTime,
    bytes_transferred: metrics.bytesTransferred,
    cache_hit_rate: (metrics.cachedImages / metrics.imagesLoaded) * 100,
  })
})

// Review recommendations
const report = monitor.generateReport()
if (report.score < 70) {
  console.warn('Image performance needs improvement')
  report.recommendations.forEach((rec) => console.log('•', rec))
}
```

## Image Transformation Options

### Resize and Crop

```typescript
{
  width: 800,
  height: 600,
  crop: 'fill',     // fill, fit, scale, crop, thumb, pad
  gravity: 'auto',  // auto, center, face, faces, north, south, east, west
  aspectRatio: '16:9'
}
```

### Quality and Format

```typescript
{
  quality: 80,           // 1-100
  format: 'webp',        // jpeg, png, webp, avif, gif, svg
  auto: ['format', 'quality'],  // Automatic optimization
  progressive: true      // Progressive JPEG
}
```

### Effects

```typescript
{
  blur: 10,              // Blur effect
  sharpen: 1,            // Sharpen effect
  brightness: 120,       // Brightness adjustment
  contrast: 110          // Contrast adjustment
}
```

### Device Optimization

```typescript
{
  dpr: 2,                // Device pixel ratio (1, 2, 3)
  width: 800,            // Logical width
  // Actual width will be 1600px for dpr=2
}
```

## Performance Budget Recommendations

- **Total page images**: < 2MB
- **Individual images**: < 200KB
- **Above-the-fold images**: < 100KB
- **Average load time**: < 500ms
- **Lazy loading adoption**: > 80%
- **Modern format usage**: > 70%
- **Cache hit rate**: > 80%

## CDN Configuration Examples

### Cloudinary

```typescript
const config = {
  provider: 'cloudinary',
  cloudName: 'demo',
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  defaultTransformations: {
    quality: 'auto',
    format: 'auto',
  },
}
```

### ImageKit

```typescript
const config = {
  provider: 'imagekit',
  urlEndpoint: 'https://ik.imagekit.io/demo',
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
}
```

## API Reference

### CloudinaryService

```typescript
class CloudinaryService {
  getImageUrl(publicId: string, transformations?: ImageTransformation): string
  generateSrcSet(config: ResponsiveImageConfig): string
  generatePictureElement(config: ResponsiveImageConfig): PictureElement
  uploadImage(options: ImageUploadOptions): Promise<ImageUploadResult>
  optimizeImage(publicId: string, options?: ImageTransformation): Promise<OptimizationResult>
  getLQIP(publicId: string, quality?: number, width?: number): string
}
```

### ImageKitService

```typescript
class ImageKitService {
  getImageUrl(path: string, transformations?: ImageTransformation): string
  generateSrcSet(config: ResponsiveImageConfig): string
  generatePictureElement(config: ResponsiveImageConfig): PictureElement
  uploadImage(options: ImageUploadOptions): Promise<ImageUploadResult>
  optimizeImage(path: string, options?: ImageTransformation): Promise<OptimizationResult>
}
```

### LazyLoader

```typescript
class LazyLoader {
  observe(img: HTMLImageElement): void
  observeAll(selector: string): void
  unobserve(img: HTMLImageElement): void
  loadNow(img: HTMLImageElement): void
  getStats(): LoadingStats
  destroy(): void
}
```

### ImagePerformanceMonitor

```typescript
class ImagePerformanceMonitor {
  initialize(): void
  subscribe(callback: (metrics: ImagePerformanceMetrics) => void): () => void
  getMetrics(): ImagePerformanceMetrics
  getScore(): number
  generateReport(): PerformanceReport
  reset(): void
}
```

## Resources

- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [ImageKit Documentation](https://docs.imagekit.io/)
- [WebP vs AVIF vs JPEG](https://web.dev/compress-images/)
- [Lazy Loading Images](https://web.dev/lazy-loading-images/)
- [Responsive Images](https://web.dev/responsive-images/)

## License

MIT
