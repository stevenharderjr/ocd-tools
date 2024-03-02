<script lang="ts">
  export let count: number;
  export let direction: 1 | -1 = 1;
  const _direction = direction < 1 ? -1 : 1;
  const colors = getColorGradient(count);

  function getColorGradient(steps: number) {
    const arr = [];
    const gradientStep = Math.round(255 / (steps * 2));
    // const baseline = gradientStep;

    let i = count;
    while (i--) {
      const value = (gradientStep * i).toString(16);
      arr[_direction < 0 ? i : (count - i - 1)] = ('color: #' + value + value + value + ';');
    }
    return arr;
  }
</script>

<span class="line">
  {#each Array(count) as _, i}
    <span style={colors[i]}>⬩</span>
  {/each}
</span>

<style>
  .line {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    opacity: 0.25;
  }
</style>