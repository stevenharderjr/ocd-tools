<script lang="ts">
  import LayoutPoint from './LayoutPoint.svelte';
  import LayoutFraction from './LayoutFraction.svelte';
  import { formatter, measurer } from '$lib/utils/MeasurementConverter';
  import { points } from '$lib/utils/deriveLayoutPoints';

  export let layout: App.Layout;
  const feet = layout.span > 144;
  const displayOptions = { feet };
  const readable = formatter(displayOptions);
  const measure = measurer(displayOptions);
  $: measurements = points(layout).map(measure);
</script>

<ul>
  {#each measurements as measurement}
    <LayoutPoint {measurement} />
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow-x: scroll;
  }
  li {
    white-space: nowrap;
    padding-right: 2rem;
  }
</style>