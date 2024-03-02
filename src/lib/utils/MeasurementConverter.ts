import { prettyBigNumber } from './prettyBigNumber';

export interface Measurement {
	fixed: string;
	numeric: number;
	inches: number;
	feet: number;
	fraction: string;
	readable?: string;
}

export type MeasurementPrecision = 0 | 1 | 2 | 4 | 8 | 16 | 32 | 64;
type MeasurementDecimals = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface MeasurementOptions {
	decimals?: MeasurementDecimals;
	precision?: MeasurementPrecision;
	feet?: boolean;
	commas?: boolean;
	zeros?: boolean;
	caching?: boolean;
}

export const decimalsByPrecision: { [K in MeasurementPrecision]?: number } = {
	1: 0,
	2: 1,
	4: 2,
	8: 3,
	16: 4,
	32: 5,
	64: 6
};

const verbalDenominators = {
	2: 'half',
	4: 'quarter',
	8: 'eighth',
	16: 'sixteenth',
	32: 'thirty-second',
	64: 'sixty-fourth'
};

export const precisionByDecimals = [1, 2, 4, 8, 16, 32, 64];

const defaultOptions: MeasurementOptions = {
	precision: 16,
	decimals: 4,
	commas: true,
	feet: true,
	caching: true
};

export class MeasurementConverter {
	_options: MeasurementOptions;
	_cachedMeasurements: Map<string | number, Measurement>;
	_cachedOverrides: Map<string | number | Measurement, MeasurementOptions | undefined>;
	_cachedStrings: Map<Measurement, string>;
	_empty: Measurement;

	constructor(_options: MeasurementOptions = defaultOptions) {
		this._options = { ...defaultOptions, ..._options };
		this._cachedMeasurements = new Map();
		this._cachedOverrides = new Map();
		this._cachedStrings = new Map();

		this._empty = {
			fixed: '',
			numeric: 0,
			feet: 0,
			inches: 0,
			fraction: '',
			readable: '0"'
		};

		this.options = this.options.bind(this);
		this.fromDecimalInches = this.fromDecimalInches.bind(this);
		this.parse = this.parse.bind(this);
		this.stringify = this.stringify.bind(this);
		this.verbalize = this.verbalize.bind(this);
		this._cycleFractions = this._cycleFractions.bind(this);
		this._optionsMatch = this._optionsMatch.bind(this);
	}

	options(options: MeasurementOptions) {
		const { precision, decimals, caching } = options;
		if (caching == false) console.warn('MeasurementConverter CACHING DISABLED');
		if (precision && !decimals && decimals !== 0)
			options.decimals = decimalsByPrecision[precision] as MeasurementDecimals;
		else if (decimals && !precision)
			options.precision = precisionByDecimals[decimals] as MeasurementPrecision;
		this._options = { ...this._options, ...options };
	}

	fromDecimalInches(
		inputValue: number | string,
		optionOverrides?: MeasurementOptions
	): Measurement | void {
		if (!inputValue || isNaN(+inputValue)) return undefined;
		const {
			options,
			_optionsMatch,
			_cachedMeasurements,
			_cachedOverrides,
			_cycleFractions,
			stringify
		} = this;

		if (this._options.caching) {
			const cachedResult = _cachedMeasurements.get(inputValue);
			if (cachedResult && _optionsMatch(_cachedOverrides.get(inputValue)))
				return { ...cachedResult };
		}

		let reset: MeasurementOptions = {};
		if (optionOverrides) {
			reset = { ...this._options };
			options(optionOverrides);
		}
		const { feet: measureFeet, decimals } = this._options;
		let feet = 0;
		let inches = 0;

		const string = inputValue + '';
		const fixed = Number(string).toFixed(decimals);
		const numeric = +fixed;

		if (measureFeet) {
			feet = Math.floor(numeric / 12);
			inches = Math.floor(numeric % 12);
		} else inches = Math.floor(numeric);

		const fraction = _cycleFractions(numeric % 1);
		const result: Measurement = { numeric, fixed, feet, inches, fraction };
		result.readable = stringify(result);

		if (reset) options(reset);

		_cachedMeasurements.set(inputValue, result);
		_cachedOverrides.set(inputValue, optionOverrides);

		return result;
	}

	parse(inputValue: string, optionOverrides?: MeasurementOptions): Measurement | void {
		const { options, stringify, _optionsMatch, _cachedMeasurements, _cachedOverrides } = this;

		if (this._options.caching) {
			const cachedResult = _cachedMeasurements.get(inputValue);
			if (cachedResult && _optionsMatch(_cachedOverrides.get(inputValue))) return cachedResult;
		}

		let reset: MeasurementOptions = {};
		if (optionOverrides) {
			reset = { ...this._options };
			options(optionOverrides);
		}
		const { decimals, feet: measureFeet, precision } = this._options;

		const result = {
			numeric: 0,
			fixed: '',
			feet: 0,
			inches: 0,
			fraction: '',
			readable: ''
		};

		let i = inputValue.length;
		if (i < 1) return;

		let digits = '';
		let segment: 'feet' | 'inches' | 'fraction' = 'inches';
		let numerator = 0;
		let denominator = 0;
		let spaceCount = 0;
		let prevChar = '';

		while (i--) {
			// work backward through input string
			const char = inputValue[i];

			if (isNaN(+char)) {
				// segment changes are indicated by non-numeric characters (', ", /) or spaces
				switch (char) {
					case '/':
						// indicates that the current set of digits is a denominator, and the next set should be a numerator
						if (!digits)
							return console.error('invalid input: fraction indicated by "/" with no denominator');
						denominator = +digits;
						segment = 'fraction';
						break;
					case "'":
						if (segment === 'fraction') numerator = +digits;
						else if (!result[segment]) result[segment] = +digits;
						segment = 'feet';
						break;
					case '"':
						if (denominator || numerator || result.inches)
							return console.error(
								'invalid input: inches (and fractions of inches) should come before the inch symbol (")'
							);
						break;
					case ',':
						continue;
					default:
						return console.error('invalid input (valid characters are \', ", /, 0-9');
				}

				digits = '';
				continue;
			} else if (char === ' ') {
				// a space should indicate that "digits" now represents a complete value
				if (++spaceCount > 2 || prevChar === ' ')
					return console.error(
						'invalid input ' + prevChar === ' '
							? 'no double spaces'
							: 'there should be spaces only between feet, inches and/or fractions'
					);

				if (segment === 'fraction') numerator = +digits;
				else result[segment] = +digits;

				segment = 'inches';
				digits = '';
				continue;
			}

			digits = char + digits;
			prevChar = char;
		}

		if (segment === 'fraction') numerator = +digits;
		else if (!result[segment]) result[segment] = +digits;

		let feet = +result.feet;
		let inches = +result.inches;

		if (inches > 11) {
			feet += Math.floor(inches / 12);
			inches = inches % 12;
		}

		if (!measureFeet) {
			inches += feet * 12;
			feet = 0;
		}

		if (numerator && !denominator) return undefined;

		if (numerator && denominator) {
			result.fraction = numerator + '/' + denominator;
			const decimalFraction = +numerator / +denominator;
			const fixed = (feet * 12 + inches + decimalFraction).toFixed(decimals);
			result.fixed = fixed;
			result.numeric = +fixed;
		} else {
			const fixed = (feet * 12 + inches).toFixed(decimals);
			result.numeric = +fixed;
			result.fixed = fixed;
		}

		if (precision === 1) {
			result.fraction = '';
			result.inches = Math.round(result.numeric);
			if (measureFeet && inches > 12) {
				feet++;
				inches -= 12;
			}
		}

		result.feet = feet;
		result.inches = inches;
		result.readable = stringify(result);

		if (reset) options(reset);

		_cachedMeasurements.set(inputValue, result);
		_cachedOverrides.set(inputValue, optionOverrides);

		return result;
	}

	stringify(freedomFraction: Measurement, optionOverrides?: MeasurementOptions): string {
		const { options, _optionsMatch, _cachedStrings, _cachedOverrides } = this;

		if (this._options.caching) {
			const cachedResult = _cachedStrings.get(freedomFraction);
			if (cachedResult && _optionsMatch(_cachedOverrides.get(freedomFraction)))
				return cachedResult as string;
		}

		let reset: MeasurementOptions = {};
		if (optionOverrides) {
			reset = { ...this._options };
			options(optionOverrides);
		}
		const { feet: measureFeet, zeros, commas } = this._options;

		// eslint-disable-next-line prefer-const
		let { feet, inches, fraction } = freedomFraction;
		if (feet && !measureFeet) {
			inches += feet * 12;
			feet = 0;
		}

		if (commas) {
			if (feet > 1000) feet = prettyBigNumber(feet);
			if (inches > 1000) inches = prettyBigNumber(inches);
			if (!(inches || fraction || feet)) return '';
		}

		let f = measureFeet && (feet || zeros) ? feet + "'" : '';
		let i = inches ? inches + '' : '';
		if (fraction) i += i ? ' ' + fraction : fraction;
		if (zeros && !i) i = '0';
		if (i) i += '"';
		if (i && f) f += ' ';

		if (reset) options(reset);

		const result = f + i;

		_cachedStrings.set(freedomFraction, result);
		_cachedOverrides.set(freedomFraction, optionOverrides);

		return result;
	}

	verbalize(measurement: Measurement) {
		const phraseComponents = [];
		const { feet, inches, fraction } = measurement;
		let index = 0;
		if (feet === 0 && inches === 0 && fraction === '') return 'zero inches';
		if (feet) phraseComponents[index++] = feet + ' foot';
		phraseComponents[index++] = inches ? inches + '' : 'zero';
		if (fraction) {
			const [numerator, denominator] = fraction.split('/');
			let beginning = (numerator === '1' ? (denominator === '8' ? 'an' : 'a') : numerator) + ' ';
			let ending = verbalDenominators[+denominator] + (numerator === '1' ? '' : 's');
			if (feet || inches) {
				beginning = ' and ' + beginning;
			} else ending = ' of an inch';
			phraseComponents[index++] = beginning + ending;
		} else if (inches && !feet) {
			phraseComponents[index - 1] += inches === 1 ? ' inch' : ' inches';
		}

		return phraseComponents.join(' ');
	}

	_cycleFractions(decimal: number) {
		let denominator = this._options.precision || 16;
		let numerator = Math.round(decimal * denominator);
		while (numerator % 2 === 0 && denominator % 2 === 0) {
			numerator /= 2;
			denominator /= 2;
		}

		return denominator > 1 ? numerator + '/' + denominator : '';
	}

	_optionsMatch(optionOverrides?: MeasurementOptions) {
		if (!optionOverrides) return true;
		const {
			decimals: newDecimalsOption,
			precision: newPrecisionOption,
			feet: newFeetOption,
			commas: newCommasOption,
			zeros: newZerosOption,
			caching: newCachingOption
		} = optionOverrides;
		const { decimals, precision, feet, commas, zeros, caching } = this._options;
		return (
			(decimals === newDecimalsOption || newDecimalsOption === undefined) &&
			(precision === newPrecisionOption || newPrecisionOption === undefined) &&
			(feet === newFeetOption || newFeetOption === undefined) &&
			(commas === newCommasOption || newCommasOption === undefined) &&
			(zeros === newZerosOption || newZerosOption === undefined) &&
			(caching === newCachingOption || newCachingOption === undefined)
		);
	}
}

export const measurement = new MeasurementConverter();

export function formatter(optionOverrides?: MeasurementOptions): (decimalInches: number) => string {
	return (decimalInches: number) =>
		measurement.fromDecimalInches(decimalInches, optionOverrides)?.readable || '';
}

export function sae(decimalInches: number, displayOptions?: MeasurementOptions) {
	return measurement.fromDecimalInches(decimalInches, displayOptions)?.readable || '';
}

export function wordify(decimalInches: string, options?: MeasurementOptions) {
	const result = measurement.verbalize(measurement.fromDecimalInches(decimalInches, options)!);
	return result;
}

export function inches(saeMeasurement: string, displayOptions: MeasurementOptions) {
	return measurement.parse(saeMeasurement, displayOptions)?.numeric;
}

export function measurer(
	optionOverrides?: MeasurementOptions
): (decimalInches: number) => Measurement {
	return (decimalInches: number) =>
		measurement.fromDecimalInches(decimalInches, optionOverrides) || ({} as Measurement);
}
