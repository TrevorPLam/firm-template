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
 * @module QueryProcessor
 * Natural language query processor for understanding voice commands
 * and extracting intents and entities.
 */

import type {
  NaturalLanguageQuery,
  QueryEntity,
  QueryContext,
} from '../types'

/**
 * Natural language processor for analyzing voice queries
 * and extracting structured information.
 */
export class QueryProcessor {
  private intentPatterns: Map<string, IntentPattern[]>
  private entityExtractors: Map<string, EntityExtractor>

  /**
   * Creates a new query processor
   */
  constructor() {
    this.intentPatterns = new Map()
    this.entityExtractors = new Map()
    this.initializeDefaultPatterns()
  }

  /**
   * Processes natural language query
   * @param text - Query text
   * @param context - Optional query context
   * @returns Processed query with intent and entities
   */
  async processQuery(
    text: string,
    context?: QueryContext
  ): Promise<NaturalLanguageQuery> {
    try {
      const normalizedText = this.normalizeText(text)

      // Detect intent
      const intentResult = this.detectIntent(normalizedText)

      // Extract entities
      const entities = this.extractEntities(normalizedText, intentResult.intent)

      return {
        text,
        intent: intentResult.intent,
        entities,
        confidence: intentResult.confidence,
        context,
      }
    } catch (error) {
      throw new Error(
        `Failed to process query: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Registers custom intent pattern
   * @param intent - Intent name
   * @param patterns - Pattern matchers
   */
  registerIntent(intent: string, patterns: IntentPattern[]): void {
    this.intentPatterns.set(intent, patterns)
  }

  /**
   * Registers custom entity extractor
   * @param entityType - Entity type name
   * @param extractor - Extraction function
   */
  registerEntityExtractor(
    entityType: string,
    extractor: EntityExtractor
  ): void {
    this.entityExtractors.set(entityType, extractor)
  }

  /**
   * Normalizes query text
   * @param text - Raw text
   * @returns Normalized text
   */
  private normalizeText(text: string): string {
    return text.toLowerCase().trim().replace(/\s+/g, ' ')
  }

  /**
   * Detects intent from text
   * @param text - Normalized text
   * @returns Intent and confidence
   */
  private detectIntent(text: string): { intent: string; confidence: number } {
    let bestMatch: { intent: string; confidence: number } = {
      intent: 'unknown',
      confidence: 0,
    }

    for (const [intent, patterns] of this.intentPatterns) {
      for (const pattern of patterns) {
        let confidence = 0

        if (pattern.regex) {
          if (pattern.regex.test(text)) {
            confidence = pattern.weight || 1.0
          }
        } else if (pattern.keywords) {
          const matchedKeywords = pattern.keywords.filter((kw) =>
            text.includes(kw.toLowerCase())
          )
          confidence =
            (matchedKeywords.length / pattern.keywords.length) *
            (pattern.weight || 1.0)
        }

        if (confidence > bestMatch.confidence) {
          bestMatch = { intent, confidence }
        }
      }
    }

    return bestMatch
  }

  /**
   * Extracts entities from text
   * @param text - Normalized text
   * @param intent - Detected intent
   * @returns Array of extracted entities
   */
  private extractEntities(text: string, intent: string): QueryEntity[] {
    const entities: QueryEntity[] = []

    for (const [entityType, extractor] of this.entityExtractors) {
      const extracted = extractor(text, intent)
      entities.push(...extracted)
    }

    return entities
  }

  /**
   * Initializes default intent patterns
   */
  private initializeDefaultPatterns(): void {
    // Navigation intents
    this.registerIntent('navigate', [
      {
        keywords: ['go to', 'navigate to', 'open', 'show me'],
        weight: 0.9,
      },
      { regex: /^(go|navigate|open)\s+/i, weight: 0.85 },
    ])

    // Search intents
    this.registerIntent('search', [
      { keywords: ['search', 'find', 'look for', 'query'], weight: 0.9 },
      { regex: /^(search|find|look for)\s+/i, weight: 0.85 },
    ])

    // Action intents
    this.registerIntent('action', [
      {
        keywords: ['click', 'press', 'select', 'activate', 'submit'],
        weight: 0.9,
      },
      { regex: /^(click|press|select)\s+/i, weight: 0.85 },
    ])

    // Query intents
    this.registerIntent('query', [
      { keywords: ['what', 'where', 'when', 'who', 'why', 'how'], weight: 0.8 },
      { regex: /^(what|where|when|who|why|how)\s+/i, weight: 0.85 },
    ])

    // Help intents
    this.registerIntent('help', [
      { keywords: ['help', 'assist', 'support', 'guide'], weight: 0.95 },
      { regex: /^(help|assist|support)\s*/i, weight: 0.9 },
    ])

    // Close/exit intents
    this.registerIntent('close', [
      { keywords: ['close', 'exit', 'quit', 'stop', 'cancel'], weight: 0.95 },
      { regex: /^(close|exit|quit|stop|cancel)\s*/i, weight: 0.9 },
    ])

    // Initialize default entity extractors
    this.initializeDefaultExtractors()
  }

  /**
   * Initializes default entity extractors
   */
  private initializeDefaultExtractors(): void {
    // Page entity extractor
    this.registerEntityExtractor('page', (text) => {
      const pagePatterns = [
        { pattern: /home\s*page|homepage/i, value: 'home' },
        { pattern: /about\s*page|about\s*us/i, value: 'about' },
        { pattern: /contact\s*page|contact\s*us/i, value: 'contact' },
        { pattern: /settings\s*page|settings/i, value: 'settings' },
        { pattern: /dashboard/i, value: 'dashboard' },
      ]

      const entities: QueryEntity[] = []

      for (const { pattern, value } of pagePatterns) {
        const match = text.match(pattern)
        if (match) {
          entities.push({
            type: 'page',
            value,
            confidence: 0.9,
            startPos: match.index || 0,
            endPos: (match.index || 0) + match[0].length,
          })
        }
      }

      return entities
    })

    // Number entity extractor
    this.registerEntityExtractor('number', (text) => {
      const numberRegex = /\b(\d+)\b/g
      const entities: QueryEntity[] = []
      let match

      while ((match = numberRegex.exec(text)) !== null) {
        entities.push({
          type: 'number',
          value: match[1],
          confidence: 1.0,
          startPos: match.index,
          endPos: match.index + match[0].length,
        })
      }

      return entities
    })

    // Date entity extractor
    this.registerEntityExtractor('date', (text) => {
      const datePatterns = [
        { pattern: /today/i, value: 'today' },
        { pattern: /tomorrow/i, value: 'tomorrow' },
        { pattern: /yesterday/i, value: 'yesterday' },
        {
          pattern: /next\s+(week|month|year)/i,
          value: (match: RegExpMatchArray) => `next_${match[1]}`,
        },
        {
          pattern: /last\s+(week|month|year)/i,
          value: (match: RegExpMatchArray) => `last_${match[1]}`,
        },
      ]

      const entities: QueryEntity[] = []

      for (const { pattern, value } of datePatterns) {
        const match = text.match(pattern)
        if (match) {
          entities.push({
            type: 'date',
            value: typeof value === 'function' ? value(match) : value,
            confidence: 0.85,
            startPos: match.index || 0,
            endPos: (match.index || 0) + match[0].length,
          })
        }
      }

      return entities
    })

    // Action entity extractor
    this.registerEntityExtractor('action', (text) => {
      const actionPatterns = [
        { pattern: /click|press|tap/i, value: 'click' },
        { pattern: /scroll\s+up/i, value: 'scroll_up' },
        { pattern: /scroll\s+down/i, value: 'scroll_down' },
        { pattern: /go\s+back/i, value: 'back' },
        { pattern: /go\s+forward/i, value: 'forward' },
        { pattern: /refresh|reload/i, value: 'refresh' },
      ]

      const entities: QueryEntity[] = []

      for (const { pattern, value } of actionPatterns) {
        const match = text.match(pattern)
        if (match) {
          entities.push({
            type: 'action',
            value,
            confidence: 0.9,
            startPos: match.index || 0,
            endPos: (match.index || 0) + match[0].length,
          })
        }
      }

      return entities
    })
  }
}

/**
 * Intent pattern definition
 */
interface IntentPattern {
  /** Regular expression matcher */
  regex?: RegExp
  /** Keyword matchers */
  keywords?: string[]
  /** Pattern weight/priority */
  weight?: number
}

/**
 * Entity extractor function type
 */
type EntityExtractor = (text: string, intent: string) => QueryEntity[]
