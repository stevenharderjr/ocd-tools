// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		type ButtonType = 'operator' | 'input' | 'action';
		interface Img {
			src: string;
			alt: string;
		}

		interface Button {
			id: string;
			type: ButtonType;
			img?: Img;
			label?: string;
			title: string;
			inverted?: boolean;
			highlighted?: boolean;
			class?: string;
			style?: string;
		}

		interface Pin {
			id: string;
			changedAt: number;
			toolType: 'ratio' | 'layout';
			toolId: string;
		}

		interface Tool {
			id: string;
			createdAt: number;
			changedAt: number;
			label: string;
		}

		interface RatioBaseline extends Tool {
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

		interface FactorBaseline extends Tool {
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

		interface LayoutBaseline extends Tool {
			span: number;
			padding: [number, number];
			targetSpacing: number;
			precision: 1 | 2 | 4 | 8 | 16 | 32 | 64;
			decimals: 0 | 1 | 2 | 3 | 4 | 5 | 6;
			alignment: 'even' | 'simple';
		}

		interface Layout extends LayoutBaseline {
			name?: string;
			points: number[];
			actualSpacing: number;
		}

		type RatioFlag = Ratio | undefined;
		type FactorFlag = Factor | undefined;
		type LayoutFlag = Layout | undefined;
	}
}

export {};
