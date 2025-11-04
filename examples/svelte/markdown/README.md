# LLM UI Svelte Markdown Example

This example demonstrates markdown rendering with the `@actus-ag/llm-ui` library.

## Features Demonstrated

- Creating an LLM output stream with `createStreamExample`
- Rendering LLM output with `createLLMOutput`
- Custom Svelte components for rendering blocks
- Stream controls (start, pause, reset)
- Reactive updates with Svelte stores

## Running the Example

```bash
# From the repository root
pnpm install

# Run the example
cd examples/svelte/markdown
pnpm dev
```

Then open your browser to the URL shown in the terminal.

## Code Structure

- `src/App.svelte` - Main application component
- `src/TextBlock.svelte` - Custom component for rendering text blocks
- `src/main.ts` - Application entry point

## Key Concepts

### 1. Creating a Stream

```typescript
const stream = createStreamExample(exampleText, {
  autoStart: true,
  autoStartDelayMs: 500,
});
```

### 2. Creating LLM Output

```typescript
const llmOutput = createLLMOutput({
  llmOutput: $stream.output,
  isStreamFinished: $stream.isStreamFinished,
  fallbackBlock: {
    component: TextBlock,
    lookBack: (params) => ({
      output: params.output,
      visibleText: params.output.slice(0, params.visibleTextLengthTarget),
    }),
  },
});
```

### 3. Reactive Updates

```typescript
$: llmOutput.update({
  llmOutput: $stream.output,
  isStreamFinished: $stream.isStreamFinished,
});
```

### 4. Rendering Blocks

```svelte
{#each $llmOutput.blockMatches as match (match.startIndex)}
  <svelte:component this={match.block.component} blockMatch={match} />
{/each}
```

## Learn More

- [LLM UI Documentation](http://llm-ui.com/docs)
- [Migration Guide](../../MIGRATION_TO_SVELTE.md)
- [Svelte Documentation](https://svelte.dev)
