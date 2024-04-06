<script lang="ts">
	export let numerator: number | undefined;
	export let denominator: number | undefined;
</script>

{#if denominator}
	<div class="box">
		<div class="numerator">{numerator}</div>
		<svg class="divider" aria-hidden="true" viewBox="0 0 1 1">
			<path d="M1,0 L0,1" />
		</svg>
		<div class="denominator">{denominator}</div>
	</div>
{/if}

<style>
	.box {
		position: relative;
		height: 1.25rem;
		width: min-content;
		max-width: 2rem;
		background: #f006;
	}
	.numerator,
	.denominator {
		font-size: 0.75rem;
		position: absolute;
		white-space: nowrap;
		line-height: 0.5rem;
		background: #f006;
		height: 0.5rem;
		width: 1rem;
	}
	.numerator {
		top: 0;
		left: 0;
		text-align: right;
	}
	.denominator {
		bottom: 0;
		right: 0;
		text-align: left;
	}
	.divider {
		position: absolute;
		height: 1rem;
		width: 1rem;
		background: #f006;
	}
</style>
