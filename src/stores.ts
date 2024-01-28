import { writable } from 'svelte/store';
import { uuid } from '$lib/utils/uuid';

export const ratios = writable<App.Ratio[]>([
	{
		id: '0',
		name: 'cup of coffee',
		label: 'Cup of Coffee',
		factors: [
			{
				id: '0',
				name: 'coffee',
				label: 'Coffee',
				prefix: '',
				value: 200,
				suffix: ' g'
			},
			{
				id: '1',
				name: 'half & half',
				label: 'Half & Half',
				prefix: '',
				value: 150,
				suffix: ' g'
			},
			{
				id: '2',
				name: 'sugar',
				label: 'Sugar',
				prefix: '',
				value: 20,
				suffix: ' g'
			}
		]
	},
	{
		id: '1',
		name: 'pot of coffee',
		label: 'Pot of Coffee',
		factors: [
			{
				id: '0',
				name: 'coffee grounds',
				label: 'Coffee Grounds',
				prefix: '',
				value: 36,
				suffix: ' g'
			},
			{
				id: '1',
				name: 'water',
				label: 'Water',
				prefix: '',
				value: 1140,
				suffix: ' g'
			}
		]
	}
]);

export const layouts = writable([
	{
		id: 0,
		name: 'gutter hangers',
		type: 'fill',
		label: 'Gutter Hanger Layout',
		points: ['6"', '22"', '38"', '54"', '72"'],
		spacing: '30"',
		padding: ['6"', '6"'],
		span: '78"'
	},
	{
		id: 1,
		name: 'eclipse rail drilling',
		type: 'arrange',
		label: 'Eclipse Rail Drilling',
		points: ['6"', '22"', '38"', '54"', '72"'],
		spacing: '18"',
		padding: ['4"', '4"'],
		span: '78"'
	}
]);

export const newRatio = () => ({
	id: uuid(),
	label: '',
	factors: []
});

export const newFactor = () => ({
	id: uuid(),
	label: '',
	prefix: '',
	value: 1,
	suffix: ''
});

export const newLayout = () => ({
	id: uuid(),
	label: '',
	name: '',
	points: [],
	spacing: '',
	padding: ['', ''],
	measurement: ''
});

export const toasts = writable([]);

export const blur = writable(false);

export const editing = writable<App.RatioFlag>();

export const using = writable<App.RatioFlag>();

export const pinned = writable([]);

// export const use = writable(false);
