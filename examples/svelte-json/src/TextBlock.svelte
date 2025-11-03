<script lang="ts">
  import type { BlockMatch } from '@actus-ag/llm-ui-svelte';
  
  export let blockMatch: BlockMatch;
</script>

<div class="text-block">
  {blockMatch.output}
</div>

<style>
  .text-block {
    white-space: pre-wrap;
    line-height: 1.6;
  }
</style>
