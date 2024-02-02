export const diff = (entity1?: App.Ratio | App.Factor, entity2?: App.Ratio | App.Factor) => {
	if (entity1 === undefined || entity2 === undefined) {
		if (entity1 === undefined && entity2 === undefined)
			throw new Error('Expected at least one ratio or factor.');
		return 'Undefined argument.';
	}
	if (typeof entity1.label !== 'string' || typeof entity2.label !== 'string')
		throw new Error('Provided arguments should be ratios or factors.');
	// @ts-expect-error: type checked at runtime
	return Array.isArray(entity1?.factors)
		? (diffRatio(entity1 as App.Ratio, entity2 as App.Ratio) as string)
		: (diffFactor(entity1 as App.Factor, entity2 as App.Factor) as string);
};

export const invalidate = (entity?: App.Ratio | App.Factor) => {
	if (entity === undefined) return 'Undefined argument.';
	if (typeof entity.label !== 'string')
		throw new Error('Provided argument should be a ratio or factor.');
	// @ts-expect-error: type checked at runtime
	return Array.isArray(entity?.factors)
		? (invalidateRatio(entity as App.Ratio) as string)
		: (invalidateFactor(entity as App.Factor) as string);
};

function diffRatio(r1: App.Ratio, r2: App.Ratio) {
	if (r1.label !== r2.label) return 'Ratio renamed.';

	const r1Factors = r1.factors;
	const r2Factors = r2.factors;
	const r1FactorCount = r1Factors.length;
	const r2FactorCount = r2Factors.length;

	if (r1FactorCount !== r2FactorCount)
		return (r1FactorCount > r2FactorCount ? 'Less' : 'More') + ' factors.';

	let i = r1FactorCount;
	while (i--) {
		const difference = diffFactor(r1Factors[i], r2Factors[i]);
		if (difference) return difference;
	}

	return '';
}

function diffFactor(f1: App.Factor, f2: App.Factor) {
	const { label: label1, value: value1, prefix: prefix1, suffix: suffix1 } = f1;
	const { label: label2, value: value2, prefix: prefix2, suffix: suffix2 } = f2;
	if (label1 !== label2) return 'Different factor name.';
	if (value1 !== value2) return 'Different factor value.';
	if (prefix1 !== prefix2) return 'Different factor prefix.';
	if (suffix1 !== suffix2) return 'Different factor suffix.';
}

function invalidateRatio(ratio: App.Ratio) {
	if (!ratio.label) return 'Ratio name is required.';

	const factors = ratio.factors;
	const factorCount = factors?.length || 0;
	if (factorCount < 2) return 'At least two factors are required.';

	for (const factor of factors) {
		const reason = invalidateFactor(factor);
		if (reason) return reason;
	}

	return '';
}

function invalidateFactor(factor: App.Factor) {
	const { label, value = 0 } = factor;
	if (!label) return 'Factor name is required.';
	// if (Math.round(value) !== value) return 'Factor value must be integers (whole numbers).';
	if (value < 1) return 'Factor value must be positive';
	return '';
}
