<script lang="ts">
  export let layout: App.LayoutFlag;

/*
interface Layout {
  id: string;
  name?: string;
  label: string;
  type: 'arrange' | 'fill';
  points: string[];
  spacing: string;
  spacingTarget: string;
  alignment: 'even' | 'center' | 'start' | 'end';
  padding: [number, number];
  measurement: string;
}
*/
</script>

<div class="floating container">
  <section class="title-bar">
    <h1>{layout?.label}</h1>
    <div class="options">
      <button class="option" title={'edit ' + layout?.name || 'ratio'}>
        <img src="edit.svg" alt="edit" />
      </button>
    </div>
  </section>
  <section class="variables">
    {#if layout?.type === "arrange"}
      <span>{layout.spacing} SPACING</span>
    {/if}
  </section>
</div>
