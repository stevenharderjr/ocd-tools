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
	compactFractions?: boolean;
}

export const precisionByDecimals = [1, 2, 4, 8, 16, 32, 64];

export const decimalsByPrecision: { [K in MeasurementPrecision]: number } = {
	0: 0,
	1: 0,
	2: 1,
	4: 2,
	8: 3,
	16: 4,
	32: 5,
	64: 6
};

const verbalDenominators: { [K in MeasurementPrecision]?: string } = {
	2: 'half',
	4: 'quarter',
	8: 'eighth',
	16: 'sixteenth',
	32: 'thirty-second',
	64: 'sixty-fourth'
};

const superscript = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
const subscript = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

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

		this.fromDecimalInches = this.fromDecimalInches.bind(this);
		this.stringify = this.stringify.bind(this);
		this.verbalize = this.verbalize.bind(this);
		this.options = this.options.bind(this);
		this.parse = this.parse.bind(this);

		this._cycleFractions = this._cycleFractions.bind(this);
		this._optionsMatch = this._optionsMatch.bind(this);
		this._superscript = this._superscript.bind(this);
		this._subscript = this._subscript.bind(this);
	}

	options(options: MeasurementOptions) {
		const { precision, decimals, caching } = options;
		if (caching == false) console.warn('MeasurementConverter CACHING DISABLED');

		if (precision !== undefined && decimals === undefined)
			options.decimals = decimalsByPrecision[precision] as MeasurementDecimals;
		else if (decimals !== undefined && precision === undefined)
			options.precision = precisionByDecimals[decimals] as MeasurementPrecision;

		this._options = { ...this._options, ...options };
	}

	fromDecimalInches(
		inputValue: number | string,
		optionOverrides?: MeasurementOptions
	): Measurement | void {
		const {
			options,
			_optionsMatch,
			_cachedMeasurements,
			_cachedOverrides,
			_cycleFractions,
			stringify,
			_empty
		} = this;
		if (!inputValue || isNaN(+inputValue)) return _empty;

		if (this._options.caching) {
			const cachedResult = _cachedMeasurements.get(inputValue);
			if (cachedResult && _optionsMatch(_cachedOverrides.get(inputValue))) return cachedResult;
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

		const negative = numeric < 0;
		const trim = negative ? Math.ceil : Math.floor;

		if (measureFeet) {
			feet = trim(numeric / 12);
			inches = trim(numeric % 12);
		} else inches = trim(numeric);

		const fraction = _cycleFractions(numeric % 1);
		const result: Measurement = { numeric, fixed, feet, inches, fraction };
		result.readable = stringify(result);

		if (reset) options(reset);

		_cachedMeasurements.set(inputValue, result);
		_cachedOverrides.set(inputValue, optionOverrides);

		return result;
	}

	parse(inputValue: string, optionOverrides?: MeasurementOptions): Measurement | void {
		const { options, stringify, _optionsMatch, _cachedMeasurements, _cachedOverrides, _empty } =
			this;

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
		const result = { ..._empty };

		let inputEval = inputValue + '';

		const negative = inputEval[0] === '-';
		// the negative symbol interferes with parsing, so remove it for now and add it back in when necessary
		if (negative) inputValue = inputValue.slice(1, inputValue.length);
		// remove any trailing inch symbol, since that can also interfere with parsing
		if (inputEval.slice(-1) === '"') inputEval = inputEval.slice(0, -1);

		let i = inputEval.length;
		if (i < 1) return result;

		let digits = '';
		let segment: 'feet' | 'inches' | 'fraction' = 'inches';
		let numerator = 0;
		let denominator = 0;
		let segmentCount = 0;
		let prevChar = '';

		// work backward through input string
		while (i--) {
			const char = inputValue[i];

			// segment changes are indicated by non-numeric characters (', ", /) or spaces
			if (isNaN(+char)) {
				switch (char) {
					case '/':
						// indicates that the current set of digits is a denominator, and the next set should be a numerator
						if (!digits)
							throw new Error('invalid input: fraction (indicated by "/") requires a denominator');
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
							throw new Error('inches (and fractions of inches) must precede the inch symbol (")');
						break;
					case ',':
						continue;
					default:
						console.log({ char });
						throw new Error('invalid input (valid characters are \', ", /, 0-9');
				}

				digits = '';
				continue;
			} else if (char === ' ') {
				// a space indicates that the value represented by "digits" is complete
				if (prevChar === ' ') continue;
				if (++segmentCount > 2)
					throw new Error('spaces are allowed only between feet, inches and/or fractions');

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

		// if (numerator && !denominator) return undefined;

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

		if (negative) {
			const { numeric, fixed, feet, inches } = result;
			result.numeric = -numeric;
			result.fixed = '-' + fixed;
			result.inches = -inches;
			result.feet = -feet;
		}

		return result;
	}

	stringify(measurement: Measurement, optionOverrides?: MeasurementOptions): string {
		const { options, _optionsMatch, _cachedStrings, _cachedOverrides, _subscript, _superscript } =
			this;

		if (this._options.caching) {
			const cachedResult = _cachedStrings.get(measurement);
			if (cachedResult && _optionsMatch(_cachedOverrides.get(measurement))) return cachedResult;
		}

		let reset: MeasurementOptions = {};
		if (optionOverrides) {
			reset = { ...this._options };
			options(optionOverrides);
		}
		const { feet: measureFeet, zeros, commas, compactFractions } = this._options;

		// eslint-disable-next-line prefer-const
		let { feet, inches, fraction } = measurement;
		let negative = feet < 0 || inches < 0;
		feet = Math.abs(feet);
		inches = Math.abs(inches);

		if (fraction && compactFractions) {
			const [numerator, denominator] = fraction.split('/');
			fraction = _superscript(numerator) + '⁄' + _subscript(denominator);
		}

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
		if (zeros && !i) i = '0';
		if (fraction) i += i ? ' ' + fraction : fraction;
		if (i) i += '"';
		if (i && f) f += ' ';

		if (reset) options(reset);

		const result = f + i;

		_cachedStrings.set(measurement, result);
		_cachedOverrides.set(measurement, optionOverrides);

		return (negative ? '-' : '') + result;
	}

	verbalize(measurement: Measurement): string {
		const phraseComponents = [];
		const { feet, inches, fraction } = measurement;
		let index = 0;

		if (feet === 0 && inches === 0 && fraction === '') return 'zero inches';

		if (feet) phraseComponents[index++] = feet + ' foot';
		phraseComponents[index++] = inches ? inches + '' : 'zero';

		if (fraction) {
			const [numerator, denominator] = fraction.split('/');
			let beginning = (numerator === '1' ? (denominator === '8' ? 'an' : 'a') : numerator) + ' ';
			let ending =
				verbalDenominators[denominator as unknown as MeasurementPrecision] +
				(numerator === '1' ? '' : 's');
			if (feet || inches) {
				beginning = ' and ' + beginning;
			} else ending = ' of an inch';
			phraseComponents[index++] = beginning + ending;
		} else if (inches && !feet) {
			phraseComponents[index - 1] += inches === 1 ? ' inch' : ' inches';
		}

		return phraseComponents.join(' ');
	}

	_cycleFractions(decimal: number): string {
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
			caching: newCachingOption,
			compactFractions: newCompactFractions
		} = optionOverrides;
		const { decimals, precision, feet, commas, zeros, caching, compactFractions } = this._options;
		return (
			(decimals === newDecimalsOption || newDecimalsOption === undefined) &&
			(precision === newPrecisionOption || newPrecisionOption === undefined) &&
			(feet === newFeetOption || newFeetOption === undefined) &&
			(commas === newCommasOption || newCommasOption === undefined) &&
			(zeros === newZerosOption || newZerosOption === undefined) &&
			(caching === newCachingOption || newCachingOption === undefined) &&
			(compactFractions === newCompactFractions || newCompactFractions === undefined)
		);
	}

	_subscript(number: string | number) {
		const digits = number + '';
		let result = '';

		let i = digits.length;
		if (i > 0) {
			while (i--) {
				const digit = subscript[+digits[i]];
				result = digit + result;
			}
			return result;
		}
		return digits;
	}

	_superscript(number: string | number) {
		const digits = number + '';
		let result = '';

		let i = digits.length;
		if (i > 0) {
			while (i--) {
				const digit = superscript[+digits[i]];
				result = digit + result;
			}
			return result;
		}
		return digits;
	}
}

export const converter = new MeasurementConverter();

export function measure(decimalInches: number, optionOverrides?: MeasurementOptions) {
	return converter.fromDecimalInches(decimalInches, optionOverrides);
}

export function formatter(optionOverrides?: MeasurementOptions): (decimalInches: number) => string {
	return (decimalInches: number) =>
		converter.fromDecimalInches(decimalInches, optionOverrides)?.readable || '';
}

export function sae(decimalInches: number, displayOptions?: MeasurementOptions) {
	return converter.fromDecimalInches(decimalInches, displayOptions)?.readable || '';
}

export function wordify(decimalInches: number, options?: MeasurementOptions) {
	const result = converter.verbalize(converter.fromDecimalInches(decimalInches, options)!);
	return result;
}

export function inches(saeNotation: string, displayOptions?: MeasurementOptions) {
	return converter.parse(saeNotation, displayOptions)?.numeric;
}

export function measurer(
	optionOverrides?: MeasurementOptions
): (decimalInches: number) => Measurement {
	return (decimalInches: number) =>
		converter.fromDecimalInches(decimalInches, optionOverrides) || ({} as Measurement);
}
