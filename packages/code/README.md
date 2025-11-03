# @llm-ui/code

Code block support for @llm-ui/svelte with syntax highlighting via Shiki.

## Features

- Detects code blocks in markdown format (```language ... ```)
- Syntax highlighting with Shiki
- Supports all programming languages
- Handles streaming code blocks
- Framework-agnostic core functions

## Installation

```bash
npm install @llm-ui/code shiki
# or
pnpm add @llm-ui/code shiki
# or
yarn add @llm-ui/code shiki
```

## Usage

### Basic Setup

```typescript
import { createLLMOutput } from '@llm-ui/svelte';
import { codeBlockLookBack, findCompleteCodeBlock, findPartialCodeBlock } from '@llm-ui/code';
import { loadHighlighter } from '@llm-ui/code';
import { getHighlighterCore } from 'shiki/core';
import { bundledLanguagesInfo } from 'shiki/langs';
import { bundledThemes } from 'shiki/themes';
import getWasm from 'shiki/wasm';

// Load Shiki highlighter
const highlighter = loadHighlighter(
  getHighlighterCore({
    langs: bundledLanguagesInfo,
    themes: Object.values(bundledThemes),
    loadWasm: getWasm,
  })
);

// Create LLM output with code block support
const llmOutput = createLLMOutput({
  llmOutput: streamedText,
  isStreamFinished: false,
  blocks: [
    {
      findCompleteMatch: findCompleteCodeBlock(),
      findPartialMatch: findPartialCodeBlock(),
      lookBack: codeBlockLookBack(),
      component: CodeBlock,
    },
  ],
  fallbackBlock: {
    component: TextBlock,
    lookBack: markdownLookBack(),
  },
});
```

### Code Block Component

```svelte
<script lang="ts">
  import type { BlockMatch } from '@llm-ui/svelte';
  import { codeBlockToHtml } from '@llm-ui/code';
  import { onMount } from 'svelte';
  
  export let blockMatch: BlockMatch;
  export let highlighter;
  
  let html = '';
  
  onMount(async () => {
    const result = await codeBlockToHtml({
      markdownCodeBlock: blockMatch.output,
      highlighter,
      codeToHtmlOptions: { theme: 'github-dark' },
    });
    html = result.html || '';
  });
</script>

{@html html}
```

## API

### Functions

- `findCompleteCodeBlock(options?)` - Matcher for complete code blocks
- `findPartialCodeBlock(options?)` - Matcher for partial code blocks (streaming)
- `codeBlockLookBack(options?)` - LookBack function for code blocks
- `codeBlockToHtml(params)` - Convert code block to HTML
- `codeToHtml(params)` - Convert code to HTML
- `loadHighlighter(highlighter)` - Load Shiki highlighter

### Types

- `CodeBlockOptions` - Configuration options
- `CodeToHtmlOptions` - Shiki options
- `LLMUIHighlighter` - Highlighter type
- `CodeBlock` - Parsed code block

## License

MIT
