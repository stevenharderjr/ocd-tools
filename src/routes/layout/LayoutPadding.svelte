<script lang="ts">
  import { formatter } from '$lib/utils/MeasurementConverter';

  export let start: number;
  export let end: number;

  const readable = formatter({ feet: false });
</script>

<div class="row">
  <div class="measurement">
    <span>&#8677;</span>
    <ul>
        <li>{readable(start) || '0"'}</li>
        <li>Padding</li>
        <li>{readable(end) || '0"'}</li>
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
    padding: 0;
    white-space: nowrap;
    min-width: 3rem;
    text-align: center;
  }
</style>