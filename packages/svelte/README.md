# @actus-ag/llm-ui-svelte

Display language model outputs in your Svelte project.

More examples: https://llm-ui.com.

Visit http://llm-ui.com/docs to view the documentation.

## Installation

```bash
npm install @actus-ag/llm-ui-svelte
# or
pnpm add @actus-ag/llm-ui-svelte
# or
yarn add @actus-ag/llm-ui-svelte
```

## Usage

```svelte
<script lang="ts">
  import { createLLMOutput } from '@actus-ag/llm-ui-svelte';
  
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
  {#each $llmOutput.blockMatches as match}
    <svelte:component this={match.block.component} blockMatch={match} />
  {/each}
</div>
```

## Features

- Removes broken markdown syntax
- Add your own custom components to LLM output
- Throttling smooths out pauses in the LLM's streamed output
- Renders output at native frame rate
- Code blocks for every language with [Shiki](https://shiki.style)
- Headless: Bring your own styles

## License

[MIT](/LICENSE)
