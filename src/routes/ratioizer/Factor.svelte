<script lang="ts">
  export let factor: App.Factor = { id: '', label: '', value: 0, prefix: '', suffix: '' };
  export let precision;
  const initial = { ...factor };
  $: decimals = precision.length - 1;
  $: delta = factor?.baseline ? (factor.value - factor.baseline!) : 0;
</script>

<li class="factor">
  <h2>{factor.label}</h2>
  <div class="components">
    {#if delta}
      <span class="delta">({delta > 0 ? '+' : ''}{delta.toFixed(decimals)})</span>
    {/if}
    <span class="value">{factor.prefix + factor.value.toFixed(decimals) + factor.suffix}</span>
  </div>
</li>

<style>
  .factor {
    pointer-events: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    pointer-events: none;
    min-width: 100%;
    height: 1.4rem;
  }

  h2 {
    font-weight: 300;
    font-size: 1rem;
    min-width: 50%;
    max-width: 8rem;
  }

  .components {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: flex-end;
    gap: 4px;
    flex-wrap: wrap;
  }

  .value {
    white-space: nowrap;
  }

  .delta {
    position: relative;
    top: -1px;
    font-size: small;
    font-weight: 300;
    color: #999;
    margin-right: 4px;
  }

</style>