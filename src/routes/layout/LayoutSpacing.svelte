<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';

  const displayOptions = { feet: false, precision: 8 };

  export let target: number;
  export let actual: number;

</script>

<div class="box">
  <div class="measurement">
    <span class="label">Spacing</span>
    <span class="target">{sae(target, displayOptions)}</span>
    <span class="actual">
      {#if target !== actual}
        ({sae(actual, displayOptions)})
      {/if}
    </span>
  </div>
</div>

<style>
  .box {
    align-items: center;
  }
  .measurement {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  /* .label {
    min-width: 4rem;
    text-align: center;
  } */
  .target {
    min-width: 4rem;
    text-align: center;
    /* padding: 0 0.5rem; */
  }
  .actual {
    min-width: 4rem;
    text-align: right;
    font-size: small;
  }
  span {
    width: 100%;
  }
</style>
