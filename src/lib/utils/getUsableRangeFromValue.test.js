import { expect, test } from 'vitest';
import { round } from './round';
import { getUsableRangeFromValue } from './getUsableRangeFromValue';
// import type { MeasurementPrecision } from './MeasurementConverter';

test('should return an array of two numbers', () => {
	const expectedMin = round(16 * 0.125, 16);
	const expectedMax = round(16 * 1.875, 16);
	const [min, max] = getUsableRangeFromValue(16);
	console.log({ expectedMin, expectedMax });
	console.log({ min, max });
	expect(min).toEqual(expectedMin);
	expect(max).toEqual(expectedMax);
});

test('minimum should not be greater than the input value', () => {
	for (let i = 0; i < 16; i++) {
		const [min] = getUsableRangeFromValue(i, [0]);
		expect(min).not.toBeGreaterThan(i);
	}
});

test('maximum should not be less than the input value', () => {
	for (let i = 0; i < 16; i++) {
		const max = getUsableRangeFromValue(i, [0])[1];
		expect(max).not.toBeLessThan(i);
	}
});

test('maximum should never be less than 20', () => {
	for (let i = 0; i < 16; i++) {
		const max = getUsableRangeFromValue(i, [0])[1];
		expect(max).not.toBeLessThan(20);
	}
});
