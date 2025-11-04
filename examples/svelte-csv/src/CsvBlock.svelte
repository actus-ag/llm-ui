<script lang="ts">
  import type { BlockMatch } from '@actus-ag/llm-ui';
  import { parseCsv } from '@actus-ag/llm-ui-csv';
  
  export let blockMatch: BlockMatch;
  
  $: items = parseCsv(blockMatch.output, { type: 'data' });
  $: type = items[0] || '';
  $: values = items.slice(1);
</script>

<div class="csv-block">
  <div class="csv-header">
    <span class="csv-type">{type}</span>
    <span class="csv-count">{values.length} items</span>
  </div>
  <div class="csv-content">
    {#each values as value, i}
      <div class="csv-item">
        <span class="csv-index">{i + 1}</span>
        <span class="csv-value">{value}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .csv-block {
    margin: 1em 0;
    border: 2px solid #28a745;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
  }
  
  .csv-header {
    background: #28a745;
    color: white;
    padding: 0.5em 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .csv-type {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.875em;
  }
  
  .csv-count {
    font-size: 0.75em;
    opacity: 0.9;
  }
  
  .csv-content {
    padding: 1em;
    background: white;
  }
  
  .csv-item {
    display: flex;
    gap: 1em;
    padding: 0.5em;
    border-bottom: 1px solid #e9ecef;
  }
  
  .csv-item:last-child {
    border-bottom: none;
  }
  
  .csv-index {
    color: #6c757d;
    font-weight: bold;
    min-width: 2em;
  }
  
  .csv-value {
    flex: 1;
    font-family: 'Courier New', monospace;
  }
</style>
