export function getUsableRangeFromValue(
	value: number,
	constraints: [number, number | undefined] = [1, undefined]
): [number, number] {
	const [floor, ceiling] = constraints;
	let min = Math.max(floor || 0, Math.round(value * 0.125));
	const max = Math.max(ceiling || min + 20, Math.round(value * 1.875));
	min = Math.min(min, max - 20);
	min = Math.max(floor, min);
	return [min, max];
}
