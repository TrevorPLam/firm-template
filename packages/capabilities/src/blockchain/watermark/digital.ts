/**
 * @module DigitalWatermark
 * Digital watermarking system for embedding and verifying ownership
 * information in content using various watermarking techniques.
 */

import type {
  DigitalWatermark,
  WatermarkVerification,
  BlockchainConfig,
} from '../types'

/**
 * Digital watermark manager for embedding invisible ownership markers
 * in content and verifying authenticity through watermark detection.
 */
export class DigitalWatermarkManager {
  private config: BlockchainConfig
  private watermarks: Map<string, DigitalWatermark>

  /**
   * Creates a new digital watermark manager instance
   * @param config - Blockchain configuration
   */
  constructor(config: BlockchainConfig) {
    this.config = config
    this.watermarks = new Map()
  }

  /**
   * Embeds digital watermark into content
   * @param contentId - Content identifier
   * @param content - Content data to watermark (base64 or buffer)
   * @param payload - Watermark payload (ownership info, UUID, etc)
   * @param options - Watermark options
   * @returns Watermarked content and watermark record
   * @throws {Error} If watermarking fails
   */
  async embedWatermark(
    contentId: string,
    content: string | Buffer,
    payload: string,
    options: {
      type?: DigitalWatermark['type']
      algorithm?: DigitalWatermark['algorithm']
      robustness?: DigitalWatermark['robustness']
    } = {}
  ): Promise<{
    watermarkedContent: string | Buffer
    watermark: DigitalWatermark
  }> {
    try {
      const {
        type = 'invisible',
        algorithm = 'lsb',
        robustness = 'medium',
      } = options

      // Create watermark record
      const watermark: DigitalWatermark = {
        contentId,
        type,
        payload,
        algorithm,
        robustness,
        timestamp: new Date(),
      }

      // Embed watermark based on algorithm
      let watermarkedContent: string | Buffer
      switch (algorithm) {
        case 'lsb':
          watermarkedContent = await this.embedLSB(content, payload, robustness)
          break
        case 'dct':
          watermarkedContent = await this.embedDCT(content, payload, robustness)
          break
        case 'dwt':
          watermarkedContent = await this.embedDWT(content, payload, robustness)
          break
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`)
      }

      // Store watermark record
      this.watermarks.set(contentId, watermark)

      return { watermarkedContent, watermark }
    } catch (error) {
      throw new Error(
        `Failed to embed watermark: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Extracts and verifies watermark from content
   * @param contentId - Content identifier
   * @param content - Content to verify
   * @param expectedPayload - Optional expected payload for verification
   * @returns Verification result
   */
  async verifyWatermark(
    contentId: string,
    content: string | Buffer,
    expectedPayload?: string
  ): Promise<WatermarkVerification> {
    try {
      const watermark = this.watermarks.get(contentId)

      if (!watermark) {
        return {
          present: false,
          confidence: 0,
          intact: false,
          tampered: true,
        }
      }

      // Extract watermark based on algorithm
      let extractedPayload: string | null
      let confidence: number

      switch (watermark.algorithm) {
        case 'lsb': {
          const result = await this.extractLSB(content, watermark.robustness)
          extractedPayload = result.payload
          confidence = result.confidence
          break
        }
        case 'dct': {
          const result = await this.extractDCT(content, watermark.robustness)
          extractedPayload = result.payload
          confidence = result.confidence
          break
        }
        case 'dwt': {
          const result = await this.extractDWT(content, watermark.robustness)
          extractedPayload = result.payload
          confidence = result.confidence
          break
        }
        default:
          return {
            present: false,
            confidence: 0,
            intact: false,
            tampered: true,
          }
      }

      // Verify payload if present
      if (!extractedPayload) {
        return {
          present: false,
          confidence: 0,
          intact: false,
          tampered: true,
        }
      }

      const payloadMatches = expectedPayload
        ? extractedPayload === expectedPayload
        : extractedPayload === watermark.payload

      return {
        present: true,
        payload: extractedPayload,
        confidence,
        intact: payloadMatches && confidence > 0.7,
        tampered: !payloadMatches || confidence < 0.5,
      }
    } catch (error) {
      return {
        present: false,
        confidence: 0,
        intact: false,
        tampered: true,
      }
    }
  }

  /**
   * Embeds watermark using LSB (Least Significant Bit) technique
   * @param content - Content to watermark
   * @param payload - Watermark payload
   * @param robustness - Robustness level
   * @returns Watermarked content
   */
  private async embedLSB(
    content: string | Buffer,
    payload: string,
    robustness: DigitalWatermark['robustness']
  ): Promise<string | Buffer> {
    // Simulate LSB watermark embedding
    // In production, implement actual LSB steganography
    await new Promise((resolve) => setTimeout(resolve, 50))

    const contentBuffer =
      typeof content === 'string' ? Buffer.from(content, 'base64') : content

    // For simulation, append encoded payload to content
    const payloadBuffer = Buffer.from(
      JSON.stringify({ payload, robustness, method: 'lsb' })
    )
    const watermarked = Buffer.concat([contentBuffer, payloadBuffer])

    return typeof content === 'string'
      ? watermarked.toString('base64')
      : watermarked
  }

  /**
   * Embeds watermark using DCT (Discrete Cosine Transform) technique
   * @param content - Content to watermark
   * @param payload - Watermark payload
   * @param robustness - Robustness level
   * @returns Watermarked content
   */
  private async embedDCT(
    content: string | Buffer,
    payload: string,
    robustness: DigitalWatermark['robustness']
  ): Promise<string | Buffer> {
    // Simulate DCT watermark embedding
    // In production, implement actual DCT-based watermarking
    await new Promise((resolve) => setTimeout(resolve, 100))

    const contentBuffer =
      typeof content === 'string' ? Buffer.from(content, 'base64') : content

    const payloadBuffer = Buffer.from(
      JSON.stringify({ payload, robustness, method: 'dct' })
    )
    const watermarked = Buffer.concat([contentBuffer, payloadBuffer])

    return typeof content === 'string'
      ? watermarked.toString('base64')
      : watermarked
  }

  /**
   * Embeds watermark using DWT (Discrete Wavelet Transform) technique
   * @param content - Content to watermark
   * @param payload - Watermark payload
   * @param robustness - Robustness level
   * @returns Watermarked content
   */
  private async embedDWT(
    content: string | Buffer,
    payload: string,
    robustness: DigitalWatermark['robustness']
  ): Promise<string | Buffer> {
    // Simulate DWT watermark embedding
    // In production, implement actual DWT-based watermarking
    await new Promise((resolve) => setTimeout(resolve, 150))

    const contentBuffer =
      typeof content === 'string' ? Buffer.from(content, 'base64') : content

    const payloadBuffer = Buffer.from(
      JSON.stringify({ payload, robustness, method: 'dwt' })
    )
    const watermarked = Buffer.concat([contentBuffer, payloadBuffer])

    return typeof content === 'string'
      ? watermarked.toString('base64')
      : watermarked
  }

  /**
   * Extracts watermark using LSB technique
   * @param content - Watermarked content
   * @param robustness - Robustness level
   * @returns Extracted payload and confidence
   */
  private async extractLSB(
    content: string | Buffer,
    robustness: DigitalWatermark['robustness']
  ): Promise<{ payload: string | null; confidence: number }> {
    // Simulate LSB watermark extraction
    await new Promise((resolve) => setTimeout(resolve, 50))

    try {
      const contentBuffer =
        typeof content === 'string' ? Buffer.from(content, 'base64') : content

      // For simulation, extract appended payload
      const payloadStr = contentBuffer.slice(-200).toString()
      const match = payloadStr.match(/\{"payload":"([^"]+)"/)

      if (match && match[1]) {
        return {
          payload: match[1],
          confidence: robustness === 'high' ? 0.95 : robustness === 'medium' ? 0.85 : 0.75,
        }
      }

      return { payload: null, confidence: 0 }
    } catch {
      return { payload: null, confidence: 0 }
    }
  }

  /**
   * Extracts watermark using DCT technique
   * @param content - Watermarked content
   * @param robustness - Robustness level
   * @returns Extracted payload and confidence
   */
  private async extractDCT(
    content: string | Buffer,
    robustness: DigitalWatermark['robustness']
  ): Promise<{ payload: string | null; confidence: number }> {
    // Simulate DCT watermark extraction
    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      const contentBuffer =
        typeof content === 'string' ? Buffer.from(content, 'base64') : content

      const payloadStr = contentBuffer.slice(-200).toString()
      const match = payloadStr.match(/\{"payload":"([^"]+)"/)

      if (match && match[1]) {
        return {
          payload: match[1],
          confidence: robustness === 'high' ? 0.98 : robustness === 'medium' ? 0.9 : 0.8,
        }
      }

      return { payload: null, confidence: 0 }
    } catch {
      return { payload: null, confidence: 0 }
    }
  }

  /**
   * Extracts watermark using DWT technique
   * @param content - Watermarked content
   * @param robustness - Robustness level
   * @returns Extracted payload and confidence
   */
  private async extractDWT(
    content: string | Buffer,
    robustness: DigitalWatermark['robustness']
  ): Promise<{ payload: string | null; confidence: number }> {
    // Simulate DWT watermark extraction
    await new Promise((resolve) => setTimeout(resolve, 150))

    try {
      const contentBuffer =
        typeof content === 'string' ? Buffer.from(content, 'base64') : content

      const payloadStr = contentBuffer.slice(-200).toString()
      const match = payloadStr.match(/\{"payload":"([^"]+)"/)

      if (match && match[1]) {
        return {
          payload: match[1],
          confidence: robustness === 'high' ? 0.99 : robustness === 'medium' ? 0.92 : 0.82,
        }
      }

      return { payload: null, confidence: 0 }
    } catch {
      return { payload: null, confidence: 0 }
    }
  }

  /**
   * Gets watermark record for content
   * @param contentId - Content identifier
   * @returns Watermark record or undefined
   */
  getWatermark(contentId: string): DigitalWatermark | undefined {
    return this.watermarks.get(contentId)
  }
}
