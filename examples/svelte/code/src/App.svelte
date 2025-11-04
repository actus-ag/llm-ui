<script lang="ts">
  import { createLLMOutput, createStreamExample } from '@actus-ag/llm-ui';
  import { markdownLookBack } from '@actus-ag/llm-ui-markdown';
  import { codeBlockLookBack, findCompleteCodeBlock, findPartialCodeBlock, loadHighlighter } from '@actus-ag/llm-ui-code';
  import { getHighlighterCore } from 'shiki/core';
  import getWasm from 'shiki/wasm';
  import MarkdownBlock from './MarkdownBlock.svelte';
  import CodeBlock from './CodeBlock.svelte';

  const exampleText = `## Python

\`\`\`python
def greet(name):
    print(f'Hello {name} from llm-ui!')

greet('World')
\`\`\`

## TypeScript

\`\`\`typescript
function greet(name: string): void {
  console.log(\`Hello \${name} from llm-ui!\`);
}

greet('World');
\`\`\`

## JavaScript

\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello \${name} from llm-ui!\`);
};

greet('World');
\`\`\`

Pretty cool, right? Code blocks are syntax-highlighted as they stream in!`;

  // Load Shiki highlighter with specific languages and theme
  const highlighter = loadHighlighter(
    getHighlighterCore({
      langs: [
        import('shiki/langs/python.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/javascript.mjs'),
      ],
      themes: [
        import('shiki/themes/github-dark.mjs'),
      ],
      loadWasm: getWasm,
    })
  );

  const stream = createStreamExample(exampleText, {
    autoStart: true,
    autoStartDelayMs: 500,
  });

  const llmOutput = createLLMOutput({
    llmOutput: stream.output,
    isStreamFinished: stream.isStreamFinished,
    blocks: [
      {
        component: CodeBlock,
        findCompleteMatch: findCompleteCodeBlock(),
        findPartialMatch: findPartialCodeBlock(),
        lookBack: codeBlockLookBack(),
      },
    ],
    fallbackBlock: {
      component: MarkdownBlock,
      lookBack: markdownLookBack(),
    },
  });

  $effect(() => {
    llmOutput.update({
      llmOutput: stream.output,
      isStreamFinished: stream.isStreamFinished,
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
    <h1>LLM UI Svelte - Code Example</h1>
    
    <div class="controls">
      <button onclick={handleStart} disabled={stream.isPlaying || stream.isStreamFinished}>
        Start
      </button>
      <button onclick={handlePause} disabled={!stream.isPlaying}>
        Pause
      </button>
      <button onclick={handleReset}>
        Reset
      </button>
    </div>

    <div class="output">
      {#each llmOutput.blockMatches as match (match.startIndex)}
        {@const Component = match.block.component}
        <Component blockMatch={match} {highlighter} />
      {/each}
    </div>

    <div class="stats">
      <p>Stream Started: {stream.isStreamStarted ? 'Yes' : 'No'}</p>
      <p>Stream Finished: {stream.isStreamFinished ? 'Yes' : 'No'}</p>
      <p>Playing: {stream.isPlaying ? 'Yes' : 'No'}</p>
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
