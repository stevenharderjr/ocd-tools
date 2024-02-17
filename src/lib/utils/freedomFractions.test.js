import { expect, test } from 'vitest';
import { measurement, cycleFractions } from '$lib/utils/freedomFractions';

test('measurement respects higher precision option', () => {
	const { readable } = measurement.fromDecimalInches(1.03125, { precision: 32 });
	expect(readable).toEqual('1 1/32"');
});

test('measurement respects lower precision option', () => {
	const { readable } = measurement.fromDecimalInches(1.0625, { precision: 8 });
	expect(readable).toEqual('1 1/8"');
});

test('measurement defaults to 1/16" precision', () => {
	const { readable } = measurement.fromDecimalInches(1.0625);
	expect(readable).toEqual('1 1/16"');
});

test('measurement respects zeros option', () => {
	const { feet, inches, fraction, readable, numeric } = measurement.parse('1/2"', {
		feet: true,
		zeros: true
	});
	expect(numeric).toEqual(0.5);
	expect(feet).toEqual(0);
	expect(inches).toEqual(0);
	expect(fraction).toEqual('1/2');
	expect(readable).toEqual('0\' 1/2"');
});

test('measurement respects zeros option', () => {
	const { feet, inches, fraction, readable } = measurement.parse("1'", { feet: true, zeros: true });
	expect(feet).toEqual(1);
	expect(inches).toEqual(0);
	expect(fraction).toEqual('');
	expect(readable).toEqual('1\' 0"');
});

test('should convert decimal fraction to feet, inches and a fraction string', () => {
	const { feet, inches, fraction } = measurement.parse('13 1/2"', { feet: true, zeros: true });
	expect(feet).toEqual(1);
	expect(inches).toEqual(1);
	expect(fraction).toEqual('1/2');
});

test('should convert decimal inches to feet and inches', () => {
	const { feet, inches } = measurement.parse(13, { feet: true, zeros: true });
	expect(feet).toEqual(1);
	expect(inches).toEqual(1);
});

test('should convert foot measurement into decimal inches', () => {
	expect(measurement.parse("1'", { feet: true, zeros: true }).feet).toEqual(1);
});

test('should return undefined when called without arguments', () => {
	expect(measurement.fromDecimalInches()).toEqual(undefined);
});

test('numeric value respects decimals option', () => {
	expect(measurement.fromDecimalInches(1.25000087, { decimals: 4 }).numeric).toEqual(1.25);
});

test('numeric value respects decimals option', () => {
	expect(measurement.fromDecimalInches(1.0625087676, { decimals: 4 }).numeric).toEqual(1.0625);
});

test('fixed value respects decimals option', () => {
	expect(measurement.fromDecimalInches(106.06250983, { decimals: 4 }).fixed).toEqual('106.0625');
});

test('numeric value trimmed to feet and inches', () => {
	const { feet, inches } = measurement.fromDecimalInches(106.6250983);
	expect(feet).toEqual(8);
	expect(inches).toEqual(10);
});

test('whole number input should return an empty string', () => {
	expect(cycleFractions(12)).toEqual('');
});

test('decimal fraction should return one half', () => {
	expect(cycleFractions(0.5)).toEqual('1/2');
});

test('decimal fraction should return one quarter', () => {
	expect(cycleFractions(0.25)).toEqual('1/4');
});

test('decimal fraction should return one eighth', () => {
	expect(cycleFractions(0.125)).toEqual('1/8');
});

test('decimal should return nearest sixteenth', () => {
	expect(cycleFractions(0.1225)).toEqual('1/8');
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
