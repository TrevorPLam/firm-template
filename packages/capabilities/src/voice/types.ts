/**
 * Type definitions for voice interface system
 */

/**
 * Voice interface configuration
 */
export interface VoiceConfig {
  /** Speech recognition service */
  recognitionService: 'browser' | 'google' | 'azure' | 'aws'
  /** API credentials */
  credentials?: {
    apiKey?: string
    region?: string
    endpoint?: string
  }
  /** Language code (e.g., 'en-US') */
  language: string
  /** Continuous recognition */
  continuous?: boolean
  /** Interim results */
  interimResults?: boolean
  /** Maximum alternatives */
  maxAlternatives?: number
}

/**
 * Speech recognition result
 */
export interface SpeechRecognitionResult {
  /** Recognized transcript */
  transcript: string
  /** Confidence score (0-1) */
  confidence: number
  /** Is final result */
  isFinal: boolean
  /** Alternative transcripts */
  alternatives?: SpeechAlternative[]
  /** Timestamp */
  timestamp: Date
}

/**
 * Alternative speech recognition result
 */
export interface SpeechAlternative {
  /** Alternative transcript */
  transcript: string
  /** Confidence score */
  confidence: number
}

/**
 * Natural language query
 */
export interface NaturalLanguageQuery {
  /** Original query text */
  text: string
  /** Query intent */
  intent: string
  /** Extracted entities */
  entities: QueryEntity[]
  /** Confidence score (0-1) */
  confidence: number
  /** Query context */
  context?: QueryContext
}

/**
 * Query entity
 */
export interface QueryEntity {
  /** Entity type */
  type: string
  /** Entity value */
  value: string
  /** Confidence score */
  confidence: number
  /** Start position in text */
  startPos: number
  /** End position in text */
  endPos: number
}

/**
 * Query context
 */
export interface QueryContext {
  /** Previous queries */
  history: string[]
  /** User preferences */
  preferences?: Record<string, unknown>
  /** Current page/view */
  currentView?: string
  /** Session data */
  sessionData?: Record<string, unknown>
}

/**
 * Voice command definition
 */
export interface VoiceCommand {
  /** Command name */
  name: string
  /** Command patterns (regex or phrases) */
  patterns: string[]
  /** Command handler */
  handler: CommandHandler
  /** Command description */
  description: string
  /** Required parameters */
  parameters?: CommandParameter[]
  /** Command category */
  category: 'navigation' | 'action' | 'query' | 'system'
}

/**
 * Command handler function
 */
export type CommandHandler = (
  params: Record<string, unknown>,
  context: QueryContext
) => Promise<CommandResult> | CommandResult

/**
 * Command parameter definition
 */
export interface CommandParameter {
  /** Parameter name */
  name: string
  /** Parameter type */
  type: 'string' | 'number' | 'boolean' | 'date'
  /** Is required */
  required: boolean
  /** Default value */
  default?: unknown
}

/**
 * Command execution result
 */
export interface CommandResult {
  /** Success status */
  success: boolean
  /** Result message */
  message: string
  /** Result data */
  data?: unknown
  /** Voice response */
  voiceResponse?: string
}

/**
 * Screen reader configuration
 */
export interface ScreenReaderConfig {
  /** Enable screen reader */
  enabled: boolean
  /** Speech rate (0.5-2.0) */
  rate?: number
  /** Speech pitch (0-2) */
  pitch?: number
  /** Speech volume (0-1) */
  volume?: number
  /** Voice selection */
  voice?: string
  /** Reading mode */
  mode?: 'verbose' | 'brief' | 'minimal'
}

/**
 * Accessible element description
 */
export interface AccessibleElement {
  /** Element ID */
  id: string
  /** Element role */
  role: string
  /** Element label */
  label: string
  /** Element description */
  description?: string
  /** Element state */
  state?: Record<string, boolean>
  /** Navigation order */
  tabIndex?: number
}

/**
 * Voice interaction event
 */
export interface VoiceInteractionEvent {
  /** Event type */
  type: 'recognition' | 'command' | 'navigation' | 'query' | 'error'
  /** Event timestamp */
  timestamp: Date
  /** User input */
  input?: string
  /** Recognized intent */
  intent?: string
  /** Command executed */
  command?: string
  /** Success status */
  success: boolean
  /** Duration (ms) */
  duration: number
  /** Error message */
  error?: string
  /** User identifier */
  userId?: string
}

/**
 * Voice analytics metrics
 */
export interface VoiceAnalyticsMetrics {
  /** Total interactions */
  totalInteractions: number
  /** Successful interactions */
  successfulInteractions: number
  /** Failed interactions */
  failedInteractions: number
  /** Success rate */
  successRate: number
  /** Average confidence */
  averageConfidence: number
  /** Most used commands */
  topCommands: Array<{ command: string; count: number }>
  /** Most common intents */
  topIntents: Array<{ intent: string; count: number }>
  /** Average response time (ms) */
  averageResponseTime: number
  /** Error distribution */
  errorTypes: Record<string, number>
}

/**
 * Voice analytics report
 */
export interface VoiceAnalyticsReport {
  /** Report period */
  period: { start: Date; end: Date }
  /** Metrics */
  metrics: VoiceAnalyticsMetrics
  /** Trends */
  trends: AnalyticsTrend[]
  /** Recommendations */
  recommendations: string[]
}

/**
 * Analytics trend
 */
export interface AnalyticsTrend {
  /** Metric name */
  metric: string
  /** Trend direction */
  direction: 'up' | 'down' | 'stable'
  /** Percentage change */
  change: number
  /** Is significant */
  significant: boolean
}

/**
 * Navigation target
 */
export interface NavigationTarget {
  /** Target type */
  type: 'page' | 'section' | 'element' | 'url'
  /** Target identifier */
  id: string
  /** Target label */
  label: string
  /** Target URL */
  url?: string
}

/**
 * Voice feedback options
 */
export interface VoiceFeedbackOptions {
  /** Enable audio feedback */
  audio?: boolean
  /** Enable visual feedback */
  visual?: boolean
  /** Enable haptic feedback */
  haptic?: boolean
  /** Feedback message */
  message?: string
}
