export function prettyBigNumber(digits: number | string) {
	if (isNaN(+digits)) return undefined;
	let result = digits + '';
	const digitCount = result.length;
	let nextCommaIndex = digitCount - 3;
	while (nextCommaIndex > 0) {
		result = result.slice(0, nextCommaIndex) + ',' + result.slice(nextCommaIndex);
		nextCommaIndex -= 3;
	}
	return result;
}
