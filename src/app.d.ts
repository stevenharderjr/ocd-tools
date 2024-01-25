// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Ratio {
			id: string;
			name?: string;
			label?: string;
			factors: Factor[] | [];
			// conversionRate: 1 | number;
			// inputRange: [number, number];
			// derivedPrefix: string;
			// derivedSuffix: string;
		}

		interface Factor {
			id: string;
			name?: string;
			label: string;
			value: number;
			prefix: string;
			suffix: string;
			softDelete?: boolean;
		}

		interface Layout {
			id: string;
			name?: string;
			label: string;
			layoutType: 'arrange' | 'fill';
			pointCount: number;
			spacing: number;
			spacingMode: 'even' | 'center' | 'start' | 'end';
			padding: [number, number];
			measurements: string[];
		}

		type RatioFlag = Ratio | undefined;
		type FactorFlag = Factor | undefined;
		type LayoutFlag = Layout | undefined;
	}
}

export {};
