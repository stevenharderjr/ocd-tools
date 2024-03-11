import { expect, test } from 'vitest';
import { round } from './round';
import { getUsableRangeWithPrecision } from './getUsableRangeWithPrecision';
import { precisionByDecimals } from './MeasurementConverter';

test('should return an array of two numbers', () => {
	const precision = 16;
	const [min, max] = getUsableRangeWithPrecision(16, { precision });
	expect(typeof min).toBe('number');
	expect(typeof max).toBe('number');
});

test('should return an array of two numbers', () => {
	const precision = 16;
	const [min, max] = getUsableRangeWithPrecision(16, { precision });
	expect(typeof min).toBe('number');
	expect(typeof max).toBe('number');
});

test('minimum should not be greater than the input value', () => {
	for (const precision of precisionByDecimals) {
		const [min] = getUsableRangeWithPrecision(16, { precision });
		expect(min).not.toBeGreaterThan(16);
	}
});

test('maximum should not be less than the input value', () => {
	for (const precision of precisionByDecimals) {
		const max = getUsableRangeWithPrecision(16, { precision })[1];
		expect(max).not.toBeLessThan(16);
	}
});

test('range should narrow with increasing precision', () => {
	let prevMax = round(16 * 1.875, 1);
	let prevMin = -1;
	for (const precision of precisionByDecimals) {
		const [min, max] = getUsableRangeWithPrecision(16, { precision });
		expect(min).not.toBeLessThan(prevMin);
		expect(max).not.toBeGreaterThan(prevMax);

		console.log({ prevMin, prevMax });
		prevMin = min;
		prevMax = max;
	}
});
