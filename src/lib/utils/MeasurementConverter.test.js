import { expect, test } from 'vitest';
import { measurement } from './MeasurementConverter';

measurement.options({ feet: false, caching: false });

test('parser respects 1" precision option', () => {
	const options = { precision: 1 };
	const { fraction } = measurement.parse('1 1/4"', options);
	expect(fraction).toEqual('');
});

test('measurement respects 1" precision option', () => {
	const options = { precision: 1 };
	const { fraction } = measurement.fromDecimalInches(1.25, options);
	expect(fraction).toEqual('');
});

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
	const { feet, inches, readable } = measurement.parse('12\' 28 1/2"', { feet: true });
	expect(feet).toEqual(14);
	expect(inches).toEqual(4);
	expect(readable).toEqual('14\' 4 1/2"');
});

test('parser should ignore commas', () => {
	const { feet, inches, fraction, readable } = measurement.parse('5,000\', 0, 1/2"', {
		feet: true
	});
	expect(feet).toEqual(5000);
	expect(inches).toEqual(0);
	expect(fraction).toEqual('1/2');
	expect(readable).toEqual('5,000\' 1/2"');
});

test('invalid inputs should throw errors', () => {
	const invalidInputs = ['1/', '12 1" 1/2"', '12\'1"1/2"'];
	invalidInputs.forEach((input) => {
		try {
			expect(measurement.parse(input)).toThrowError('invalid');
		} catch (err) {
			// do nothing
		}
	});
});

test('parser respects feet option', () => {
	const options = { feet: false };
	const { feet, inches, readable } = measurement.parse('5\' 10 1/2"', options);
	expect(feet).toEqual(0);
	expect(inches).toEqual(70);
	expect(readable).toEqual('70 1/2"');
});

test('conversion respects commas option', () => {
	const options = { feet: true, commas: false };
	expect(measurement.fromDecimalInches(5000 * 12 + 8, options).readable).toEqual('5000\' 8"');
});

test('conversion handles high numbers', () => {
	expect(
		measurement.fromDecimalInches(5000 * 12 + 8, {
			feet: true
		}).readable
	).toEqual('5,000\' 8"');
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
	const { feet, inches } = measurement.fromDecimalInches(13, options);
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
	const { fixed, numeric } = measurement.fromDecimalInches(1.25000087, options);
	expect(numeric).toEqual(1.25);
	expect(fixed).toEqual('1.2500');
});

test('numeric value respects decimals option', () => {
	const options = { decimals: 4 };
	const { fixed, numeric } = measurement.fromDecimalInches(1.0625087676, options);
	expect(numeric).toEqual(1.0625);
	expect(fixed).toEqual('1.0625');
});

test('fixed value respects decimals option', () => {
	const options = { decimals: 4 };
	const { fixed, numeric } = measurement.fromDecimalInches(106.06250983, options);
	expect(fixed).toEqual('106.0625');
	expect(numeric).toEqual(106.0625);
});

test('numeric value trimmed to feet and inches', () => {
	const { feet, inches } = measurement.fromDecimalInches(106.6250983, { feet: true });
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
