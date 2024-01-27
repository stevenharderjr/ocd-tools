<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let factor: App.Factor;
  export let relativeRange = [0.25, 1.75];

  const baseline = factor.value;
  let delta = 0, min = 1, max = 2;

  $: {
    const [relativeMin, relativeMax] = relativeRange;
    delta = Math.round(factor.value - baseline);
    min = Math.max(1, Math.round(baseline * relativeMin));
    max = Math.max(3, baseline * relativeMax);
  }



  function handleChange({ currentTarget: { value }}) {
    const { name, id } = factor;
    dispatch('update', { name, id, value });
  }
</script>

{#if factor?.label }
  <div class="independent-factor">
    <span class="label">{factor.label}</span>
    <div class='dynamics'>
      {#if delta}
        <span class="delta">({delta > 0 ? '+' : ''}{delta})</span>
      {/if}
      <span class="value">{factor.prefix + Math.round(factor.value) + factor.suffix}</span>
      <!-- <span class="unit">{factor.unit}</span> -->
    </div>
  </div>
{/if}
<button class="slider-base" on:click|stopPropagation tabindex={-1}>
  <input class="slider" type="range" {min} {max} value={Math.round(factor.value)} on:input={handleChange} />
</button>

<style>
  .independent-factor {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: -1.5rem;
  }
  .dynamics {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: baseline;
    gap: 0.25rem;
    flex-wrap: wrap;
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

  .slider-base {
    position: relative;
    left: 0;
    /* background: #f006; */
    border: none;
    background: none;
    height: 4rem;
    /* margin-bottom: 1.5rem; */
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  input {
    width: 100%;
  }

</style>