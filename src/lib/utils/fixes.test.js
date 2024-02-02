import { expect, test } from 'vitest';
import { fixes } from '$lib/utils/fixes';

test('empty argument returns neutral values', () => {
	const result = fixes();
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(0);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(0);
});

test('dollar value returns a prefix', () => {
	const result = fixes('$12');
	console.log(result);

	expect(result.prefix).toEqual('$');
	expect(result.value).toEqual(12);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(1);
});

test('numeric value is separated from suffix', () => {
	const result = fixes('12M');
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12);
	expect(result.suffix).toEqual('M');
	expect(result.precision).toEqual(1);
});

test('10ths precision is accurately recorded', () => {
	const result = fixes('12.0');
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(10);
});

test('10ths precision is accurately recorded', () => {
	const result = fixes('12.5');
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12.5);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(10);
});

test('100ths precision is accurately recorded', () => {
	const result = fixes('12.00');
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(100);
});

test('100ths precision is accurately recorded', () => {
	const result = fixes('12.05');
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12.05);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(100);
});

test('1000ths precision is accurately recorded', () => {
	const result = fixes('12.000');
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(1000);
});

test('1000ths precision is accurately recorded', () => {
	const result = fixes('12.005');
	console.log(result);

	console.log(result);
	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12.005);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(1000);
});

test('strips commas from numbers', () => {
	const result = fixes('12,000');
	console.log(result);

	expect(result.prefix).toEqual('');
	expect(result.value).toEqual(12000);
	expect(result.suffix).toEqual('');
	expect(result.precision).toEqual(1);
});

test('allows commas in prefix and suffix', () => {
	const result = fixes('a, b: 12,000, (c, d)');
	console.log(result);

	expect(result.prefix).toEqual('a, b: ');
	expect(result.value).toEqual(12000);
	expect(result.suffix).toEqual(' (c, d)');
	expect(result.precision).toEqual(1);
});
