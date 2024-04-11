const kerning = {
	' ': 2,
	t: 2,
	i: 2,
	l: 2,
	'(': 2,
	')': 2,
	'/': 2,
	"'": 1,
	',': 1,
	'"': 2,
	r: 3,
	G: 6,
	C: 6,
	D: 6,
	W: 6,
	M: 6,
	m: 6
};

export function visualWidth(str) {
	let length = 0;
	let i = str?.length || 0;
	if (i < 1) return 0;

	while (i--) {
		const char = str[i];
		length += kerning[char] || 4;
	}

	return Math.round(length / 4);
}

export function sortByVisualWidth(arr, direction) {
	return arr.sort((a, b) => {
		const aLength = a?.length || 0;
		const bLength = b?.length || 0;

		let aKerned = 0;
		let bKerned = 0;
		let i = Math.max(aLength, bLength);
		while (i--) {
			const aChar = a[i];
			const bChar = b[i];
			if (aChar) aKerned += kerning[aChar] || 4;
			if (bChar) bKerned += kerning[bChar] || 4;
		}
		return direction
			? aKerned - bKerned || a.localeCompare(b)
			: bKerned - aKerned || b.localeCompare(a);
	});
}
