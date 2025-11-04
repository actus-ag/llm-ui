<script lang="ts">
  import { createLLMOutput, createStreamExample } from '@actus-ag/llm-ui';
  import { findCompleteJsonBlock, findPartialJsonBlock, jsonBlockLookBack } from '@actus-ag/llm-ui-json';
  import JsonBlock from './JsonBlock.svelte';
  import TextBlock from './TextBlock.svelte';

  const exampleText = `Here's a user profile:

【{"type":"user","name":"Alice Johnson","email":"alice@example.com","role":"developer"}】

And here's a product:

【{"type":"product","id":"prod-123","name":"Wireless Mouse","price":29.99,"inStock":true}】

JSON blocks stream in character by character with smooth animation!`;

  const stream = createStreamExample(exampleText, {
    autoStart: true,
    autoStartDelayMs: 500,
  });

  const llmOutput = createLLMOutput({
    llmOutput: $stream.output,
    isStreamFinished: $stream.isStreamFinished,
    blocks: [
      {
        component: JsonBlock,
        findCompleteMatch: findCompleteJsonBlock({ type: 'user' }),
        findPartialMatch: findPartialJsonBlock({ type: 'user' }),
        lookBack: jsonBlockLookBack({ type: 'user', defaultVisible: true }),
      },
      {
        component: JsonBlock,
        findCompleteMatch: findCompleteJsonBlock({ type: 'product' }),
        findPartialMatch: findPartialJsonBlock({ type: 'product' }),
        lookBack: jsonBlockLookBack({ type: 'product', defaultVisible: true }),
      },
    ],
    fallbackBlock: {
      component: TextBlock,
      lookBack: (params) => ({
        output: params.output,
        visibleText: params.output.slice(0, params.visibleTextLengthTarget)
      }),
    },
  });

  $effect(() => {
    llmOutput.update({
      llmOutput: $stream.output,
      isStreamFinished: $stream.isStreamFinished,
    });
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
    <h1>LLM UI Svelte - JSON Example</h1>
    
    <div class="controls">
      <button onclick={handleStart} disabled={$stream.isPlaying || $stream.isStreamFinished}>
        Start
      </button>
      <button onclick={handlePause} disabled={!$stream.isPlaying}>
        Pause
      </button>
      <button onclick={handleReset}>
        Reset
      </button>
    </div>

    <div class="output">
      {#each $llmOutput.blockMatches as match (match.startIndex)}
        {@const Component = match.block.component}
        <Component blockMatch={match} />
      {/each}
    </div>

    <div class="stats">
      <p>Stream Started: {$stream.isStreamStarted ? 'Yes' : 'No'}</p>
      <p>Stream Finished: {$stream.isStreamFinished ? 'Yes' : 'No'}</p>
      <p>Playing: {$stream.isPlaying ? 'Yes' : 'No'}</p>
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
    max-width: 900px;
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
    background: #fafafa;
    border-radius: 4px;
    margin-bottom: 2rem;
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
