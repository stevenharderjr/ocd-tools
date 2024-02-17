import { writable } from 'svelte/store';
import { uuid } from '$lib/utils/uuid';
import { overload } from '$lib/utils/loaders';

export const ratios = writable<App.Ratio[]>(
	[
		{
			id: '0',
			label: 'Cup of Coffee',
			factors: [
				{
					id: '0',
					label: 'Coffee',
					value: '200 g'
				},
				{
					id: '1',
					label: 'Half & Half',
					value: '150 g'
				},
				{
					id: '2',
					label: 'Sugar',
					value: '20 g'
				}
			]
		},
		{
			id: '1',
			label: 'Pot of Coffee',
			factors: [
				{
					id: '0',
					label: 'Coffee Grounds',
					value: '36 g'
				},
				{
					id: '1',
					label: 'Water',
					value: '1140 g'
				}
			]
		},
		{
			id: '2',
			label: 'Pot of Tea',
			factors: [
				{
					id: '0',
					label: 'Water',
					value: '830 g'
				},
				{
					id: '1',
					label: 'Sugar',
					value: '75 g'
				},
				{
					id: '2',
					label: 'Tea',
					value: '3.5 g'
				}
			]
		}
	].map(overload.ratio)
);

export const layouts = writable([
	{
		id: 0,
		type: 'fill',
		label: 'Gutter Hanger Layout',
		points: ['6"', '22"', '38"', '54"', '72"'],
		spacing: '30"',
		padding: ['6"', '6"'],
		span: '78"'
	},
	{
		id: 1,
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
