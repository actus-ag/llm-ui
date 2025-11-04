<script lang="ts">
  import type { BlockMatch } from '@actus-ag/llm-ui';
  import { ZERO_WIDTH_SPACE } from '@actus-ag/llm-ui-markdown';
  import { marked } from 'marked';
  
  export let blockMatch: BlockMatch;
  
  // Remove zero-width spaces that the markdown parser uses internally
  $: cleanedOutput = blockMatch.output.replaceAll(ZERO_WIDTH_SPACE, '');
  $: html = marked.parse(cleanedOutput, { async: false }) as string;
</script>

<div class="markdown">
  {@html html}
</div>

<style>
  .markdown :global(h1) {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
  }

  .markdown :global(h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.75em 0;
  }

  .markdown :global(h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin: 0.83em 0;
  }

  .markdown :global(ul) {
    list-style-type: disc;
    margin: 1em 0;
    padding-left: 2em;
  }

  .markdown :global(li) {
    margin: 0.5em 0;
  }

  .markdown :global(p) {
    margin: 1em 0;
  }

  .markdown :global(code) {
    background: #f4f4f4;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }

  .markdown :global(pre) {
    background: #f4f4f4;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }

  .markdown :global(pre code) {
    background: none;
    padding: 0;
  }
</style>
