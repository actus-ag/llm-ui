<script lang="ts">
  import { createLLMOutput, createStreamExample } from '@llm-ui/svelte';
  import { markdownLookBack } from '@llm-ui/markdown';
  import TextBlock from './TextBlock.svelte';

  const exampleText = `# Hello from LLM UI Svelte!

This is a demonstration of the LLM UI library ported to Svelte.

## Features

- ✅ Smooth streaming animation
- ✅ Throttling for consistent output
- ✅ Custom components support
- ✅ Framework-agnostic core logic
- ✅ **Markdown rendering** with proper formatting

The library handles the complexity of rendering LLM output with proper timing and animation.

### Code Example

Here's how easy it is to use:

\`\`\`typescript
const llmOutput = createLLMOutput({
  llmOutput: text,
  isStreamFinished: false,
  fallbackBlock: {
    component: TextBlock,
    lookBack: markdownLookBack()
  }
});
\`\`\`

Pretty cool, right? The markdown is rendered smoothly as it streams in!`;

  const stream = createStreamExample(exampleText, {
    autoStart: true,
    autoStartDelayMs: 500,
  });

  const llmOutput = createLLMOutput({
    llmOutput: $stream.output,
    isStreamFinished: $stream.isStreamFinished,
    fallbackBlock: {
      component: TextBlock,
      lookBack: markdownLookBack(),
    },
  });

  $: llmOutput.update({
    llmOutput: $stream.output,
    isStreamFinished: $stream.isStreamFinished,
  });

  function handleReset() {
    stream.reset();
    llmOutput.restart();
  }

  function handlePause() {
    stream.pause();
  }

  function handleStart() {
    stream.start();
  }
</script>

<main>
  <div class="container">
    <h1>LLM UI Svelte Example</h1>
    
    <div class="controls">
      <button on:click={handleStart} disabled={$stream.isPlaying || $stream.isStreamFinished}>
        Start
      </button>
      <button on:click={handlePause} disabled={!$stream.isPlaying}>
        Pause
      </button>
      <button on:click={handleReset}>
        Reset
      </button>
    </div>

    <div class="output">
      {#each $llmOutput.blockMatches as match (match.startIndex)}
        <svelte:component this={match.block.component} blockMatch={match} />
      {/each}
    </div>

    <div class="stats">
      <p>Stream Started: {$stream.isStreamStarted ? 'Yes' : 'No'}</p>
      <p>Stream Finished: {$stream.isStreamFinished ? 'Yes' : 'No'}</p>
      <p>Playing: {$stream.isPlaying ? 'Yes' : 'No'}</p>
      <p>Visible Text Length: {$llmOutput.visibleText.length}</p>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: #f5f5f5;
  }

  main {
    padding: 2rem;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin-top: 0;
    color: #333;
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #007bff;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  button:hover:not(:disabled) {
    background: #0056b3;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .output {
    min-height: 200px;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 2rem;
    font-size: 1rem;
    line-height: 1.6;
  }

  .stats {
    padding: 1rem;
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .stats p {
    margin: 0.5rem 0;
  }
</style>
