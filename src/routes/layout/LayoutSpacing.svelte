<script lang="ts">
  import { sae } from '$lib/utils/MeasurementConverter';

  const displayOptions = { feet: false, precision: 8 };

  export let target: number;
  export let actual: number;

</script>

<div class="box">
  <div class="measurement">
    <span class="label">Spacing</span>
    <span class="target">
      <span>{sae(target, displayOptions)}</span>
      <span class="actual">
        {#if target !== actual}
          ({sae(actual, displayOptions)})
        {/if}
      </span>
    </span>
  </div>
</div>

<style>
  .box {
    align-items: center;
    margin-right: 0.5rem;
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
    display: flex;
    align-items: center;
    min-width: 4rem;
    text-align: center;
    white-space: nowrap;
    /* padding: 0 0.5rem; */
  }
  .actual {
    min-width: 4rem;
    text-align: right;
    font-size: small;
    white-space: nowrap;
  }
  span {
    width: 100%;
  }
</style>
