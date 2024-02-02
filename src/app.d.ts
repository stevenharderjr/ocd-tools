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
			label?: string;
			factors: Factor[] | [];
			// overload properties (derived and used by client only)
			name?: string;
			latestConversionRate?: 1 | number;
			inputRange?: [number, number];
			derivedPrefix?: string;
			derivedSuffix?: string;
		}

		interface Factor {
			id: string;
			label: string;
			value: number;
			prefix: string;
			suffix: string;
			// overload properties (derived and used by client only)
			name?: string;
			softDelete?: boolean;
			min?: number;
			max?: number;
			baseline?: number;
			precision?: string;
		}

		interface Layout {
			id: string;
			name?: string;
			label: string;
			span: string;
			type: 'arrange' | 'fill';
			points: string[];
			spacing: string;
			spacingTarget: string;
			alignment: 'even' | 'center' | 'start' | 'end';
			padding: [number, number];
		}

		type RatioFlag = Ratio | undefined;
		type FactorFlag = Factor | undefined;
		type LayoutFlag = Layout | undefined;
	}
}

export {};
