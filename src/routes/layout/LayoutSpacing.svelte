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
    <span class="actual">{readable(actual)}</span>
  {/if}
</div>
