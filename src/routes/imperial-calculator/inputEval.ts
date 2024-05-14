interface InputEval {
	isValid: boolean;
	isComplete: boolean;
	isDecimal: boolean;
	isMeasurement: boolean;
	containsDigits: boolean;
	containsFeet: boolean;
	containsInches: boolean;
	containsFractionSlash: boolean;
	containsSpace: boolean;
	isNegative: boolean;
	isFraction: boolean;
	isMixed: boolean;
	decimalValue: number;
	feet: number;
	inches: number;
	combinedInches: number;
	numerator: string;
	denominator: string;
	fraction: string;
	hasTrailingSpace: boolean;
	spacePermitted: boolean;
	slashPermitted: boolean;
	lastChar: string;
	lastIndex: number;
	inchesIndex: number;
	decimalIndex: number;
	slashIndex: number;
	firstSpaceIndex: number;
	lastSpaceIndex: number;
	spaceCount: number;
	formatted: string;
}

const defaults = {
	isValid: true,
	isComplete: false,
	isDecimal: false,
	isMeasurement: false,
	containsDigits: false,
	containsFeet: false,
	containsInches: false,
	containsFractionSlash: false,
	containsSpace: false,
	isNegative: false,
	isFraction: false,
	isMixed: false,
	decimalValue: 0,
	feet: 0,
	inches: 0,
	combinedInches: 0,
	numerator: '',
	denominator: '',
	fraction: '',
	hasTrailingSpace: false,
	spacePermitted: false,
	slashPermitted: false,
	lastChar: '',
	lastIndex: 0,
	decimalIndex: -1,
	slashIndex: -1,
	inchesIndex: -1,
	firstSpaceIndex: -1,
	lastSpaceIndex: -1,
	integerSegment: 0,
	decimalSegment: 0,
	spaceCount: 0,
	formatted: ''
};

export function inputEval(input: string): InputEval {
	if (!input) return defaults;
	const str = input + '';
	let i = str.length;
	const lastIndex = i - 1;
	let {
		isValid,
		isComplete,
		isDecimal,
		isMeasurement,
		containsDigits,
		containsFeet,
		containsInches,
		containsFractionSlash,
		containsSpace,
		isNegative,
		isFraction,
		isMixed,
		decimalValue,
		feet,
		inches,
		combinedInches,
		numerator,
		denominator,
		fraction,
		hasTrailingSpace,
		spacePermitted,
		slashPermitted,
		lastChar,
		lastIndex,
		slashIndex,
		decimalIndex,
		inchesIndex,
		firstSpaceIndex,
		lastSpaceIndex,
		integerSegment,
		decimalSegment,
		spaceCount
	} = defaults;

	let value = '';

	while (i--) {
		const char = str[i];
		switch (char) {
			case ',':
				continue;
			case ' ':
				isMeasurement = true;
				containsSpace = true;
				spaceCount++;
				if (spaceCount === 1) {
					firstSpaceIndex = i;
					if (slashIndex >= 0) {
						numerator = value;
						value = '';
					}
				} else {
					lastSpaceIndex = i;
					inches = +value;
					value = '';
				}
				if (isDecimal || spaceCount > 2) isValid = false;
				continue;
			case '"':
				isMeasurement = true;
				if (containsInches || isDecimal || value) isValid = false;
				containsInches = true;
				continue;
			case "'":
				isMeasurement = true;
				if (containsFeet || isDecimal) isValid = false;
				containsFeet = true;
				continue;
			case '/':
				isMeasurement = true;
				if (containsFractionSlash || str[i - 1] !== ' ' || !value) isValid = false;
				else slashIndex = i;
				containsFractionSlash = true;
				denominator = value;
				value = '';
				continue;
			case '.':
				if (isDecimal || isMeasurement) isValid = false;
				isDecimal = true;
				decimalIndex = i;
				continue;
		}
		if (isNaN(char)) isValid = false;
		else value = char + value;
	}

	return {
		isValid,
		isComplete,
		isDecimal,
		isMeasurement,
		containsDigits,
		containsFeet,
		containsInches,
		containsFractionSlash,
		containsSpace,
		isNegative,
		isFraction,
		isMixed,
		decimalValue,
		feet,
		inches,
		combinedInches,
		numerator,
		denominator,
		fraction,
		hasTrailingSpace,
		spacePermitted,
		slashPermitted,
		lastChar,
		lastIndex,
		slashIndex,
		decimalIndex,
		inchesIndex,
		firstSpaceIndex,
		lastSpaceIndex,
		spaceCount
	};
}
