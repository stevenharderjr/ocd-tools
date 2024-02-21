export function getUsableRangeFromValue(value: number): [number, number] {
	const min = Math.max(1, Math.round(value * 0.125));
	const max = Math.max(min + 20, Math.round(value * 1.875));
	return [min, max];
}
