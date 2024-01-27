<script lang="ts">
  export let layout: App.LayoutFlag;
  const spacing = layout?.spacing;
  const [start, end] = layout?.padding || [];
  const details = [
    spacing + ' spacing',
    (start === end)
      ? start + ' padding'
      : 'Padding: ' + start + ', ' + end
  ];
</script>

<li class="floating card">
  <button class="touchable" on:click>
    <div class="content">
      <section class="card-top">
        <h2>{layout?.label}</h2>
      </section>
      <section class="datapoints">
        {#each details as detail}
          <span>{detail}</span>
        {/each}
      </section>
    </div>
  </button>

  <div class="card-options">
    <button class="option-icon" title={'edit ' + layout?.name || 'ratio'}>
      <img src="edit.svg" alt="edit" />
    </button>
  </div>
</li>
