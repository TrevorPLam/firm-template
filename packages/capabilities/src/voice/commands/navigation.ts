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
 * @module NavigationCommands
 * Voice-controlled navigation system for web applications
 * with support for page navigation, element selection, and history.
 */

import type {
  VoiceCommand,
  CommandResult,
  QueryContext,
  NavigationTarget,
} from '../types'

/**
 * Voice navigation command manager for hands-free navigation
 */
export class NavigationCommandManager {
  private commands: Map<string, VoiceCommand>
  private navigationHistory: NavigationTarget[] = []
  private currentTarget: NavigationTarget | null = null

  /**
   * Creates a new navigation command manager
   */
  constructor() {
    this.commands = new Map()
    this.initializeDefaultCommands()
  }

  /**
   * Registers a voice command
   * @param command - Command definition
   */
  registerCommand(command: VoiceCommand): void {
    this.commands.set(command.name, command)
  }

  /**
   * Executes voice command
   * @param text - Command text
   * @param context - Query context
   * @returns Command execution result
   */
  async executeCommand(
    text: string,
    context: QueryContext
  ): Promise<CommandResult> {
    try {
      const normalizedText = text.toLowerCase().trim()

      // Find matching command
      const matchedCommand = this.findMatchingCommand(normalizedText)

      if (!matchedCommand) {
        return {
          success: false,
          message: 'Command not recognized',
          voiceResponse: 'Sorry, I did not understand that command.',
        }
      }

      // Extract parameters
      const params = this.extractParameters(
        normalizedText,
        matchedCommand.command
      )

      // Execute command handler
      const result = await matchedCommand.command.handler(params, context)

      return result
    } catch (error) {
      return {
        success: false,
        message: `Command execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        voiceResponse: 'Sorry, something went wrong while executing that command.',
      }
    }
  }

  /**
   * Gets all registered commands
   * @returns Array of voice commands
   */
  getCommands(): VoiceCommand[] {
    return Array.from(this.commands.values())
  }

  /**
   * Gets commands by category
   * @param category - Command category
   * @returns Array of matching commands
   */
  getCommandsByCategory(category: VoiceCommand['category']): VoiceCommand[] {
    return Array.from(this.commands.values()).filter(
      (cmd) => cmd.category === category
    )
  }

  /**
   * Finds matching command from text
   * @param text - Command text
   * @returns Matched command or null
   */
  private findMatchingCommand(
    text: string
  ): { command: VoiceCommand; match: RegExpMatchArray } | null {
    for (const command of this.commands.values()) {
      for (const pattern of command.patterns) {
        const regex = new RegExp(pattern, 'i')
        const match = text.match(regex)
        if (match) {
          return { command, match }
        }
      }
    }
    return null
  }

  /**
   * Extracts parameters from command text
   * @param text - Command text
   * @param command - Command definition
   * @returns Extracted parameters
   */
  private extractParameters(
    text: string,
    command: VoiceCommand
  ): Record<string, unknown> {
    const params: Record<string, unknown> = {}

    if (!command.parameters) {
      return params
    }

    for (const param of command.parameters) {
      // Simple parameter extraction (can be enhanced)
      if (param.type === 'string') {
        // Extract quoted strings or remaining text
        const match = text.match(/"([^"]+)"|'([^']+)'|(\w+)/)
        if (match) {
          params[param.name] = match[1] || match[2] || match[3]
        } else if (param.default !== undefined) {
          params[param.name] = param.default
        }
      } else if (param.type === 'number') {
        const match = text.match(/\d+/)
        if (match) {
          params[param.name] = parseInt(match[0], 10)
        } else if (param.default !== undefined) {
          params[param.name] = param.default
        }
      }
    }

    return params
  }

  /**
   * Initializes default navigation commands
   */
  private initializeDefaultCommands(): void {
    // Go to page command
    this.registerCommand({
      name: 'goToPage',
      patterns: [
        '^go to (\\w+)( page)?$',
        '^navigate to (\\w+)( page)?$',
        '^open (\\w+)( page)?$',
      ],
      category: 'navigation',
      description: 'Navigate to a specific page',
      parameters: [
        { name: 'page', type: 'string', required: true },
      ],
      handler: async (params) => {
        const page = params.page as string
        const target: NavigationTarget = {
          type: 'page',
          id: page,
          label: page,
          url: `/${page}`,
        }

        this.navigateTo(target)

        return {
          success: true,
          message: `Navigated to ${page}`,
          voiceResponse: `Opening ${page} page`,
          data: target,
        }
      },
    })

    // Go back command
    this.registerCommand({
      name: 'goBack',
      patterns: ['^go back$', '^back$', '^previous page$'],
      category: 'navigation',
      description: 'Navigate to previous page',
      handler: async () => {
        if (this.navigationHistory.length === 0) {
          return {
            success: false,
            message: 'No previous page',
            voiceResponse: 'There is no previous page to go back to',
          }
        }

        const previous = this.navigationHistory.pop()!
        this.currentTarget = previous

        return {
          success: true,
          message: `Navigated back to ${previous.label}`,
          voiceResponse: `Going back to ${previous.label}`,
          data: previous,
        }
      },
    })

    // Scroll commands
    this.registerCommand({
      name: 'scrollUp',
      patterns: ['^scroll up$', '^page up$'],
      category: 'navigation',
      description: 'Scroll up on the page',
      handler: async () => {
        if (typeof window !== 'undefined') {
          window.scrollBy({ top: -300, behavior: 'smooth' })
        }

        return {
          success: true,
          message: 'Scrolled up',
          voiceResponse: 'Scrolling up',
        }
      },
    })

    this.registerCommand({
      name: 'scrollDown',
      patterns: ['^scroll down$', '^page down$'],
      category: 'navigation',
      description: 'Scroll down on the page',
      handler: async () => {
        if (typeof window !== 'undefined') {
          window.scrollBy({ top: 300, behavior: 'smooth' })
        }

        return {
          success: true,
          message: 'Scrolled down',
          voiceResponse: 'Scrolling down',
        }
      },
    })

    // Scroll to top/bottom
    this.registerCommand({
      name: 'scrollToTop',
      patterns: ['^scroll to top$', '^go to top$', '^top of page$'],
      category: 'navigation',
      description: 'Scroll to top of page',
      handler: async () => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        return {
          success: true,
          message: 'Scrolled to top',
          voiceResponse: 'Going to top of page',
        }
      },
    })

    this.registerCommand({
      name: 'scrollToBottom',
      patterns: ['^scroll to bottom$', '^go to bottom$', '^bottom of page$'],
      category: 'navigation',
      description: 'Scroll to bottom of page',
      handler: async () => {
        if (typeof window !== 'undefined') {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          })
        }

        return {
          success: true,
          message: 'Scrolled to bottom',
          voiceResponse: 'Going to bottom of page',
        }
      },
    })

    // Refresh page
    this.registerCommand({
      name: 'refresh',
      patterns: ['^refresh( page)?$', '^reload( page)?$'],
      category: 'action',
      description: 'Refresh the current page',
      handler: async () => {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }

        return {
          success: true,
          message: 'Refreshing page',
          voiceResponse: 'Refreshing the page',
        }
      },
    })

    // Click element
    this.registerCommand({
      name: 'clickElement',
      patterns: ['^click (\\w+)$', '^press (\\w+)$', '^tap (\\w+)$'],
      category: 'action',
      description: 'Click a named element',
      parameters: [
        { name: 'element', type: 'string', required: true },
      ],
      handler: async (params) => {
        const elementName = params.element as string

        if (typeof document === 'undefined') {
          return {
            success: false,
            message: 'Document not available',
            voiceResponse: 'Cannot perform action in this environment',
          }
        }

        // Try to find element by aria-label, id, or data-voice-id
        const selectors = [
          `[aria-label="${elementName}"]`,
          `#${elementName}`,
          `[data-voice-id="${elementName}"]`,
          `button:contains("${elementName}")`,
        ]

        for (const selector of selectors) {
          try {
            const element = document.querySelector(selector) as HTMLElement
            if (element) {
              element.click()
              return {
                success: true,
                message: `Clicked ${elementName}`,
                voiceResponse: `Clicking ${elementName}`,
              }
            }
          } catch {
            continue
          }
        }

        return {
          success: false,
          message: `Element ${elementName} not found`,
          voiceResponse: `Could not find ${elementName}`,
        }
      },
    })
  }

  /**
   * Navigates to target
   * @param target - Navigation target
   */
  private navigateTo(target: NavigationTarget): void {
    if (this.currentTarget) {
      this.navigationHistory.push(this.currentTarget)
    }
    this.currentTarget = target

    // Perform navigation based on type
    if (target.url && typeof window !== 'undefined') {
      window.location.href = target.url
    }
  }
}
