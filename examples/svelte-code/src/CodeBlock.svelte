<script lang="ts">
  import type { BlockMatch } from '@llm-ui/svelte';
  import type { LLMUIHighlighter } from '@llm-ui/svelte-code';
  import { codeBlockToHtml } from '@llm-ui/svelte-code';
  import { onMount } from 'svelte';
  
  export let blockMatch: BlockMatch;
  export let highlighter: LLMUIHighlighter;
  
  let html = '';
  let code = '';
  let loading = true;
  
  onMount(async () => {
    const result = await codeBlockToHtml({
      markdownCodeBlock: blockMatch.output,
      highlighter,
      codeToHtmlOptions: { theme: 'github-dark' },
    });
    html = result.html || '';
    code = result.code;
    loading = false;
  });
  
  // Update when blockMatch changes (streaming)
  $: if (blockMatch) {
    codeBlockToHtml({
      markdownCodeBlock: blockMatch.output,
      highlighter,
      codeToHtmlOptions: { theme: 'github-dark' },
    }).then(result => {
      html = result.html || '';
      code = result.code;
    });
  }
</script>

{#if html}
  {@html html}
{:else if loading}
  <pre class="shiki loading"><code>{code || 'Loading...'}</code></pre>
{:else}
  <pre class="shiki"><code>{code}</code></pre>
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
