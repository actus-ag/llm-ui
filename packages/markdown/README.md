# @actus-ag/llm-ui-markdown

Markdown support for @actus-ag/llm-ui with streaming-safe rendering.

## Features

- Removes incomplete markdown syntax during streaming
- Prevents flickering and broken rendering
- Supports GitHub Flavored Markdown (GFM)
- Handles partial markdown elements gracefully

## Installation

```bash
npm install @actus-ag/llm-ui-markdown
# or
pnpm add @actus-ag/llm-ui-markdown
# or
yarn add @actus-ag/llm-ui-markdown
```

## Usage

```typescript
import { createLLMOutput } from '@actus-ag/llm-ui';
import { markdownLookBack } from '@actus-ag/llm-ui-markdown';

const llmOutput = createLLMOutput({
  llmOutput: streamedText,
  isStreamFinished: false,
  fallbackBlock: {
    component: MarkdownBlock,
    lookBack: markdownLookBack(),
  },
});
```

## How it Works

The `markdownLookBack` function:
1. Parses markdown into an AST (Abstract Syntax Tree)
2. Removes incomplete markdown elements during streaming
3. Calculates visible text length for proper throttling
4. Only shows complete, valid markdown

This prevents users from seeing broken syntax like:
- Incomplete bold: `**half bold`
- Incomplete links: `[text](http`
- Incomplete lists: `* item`

## License

MIT
