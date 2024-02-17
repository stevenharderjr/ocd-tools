interface FF {
	fixed: string;
	numeric: number;
	inches: number;
	feet: number;
	fraction: string;
	readable?: string;
}

type FFPrecision = 1 | 2 | 4 | 8 | 16 | 32 | 64;

interface FFOptions {
	decimals?: number;
	precision?: FFPrecision;
	feet?: true;
	yards?: true;
	miles?: true;
	zeros?: true;
}

const defaultDecimals = 6;
const defaultPrecision = 16;

class MeasurementConverter {
	_options: FFOptions;

	constructor(
		_options: FFOptions = { precision: defaultPrecision, feet: true, decimals: defaultDecimals }
	) {
		this._options = _options;

		this.fromDecimalInches = this.fromDecimalInches.bind(this);
		this.parse = this.parse.bind(this);
		this.stringify = this.stringify.bind(this);
	}

	options(options: FFOptions) {
		this._options = options;
	}

	fromDecimalInches(inputValue: string, options?: FFOptions): FF | undefined {
		if (!inputValue) return undefined;
		if (isNaN(+inputValue)) return this.parse(inputValue);
		const {
			decimals = defaultDecimals,
			precision = defaultPrecision,
			feet: measureFeet
		} = options || this._options;

		const string = inputValue + '';
		const fixed = Number(string).toFixed(decimals);
		const numeric = +fixed;
		const inchesOnly = measureFeet ? numeric % 12 : numeric;
		const inches = Math.floor(inchesOnly);
		const feet = (numeric - inchesOnly) / 12;
		const fraction = cycleFractions(inchesOnly % 1, precision);
		const result: FF = { numeric, fixed, feet, inches, fraction };
		result.readable = this.stringify(result, options);

		return result;
	}

	parse(inputValue: string, options?: FFOptions): FF | undefined {
		if (!isNaN(+inputValue)) return this.fromDecimalInches(inputValue);
		const { decimals = defaultDecimals, feet: measureFeet } = options || this._options;

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
		let segment = '';
		let numerator = '';
		let denominator = '';

		while (i--) {
			const char = inputValue[i];

			if (isNaN(+char)) {
				if (char === '/') {
					if (!digits) return undefined; // invalid input (fraction indicated without denominator)
					denominator = digits;
					segment = 'numerator';
				} else if (char === "'") {
					if (segment) result[segment] = digits;
					segment = 'feet';
				} else if (char === '"') {
					result[segment] = digits;
					segment = 'inches';
				}

				digits = '';
				continue;
			}

			if (char === ' ') {
				if (!segment) segment = 'inches';
				else if (segment === 'numerator') numerator = digits;
				else result[segment] = digits;
				digits = '';
				segment = 'inches';
				continue;
			}

			digits = char + digits;
		}

		if (segment) {
			if (segment === 'numerator') numerator = digits;
			else result[segment] = digits;
		}

		let feet = +result.feet;
		let inches = +result.inches;

		if (measureFeet) {
			if (inches > 12) {
				feet = Math.floor(inches / 12);
				inches = inches % 12;
			}
		} else {
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
		result.readable = this.stringify(result, options);

		console.log({ numerator, denominator }, options);
		console.log(result);

		return result;
	}

	stringify(freedomFraction: FF, options?: FFOptions) {
		const { feet: measureFeet, zeros } = options || this._options;
		const { feet, inches, fraction } = freedomFraction;

		console.log({ feet, inches, fraction });

		let f = measureFeet && (feet || zeros) ? feet + "'" : '';
		let i = inches ? inches + '' : '';
		if (fraction) i += i ? ' ' + fraction : fraction;
		if (zeros && !i) i = '0';
		if (i) i += '"';
		if (i && f) f += ' ';

		console.log({ f, i });

		return f + i;
	}
}

export const measurement = new MeasurementConverter({ precision: 16, feet: true });

export function cycleFractions(decimal: number, precision?: FFPrecision) {
	console.log({ decimal, precision });
	let denominator = precision || 16;
	let numerator = Math.round(decimal * denominator);
	while (numerator % 2 === 0 && denominator % 2 === 0) {
		numerator /= 2;
		denominator /= 2;
	}

	return denominator > 1 ? numerator + '/' + denominator : '';
}
