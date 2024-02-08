import { fixes } from './fixes';

class Overloader {
	constructor() {}

	ratio(ratio: App.Ratio) {
		const { factor: overloaded } = this;
		const { label, factors: underloadedFactors } = ratio;
		const factors: App.Factor[] = [];
		let precision = '1';
		let prefix = '';
		let suffix = '';
		const uniquePrefixes: Set<string> = new Set([prefix]);
		const uniqueSuffixes: Set<string> = new Set([suffix]);

		for (const factor of underloadedFactors) {
			const overloadedFactor = overloaded(factor);
			factors.push(overloadedFactor);

			const {
				precision: factorPrecision,
				prefix: factorPrefix,
				suffix: factorSuffix
			} = overloadedFactor;

			if (+factorPrecision > +precision) precision = factorPrecision;
			if (factorPrefix) uniquePrefixes.add(factorPrefix);
			if (factorSuffix) uniqueSuffixes.add(factorSuffix);
		}

		if (uniquePrefixes.size < 3 && uniqueSuffixes.size < 3) {
			// every factor has one and only one prefix and/or suffix in common, so apply them to the ratio as a whole
			const [uniquePrefix] = uniquePrefixes;
			const [uniqueSuffix] = uniqueSuffixes;
			prefix = uniquePrefix;
			suffix = uniqueSuffix;
		}

		return {
			...ratio,
			name: label?.toLowerCase(),
			prefix,
			suffix,
			factors
		};
	}

	factor(factor: App.FactorBaseline) {
		const { label, value } = factor;
		return {
			...fixes(value),
			...factor,
			name: label.toLowerCase()
		} as unknown as App.Factor;
	}
}

class Underloader {
	constructor() {}

	ratio(ratio: App.Ratio) {
		const { factor: underloaded } = this;
		const { id, label, factors: overloadedFactors } = ratio;
		const factors: App.FactorBaseline[] = [];

		for (const factor in overloadedFactors) factors.push(underloaded(factor));
		return { id, label, factors };
	}

	factor(factor: App.Factor) {
		const { label, value, prefix, suffix } = factor;
		return {
			label,
			value: prefix + value + suffix
		} as App.FactorBaseline;
	}
}

export const overload = new Overloader();

export const underload = new Underloader();
