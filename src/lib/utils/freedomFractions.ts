import { prettyBigNumber } from './prettyBigNumber';

interface FF {
	fixed: string;
	numeric: number;
	inches: number;
	feet: number;
	fraction: string;
	readable?: string;
}

type FFPrecision = 1 | 2 | 4 | 8 | 16 | 32 | 64;
type FFDecimals = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface FFOptions {
	decimals?: FFDecimals;
	commas?: boolean;
	precision?: FFPrecision;
	feet?: boolean;
	zeros?: boolean;
}

const decimalsByPrecision: { [K in FFPrecision]?: number } = {
	2: 1,
	4: 2,
	8: 3,
	16: 4,
	32: 5,
	64: 6
};

const precisionByDecimals = [0, 2, 4, 8, 16, 32, 64];

const defaultOptions: FFOptions = {
	precision: 16,
	decimals: 4,
	commas: true,
	feet: true
};

export class MeasurementConverter {
	_options: FFOptions;

	constructor(_options: FFOptions = defaultOptions) {
		this._options = { ...defaultOptions, ..._options };

		this.options = this.options.bind(this);
		this.fromDecimalInches = this.fromDecimalInches.bind(this);
		this.parse = this.parse.bind(this);
		this.stringify = this.stringify.bind(this);
		this._cycleFractions = this._cycleFractions.bind(this);
	}

	options(options: FFOptions) {
		const { precision, decimals } = options;
		if (precision) options.decimals = decimalsByPrecision[precision] as FFDecimals;
		else if (decimals) options.precision = precisionByDecimals[decimals] as FFPrecision;
		this._options = { ...defaultOptions, ...options };
	}

	fromDecimalInches(inputValue: string, optionOverrides?: FFOptions): FF | void {
		if (!inputValue) return undefined;
		if (isNaN(+inputValue)) return this.parse(inputValue);
		const { options, _cycleFractions, stringify } = this;

		let reset: FFOptions = {};
		if (optionOverrides) {
			reset = { ...this._options };
			options(optionOverrides);
		}
		const { feet: measureFeet, decimals } = this._options;

		const string = inputValue + '';
		const fixed = Number(string).toFixed(decimals);
		const numeric = +fixed;
		const inchesOnly = measureFeet ? numeric % 12 : numeric;
		const inches = Math.floor(inchesOnly);
		const feet = (numeric - inchesOnly) / 12;
		const fraction = _cycleFractions(inchesOnly % 1);
		const result: FF = { numeric, fixed, feet, inches, fraction };
		result.readable = stringify(result);

		if (reset) options(reset);

		return result;
	}

	parse(inputValue: string, optionOverrides?: FFOptions): FF | void {
		if (!isNaN(+inputValue)) return this.fromDecimalInches(inputValue);
		const { options, stringify } = this;

		let reset: FFOptions = {};
		if (optionOverrides) {
			reset = { ...this._options };
			options(optionOverrides);
		}
		const { decimals, feet: measureFeet } = this._options;

		const result = {
			numeric: 0,
			fixed: '',
			feet: 0,
			inches: 0,
			fraction: '',
			readable: inputValue
		};

		let i = inputValue.length;
		if (i < 1) return;

		let digits = '';
		let segment = 'inches';
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
						// current segment should have been a denominator
						if (!digits)
							return console.error('invalid input: fraction indicated by "/" with no denominator');
						denominator = +digits;
						// next segment should be a numerator
						segment = 'numerator';
						break;
					case "'":
						if (!result[segment]) result[segment] = +digits;
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

				if (segment === 'numerator') numerator = +digits;
				else result[segment] = +digits;

				segment = 'inches';
				digits = '';
				continue;
			}

			digits = char + digits;
			prevChar = char;
		}

		if (segment === 'numerator') numerator = +digits;
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
			const numeric = feet * 12 + inches;
			result.numeric = numeric;
			result.fixed = numeric + '';
		}

		result.feet = feet;
		result.inches = inches;
		result.readable = stringify(result);

		if (reset) options(reset);

		console.log({ inputValue, ...result });

		return result;
	}

	stringify(freedomFraction: FF, optionOverrides?: FFOptions) {
		const { options } = this;

		let reset: FFOptions = {};
		if (optionOverrides) {
			reset = { ...this._options };
			options(optionOverrides);
		}
		const { feet: measureFeet, zeros, commas } = this._options;

		// eslint-disable-next-line prefer-const
		let { feet, inches, fraction } = freedomFraction;

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

		return f + i;
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
}

export const measurement = new MeasurementConverter();
