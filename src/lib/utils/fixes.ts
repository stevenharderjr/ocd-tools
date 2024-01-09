interface Fix {
	value: string;
	prefix: string;
	suffix: string;
}

const blank: Fix = { value: '', prefix: '', suffix: '' };

export function fixes(stringOrNumber = '') {
	const string = stringOrNumber + '';
	const charCount = string.length;
	if (!charCount) return blank;

	// let decimal = false;
	let value = '';
	let prefix = '';
	let suffix = '';

	for (let i = 0; i < charCount; i++) {
		const char = string[i];

		if (char === '.' && !suffix) {
			value += char;
		} else if (suffix || isNaN(char) || char === ' ') {
			if (!value) prefix += char;
			else {
				// decimal = false;
				suffix += char;
			}
		} else {
			value += char;
		}
		// if (char === '.') {
		// 	decimal = true;
		// } else if (suffix || isNaN(char) || char === ' ') {
		// 	if (!value) prefix += char;
		// 	else {
		// 		decimal = false;
		// 		suffix += char;
		// 	}
		// } else if (!decimal) {
		// 	value += char;
		// }
	}

	return { value: +value, prefix, suffix };
}
