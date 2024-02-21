<script lang="ts">
  import { formatter } from '$lib/utils/MeasurementConverter';

  export let start: number;
  export let end: number;

  const readable = formatter({ feet: false });
</script>

<div class="row">
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
  .row {
    display: flex;
    flex-wrap: nowrap;
  }
  .measurement {
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
    padding: 0 0.5rem;
    white-space: nowrap;
    min-width: 3rem;
    text-align: center;
  }
  .label {
    min-width: 4rem;
    padding-right: 2rem;
  }
</style>