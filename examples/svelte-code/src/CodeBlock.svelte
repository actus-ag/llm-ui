<script lang="ts">
  import type { BlockMatch } from '@actus-ag/llm-ui-svelte';
  import type { LLMUIHighlighter } from '@actus-ag/llm-ui-svelte-code';
  import { codeBlockToHtml } from '@actus-ag/llm-ui-svelte-code';
  
  export let blockMatch: BlockMatch;
  export let highlighter: LLMUIHighlighter;
  
  let html = '';
  let code = '';
  let updateId = 0;
  
  // Update when blockMatch.output changes (streaming)
  $: {
    const currentId = ++updateId;
    codeBlockToHtml({
      markdownCodeBlock: blockMatch.output,
      highlighter,
      codeToHtmlOptions: { theme: 'github-dark' },
    }).then(result => {
      // Only update if this is still the latest request
      if (currentId === updateId) {
        html = result.html || '';
        code = result.code;
      }
    });
  }
</script>

{#if html}
  {@html html}
{:else}
  <pre class="shiki loading"><code>{code || 'Loading...'}</code></pre>
{/if}

<style>
  .shiki {
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1em 0;
  }
  
  .loading {
    background: #f4f4f4;
    color: #666;
  }
</style>
