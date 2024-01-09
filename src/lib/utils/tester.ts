export const diff = (entity1: App.Ratio | App.Factor, entity2: App.Ratio | App.Factor) =>
	Array.isArray(entity1?.factors) ? diffRatio(entity1, entity2) : diffFactor(entity1, entity2);

export const invalidate = (entity: App.Ratio | App.Factor) =>
	Array.isArray(entity?.factors) ? invalidateRatio(entity) : invalidateFactor(entity);

function diffRatio(r1: App.Ratio, r2: App.Ratio) {
	if (r1.label !== r2.label) return 'rename';

	const r1Factors = r1.factors;
	const r2Factors = r2.factors;
	const r1FactorCount = r1Factors.length;
	const r2FactorCount = r2Factors.length;

	if (r1FactorCount !== r2FactorCount)
		return (r1FactorCount > r2FactorCount ? 'less' : 'more') + ' factors';

	let i = r1FactorCount;
	while (i--) {
		const difference = diffFactor(r1Factors[i], r2Factors[i]);
		if (difference) return difference;
	}

	return '';
}

function diffFactor(f1: App.Factor, f2: App.Factor) {
	const { label: label1, value: value1, unit: unit1 } = f1;
	const { label: label2, value: value2, unit: unit2 } = f2;
	if (label1 !== label2) return 'factor renamed';
	if (value1 !== value2) return 'factor value change';
	if (unit1 !== unit2) return 'factor unit change';
}

function invalidateRatio(ratio: App.Ratio) {
	if (!ratio.label) return 'Ratio requires a name.';

	console.log(ratio.label);

	const factors = ratio.factors;
	const factorCount = factors?.length || 0;
	if (factorCount < 2) return 'Ratio requires at least two factors.';

	let i = factorCount;
	while (i--) {
		const reason = invalidateFactor(factors[i]);
		if (reason) return reason;
	}

	return '';
}

function invalidateFactor(factor: App.Factor) {
	const { label, value = 0 } = factor;
	console.log({ label, value });
	if (!label) return 'Each factor requires a name';
	if (isNaN(value)) return 'Factor values must be numeric.';
	if (Math.round(value) !== value) return 'Factor values must be integers (whole numbers).';
	if (value < 1) return 'Each factor requires a positive value.';
	return '';
}
