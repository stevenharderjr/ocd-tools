export function freedomFractions(inputValue: string | number) {
	if (!inputValue) return undefined;
	const string = inputValue + '';
	const fixed = Number(string).toFixed(4);
	const numeric = +fixed;
	const remainder = numeric % 12;
	const inch = Math.floor(remainder);
	const foot = (numeric - remainder) / 12;
	const fraction = cycleFractions(remainder % 1);

	console.log({ numeric, fixed, foot, inch, fraction });
	return { numeric, fixed, foot, inch, fraction };
}

export function cycleFractions(decimal: number) {
	let denominator = 16;
	let numerator = Math.round(decimal * denominator);
	while (numerator % 2 === 0 && denominator % 2 === 0) {
		numerator /= 2;
		denominator /= 2;
	}

	return [numerator, denominator];
}
