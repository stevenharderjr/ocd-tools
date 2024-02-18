export function points(layout: App.Layout) {
	const { targetSpacing, span, alignment } = layout;
	const [start, end] = layout.padding;

	const usableSpan = span - start - end;
	const pointCount = Math.ceil(usableSpan / targetSpacing);
	const spacing = usableSpan / pointCount;

	// let offset = 0;
	// switch (alignment) {
	// 	case 'center':
	// 		// even spacing between fixed start/end points
	// 		offset = (usableSpan % targetSpacing) / 2;
	// 		break;
	// 	case 'even':
	// 		// even spacing without fixed start/end points
	// 		offset = (usableSpan % targetSpacing) / 2;
	// 		break;
	// 	default:
	// 		// narrower spacing between last/penultimate points
	// 		break;
	// }

	const points = [];

	for (let i = 0; i < pointCount; i++) points.push(start + i * spacing);

	points.push(span - end);

	return points;
}
