<script lang="ts">
  import { formatter } from '$lib/utils/MeasurementConverter';

  const displayOptions = { feet: false };
  const readable = formatter(displayOptions);

  export let spacing: number | [number, number];
  $: [target, actual] = Array.isArray(spacing) ? spacing : [spacing, spacing];

</script>

<div class="box">
  <span class="label">Spacing</span>
  <span class="target">{readable(target)}</span>
  {#if target !== actual}
    <span class="actual"> ({readable(actual)} actual)</span>
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
