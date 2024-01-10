// sorts non-numeric 'fixes (prefixes and suffixes) out of factor values

interface Fix {
	value: string;
	prefix: string;
	suffix: string;
}

const blank: Fix = { value: '', prefix: '', suffix: '' };

export function fixes(stringOrNumber: string | number) {
	const string = stringOrNumber + '';
	const charCount = string.length;
	if (!charCount) return blank;

	let value = '';
	let prefix = '';
	let suffix = '';

	for (const char of string) {
		if ((suffix || char === ' ' || isNaN(+char)) && char !== '.') {
			if (!value) prefix += char;
			else suffix += char;
		} else {
			value += char;
		}
	}

	return { value: +value as number, prefix, suffix };
}
