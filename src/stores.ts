import { writable } from 'svelte/store';
import { uuid } from '$lib/utils/uuid';
import { overload } from '$lib/utils/loaders';

// TODO: combine separate lists (ratios & layouts) into one list called "tools"

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
		span: 15 * 12,
		targetSpacing: 30,
		padding: [8, 8],
		precision: 1
	},
	{
		id: 1,
		alignment: 'even',
		label: 'Eclipse Rail Drilling',
		span: 8 * 12,
		targetSpacing: 16,
		padding: [4, 4],
		precision: 8
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
