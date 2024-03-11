import type { MeasurementPrecision } from './MeasurementConverter';

export function round(value: number, precision: MeasurementPrecision) {
	return Math.round(value * precision) / precision;
}
