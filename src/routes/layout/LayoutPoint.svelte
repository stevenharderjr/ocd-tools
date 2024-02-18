<script lang="ts">
  import type { Measurement } from '$lib/utils/MeasurementConverter';
  import LayoutFraction from './LayoutFraction.svelte';

  export let measurement: Measurement;
</script>

<li>
  <span>&#8729;</span>
  <span>{`${measurement.feet ? measurement.feet + "' " : ''}${measurement.inches || ''}`}<LayoutFraction fraction={measurement.fraction} /></span>
</li>
