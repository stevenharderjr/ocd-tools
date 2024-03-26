<script lang="ts">
  import { inches, sae, type MeasurementPrecision } from '$lib/utils/MeasurementConverter';
  import Toast from '../../toast';

  export let inputValue = '';
  export let operativeValue = '';
  export let operation = '';
  export let precision: MeasurementPrecision = 1;

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
  <span class="calculator-input">{inputValue}</span>
  <div class="button-grid">
    <button><img src="refresh.svg" /></button>
    <button><img src="clipboard.svg" /></button>
    <button>paste</button>
    <button><img src="delete.svg" /></button>
    <button>7</button>
    <button>8</button>
    <button>9</button>
    <button>÷</button>
    <button>4</button>
    <button>5</button>
    <button>6</button>
    <button>×</button>
    <button>1</button>
    <button>2</button>
    <button>3</button>
    <button>−</button>
    <button>0</button>
    <button>'</button>
    <button>/</button>
    <button>+</button>
  </div>
</div>

<style>
  .backdrop {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: space-between;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .calculator-input {
    text-align: right;
    font-size: 2rem;
    color: #000;
    background: #777;
    padding: 12px 8px;
    border-radius: 8px;
    height: 4rem;
    margin: 8px;
  }

  .button-grid {
    pointer-events: none;
    z-index: 4;
		display: grid;
    align-self: center;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 8px;
		pointer-events: none;
		max-width: 100%;
    width: min-content;
    padding: 8px;
	}

  img {
    filter: invert(0.1);
    height: 1.25rem;
    width: 1.25rem;
  }

	button {
    pointer-events: auto;
		border-radius: 9999px;
		background: #fffc;
		width: 4rem;
		height: 4rem;
    max-width: 20wu;
    max-height: 20wu;
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