<script lang="ts">
  import type { BlockMatch } from '@actus-ag/llm-ui-svelte';
  import { ZERO_WIDTH_SPACE } from '@actus-ag/llm-ui-markdown';
  import { marked } from 'marked';
  
  export let blockMatch: BlockMatch;
  
  $: cleanedOutput = blockMatch.output.replaceAll(ZERO_WIDTH_SPACE, '');
  $: html = marked.parse(cleanedOutput, { async: false }) as string;
</script>

<div class="markdown">
  {@html html}
</div>

<style>
  .markdown :global(h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 1.5em 0 0.5em 0;
    color: #333;
  }

  .markdown :global(p) {
    margin: 0.5em 0;
    line-height: 1.6;
  }
</style>
