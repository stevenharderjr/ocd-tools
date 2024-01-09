<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let factor = {};
  export let relativeRange = [0.25, 1.75];

  const baseline = +factor.value;
  $: delta = Math.round(+factor.value - baseline);
  $: min = Math.max(1, Math.round(baseline * relativeRange[0]));
  $: max = Math.round(baseline * relativeRange[1]);
  // const min = Math.round(baseline * 0.25);
  // const max = Math.round(baseline * 1.75);

  function handleChange({ currentTarget: { value }}) {
    dispatch('update', { name: factor.name, value });
  }
</script>

{#if factor?.label }
  <div class="factor">
    <span class="label">{factor.label}</span>
    <div>
      {#if delta}
        <span class="delta">({delta > 0 ? '+' : ''}{delta})</span>
      {/if}
      <span class="value">{factor.prefix + Math.round(factor.value) + factor.suffix}</span>
      <!-- <span class="unit">{factor.unit}</span> -->
    </div>
  </div>
{/if}
<input class="slider" type="range" {min} {max} value={+factor?.value} on:input={handleChange} />

<style>
  .factor {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 1rem;
  }
  .label, .value {
    font-size: 1rem;
    font-weight: 300;
    white-space: nowrap;
  }

  .label {
    margin-right: 1rem;
  }

  .delta {
    font-size: small;
    font-weight: 300;
    color: #999;
  }

  input {
    width: 100%;
    margin-bottom: 1.5rem;
  }

</style>