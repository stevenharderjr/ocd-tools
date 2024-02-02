<script lang="ts">
	import Factor from './Factor.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let ratio: App.Ratio;
	let factors: App.Factor[] = ratio.factors.sort(({ value: a }, { value: b }) =>
		+a > +b ? -1 : +a < +b ? +1 : 0
	);

	function use() {
		dispatch('use', ratio);
	}

	function edit() {
		dispatch('edit', ratio);
	}

	function handleKeyPress(event: KeyboardEvent) {
		const { key } = event;
		if (key === 'Space' || key === 'Enter') use();
	}
</script>

<li class="floating card">
	<button class="touchable"
		on:click|stopPropagation={use}
		on:keypress={handleKeyPress}
		title={'use "' + ratio.name + '"'}
  >
		<div class="content">
			<section class="card-header">
				<h2>{ratio.label}</h2>
			</section>
			<ul class="factors">
				{#each factors as factor}
					<Factor {factor} />
				{/each}
			</ul>
		</div>

		<div class="card-options">
			<button
				class="option-icon"
				on:click|stopPropagation={edit}
				title={'edit "' + ratio.name + '"'}
			>
				<img height="16px" width="16px"src="edit.svg" alt="pen on paper" />
			</button>
		</div>
	</button>
</li>
