<script lang="ts">
	import { measurement } from '$lib/utils/MeasurementConverter';
	export let decimalInches = 0;
	export let precision = 1;

	const { feet, inches, numerator, denominator } = measurement(decimalInches, { precision });

	$: main = inches || '0';
	$: {
		if (feet) main = feet + "' " + inches;
		if (!denominator) main += '"';
	}
</script>

<div class="line">
	<span>{main}</span>
	{#if denominator}
		<div class="fraction">
			<div class="numerator"><span>{numerator}</span></div>
			<div class="denominator"><span>{denominator}</span></div>
		</div>
		"
	{/if}
</div>

<style>
	.line {
		display: flex;
		align-items: center;
	}
	.fraction {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* align-content: space-between; */
		width: fit-content;
		box-sizing: border-box;
		margin-left: 2px;
	}
	.numerator,
	.denominator {
		display: flex;
		justify-content: center;
		font-size: x-small;
		width: 100%;
		text-align: center;
		/* width: 50%; */
	}
	.numerator {
		border-bottom: 1px solid;
		/* padding-bottom: 9px; */
	}
	.numerator span {
		margin-left: -6px;
		min-width: 1rem;
		text-align: center;
	}
	.denominator span {
		margin-left: -6px;
	}
</style>
