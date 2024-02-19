// sorts non-numeric 'fixes (prefixes and suffixes) out of factor values

interface Fix {
	value: number;
	prefix: string;
	suffix: string;
	precision: string;
}

const blank: Fix = { value: 0, prefix: '', suffix: '', precision: '' };

export function fixes(stringOrNumber: string | number) {
	if (!stringOrNumber) return blank;
	const string = stringOrNumber + '';
	const charCount = string.length;
	if (!charCount) return blank;

	let value = '';
	let prefix = '';
	let suffix = '';
	let precision = 0;

	for (const char of string) {
		if (char === ',' && value && !suffix) continue;
		const numeric = !isNaN(+char);
		if ((suffix || char === ' ' || !numeric) && (precision || char !== '.')) {
			if (!value) {
				prefix += char;
			} else suffix += char;
			continue;
		} else {
			if (precision) precision *= 10;
			else if (char === '.') precision = 1;
			value += char;
		}
	}

	return { value: +value as number, prefix, suffix, precision: (precision || 1) + '' };
}
