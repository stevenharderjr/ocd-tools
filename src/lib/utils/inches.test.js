import { expect, test } from 'vitest';
import { freedomFractions, cycleFractions } from './inches.ts';

test('calling without arguments should return undefined', () => {
	expect(freedomFractions()).toEqual(undefined);
});

test('numeric value limited to four decimal places', () => {
	expect(freedomFractions(1.25000087).numeric).toEqual(1.25);
});

test('numeric value limited to four decimal places', () => {
	expect(freedomFractions(1.0625087676).numeric).toEqual(1.0625);
});

test('numeric value limited to four decimal places', () => {
	expect(freedomFractions(106.06250983).fixed).toEqual('106.0625');
});

test('numeric value trimmed to feet and inches', () => {
	const { foot, inch } = freedomFractions(106.6250983);
	expect(foot).toEqual(8);
	expect(inch).toEqual(10);
});

test('whole number input should return itself over one', () => {
	expect(cycleFractions(12)).toEqual([12, 1]);
});

test('decimal fraction should return one half', () => {
	expect(cycleFractions(0.5)).toEqual([1, 2]);
});

test('decimal fraction should return one quarter', () => {
	expect(cycleFractions(0.25)).toEqual([1, 4]);
});

test('decimal fraction should return one eighth', () => {
	expect(cycleFractions(0.125)).toEqual([1, 8]);
});

test('decimal should return nearest sixteenth', () => {
	expect(cycleFractions(0.1225)).toEqual([1, 8]);
});

// test('should yield irregular fractions', () => {
// 	expect(cycleFractions(1.0625)).toEqual([17, 16]);
// });

// test('should yield irregular fractions', () => {
// 	expect(cycleFractions(1.0625)).toEqual([17, 16]);
// });

// test('float should be converted to the nearest 16th inch', () => {
// 	expect(inches(1.25)).toEqual('1 1/4"');
// });
