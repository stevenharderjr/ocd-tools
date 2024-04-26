export const buttons: App.Button[] = [
	{
		id: 'settings',
		type: 'action',
		title: 'settings',
		img: {
			src: 'settings.svg',
			alt: 'gear'
		}
	},
	{
		type: 'action',
		title: 'copy',
		id: 'copy',
		img: { src: 'copy.svg', alt: 'stacked squares' }
	},
	{
		id: 'paste',
		type: 'action',
		title: 'paste',
		img: { src: 'clipboard.svg', alt: 'clipboard' }
	},
	{
		id: 'refresh',
		type: 'action',
		title: 'reset/clear',
		img: { src: 'refresh.svg', alt: 'arrows turning counter clockwise' }
	},
	// {
	// 	id: 'backspace',
	// 	type: 'action',
	// 	title: 'backspace',
	// 	img: { src: 'delete.svg', alt: 'backspace' }
	// },
	{
		id: '√',
		type: 'operator',
		title: 'square root',
		class: 'inverted',
		style: 'font-size: 1.25rem;',
		label: '√'
	},
	{
		id: '**',
		type: 'operator',
		title: 'exponent',
		class: 'inverted',
		style: 'font-size: 1.25rem;',
		label: '^'
	},
	{
		id: "'",
		type: 'operator',
		title: 'foot symbol',
		class: 'inverted',
		label: "'"
	},
	{
		id: '/',
		type: 'operator',
		title: 'divide',
		label: '÷',
		class: 'inverted'
	},
	{ id: '7', type: 'input', title: '7', label: '7' },
	{ id: '8', type: 'input', title: '8', label: '8' },
	{ id: '9', type: 'input', title: '9', label: '9' },
	{
		id: '*',
		type: 'operator',
		title: 'multiply',
		label: '×',
		class: 'inverted'
	},
	{ id: '4', type: 'input', title: '4', label: '4' },
	{ id: '5', type: 'input', title: '5', label: '5' },
	{ id: '6', type: 'input', title: '6', label: '6' },
	{
		id: '-',
		type: 'operator',
		title: 'subtract',
		label: '−',
		class: 'inverted'
	},
	{ id: '1', type: 'input', title: '1', label: '1' },
	{ id: '2', type: 'input', title: '2', label: '2' },
	{ id: '3', type: 'input', title: '3', label: '3' },
	{
		id: '+',
		type: 'input',
		title: 'add',
		label: '+',
		class: 'inverted'
	},
	{ id: '0', type: 'input', title: '0', label: '0' },
	{
		id: '⁄',
		type: 'input',
		title: 'fraction slash',
		label: '⁄',
		class: 'inverted'
	},
	{
		id: 'space',
		type: 'operator',
		title: 'space',
		class: 'inverted',
		img: { src: 'space.svg', alt: 'space bar' }
	},
	{ id: '=', type: 'operator', title: 'equals', class: 'inverted', label: '=' }
];
