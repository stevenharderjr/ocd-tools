import { expect, test } from 'vitest';
import { points } from './deriveLayoutPoints';
import { convert, decimalsByPrecision } from './MeasurementConverter';

// const layout = {
// 	span: 78.5,
// 	targetSpacing: 25,
// 	padding: [6, 6],
// 	alignment: 'simple'
// };

convert.options({ precision: 8, feet: false, caching: false });
const layout = randomLayout();

function randomLayout() {
	const alignment = 'even';
	const span = +(8 + Math.random() * 30).toFixed(4);
	const padding = [
		2 + +(Math.random() * (span / 4)).toFixed(2),
		2 + +(Math.random() * (span / 4)).toFixed(2)
	];
	const [start, end] = padding;
	const usableSpan = span - start - end;
	const targetSpacing = +(start / 2 + Math.random() * (usableSpan / 2)).toFixed(4);
	return { alignment, span, padding, targetSpacing };
}

function overloadLayout(layout) {
	const { span, targetSpacing } = layout;
	const [start, end] = layout.padding;
	const usableSpan = span - start - end;
	const pointCount = usableSpan < start + end ? 0 : Math.ceil((span - start - end) / targetSpacing);
	const spacing = usableSpan / pointCount;

	return { ...layout, usableSpan, points: points(layout), spacing };
}

test('returns an array of measurements', () => {
	const measurements = points(layout);
	expect(Array.isArray(measurements)).toEqual(true);
	measurements.forEach((point) => expect(convert.fromDecimalInches(point)).not.toBe(undefined));
});

// test('returns correct number of points', () => {
// 	measurement.options({ feet: false });
// 	const measurements = points(layout);
// 	const { span, targetSpacing } = layout;
// 	const [start, end] = layout.padding;
// 	const usableSpan = span - start - end;
// 	const pointCount = usableSpan < start + end ? 0 : Math.ceil(usableSpan / targetSpacing);
// 	const spacing = usableSpan / pointCount;
// 	// console.log('spacing:', measurement.fromDecimalInches(spacing));
// 	// console.log(measurements.map((m) => measurement.fromDecimalInches(m).readable));
// 	console.log({ measurements });
// 	expect(measurements.length).toEqual(pointCount + 1);
// });

test('actual spacing does not exceed target spacing', () => {
	const [p1, p2] = points(layout);
	const diff = +(p2 - p1).toFixed(4);
	expect(diff).not.toBeGreaterThan(layout.targetSpacing);
});
