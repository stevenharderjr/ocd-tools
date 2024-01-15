import { writable } from 'svelte/store';

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

export const newRatio = () => ({
	id: crypto.randomUUID(),
	label: '',
	factors: []
});

export const newFactor = () => ({
	id: crypto.randomUUID(),
	label: '',
	prefix: '',
	value: 1,
	suffix: ''
});

export const toasts = writable([]);

export const blur = writable(false);

export const editing = writable<App.RatioFlag>();

export const using = writable<App.RatioFlag>();

export const pinned = writable([]);

// export const use = writable(false);
