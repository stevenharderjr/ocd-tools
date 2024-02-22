<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';

  const displayOptions = { feet: false, precision: 8 };

  export let target: number;
  export let actual: number;

</script>

<div class="box">
  <span class="label">Spacing</span>
  <span class="target">{sae(target, displayOptions)}</span>
  {#if target !== actual}
    <span class="actual"> ({sae(actual, displayOptions)} actual)</span>
  {/if}
</div>

<style>
  .box {
    align-items: center;
  }
  .label {
    min-width: 4rem;
  }
  .target {
    padding: 0 0.5rem;
  }
  .actual {
    font-size: small;
    padding: 0 0.5rem;
  }
</style>
