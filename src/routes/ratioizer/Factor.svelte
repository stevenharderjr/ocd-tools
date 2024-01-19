<script lang="ts">
  export let factor: App.Factor = { label: '', value: 0, unit: '' };
  const initial = { ...factor };
  $: delta = factor.value - initial.value;
</script>

<div class="factor">
  <span class="label">{factor.label}</span>
  <div class="components">
    {#if delta}
      <span class="delta">({delta > 0 ? '+' : ''}{delta})</span>
    {/if}
    <span class="value">{factor.prefix + factor.value + factor.suffix}</span>
  </div>
</div>

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

  .label {
    min-width: 50%;
    max-width: 8rem;
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