import { expect, test } from 'vitest';
import { inputEval } from './inputEval';

const defaults = {
	isValid: true,
	isComplete: false,
	isDecimal: false,
	isMeasurement: false,
	containsDigits: false,
	containsFeet: false,
	containsInches: false,
	containsFractionSlash: false,
	containsSpace: false,
	isNegative: false,
	isFraction: false,
	isMixed: false,
	decimalValue: 0,
	feet: 0,
	inches: 0,
	combinedInches: 0,
	numerator: '',
	denominator: '',
	fraction: '',
	hasTrailingSpace: false,
	spacePermitted: false,
	slashPermitted: false,
	lastChar: '',
	lastIndex: 0,
	decimalIndex: -1,
	slashIndex: -1,
	inchesIndex: -1,
	firstSpaceIndex: -1,
	lastSpaceIndex: -1,
	integerSegment: 0,
	decimalSegment: 0,
	spaceCount: 0,
	formatted: ''
};

let condition = undefined;
const tested = () => inputEval(condition);

test('returns default values for empty input', () => {
	const result = tested();
	for (const key in defaults) {
		const defaultValue = defaults[key];
		expect(result[key]).toEqual(defaultValue);
	}
});

test('detects excess tick marks', () => {
	condition = '1" 1"';
	expect(tested().isValid).toBe(false);
	condition = "1' 1'";
	expect(tested().isValid).toBe(false);
	condition = '1\' 1"';
	expect(tested().isValid).toBe(true);
});

test('allows decimal input', () => {
	condition = '1.25';
	expect(tested().isValid).toBe(true);
});

test('integer does not count as measurement', () => {
	condition = '1';
	expect(tested().isMeasurement).toBe(false);
});

test('ignores commas', () => {
	condition = '1,100';
	const result = tested();
	expect(result.isValid).toBe(true);
	expect(result.integerSegment).toEqual(1100);
	expect(result.decimalSegment).toEqual(0);
});

test('separates integer and decimal segments', () => {
	condition = '1.25';
	const result = tested();
	expect(result.integerSegment).toEqual(1);
	expect(result.decimalSegment).toEqual(25);
});

test('distinguishes between mixed numbers and decimal fractions', () => {
	condition = '1/2';
	const fraction = tested();
	expect(fraction.isMeasurement).toBe(false);
	expect(fraction.fraction).toEqual('1/2');
	expect(fraction.containsFractionSlash).toBe(true);
	condition = '0.5';
	const decimal = tested();
	expect(decimal.isMeasurement).toBe(false);
	expect(decimal.fraction).toEqual('');
	expect(decimal.decimalSegment).toEqual(5);
	expect(decimal.integerSegment).toEqual(0);
});

test('detects fraction slash', () => {
	condition = '1/2';
	const valid = tested();
	expect(valid.containsFractionSlash).toBe(true);
	expect(valid.fraction).toEqual('1/2');
	condition = '/';
	const invalid = tested();
	expect(invalid.containsFractionSlash).toBe(true);
	expect(invalid.isValid).toBe(false);
});

// test('translates decimal input to fraction', () => {
// 	condition = '1.25';
// 	const result = tested();
// 	expect(result.numerator).toEqual(1);
// 	expect(result.denominator).toEqual(4);
// });

// test('detects trailing spaces', () => {
// 	const input = '1 "';
// 	const result = inputEval(input);
// 	expect(input.hasTrailingSpace).toBe(true);
// });
