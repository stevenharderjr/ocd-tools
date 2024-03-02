export function points(layout: App.Layout, precision: number) {
	const { targetSpacing, span, alignment } = layout;
	const [start, end] = layout.padding;

	const usableSpan = span - start - end;
	if (usableSpan < start + end) return [];
	const pointCount = Math.ceil(usableSpan / targetSpacing);
	const spacing = alignment === 'even' ? usableSpan / pointCount : targetSpacing;

	const points = [];

	for (let i = 0; i < pointCount; i++) points.push(+(start + i * spacing).toFixed(precision));

	points.push(span - end);

	return points;
}
