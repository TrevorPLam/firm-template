/**
 * @module SpeechToText
 * Speech recognition engine supporting multiple speech-to-text services
 * with browser Web Speech API and cloud service integration.
 */

import type {
  VoiceConfig,
  SpeechRecognitionResult,
  SpeechAlternative,
} from '../types'

/**
 * Speech-to-text recognition engine supporting multiple backends
 * including browser native API and cloud services.
 */
export class SpeechToTextEngine {
  private config: VoiceConfig
  private recognition: SpeechRecognition | null = null
  private isListening: boolean = false
  private listeners: Map<string, Set<RecognitionListener>> = new Map()

  /**
   * Creates a new speech recognition engine
   * @param config - Voice configuration
   */
  constructor(config: VoiceConfig) {
    this.config = config
    this.initializeListeners()
  }

  /**
   * Starts speech recognition
   * @returns Promise that resolves when recognition starts
   * @throws {Error} If recognition fails to start
   */
  async start(): Promise<void> {
    if (this.isListening) {
      throw new Error('Recognition already active')
    }

    try {
      if (this.config.recognitionService === 'browser') {
        await this.startBrowserRecognition()
      } else {
        await this.startCloudRecognition()
      }
      this.isListening = true
    } catch (error) {
      throw new Error(
        `Failed to start recognition: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Stops speech recognition
   */
  stop(): void {
    if (!this.isListening) {
      return
    }

    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }

    this.isListening = false
  }

  /**
   * Subscribes to recognition events
   * @param event - Event name
   * @param listener - Event listener function
   */
  on(event: string, listener: RecognitionListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  /**
   * Unsubscribes from recognition events
   * @param event - Event name
   * @param listener - Event listener function
   */
  off(event: string, listener: RecognitionListener): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(listener)
    }
  }

  /**
   * Checks if speech recognition is supported
   * @returns True if supported
   */
  static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    )
  }

  /**
   * Gets available voices/languages
   * @returns Array of supported language codes
   */
  async getAvailableLanguages(): Promise<string[]> {
    // Common supported languages
    return [
      'en-US',
      'en-GB',
      'es-ES',
      'fr-FR',
      'de-DE',
      'it-IT',
      'pt-BR',
      'ja-JP',
      'ko-KR',
      'zh-CN',
    ]
  }

  /**
   * Starts browser-based speech recognition
   */
  private async startBrowserRecognition(): Promise<void> {
    if (typeof window === 'undefined' || !SpeechToTextEngine.isSupported()) {
      throw new Error('Browser speech recognition not supported')
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    this.recognition = new SpeechRecognition()
    this.recognition.lang = this.config.language
    this.recognition.continuous = this.config.continuous ?? true
    this.recognition.interimResults = this.config.interimResults ?? true
    this.recognition.maxAlternatives = this.config.maxAlternatives ?? 3

    this.recognition.onresult = (event: any) => {
      const results: SpeechRecognitionResult[] = []

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const alternatives: SpeechAlternative[] = []

        for (let j = 1; j < result.length; j++) {
          alternatives.push({
            transcript: result[j].transcript,
            confidence: result[j].confidence,
          })
        }

        results.push({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal,
          alternatives,
          timestamp: new Date(),
        })
      }

      this.emit('result', results)
    }

    this.recognition.onerror = (event: any) => {
      this.emit('error', new Error(event.error))
    }

    this.recognition.onend = () => {
      this.isListening = false
      this.emit('end', null)
    }

    this.recognition.start()
  }

  /**
   * Starts cloud-based speech recognition
   */
  private async startCloudRecognition(): Promise<void> {
    const { recognitionService, credentials } = this.config

    if (!credentials?.apiKey) {
      throw new Error('API credentials required for cloud recognition')
    }

    switch (recognitionService) {
      case 'google':
        await this.startGoogleRecognition()
        break
      case 'azure':
        await this.startAzureRecognition()
        break
      case 'aws':
        await this.startAWSRecognition()
        break
      default:
        throw new Error(`Unsupported service: ${recognitionService}`)
    }
  }

  /**
   * Starts Google Cloud Speech-to-Text
   */
  private async startGoogleRecognition(): Promise<void> {
    // Placeholder for Google Cloud Speech API integration
    // In production, use @google-cloud/speech package
    throw new Error('Google Cloud Speech integration not yet implemented')
  }

  /**
   * Starts Azure Speech Services
   */
  private async startAzureRecognition(): Promise<void> {
    // Placeholder for Azure Speech Services integration
    // In production, use microsoft-cognitiveservices-speech-sdk package
    throw new Error('Azure Speech integration not yet implemented')
  }

  /**
   * Starts AWS Transcribe
   */
  private async startAWSRecognition(): Promise<void> {
    // Placeholder for AWS Transcribe integration
    // In production, use aws-sdk or @aws-sdk packages
    throw new Error('AWS Transcribe integration not yet implemented')
  }

  /**
   * Initializes event listeners map
   */
  private initializeListeners(): void {
    this.listeners.set('result', new Set())
    this.listeners.set('error', new Set())
    this.listeners.set('end', new Set())
    this.listeners.set('start', new Set())
  }

  /**
   * Emits event to listeners
   * @param event - Event name
   * @param data - Event data
   */
  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Error in ${event} listener:`, error)
        }
      })
    }
  }

  /**
   * Gets current listening state
   * @returns True if currently listening
   */
  getIsListening(): boolean {
    return this.isListening
  }

  /**
   * Updates configuration
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config }

    // Restart recognition if active
    if (this.isListening) {
      this.stop()
      this.start()
    }
  }
}

/**
 * Recognition event listener type
 */
type RecognitionListener = (data: any) => void

/**
 * Browser SpeechRecognition interface (for type safety)
 */
interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}
