// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Factor {
			id: string;
			name?: string;
			label: string;
			value: number;
			prefix: string;
			suffix: string;
			softDelete?: boolean;
		}

		interface Ratio {
			id: string;
			name?: string;
			label?: string;
			factors: Factor[] | [];
			useConversionRate: number;
			inputRange: [number, number];
			derivedPrefix: string;
			derivedSuffix: string;
		}

		type RatioFlag = Ratio | undefined;
		type FactorFlag = Factor | undefined;
	}
}

export {};
