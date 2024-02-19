<script>
  import Dashboard from '$lib/Dashboard.svelte';
</script>

<!-- {#if !using} -->
  <Dashboard />
<!-- {:else if !editing}
  <Use ratio={$ratios[using]} on:close={cancel} />
{:else}
  <Edit detail={$ratios[editing]} on:update={updateRatio} on:cancel={cancel} />
{/if} -->
