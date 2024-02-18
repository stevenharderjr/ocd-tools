import { expect, test } from 'vitest';
import { measurement } from './MeasurementConverter';

measurement.options({ feet: false });

test('parser respects feet option', () => {
	const { inches, feet, readable } = measurement.parse('54"', { feet: false });
	expect(feet).toEqual(0);
	expect(inches).toEqual(54);
	expect(readable).toEqual('54"');
});

test('conversion respects feet option', () => {
	const { inches, feet, readable } = measurement.fromDecimalInches(54);
	expect(feet).toEqual(0);
	expect(inches).toEqual(54);
	expect(readable).toEqual('54"');
});

test('parser should handle combinations of feet and inches greater than 12', () => {
	const { feet, inches, readable } = measurement.parse('12\' 28 1/2"');
	expect(feet).toEqual(14);
	expect(inches).toEqual(4);
	expect(readable).toEqual('14\' 4 1/2"');
});

test('parser should ignore commas', () => {
	const { feet, inches, fraction, readable } = measurement.parse('5,000\', 0, 1/2"');
	expect(feet).toEqual(5000);
	expect(inches).toEqual(0);
	expect(fraction).toEqual('1/2');
	expect(readable).toEqual('5,000\' 1/2"');
});

test('invalid inputs should return undefined', () => {
	const invalidInputs = ['1/', '12 1" 1/2"', '12\'1"1/2"'];
	invalidInputs.forEach((input) => expect(measurement.parse(input)).toEqual(undefined));
});

test('parser respects feet option', () => {
	const options = { feet: false };
	const { feet, inches, readable } = measurement.parse('5\' 10 1/2"', options);
	expect(feet).toEqual(0);
	expect(inches).toEqual(70);
	expect(readable).toEqual('70 1/2"');
});

test('conversion respects commas option', () => {
	const options = { commas: false };
	expect(measurement.fromDecimalInches(5000 * 12 + 8, options).readable).toEqual('5000\' 8"');
});

test('conversion handles high numbers', () => {
	expect(measurement.fromDecimalInches(5000 * 12 + 8).readable).toEqual('5,000\' 8"');
});

test('conversion respects higher precision option', () => {
	const options = { precision: 32 };
	const { readable } = measurement.fromDecimalInches(1.03125, options);
	expect(readable).toEqual('1 1/32"');
});

test('conversion respects lower precision option', () => {
	const options = { precision: 8 };
	const { readable } = measurement.fromDecimalInches(1.0625, options);
	expect(readable).toEqual('1 1/8"');
});

test('conversion defaults to 1/16" precision', () => {
	const { readable } = measurement.fromDecimalInches(1.0625);
	expect(readable).toEqual('1 1/16"');
});

test('parser respects zeros option', () => {
	const options = { feet: true, zeros: true };
	const { feet, inches, fraction, readable, numeric } = measurement.parse('1/2"', options);
	expect(numeric).toEqual(0.5);
	expect(feet).toEqual(0);
	expect(inches).toEqual(0);
	expect(fraction).toEqual('1/2');
	expect(readable).toEqual('0\' 1/2"');
});

test('parser respects zeros option', () => {
	const options = { feet: true, zeros: true };
	const { feet, inches, fraction, readable } = measurement.parse("1'", options);
	expect(feet).toEqual(1);
	expect(inches).toEqual(0);
	expect(fraction).toEqual('');
	expect(readable).toEqual('1\' 0"');
});

test('should correctly parse feet, inches and a fraction string', () => {
	const options = { feet: true, zeros: true };
	const { feet, inches, fraction } = measurement.parse('4\' 3 1/2"', options);
	expect(feet).toEqual(4);
	expect(inches).toEqual(3);
	expect(fraction).toEqual('1/2');
});

test('should convert decimal inches to feet and inches', () => {
	const options = { feet: true, zeros: true };
	const { feet, inches } = measurement.parse(13, options);
	expect(feet).toEqual(1);
	expect(inches).toEqual(1);
});

test('should convert foot measurement into decimal inches', () => {
	const options = { feet: true, zeros: true };
	expect(measurement.parse("1'", options).feet).toEqual(1);
});

test('should return undefined when called without arguments', () => {
	expect(measurement.fromDecimalInches()).toEqual(undefined);
});

test('numeric value respects decimals option', () => {
	const options = { decimals: 4 };
	expect(measurement.fromDecimalInches(1.25000087, options).numeric).toEqual(1.25);
});

test('numeric value respects decimals option', () => {
	const options = { decimals: 4 };
	expect(measurement.fromDecimalInches(1.0625087676, options).numeric).toEqual(1.0625);
});

test('fixed value respects decimals option', () => {
	const options = { decimals: 4 };
	expect(measurement.fromDecimalInches(106.06250983, options).fixed).toEqual('106.0625');
});

test('numeric value trimmed to feet and inches', () => {
	const { feet, inches } = measurement.fromDecimalInches(106.6250983);
	expect(feet).toEqual(8);
	expect(inches).toEqual(10);
});

test('whole number input should return an empty string', () => {
	expect(measurement._cycleFractions(12)).toEqual('');
});

test('decimal fraction should return one half', () => {
	expect(measurement._cycleFractions(0.5)).toEqual('1/2');
});

test('decimal fraction should return one quarter', () => {
	expect(measurement._cycleFractions(0.25)).toEqual('1/4');
});

test('decimal fraction should return one eighth', () => {
	expect(measurement._cycleFractions(0.125)).toEqual('1/8');
});

test('decimal should return nearest sixteenth', () => {
	expect(measurement._cycleFractions(0.1225)).toEqual('1/8');
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
