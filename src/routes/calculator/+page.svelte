<script lang="ts">
  import { inches, sae, type MeasurementPrecision } from '$lib/utils/MeasurementConverter';
  import Toast from '../../toast';

  export let inputValue = '';
  export let operativeValue = '5318008';
  export let operation = '+';
  export let precision: MeasurementPrecision = 1;
  export let clipboard = '3.141593';

  function operate() {
    const i = inches(inputValue) || 0;
    const o = inches(operativeValue) || 0;
    switch(operation) {
      case '+':
        return sae(i + o, { precision });
      case '-':
        return sae(o - i, { precision });
      case '*':
        return sae(o * i, { precision });
      case '/':
        return i > 0 ? (o / i, { precision }) : Toast.add({ message: 'Cannot divide by zero.', replace: true });
    }
  }
</script>

<div class="backdrop">
  <div class="floating calculator-body">
    <div class="calculator-display">
      <div class="display-input">
        {#if inputValue}
          <button class="input-button">
            <img src="x-circle.svg" />
          </button>
        {:else if operativeValue}
          <button class="input-button">
            <img src="arrow-left-circle.svg"/>
          </button>
        {/if}
        <span class="calculator-input">{inputValue || '0'}"</span>
      </div>
      <div class="display-info">
        {#if clipboard}
          <span><img src="clipboard.svg" />{clipboard}</span>
        {/if}
        {#if operativeValue}
          <span class="input-history">{operativeValue} {operation}</span>
        {/if}
      </div>
    </div>
    <div class="calculator-buttons">
      <button class="inverted"><img src="refresh.svg" /></button>
      <button class="inverted"><img src="copy.svg" /></button>
      <button class="inverted"><img src="clipboard.svg" /></button>
      <!-- {#if inputValue}
        <button class="inverted"><img src="delete.svg" /></button>
      {:else}
        <button class="inverted"><img src="arrow-left.svg" /></button>
      {/if} -->
      <button class="inverted">÷</button>
      <button>7</button>
      <button>8</button>
      <button>9</button>
      <button class="inverted">×</button>
      <button>4</button>
      <button>5</button>
      <button>6</button>
      <button class="inverted">−</button>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button class="inverted">+</button>
      <button class="inverted">/</button>
      <button>0</button>
      <button class="inverted"><img src="space.svg"/></button>
      <button class="inverted">=</button>
    </div>
  </div>
</div>

<style>
  .backdrop {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: space-between;
    justify-content: flex-end;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .calculator-body {
    pointer-events: none;
    z-index: 4;
		display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-self: center;
    padding: 1rem;
    margin-bottom: 6rem;
    background: #eee;
    border-radius: 12px 12px 18px 18px;
    max-width: var(--column-width);
  }

  .calculator-display {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    justify-content: flex-start;

    color: #000;
    background: #ccc;
    padding: 4px 8px;
    border-radius: 8px;
    height: 6rem;
    /* margin: 8px; */
    grid-column: 1/5;
    width: 100%;
    /* width: calc(100vw - 32px); */
    max-width: calc(var(--column-width) - 32px);
    margin-bottom: 1.5rem;
    background: #ddd;
    box-shadow: inset 0 1px 3px #999;
  }

  .display-input {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }

  .display-input img {
    width: 32px;
    height: 32px;
    margin-left: -24px;
  }

  .display-info {
    display: flex;
    text-align: left;
    font-size: 1rem;
    line-height: 1rem;
    align-self: flex-start;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
  }

  .display-info span {
    display: flex;
    opacity: 0.5;
    justify-content: center;
    gap: 0.25rem;
  }

  .calculator-input {
    text-align: right;
    font-size: 4rem;
    line-height: 4rem;
  }

  .calculator-buttons {
		display: grid;
    align-self: flex-end;
    justify-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 8px;
		pointer-events: none;
		max-width: 100%;
    width: min-content;
    padding: 0 17px 17px 18px;
    /* padding-right: 17px;
    padding-bottom: 18px; */
    /* padding: 0 0 0 17px; */
    /* background: #f006; */
	}

  img {
    /* filter: invert(0.1); */
    height: 1.25rem;
    width: 1.25rem;
  }

  .inverted {
    background: #999;
    filter: invert(1);
  }

	button {
    pointer-events: auto;
		border-radius: 12px;
		background: #fff;
		width: 4rem;
		height: 4rem;
    max-width: 21vw;
    max-height: 21vw;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		touch-action: manipulation;
		font-size: 2rem;
		box-shadow: 0 0 4px 2px #0003;
		backdrop-filter: blur(4px);
		pointer-events: auto;
	}

  .input-button {
    background: transparent;
    backdrop-filter: none;
    box-shadow: none;
    opacity: 0.7;
  }

	svg {
		width: 33%;
		height: 33%;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: #000c;
	}
</style>