// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface RatioBaseline {
			id: string;
			label: string;
			factors: FactorBaseline[] | [];
			userConversionRate?: string;
		}

		interface Ratio extends RatioBaseline {
			// these should be derivable from baseline properties
			name: string;
			prefix: string;
			suffix: string;
			precision: string;
			factors: Factor[];
		}

		interface FactorBaseline {
			id: string;
			label: string;
			value: string;
		}

		interface Factor extends FactorBaseline {
			// these should be derivable from baseline properties
			name: string;
			softDelete?: boolean;
			prefix: string;
			value: number;
			suffix: string;
			min?: number;
			max?: number;
			baseline?: number;
			precision: string;
		}

		interface LayoutBaseline {
			id: string;
			label: string;
			span: string;
			padding: [string, string];
			interval: string;
			alignment: 'even' | 'center' | 'none';
		}

		interface Layout extends LayoutBaseline {
			name?: string;
			points: string[];
			spacing: string;
		}

		type RatioFlag = Ratio | undefined;
		type FactorFlag = Factor | undefined;
		type LayoutFlag = Layout | undefined;
	}
}

export {};
