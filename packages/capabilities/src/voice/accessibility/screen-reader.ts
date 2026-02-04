// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * @module ScreenReader
 * Screen reader and voice accessibility system for providing
 * audio descriptions and voice navigation assistance.
 */

import type {
  ScreenReaderConfig,
  AccessibleElement,
  VoiceFeedbackOptions,
} from '../types'

/**
 * Screen reader manager for accessibility features
 * including text-to-speech and element announcements.
 */
export class ScreenReaderManager {
  private config: ScreenReaderConfig
  private synth: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private focusedElement: AccessibleElement | null = null
  private announceQueue: string[] = []

  /**
   * Creates a new screen reader manager
   * @param config - Screen reader configuration
   */
  constructor(config: ScreenReaderConfig) {
    this.config = config
    this.initializeSpeechSynthesis()
  }

  /**
   * Announces text using text-to-speech
   * @param text - Text to announce
   * @param options - Announcement options
   * @returns Promise that resolves when announcement completes
   */
  async announce(
    text: string,
    options: { interrupt?: boolean; priority?: 'high' | 'normal' } = {}
  ): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    try {
      if (options.interrupt) {
        this.stop()
        this.announceQueue = []
      }

      if (this.isSpeaking()) {
        this.announceQueue.push(text)
        return
      }

      await this.speak(text)

      // Process queue
      while (this.announceQueue.length > 0) {
        const nextText = this.announceQueue.shift()!
        await this.speak(nextText)
      }
    } catch (error) {
      console.error('Failed to announce:', error)
    }
  }

  /**
   * Announces element focus for keyboard navigation
   * @param element - Accessible element
   */
  async announceElement(element: AccessibleElement): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    this.focusedElement = element

    let announcement = ''

    // Build announcement based on reading mode
    switch (this.config.mode) {
      case 'verbose':
        announcement = this.buildVerboseAnnouncement(element)
        break
      case 'brief':
        announcement = this.buildBriefAnnouncement(element)
        break
      case 'minimal':
        announcement = element.label
        break
      default:
        announcement = this.buildBriefAnnouncement(element)
    }

    await this.announce(announcement, { interrupt: true })
  }

  /**
   * Announces page title and summary
   * @param title - Page title
   * @param summary - Optional page summary
   */
  async announcePage(title: string, summary?: string): Promise<void> {
    const announcement = summary ? `${title}. ${summary}` : title
    await this.announce(announcement, { interrupt: true })
  }

  /**
   * Announces navigation event
   * @param destination - Destination description
   */
  async announceNavigation(destination: string): Promise<void> {
    await this.announce(`Navigating to ${destination}`, { interrupt: true })
  }

  /**
   * Announces error or alert
   * @param message - Error message
   * @param severity - Severity level
   */
  async announceAlert(
    message: string,
    severity: 'error' | 'warning' | 'info' = 'info'
  ): Promise<void> {
    const prefix =
      severity === 'error'
        ? 'Error: '
        : severity === 'warning'
          ? 'Warning: '
          : ''

    await this.announce(`${prefix}${message}`, { interrupt: true, priority: 'high' })
  }

  /**
   * Provides voice feedback for action
   * @param action - Action description
   * @param options - Feedback options
   */
  async provideFeedback(
    action: string,
    options: VoiceFeedbackOptions = {}
  ): Promise<void> {
    if (options.audio !== false) {
      const message = options.message || action
      await this.announce(message)
    }

    if (options.haptic && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  /**
   * Stops current speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel()
    }
    this.currentUtterance = null
  }

  /**
   * Checks if currently speaking
   * @returns True if speaking
   */
  isSpeaking(): boolean {
    return this.synth?.speaking ?? false
  }

  /**
   * Updates configuration
   * @param config - Partial configuration
   */
  updateConfig(config: Partial<ScreenReaderConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Gets available voices
   * @returns Array of available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) {
      return []
    }
    return this.synth.getVoices()
  }

  /**
   * Checks if speech synthesis is supported
   * @returns True if supported
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  /**
   * Initializes speech synthesis
   */
  private initializeSpeechSynthesis(): void {
    if (typeof window === 'undefined' || !ScreenReaderManager.isSupported()) {
      return
    }

    this.synth = window.speechSynthesis
  }

  /**
   * Speaks text using TTS
   * @param text - Text to speak
   */
  private async speak(text: string): Promise<void> {
    if (!this.synth) {
      return
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)

      utterance.rate = this.config.rate ?? 1.0
      utterance.pitch = this.config.pitch ?? 1.0
      utterance.volume = this.config.volume ?? 1.0

      if (this.config.voice) {
        const voices = this.synth!.getVoices()
        const selectedVoice = voices.find((v) => v.name === this.config.voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      utterance.onend = () => {
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (event) => {
        this.currentUtterance = null
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      this.currentUtterance = utterance
      this.synth!.speak(utterance)
    })
  }

  /**
   * Builds verbose element announcement
   * @param element - Accessible element
   * @returns Announcement text
   */
  private buildVerboseAnnouncement(element: AccessibleElement): string {
    const parts = []

    parts.push(element.label)

    if (element.role) {
      parts.push(this.formatRole(element.role))
    }

    if (element.description) {
      parts.push(element.description)
    }

    if (element.state) {
      const states = Object.entries(element.state)
        .filter(([_, value]) => value)
        .map(([key]) => key)

      if (states.length > 0) {
        parts.push(states.join(', '))
      }
    }

    return parts.join(', ')
  }

  /**
   * Builds brief element announcement
   * @param element - Accessible element
   * @returns Announcement text
   */
  private buildBriefAnnouncement(element: AccessibleElement): string {
    const parts = [element.label]

    if (element.role && element.role !== 'generic') {
      parts.push(this.formatRole(element.role))
    }

    return parts.join(', ')
  }

  /**
   * Formats ARIA role for announcement
   * @param role - ARIA role
   * @returns Formatted role
   */
  private formatRole(role: string): string {
    const roleMap: Record<string, string> = {
      button: 'button',
      link: 'link',
      heading: 'heading',
      textbox: 'text input',
      checkbox: 'checkbox',
      radio: 'radio button',
      combobox: 'combo box',
      listbox: 'list box',
      menu: 'menu',
      menuitem: 'menu item',
      tab: 'tab',
      tabpanel: 'tab panel',
      dialog: 'dialog',
      alert: 'alert',
      alertdialog: 'alert dialog',
      navigation: 'navigation',
      main: 'main content',
      complementary: 'complementary content',
      banner: 'banner',
      contentinfo: 'content information',
      form: 'form',
      search: 'search',
      region: 'region',
    }

    return roleMap[role] || role
  }
}
