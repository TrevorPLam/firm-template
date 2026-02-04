# Voice Interface

Production-ready voice interface system with speech recognition, natural language processing, voice commands, and accessibility features.

## Features

### 1. Speech Recognition (Speech-to-Text)
Convert spoken words to text using browser Web Speech API or cloud services.

```typescript
import { SpeechToTextEngine } from '@repo/capabilities/voice'

const engine = new SpeechToTextEngine({
  recognitionService: 'browser',
  language: 'en-US',
  continuous: true,
  interimResults: true,
  maxAlternatives: 3,
})

// Listen for results
engine.on('result', (results) => {
  results.forEach((result) => {
    console.log(result.transcript)
    console.log(`Confidence: ${result.confidence}`)
    console.log(`Final: ${result.isFinal}`)
  })
})

// Start recognition
await engine.start()

// Stop when done
engine.stop()
```

### 2. Natural Language Query Processing
Extract intent and entities from voice queries.

```typescript
import { QueryProcessor } from '@repo/capabilities/voice'

const processor = new QueryProcessor()

// Process query
const query = await processor.processQuery('navigate to home page')

console.log(query.intent) // 'navigate'
console.log(query.entities) // [{ type: 'page', value: 'home', ... }]
console.log(query.confidence) // 0.9

// Register custom intent
processor.registerIntent('custom-action', [
  { keywords: ['do', 'perform', 'execute'], weight: 0.9 },
  { regex: /^(do|perform)\s+/i, weight: 0.85 },
])
```

### 3. Voice Navigation Commands
Control navigation with voice commands.

```typescript
import { NavigationCommandManager } from '@repo/capabilities/voice'

const navigation = new NavigationCommandManager()

// Execute command
const result = await navigation.executeCommand('go to settings', context)

if (result.success) {
  console.log(result.message) // "Navigated to settings"
  console.log(result.voiceResponse) // "Opening settings page"
}

// Register custom command
navigation.registerCommand({
  name: 'customAction',
  patterns: ['^perform (\\w+)$'],
  category: 'action',
  description: 'Performs a custom action',
  parameters: [{ name: 'action', type: 'string', required: true }],
  handler: async (params) => ({
    success: true,
    message: `Performed ${params.action}`,
    voiceResponse: `Performing ${params.action}`,
  }),
})
```

### 4. Screen Reader Accessibility
Text-to-speech for accessibility and voice feedback.

```typescript
import { ScreenReaderManager } from '@repo/capabilities/voice'

const screenReader = new ScreenReaderManager({
  enabled: true,
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  mode: 'brief', // 'verbose', 'brief', or 'minimal'
})

// Announce text
await screenReader.announce('Welcome to the application')

// Announce element (for keyboard navigation)
await screenReader.announceElement({
  id: 'submit-btn',
  role: 'button',
  label: 'Submit form',
  description: 'Submits the current form',
  state: { disabled: false },
})

// Announce page
await screenReader.announcePage('Dashboard', 'View your analytics and reports')

// Announce alert
await screenReader.announceAlert('Form submitted successfully', 'info')
```

### 5. Voice Interaction Analytics
Track and analyze voice interaction patterns.

```typescript
import { VoiceAnalyticsManager } from '@repo/capabilities/voice'

const analytics = new VoiceAnalyticsManager()

// Track event
analytics.trackEvent({
  type: 'command',
  input: 'go to home',
  intent: 'navigate',
  command: 'goToPage',
  success: true,
  duration: 150,
  userId: 'user-123',
})

// Get metrics
const metrics = analytics.getMetrics()
console.log(`Success rate: ${metrics.successRate}%`)
console.log(`Avg response time: ${metrics.averageResponseTime}ms`)

// Generate report
const report = analytics.generateReport(
  new Date('2024-01-01'),
  new Date('2024-01-31')
)

console.log(report.trends)
console.log(report.recommendations)
```

## Complete Example

```typescript
import {
  SpeechToTextEngine,
  QueryProcessor,
  NavigationCommandManager,
  ScreenReaderManager,
  VoiceAnalyticsManager,
} from '@repo/capabilities/voice'

// Initialize components
const speech = new SpeechToTextEngine({
  recognitionService: 'browser',
  language: 'en-US',
  continuous: true,
})

const nlp = new QueryProcessor()
const navigation = new NavigationCommandManager()
const screenReader = new ScreenReaderManager({ enabled: true })
const analytics = new VoiceAnalyticsManager()

// Listen for speech recognition
speech.on('result', async (results) => {
  for (const result of results) {
    if (!result.isFinal) continue

    const startTime = Date.now()
    
    try {
      // Process natural language
      const query = await nlp.processQuery(result.transcript)
      
      // Execute command
      const commandResult = await navigation.executeCommand(
        result.transcript,
        { history: [] }
      )
      
      // Provide voice feedback
      if (commandResult.voiceResponse) {
        await screenReader.announce(commandResult.voiceResponse)
      }
      
      // Track analytics
      analytics.trackEvent({
        type: 'command',
        input: result.transcript,
        intent: query.intent,
        command: commandResult.success ? 'executed' : 'failed',
        success: commandResult.success,
        duration: Date.now() - startTime,
      })
    } catch (error) {
      await screenReader.announceAlert(
        'Sorry, I could not process that command',
        'error'
      )
      
      analytics.trackEvent({
        type: 'error',
        input: result.transcript,
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
      })
    }
  }
})

// Start listening
await speech.start()
```

## Built-in Voice Commands

### Navigation Commands
- `"go to [page]"` - Navigate to a page
- `"go back"` - Navigate to previous page
- `"scroll up"` - Scroll up on page
- `"scroll down"` - Scroll down on page
- `"scroll to top"` - Scroll to top of page
- `"scroll to bottom"` - Scroll to bottom of page

### Action Commands
- `"click [element]"` - Click a named element
- `"refresh"` / `"reload"` - Refresh the page

### System Commands
- `"help"` - Get help
- `"stop"` / `"cancel"` - Stop current action

## Browser Compatibility

### Web Speech API (Browser Recognition)
- ✅ Chrome/Edge (full support)
- ✅ Safari (iOS 15+)
- ⚠️ Firefox (experimental)

### Speech Synthesis (Text-to-Speech)
- ✅ Chrome/Edge
- ✅ Safari
- ✅ Firefox
- ✅ Most modern browsers

## Cloud Service Integration

### Google Cloud Speech-to-Text
```typescript
const engine = new SpeechToTextEngine({
  recognitionService: 'google',
  credentials: {
    apiKey: 'YOUR_API_KEY',
  },
  language: 'en-US',
})
```

### Azure Speech Services
```typescript
const engine = new SpeechToTextEngine({
  recognitionService: 'azure',
  credentials: {
    apiKey: 'YOUR_API_KEY',
    region: 'eastus',
  },
  language: 'en-US',
})
```

### AWS Transcribe
```typescript
const engine = new SpeechToTextEngine({
  recognitionService: 'aws',
  credentials: {
    apiKey: 'YOUR_ACCESS_KEY',
    region: 'us-east-1',
  },
  language: 'en-US',
})
```

## Accessibility Guidelines

### WCAG 2.1 Compliance
- **Keyboard Navigation**: All voice commands have keyboard alternatives
- **Screen Reader Support**: Full ARIA labels and announcements
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Input**: Voice is supplementary, not required

### Best Practices
1. **Provide Visual Feedback**: Show voice commands being processed
2. **Clear Instructions**: Explain available voice commands to users
3. **Error Recovery**: Offer alternatives when commands fail
4. **Privacy**: Inform users about voice data usage
5. **Fallback**: Always provide non-voice alternatives

## Performance Optimization

### Reduce Latency
```typescript
// Use interim results for faster feedback
const engine = new SpeechToTextEngine({
  recognitionService: 'browser',
  interimResults: true, // Show results while speaking
  continuous: true,
})
```

### Optimize Command Matching
```typescript
// Use specific patterns for faster matching
navigation.registerCommand({
  name: 'quickAction',
  patterns: ['^action$'], // Exact match for common commands
  // ...
})
```

### Cache Voice Data
```typescript
// Reduce speech synthesis load
const commonPhrases = new Map()
commonPhrases.set('welcome', 'Welcome to the application')

// Reuse utterances
const cachedUtterance = commonPhrases.get('welcome')
```

## Error Handling

```typescript
try {
  await speech.start()
} catch (error) {
  if (error.message.includes('not supported')) {
    // Fallback to text input
    console.warn('Voice recognition not supported')
  } else if (error.message.includes('permission')) {
    // Request microphone permission
    console.warn('Microphone permission denied')
  } else {
    // Handle other errors
    console.error('Voice recognition error:', error)
  }
}
```

## Analytics Insights

Track these key metrics:
- **Success Rate**: Percentage of successful voice commands
- **Confidence Score**: Average recognition confidence
- **Response Time**: Time from speech to action
- **Popular Commands**: Most frequently used commands
- **Error Patterns**: Common failure scenarios

## Future Enhancements

- [ ] Multi-language support with auto-detection
- [ ] Custom wake word detection
- [ ] Voice biometrics for authentication
- [ ] Offline speech recognition
- [ ] Emotion detection from voice
- [ ] Speaker diarization (multi-speaker support)

## Resources

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Google Cloud Speech](https://cloud.google.com/speech-to-text)
- [Azure Speech Services](https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/)
