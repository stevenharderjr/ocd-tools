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
		},
		{
			id: '3',
			label: 'Ice Tea',
			factors: [
				{
					id: '0',
					label: 'Water',
					value: '460 g'
				},
				{
					id: '1',
					label: 'Ice',
					value: '220 g'
				},
				{
					id: '2',
					label: 'Sugar',
					value: '24 g'
				},
				{
					id: '3',
					label: 'Tea',
					value: '1 g'
				}
			]
		}
	].map(overload.ratio)
);

export const layouts = writable([
	{
		id: 0,
		alignment: 'even',
		label: 'Gutter Hanger Layout',
		span: 40 * 12,
		targetSpacing: 30,
		padding: [8, 8],
		precision: 1
	},
	{
		id: 1,
		alignment: 'even',
		label: 'Eclipse Rail Drilling',
		span: 78,
		targetSpacing: 16,
		padding: [4, 4],
		precision: 8
	},
	{
		id: 2,
		alignment: 'simple',
		label: 'Truss/Joist Layout',
		span: 144,
		targetSpacing: 24,
		padding: [0, 1.5],
		precision: 2
	},
	{
		id: 3,
		alignment: 'simple',
		label: 'Stud Layout',
		span: 144,
		targetSpacing: 16,
		padding: [0, 1.5],
		precision: 2
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
