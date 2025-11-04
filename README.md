# llm-ui (Svelte)

A Svelte port of [llm-ui](https://github.com/llm-ui-kit/llm-ui) - the library for displaying LLM outputs.

This is a fork maintained by actus ag, focused on Svelte instead of React.

**Original project:** https://github.com/llm-ui-kit/llm-ui (React-based)  
**This fork:** Svelte-based implementation

## Features

- Smooth streaming animation with throttling
- Custom Svelte components for LLM output
- Renders output at native frame rate (60fps)
- Framework-agnostic core logic
- Headless: Bring your own styles
- Full TypeScript support

## Installation

```bash
npm install @actus-ag/llm-ui
# or
pnpm add @actus-ag/llm-ui
# or
yarn add @actus-ag/llm-ui
```

## Quick Start

```svelte
<script lang="ts">
  import { createLLMOutput } from '@actus-ag/llm-ui';
  import TextBlock from './TextBlock.svelte';

  const llmOutput = createLLMOutput({
    llmOutput: "Your LLM output here",
    isStreamFinished: false,
    fallbackBlock: {
      component: TextBlock,
      lookBack: (params) => ({
        output: params.output,
        visibleText: params.output.slice(0, params.visibleTextLengthTarget)
      })
    }
  });
</script>

<div>
  {#each $llmOutput.blockMatches as match (match.startIndex)}
    <svelte:component this={match.block.component} blockMatch={match} />
  {/each}
</div>
```

## Example

Check out the working examples in `examples/` to see the library in action.

## License

[MIT](/LICENSE)
