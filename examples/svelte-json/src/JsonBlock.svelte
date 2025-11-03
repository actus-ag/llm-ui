<script lang="ts">
  import type { BlockMatch } from '@actus-ag/llm-ui-svelte';
  
  export let blockMatch: BlockMatch;
  
  $: jsonData = JSON.parse(blockMatch.output);
</script>

<div class="json-block">
  <div class="json-header">
    <span class="json-type">{jsonData.type}</span>
  </div>
  <pre class="json-content">{blockMatch.output}</pre>
</div>

<style>
  .json-block {
    margin: 1em 0;
    border: 2px solid #4a90e2;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
  }
  
  .json-header {
    background: #4a90e2;
    color: white;
    padding: 0.5em 1em;
    font-weight: bold;
  }
  
  .json-type {
    text-transform: uppercase;
    font-size: 0.875em;
  }
  
  .json-content {
    padding: 1em;
    margin: 0;
    background: white;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    font-size: 0.875em;
  }
</style>
