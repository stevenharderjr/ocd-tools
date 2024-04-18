<script lang="ts">
	import PrecisionModal from './CalculatorPrecision.svelte';
	import CalculatorButtonGroup from '$lib/CalculatorButtonGroup.svelte';
	import { buttons } from './buttons';
	import {
		inches,
		converter,
		sae,
		type MeasurementPrecision
	} from '$lib/utils/MeasurementConverter';
	import { round } from '$lib/utils/round';
	import { visualWidth } from '$lib/utils/visualWidth';
	import Toast from '../../toast';

	export let inputValue = '';
	export let numerator: number | undefined;
	export let denominator: number | undefined;
	export let precision: MeasurementPrecision = 16;
	let showPrecisionModal = false;
	let modalCoordinates = [0, 0];
	let holdover = false;
	let priorInput = '';
	let currentExpression: string[] = [];
	let priorExpressions: Array<string[]> = [];
	let priorExpression = '';
	let repeatValue = '';
	let operativeValue: string = '';
	let operator = '';
	let clipboard = '';
	const maxInputLength = 15;
	const inputSizeThreshold = 9;
	let negative = false;
	let history = '';
	let lastChar,
		inputContainsInches,
		inputHasTrailingSpace,
		footIndex,
		slashIndex,
		partialFraction,
		inputHasExtraSpace,
		inputEval,
		priorOperation,
		inputIsMeasurement;

	// Toast.add(`Haptic feedback ${navigator.vibrate ? 'enabled' : 'disabled'}.`);

	$: options = { precision };
	$: inputIsMeasurement = holdover || (operator !== '*' && operator !== '/');
	$: formattedInput = inputIsMeasurement ? format(inputValue) : inputValue;
	$: visualInputWidth = visualWidth(formattedInput);
	$: displayTextSize =
		visualInputWidth < inputSizeThreshold
			? 4
			: (maxInputLength - visualInputWidth) / (maxInputLength - inputSizeThreshold) + 2;
	$: {
		lastChar = inputValue.slice(-1);
		inputContainsInches = lastChar === '"';
		inputEval = inputContainsInches ? inputValue.slice(0, -1) : inputValue;
		inputHasTrailingSpace = inputEval.slice(-1) === ' ';
		slashIndex = inputValue.indexOf('/');
		footIndex = inputValue.indexOf("'");
		// $: lastSpaceIndex = inputEval.lastIndexOf(' ');
		inputHasExtraSpace =
			inputHasTrailingSpace ||
			(!denominator && inputContainsInches && inputEval.lastIndexOf(' ') > footIndex + 1);
		priorExpression = (priorExpressions[priorExpressions.length - 1] || currentExpression).join(
			' '
		);
	}

	const operatorCrossref = {
		'+': '+',
		'-': '−',
		'*': '×',
		'/': '÷',
		'−': '-',
		'×': '*',
		'÷': '/',
		'^': '**',
		'**': '²',
		'√': '√'
	};

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
			if (!inputValue) return Toast.add('There is nothing to copy.');
			clipboard = inputValue;
			navigator.clipboard.writeText(inputValue);
		},
		paste: () => {
			if (!clipboard) return Toast.add('Clipboard is empty.');
			inputValue = clipboard;
			return true;
		},
		settings: (event) => {
			togglePrecisionModal(event);
		},
		// back: () => {
		// 	if (!priorExpressions.length) return;
		// 	priorExpressions.pop();
		// 	priorExpressions = [...priorExpressions];
		// 	currentExpression = [];
		// 	const priorExpression = priorExpressions[priorExpressions.length - 1];
		// 	inputValue = priorExpression[4];
		// 	operativeValue = inputValue;
		// 	holdover = true;
		// 	// let i = priorExpressions.length;
		// 	// if (!i) return;
		// 	// let recall = '';
		// 	// while (i--) {
		// 	// 	const expression = priorExpressions.pop();
		// 	// 	if (!expression) continue;
		// 	// 	const [x, o, y, , z] = expression;
		// 	// 	console.log({ x, y, z });
		// 	// 	if (z && z !== inputValue) {
		// 	// 		recall = z;
		// 	// 		currentExpression = expression;
		// 	// 		break;
		// 	// 	}
		// 	// 	if (y && y !== inputValue) {
		// 	// 		recall = y;
		// 	// 		currentExpression = [x, o];
		// 	// 		operator = o;
		// 	// 		break;
		// 	// 	}
		// 	// 	if (x && x !== inputValue) {
		// 	// 		recall = x;
		// 	// 		currentExpression = [];
		// 	// 		break;
		// 	// 	}
		// 	// }
		// 	// priorExpressions = recall ? [...priorExpressions] : [];
		// 	// inputValue = recall;
		// 	// operator = '';
		// 	// operativeValue = '';
		// 	return true;
		// },
		space: () => {
			if (!inputValue) return Toast.add('Specify a value before adding space.');
			if (slashIndex > -1) return Toast.add('Cannot add space after a fraction.');
			const evalLastChar = inputEval.slice(-1);
			if (evalLastChar === ' ') return Toast.add('Single spaces only.');

			inputValue = inputEval + (inputContainsInches ? ' "' : ' ');
			return true;
		},
		backspace: () => {
			inputValue = '';
			repeatValue = '';
			currentExpression =
				currentExpression.length > 3
					? [operativeValue, operator, inputIsMeasurement ? inputValue : inputEval, '=', inputValue]
					: [operativeValue, operator, inputIsMeasurement ? inputValue : inputEval];
			return true;
		},
		"'": () => {
			if (!inputIsMeasurement) return Toast.add('Just use an integer.');
			if (!inputValue) return Toast.add('No need to specify a foot measurement of zero.');
			const trimmedInput = trimTrailingSpaces(inputValue);
			const [feet, otherStuff] = trimmedInput.split("'");
			if (otherStuff?.length)
				return Toast.add(
					feet
						? `Foot measurement is already specified (${inputValue.slice(0, footIndex)}').`
						: 'Only whole numbers can be converted between feet and inches.'
				);

			const length = feet?.length;
			if (length)
				inputValue = feet.slice(-1) === '"' ? feet.slice(0, length - 1) + "'" : feet + '"';
			const converted = converter.parse(inputValue, options)?.readable || '';

			let [x, o, y] = currentExpression;
			currentExpression = y ? [x, o, converted] : [converted];
			return true;
		},
		'**': () => {
			switchOperator('**');
			evaluate();
		},
		'√': () => {
			switchOperator('√');
			evaluate();
		},
		'⁄': () => {
			const lastChar = inputValue.slice(-1);
			const lastCharEval = inputEval.slice(-1);
			if ((!lastChar && !lastCharEval) || lastCharEval === '0' || lastChar === "'")
				return Toast.add('Fraction requires a numerator.');
			if (slashIndex !== -1) return Toast.add('Fraction is already specified.');
			inputEval += '/';
			inputValue = format(inputEval);
		},
		'=': evaluate
	};

	function overwriteSegment(overwrite: string, existing: string, index: number) {
		let result = '';
		try {
			result =
				existing.slice(0, index) +
				overwrite +
				existing.slice(index + overwrite.length, existing.length);
		} catch (err) {
			console.log(err);
		}
		return result;
	}

	function trimTrailingSpaces(str: string) {
		if (!str) return '';
		let i = str.length;
		while (i--) {
			const char = str[i];
			if (char !== ' ') return str.slice(0, i + 1);
		}
		return str;
	}

	function handleButtonPress({ detail: id }) {
		// const id = event.currentTarget.id;
		const action = buttonAction[id];
		if (action) return action(event);

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
			else if (lastChar === '"')
				inputValue = inputValue.slice(0, -1) + id + (operator !== '**' ? '"' : '');
			else inputValue += id;
			const i = inches(inputValue || '0');
			currentExpression[2] =
				operator !== '**'
					? operator === '*' || operator === '/'
						? i
						: sae(i, options)
					: inputValue;
		}
	}

	function switchOperator(id: string) {
		if (operativeValue && !holdover) evaluate();
		repeatValue = operator === id ? '' : inputValue;
		// console.log({ inputValue, inputEval, id });
		if (!inputEval && id === '-') negative = !negative;

		holdover = true;
		operator = id;
		operativeValue = sae(inches(inputValue || '0'), options) || '0"';
		repeatValue = inputValue;
		currentExpression = [operativeValue, operatorCrossref[operator]];
	}

	function evaluate(): Boolean {
		let result = 0;
		const i = operator === '**' ? 2 : inches(repeatValue || inputValue || '0', options);
		const o = inches(operativeValue || '0', options);
		const expression = `(${o})${operator}(${i})`;
		result = operator === '√' ? Math.sqrt(o) : eval(expression);
		if (isNaN(result) || (!i && operator === '/')) {
			Toast.add({ message: 'Invalid operation.', replace: true });
			currentExpression = [sae(o || 0, options), operator];
			holdover = true;
			return false;
		}
		const formattedResult = sae(result, options);
		const formattedInput = sae(i, options);
		priorExpressions = [
			...priorExpressions,
			operator === '√'
				? ['√', operativeValue, '', '=', formattedResult]
				: operator === '**' || (operator === '*' && i === o)
					? [operativeValue, '²', , '=', formattedResult]
					: [
							operativeValue,
							operatorCrossref[operator],
							operator === '*' || operator === '/' ? i : formattedInput,
							'=',
							formattedResult
						]
		];
		repeatValue = formattedInput;
		operativeValue = formattedResult;
		inputValue = formattedResult;
		holdover = true;
		currentExpression = [];
		negative = false;
		return true;
	}

	function format(string: String) {
		if (!string) return '0"';
		const lastChar = string.slice(-1);
		if (lastChar === "'" || lastChar === '"' || lastChar === '/') return string;
		inputValue = inputValue ? string + '"' : '';
		return string + '"';
	}

	function togglePrecisionModal({ clientX, clientY }) {
		console.log(
			`should ${showPrecisionModal ? 'hide' : 'show'} precision modal at [${clientX}, ${clientY}].`
		);
		modalCoordinates = [clientX, clientY];
		showPrecisionModal = !showPrecisionModal;
	}

	function handlePrecisionUpdate({ detail: { value } }) {
		console.log(`precision should change to ${value > 1 ? '1/' + value : value}`);
		// precision = detail;
		precision = value;
		showPrecisionModal = false;
	}

	function handleCopy() {
		console.log(currentExpression.join(' '));
		// navigator.clipboard.writeText(currentExpression)
	}
</script>

<div class="backdrop">
	<div class="calculator-body">
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
				<span class="calculator-input" style={`font-size:${displayTextSize}rem;`}
					>{formattedInput}</span
				>
				{#if negative}
					<span class="calculator-input">-</span>
				{/if}
			</div>
			<div class="display-info">
				<span class={clipboard ? '' : 'transparent'}
					><img src="clipboard.svg" alt="clipboard" />{clipboard}</span
				>
				<span class="input-history">{currentExpression.join(' ')}</span>
			</div>
		</div>
		<CalculatorButtonGroup {buttons} on:click={handleButtonPress} />
	</div>
</div>

<!-- <div class="nav-container">
	<a href="/" title="return to dashboard">
		<img height="16px" width="16px" src="arrow-left.svg" aria-hidden={true} />
	</a>
	<button on:click={addRatio} title="add new ratio" disabled={!!edit}>
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
    </svg>
  </button>
</div> -->

<style>
	.transparent {
		opacity: 0 !important;
	}

	.backdrop {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
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
		display: table-cell;
		text-align: right;
		color: #666;
		padding: 0 1rem;
		max-height: 500vh;
		transition: max-height 0.5s ease-in;
	}
	.ticker-tape li {
		user-select: text;
		pointer-events: auto;
		margin-bottom: 0.5rem;
	}
	.ticker-tape li:first-child {
		margin-top: 1rem;
	}

	.calculator-body {
		/* top: 50vh; */
		/* transform: translate(0, -50%); */
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 6rem;
		/* background: #f006; */
		/* border-radius: 12px 12px 18px 18px; */
		width: 100%;
		max-width: var(--column-width);
	}

	.calculator-display {
		display: flex;
		flex-direction: column-reverse;
		align-items: flex-end;
		justify-content: flex-start;

		/* color: #000; */
		padding: 0 8px;
		/* border-radius: 8px; */
		height: 6rem;
		/* margin: 8px; */
		grid-column: 1/5;
		width: 100%;
		/* width: calc(100vw - 32px); */
		margin-bottom: 0.5rem;
		/* background: #ccc;
		box-shadow: inset 0 1px 3px #999; */
		width: 100%;
		max-width: var(---column-width);
	}

	.display-input {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		width: 100%;
		height: 4rem;
	}

	.display-input img {
		width: 32px;
		height: 32px;
		margin-left: -24px;
	}

	.display-info {
		position: relative;
		top: -3px;
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

	.button-base {
		padding: 4px;
	}
	.calculator-buttons {
		display: grid;
		align-self: flex-end;
		justify-items: center;
		align-self: center;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		pointer-events: none;
		max-width: 100%;
		width: 100%;
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

	.highlighted {
		background: #666;
		filter: invert(1);
	}

	.button-gap {
	}

	button {
		pointer-events: auto;
		border-radius: 12px;
		background: #fff;
		width: calc(var(--column-width) / 4);
		height: calc(var(--column-width) / 4);
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

	.nav-container {
		pointer-events: none;
		z-index: 4;
		position: absolute;
		display: flex;
		justify-content: space-between;
		align-self: center;
		align-items: flex-end;
		gap: 1rem;
		padding: 0 1.5rem;
		bottom: 1.5rem;
		pointer-events: none;
		max-width: 100%;
		width: var(--column-width);
	}

	.nav-container img {
		filter: invert(0.1);
		height: 1.25rem;
		width: 1.25rem;
	}

	.nav-container button,
	a {
		pointer-events: auto;
		border-radius: 9999px;
		background: #fffc;
		width: 3rem;
		height: 3rem;
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

	.nav-container svg {
		width: 33%;
		height: 33%;
	}

	.nav-container path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: #000c;
	}
</style>
