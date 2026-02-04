---
title: AI Content Generation Patterns
description: Prompting patterns, content workflows, and review steps.
---

# AI Content Generation Patterns

## Recommended Workflow

1. **Brief:** outline audience, tone, and required sections.
2. **Draft:** request structured output with headings.
3. **Review:** human review for compliance and accuracy.
4. **Publish:** store approved content with version history.

## Prompt Template

```
You are a brand copywriter for {{client}}.
Goal: {{goal}}
Tone: {{tone}}
Format: {{format}}
Constraints:
- Include {{keywords}}
- Avoid {{excluded_terms}}
- Keep length under {{word_count}} words
```

## Example Content Request

```ts
const prompt = [
  "You are a brand copywriter for Northwind.",
  "Goal: Draft a landing page hero section.",
  "Tone: Confident and concise.",
  "Format: Headline + subhead + CTA.",
  "Constraints: Keep under 60 words.",
].join("\n");

const response = await aiClient.generate({
  prompt,
  tags: ["hero", "landing"], // Tags help with analytics later.
});
```

## Review Checklist

- Validate factual claims and numbers.
- Confirm tone matches brand guidelines.
- Ensure accessibility (avoid jargon, define acronyms).
