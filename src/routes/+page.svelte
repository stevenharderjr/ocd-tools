<script>
  import Dashboard from '$lib/Dashboard.svelte';
</script>

<svelte:head>
  <title>OCD Tools</title>
</svelte:head>

<!-- {#if !using} -->
  <Dashboard />
<!-- {:else if !editing}
  <Use ratio={$ratios[using]} on:close={cancel} />
{:else}
  <Edit detail={$ratios[editing]} on:update={updateRatio} on:cancel={cancel} />
{/if} -->
