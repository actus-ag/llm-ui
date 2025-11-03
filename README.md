# llm-ui

The Svelte library for LLMs.

## Features

- Smooth streaming animation with throttling
- Custom Svelte components for LLM output
- Renders output at native frame rate (60fps)
- Framework-agnostic core logic
- Headless: Bring your own styles
- Full TypeScript support

## Installation

```bash
npm install @llm-ui/svelte
# or
pnpm add @llm-ui/svelte
# or
yarn add @llm-ui/svelte
```

## Quick Start

```svelte
<script lang="ts">
  import { createLLMOutput } from '@llm-ui/svelte';
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

Check out the working example in `examples/svelte-basic/` to see the library in action.

## License

[MIT](/LICENSE)
