<script lang="ts">
  import { formatter } from '$lib/utils/MeasurementConverter';

  const displayOptions = { feet: false };
  const readable = formatter(displayOptions);

  export let targetSpacing: number;
  export let actualSpacing: number;

</script>

<div class="box">
  <span class="label">Spacing</span>
  <span class="target">{readable(targetSpacing)}</span>
  {#if targetSpacing !== actualSpacing}
    <span class="actual"> ({readable(actualSpacing)} actual)</span>
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
