import { fixes } from './fixes';

class Overloader {
	constructor() {
		this.factor = this.factor.bind(this);
		this.ratio = this.ratio.bind(this);
	}

	factor(factor: App.Factor | App.FactorBaseline) {
		const { label, value } = factor;
		return {
			...factor,
			...fixes(value),
			name: label.toLowerCase()
		};
	}

	ratio(ratio: App.RatioBaseline) {
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
			precision,
			prefix,
			suffix,
			factors
		};
	}
}

class Unloader {
	constructor() {
		this.factor = this.factor.bind(this);
		this.ratio = this.ratio.bind(this);
	}

	factor(factor: App.Factor | App.FactorBaseline) {
		// @ts-expect-error: undefined prefix/suffix is no problem
		const { id, label, value, prefix = '', suffix = '' } = factor;

		return {
			id,
			label,
			value: prefix + value + suffix
		};
	}

	ratio(ratio: App.Ratio | App.RatioBaseline) {
		const { factor: unload } = this;
		const { id, label, factors } = ratio;
		const unloadedFactors: App.FactorBaseline[] = [];

		if (factors.length) for (const factor of factors) unloadedFactors.push(unload(factor));

		return { id, label, factors: unloadedFactors };
	}
}

export const overload = new Overloader();

export const unload = new Unloader();
