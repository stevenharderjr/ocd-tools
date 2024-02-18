<script lang="ts">
  import { formatter } from '$lib/utils/MeasurementConverter';
  import { points } from '$lib/utils/deriveLayoutPoints';

  export let layout: App.Layout;
  const displayOptions = { feet: layout.span > 144 };
  const readable = formatter(displayOptions);
  $: measurements = points(layout);
</script>

<ul on:click|stopPropagation>
  {#each measurements as measurement}
    <li>&#8729; <span>{readable(measurement) || '0"'}</span></li>
  {/each}
</ul>

<style>
  ul {
    pointer-events: auto;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: max-content;
  }
  li {
    white-space: nowrap;
    padding-right: 2rem;
  }
</style>