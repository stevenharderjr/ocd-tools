<script lang="ts">
	import { inches, sae, type MeasurementPrecision } from '$lib/utils/MeasurementConverter';
	import { round } from '$lib/utils/round';
	import Toast from '../../toast';

	export let inputValue = '';
	export let precision: MeasurementPrecision = 16;
	let holdover = false;
	let priorInput = '';
	let currentExpression: string[] = [];
	let priorExpressions: Array<string[]> = [];
	let priorExpression = '';
	let repeatValue = '';
	let operativeValue: string = '';
	let operator = '';
	let clipboard = '';
	let numerator, denominator;
	const maxInputLength = 10;
	const options = { caching: false };
	let negative = false;
	let history = '';
	let lastChar,
		inputContainsInches,
		inputHasTrailingSpace,
		footIndex,
		inputHasExtraSpace,
		inputEval,
		priorOperation;

	$: {
		lastChar = inputValue.slice(-1);
		inputContainsInches = lastChar === '"';
		inputEval = inputContainsInches ? inputValue.slice(0, -1) : inputValue;
		inputHasTrailingSpace = inputEval.slice(-1) === ' ';
		footIndex = inputValue.indexOf("'");
		// $: lastSpaceIndex = inputEval.lastIndexOf(' ');
		inputHasExtraSpace =
			inputHasTrailingSpace ||
			(!denominator && inputContainsInches && inputEval.lastIndexOf(' ') > footIndex + 1);
		priorExpression = (priorExpressions[0] || currentExpression).join(' ');
		console.log(priorExpression);
	}

	const buttonAction = {
		refresh: () => {
			inputValue = '';
			operativeValue = '';
			operator = '';
			repeatValue = '';
			priorExpressions = [];
			currentExpression = [];
			return true;
		},
		copy: () => {
			clipboard = inputValue;
		},
		paste: () => {
			if (!clipboard) return Toast.add('Clipboard is empty.');
			inputValue = clipboard;
			return true;
		},
		back: () => {
			inputValue = operativeValue || '';
			operator = '';
			operativeValue = '';
			return true;
		},
		space: () => {
			if (!inputValue) return false;
			const evalLastChar = inputEval.slice(-1);
			if (evalLastChar === ' ') return false;

			inputValue = inputEval + (inputContainsInches ? ' "' : ' ');
			return true;
		},
		backspace: () => {
			let newInputValue = inputEval.slice(0, -1);
			if (newInputValue.slice(-1) === ' ') newInputValue = newInputValue.slice(0, -1);

			inputValue = newInputValue;
			currentExpression[2] = newInputValue;
			return true;
		},
		"'": () => {
			if (!inputValue) return Toast.add('No need to specify a foot measurement of zero.');
			if (footIndex > -1)
				return Toast.add(
					`Foot measurement is already specified (${inputValue.slice(0, footIndex)}').`
				);
			if (inputHasTrailingSpace) inputValue = inputEval.slice(0, -1);
			inputValue = inputEval + "'";
			currentExpression[2] = inputValue;
			return true;
		},
		'=': evaluate
	};

	function handleButtonPress({ currentTarget: { id } }) {
		const action = buttonAction[id];
		if (action) return action();

		if (isNaN(id)) return switchOperator(id);

		// must be a number input
		if (holdover) {
			holdover = false;
			inputValue = '';
			lastChar = '';
			repeatValue = '';
		}

		if (inputValue.length < maxInputLength) {
			if (lastChar === "'") inputValue += ' ' + id;
			else if (lastChar === '"') inputValue = inputValue.slice(0, -1) + id + '"';
			else inputValue += id;
			currentExpression[2] = sae(inches(inputValue || 0), options);
		}
	}

	function switchOperator(id: string) {
		repeatValue = operator === id ? '' : inputValue;
		// console.log({ inputValue, inputEval, id });
		if (!inputEval && id === '-') negative = !negative;

		holdover = true;
		operator = id;
		operativeValue = sae(inches(inputValue || '0'), options) || '0"';
		repeatValue = inputValue;
		currentExpression = [operativeValue, operator];
	}

	function evaluate(): Boolean {
		console.log(currentExpression.join(' '));
		let result = 0;
		const i = inches(repeatValue || inputValue || '0', options);
		const o = inches(operativeValue || '0', options);
		const expression = `(${o})${operator}(${i})`;
		console.log(expression);
		result = eval(expression);
		if (isNaN(result)) {
			Toast.add({ message: 'Invalid operation.', replace: true });
			currentExpression = [];
			operator = '';
			return false;
		}
		const formattedResult = sae(result, options);
		const formattedInput = sae(i, options);
		priorExpressions = [
			[operativeValue, operator, formattedInput, '=', formattedResult],
			...priorExpressions
		];
		operativeValue = '';
		repeatValue = formattedInput;
		inputValue = formattedResult;
		holdover = true;
		currentExpression = [];
		negative = false;
		return true;
	}

	function format(string: String) {
		if (!string) return '0"';
		const lastChar = string.slice(-1);
		if (lastChar === "'" || lastChar === '"') return string;
		inputValue = inputValue ? string + '"' : '';
		return string + '"';
	}

	function handleCopy() {
		console.log(currentExpression.join(' '));
		// navigator.clipboard.writeText(currentExpression)
	}
</script>

<div class="backdrop">
	<div class="floating calculator-body">
		<ul class="ticker-tape">
			{#each priorExpressions as expression}
				<li>{expression.join(' ')}</li>
			{/each}
		</ul>
		<div class="calculator-display">
			<div class="display-input">
				<!-- {#if inputValue}
					<button class="input-button">
						<img src="x-circle.svg" />
					</button>
				{:else if operativeValue}
					<button class="input-button">
						<img src="arrow-left-circle.svg" />
					</button>
				{/if} -->
				<span class="calculator-input">{format(inputValue)}</span>
				{#if negative}
					<span class="calculator-input">-</span>
				{/if}
			</div>
			<div class="display-info">
				<span><img src="clipboard.svg" alt="clipboard" />{clipboard}</span>
				<span class="input-history"
					>{currentExpression.length ? currentExpression.join(' ') : priorExpression}</span
				>
			</div>
		</div>
		<div class="calculator-buttons">
			<button on:click={handleButtonPress} aria-label="refresh" id="refresh" title="refresh"
				><img src="refresh.svg" alt="arrows circling counter clockwise" /></button
			>
			<button on:click={handleButtonPress} aria-label="copy" id="copy" title="copy"
				><img src="copy.svg" alt="stacked squares" /></button
			>
			<button on:click={handleButtonPress} aria-label="paste" id="paste" title="paste"
				><img src="clipboard.svg" alt="clipboard" /></button
			>
			{#if inputValue}
				<button on:click={handleButtonPress} aria-label="backspace" id="backspace" title="delete"
					><img src="delete.svg" alt="backspace" /></button
				>
			{:else}
				<button on:click={handleButtonPress} aria-label="back" id="back" title="back"
					><img src="arrow-left.svg" alt="left arrow" /></button
				>
			{/if}
			<button
				on:click={handleButtonPress}
				aria-label="exponent"
				id="**"
				title="exponent"
				class="inverted"
				style="font-size: 1.25rem;">^</button
			>
			<button
				on:click={handleButtonPress}
				aria-label="square root"
				id="√"
				title="square root"
				class="inverted"
				style="font-size: 1.25rem;">√</button
			>
			<button
				on:click={handleButtonPress}
				aria-label="foot symbol"
				id="'"
				title="foot symbol"
				class="inverted">'</button
			>
			<button on:click={handleButtonPress} aria-label="divide" id="/" class="inverted">÷</button>
			<button on:click={handleButtonPress} aria-label="7" id="7">7</button>
			<button on:click={handleButtonPress} aria-label="8" id="8">8</button>
			<button on:click={handleButtonPress} aria-label="9" id="9">9</button>
			<button on:click={handleButtonPress} aria-label="multiply" id="*" class="inverted">×</button>
			<button on:click={handleButtonPress} aria-label="4" id="4">4</button>
			<button on:click={handleButtonPress} aria-label="5" id="5">5</button>
			<button on:click={handleButtonPress} aria-label="6" id="6">6</button>
			<button on:click={handleButtonPress} aria-label="subtract" id="-" class="inverted">−</button>
			<button on:click={handleButtonPress} aria-label="1" id="1">1</button>
			<button on:click={handleButtonPress} aria-label="2" id="2">2</button>
			<button on:click={handleButtonPress} aria-label="3" id="3">3</button>
			<button on:click={handleButtonPress} aria-label="add" id="+" class="inverted">+</button>
			<button
				on:click={handleButtonPress}
				aria-label="⁄"
				id="⁄"
				title="value to numerator (create fraction)"
				class="inverted">⁄</button
			>
			<button on:click={handleButtonPress} aria-label="0" id="0">0</button>
			<button on:click={handleButtonPress} aria-label="space" id="space" class="inverted"
				><img src="space.svg" alt="space bar" /></button
			>
			<button on:click={handleButtonPress} aria-label="equals" id="=" class="inverted">=</button>
		</div>
	</div>
</div>

<style>
	.backdrop {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.ticker-tape {
		position: absolute;
		bottom: 100%;
		left: 2rem;
		right: 2rem;
		background: #fff;
		max-height: fit-content;
		display: table-cell;
		text-align: right;
		align-items: flex-end;
		color: #000;
		padding: 1rem;
	}

	.calculator-body {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* top: 50vh; */
		/* transform: translate(0, -50%); */
		pointer-events: none;
		z-index: 4;
		display: flex;
		flex-direction: column;
		padding: 1rem;
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
		padding: 4px 8px;
		border-radius: 8px;
		height: 6rem;
		/* margin: 8px; */
		grid-column: 1/5;
		width: 100%;
		/* width: calc(100vw - 32px); */
		max-width: calc(var(--column-width) - 32px);
		margin-bottom: 1.5rem;
		background: #ccc;
		box-shadow: inset 0 1px 3px #999;
	}

	.display-input {
		display: flex;
		flex-direction: row-reverse;
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
