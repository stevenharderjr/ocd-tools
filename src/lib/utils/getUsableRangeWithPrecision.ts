import type { MeasurementPrecision } from './MeasurementConverter';
import { round } from './round';

interface RangeOptions {
	min?: number;
	max?: number;
	precision?: MeasurementPrecision;
}

export function getUsableRangeWithPrecision(
	value: number,
	options: RangeOptions = {}
): [number, number] {
	const { min: floor = 1, max: ceiling, precision = 1 } = options;
	const span = 20 / precision;
	let min = Math.max(floor, round(value * 0.125, precision));
	const max = Math.max(ceiling || round(min + span, precision), round(value * 1.875, precision));
	min = Math.min(min, max - span);
	min = Math.min(floor, min);
	return [min, max];
}
