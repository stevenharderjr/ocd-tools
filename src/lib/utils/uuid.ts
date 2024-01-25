const hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

export function uuid() {
	let string: string = crypto?.randomUUID() || '';
	if (string) return string;

	let digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];

	string += '-';
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];

	string += '-';
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];

	string += '-';
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	string += '-';

	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];
	digit = ~~(Math.random() * 16);
	string += hex[digit];

	return string;
}
