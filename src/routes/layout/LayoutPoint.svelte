<script lang="ts">
	import type { Measurement } from '$lib/utils/MeasurementConverter';
	import Fraction from '../ratioizer/Fraction.svelte';
	import LayoutFraction from './LayoutFraction.svelte';

	export let measurement: Measurement;
</script>

<li>
	<span>&#8729;</span>
	<span
		>{`${measurement.feet ? measurement.feet + "' " : ''}${
			measurement.inches || ''
		}`}<LayoutFraction
			numerator={measurement.numerator}
			denominator={measurement.denominator}
		/></span
	>
</li>
