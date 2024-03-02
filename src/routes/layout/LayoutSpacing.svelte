<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';


  export let target: number;
  export let actual: number;
  export let precision = 8;
  $: displayOptions = { feet: target > 144, precision };

</script>

<div class="measurement">
  <span class="tiny-caps start">Target</span>
  <span class="target">{sae(target, displayOptions)}</span>
  <span class="small-caps label">Spacing</span>
  <span class="actual">
    {#if actual && target !== actual}
      {sae(actual, displayOptions)}
    {/if}
  </span>
  <span class="tiny-caps end">Actual</span>
</div>

<style>
  div {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .label {
    width: 100%;
    text-align: center;
  }
  .target {
    width: 100%;
    white-space: nowrap;
    font-weight: 500;
  }
  .actual {
    width: 100%;
    text-align: right;
    font-size: small;
    white-space: nowrap;
    color: #555;
  }
  .start, .end {
    position: absolute;
    top: -0.75rem;
  }
  .start {
    left: 0;
  }
  .end {
    right: 0;
    text-align: right;
  }
</style>
