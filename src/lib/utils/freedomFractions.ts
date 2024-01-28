interface FF {
	fixed: string;
	numeric: number;
	inch: number;
	foot: number;
	fraction: string;
}

class FreedomFraction {
	constructor() {}

	parse(inputValue: string) {
		if (!inputValue) return undefined;
		const string = inputValue + '';
		const fixed = Number(string).toFixed(4);
		const numeric = +fixed;
		const remainder = numeric % 12;
		const inch = Math.floor(remainder);
		const foot = (numeric - remainder) / 12;
		const fraction = cycleFractions(remainder % 1);

		return { numeric, fixed, foot, inch, fraction };
	}

	stringify(freedomFraction: FF) {
		const { foot = '', inch = '', fraction: rawFraction = '' } = freedomFraction;

		let feet = foot ? foot + "'" : '';
		const inches = inch + rawFraction + '"';
		if (inches) feet += ' ';

		return feet + inches;
	}
}

export const freedomFractions = new FreedomFraction();

// export function freedomFraction(inputValue: string | number) {
// 	if (!inputValue) return undefined;
// 	const string = inputValue + '';
// 	const fixed = Number(string).toFixed(4);
// 	const numeric = +fixed;
// 	const remainder = numeric % 12;
// 	const inch = Math.floor(remainder);
// 	const foot = (numeric - remainder) / 12;
// 	const fraction = cycleFractions(remainder % 1);

// 	console.log({ numeric, fixed, foot, inch, fraction });
// 	return { numeric, fixed, foot, inch, fraction };
// }

export function cycleFractions(decimal: number) {
	let denominator = 16;
	let numerator = Math.round(decimal * denominator);
	while (numerator % 2 === 0 && denominator % 2 === 0) {
		numerator /= 2;
		denominator /= 2;
	}

	return numerator + '/' + denominator;
}
