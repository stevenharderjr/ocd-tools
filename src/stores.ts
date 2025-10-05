import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { uuid } from '$lib/utils/uuid';
import { overload } from '$lib/utils/loaders';

// TODO: combine separate lists (ratios & layouts) into one list called "tools"

// Helper function to create persistent stores
function createPersistentStore<T>(key: string, initialValue: T) {
	let storedValue = initialValue;
	
	// Only access localStorage in browser environment
	if (browser) {
		try {
			const stored = localStorage.getItem(key);
			if (stored) {
				storedValue = JSON.parse(stored);
			}
		} catch (error) {
			console.warn(`Failed to load ${key} from localStorage:`, error);
		}
	}

	const { subscribe, set, update } = writable<T>(storedValue);

	return {
		subscribe,
		set: (value: T) => {
			set(value);
			if (browser) {
				try {
					localStorage.setItem(key, JSON.stringify(value));
				} catch (error) {
					console.error(`Failed to save ${key} to localStorage:`, error);
				}
			}
		},
		update: (updater: (value: T) => T) => {
			update((currentValue) => {
				const newValue = updater(currentValue);
				if (browser) {
					try {
						localStorage.setItem(key, JSON.stringify(newValue));
					} catch (error) {
						console.error(`Failed to save ${key} to localStorage:`, error);
					}
				}
				return newValue;
			});
		}
	};
}

const defaultRatios = [
	{
		id: '0',
		createdAt: Date.now(),
		changedAt: Date.now(),
		label: 'Cup of Coffee',
		factors: [
			{
				id: '0',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Coffee',
				value: '200 g'
			},
			{
				id: '1',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Half & Half',
				value: '150 g'
			},
			{
				id: '2',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Sugar',
				value: '20 g'
			}
		]
	},
	{
		id: '1',
		createdAt: Date.now(),
		changedAt: Date.now(),
		label: 'Pot of Coffee',
		factors: [
			{
				id: '0',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Coffee Grounds',
				value: '36 g'
			},
			{
				id: '1',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Water',
				value: '1140 g'
			}
		]
	},
	{
		id: '2',
		createdAt: Date.now(),
		changedAt: Date.now(),
		label: 'Pot of Tea',
		factors: [
			{
				id: '0',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Water',
				value: '830 g'
			},
			{
				id: '1',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Sugar',
				value: '75 g'
			},
			{
				id: '2',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Tea',
				value: '3.5 g'
			}
		]
	},
	{
		id: '3',
		createdAt: Date.now(),
		changedAt: Date.now(),
		label: 'Ice Tea',
		factors: [
			{
				id: '0',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Water',
				value: '460 g'
			},
			{
				id: '1',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Ice',
				value: '220 g'
			},
			{
				id: '2',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Sugar',
				value: '24 g'
			},
			{
				id: '3',
				createdAt: Date.now(),
				changedAt: Date.now(),
				label: 'Tea',
				value: '1 g'
			}
		]
	}
].map(overload.ratio);

export const ratios = createPersistentStore<App.Ratio[]>('ocd-tools-ratios', defaultRatios);

export const layouts = createPersistentStore('ocd-tools-layouts', [
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

export const pins = createPersistentStore<App.Pin[]>('ocd-tools-pins', [
	{
		id: '0',
		toolType: 'ratio',
		toolId: '1',
		changedAt: 0
	},
	{
		id: '1',
		toolType: 'ratio',
		toolId: '0',
		changedAt: 0
	},
	{
		id: '2',
		toolType: 'layout',
		toolId: '0',
		changedAt: 0
	},
	{
		id: '3',
		toolType: 'layout',
		toolId: '1',
		changedAt: 0
	}
]);

export const prices = createPersistentStore('ocd-tools-prices', []);

export const toasts = writable([]);

export const blur = writable(false);

export const editing = writable<App.RatioFlag>();

export const using = writable<App.RatioFlag>();

export const pinned = writable([]);
