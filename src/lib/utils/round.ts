import type { MeasurementPrecision } from './MeasurementConverter';

export type Precision = MeasurementPrecision | 10 | 100;

export function round(value: number, precision: Precision) {
	return Math.round(value * precision) / precision;
}
