<script lang="ts">
  import { formatter } from '$lib/utils/MeasurementConverter';

  export let padding: [number, number];
  $: [start, end] = padding;

  const readable = formatter({ feet: false });
</script>

<div class="grid">
  <span class="label">Padding</span>
  <div class="measurement">
    <span>&#8677;</span>
    <ul>

        <li>{readable(start) || '0"'}</li>
        <li>{readable(end)}</li>
    </ul>
    <span>&#8676;</span>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .measurement {
    grid-column: 2/4;
    display: flex;
    width: 100%;
    max-width: 10rem;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
  }
  ul {
    list-style: none;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  li {
    font-size: 0.9rem;
    padding: 0 0.75rem;
    white-space: nowrap;
  }
  .label {
    font-size: 0.9rem;
    padding-right: 2rem;
  }
</style>