<script lang="ts">
	import Toast from '$lib/Toast.svelte';
	import Item from './Item.svelte';
	// import { matchLabels, merge } from '$lib/utils/deduplicate';
	interface Item {
		price: number;
		discount: number;
		discountType: 'amt' | 'pct';
		label?: string;
		quantity: number;
		taxable: boolean;
	}

	let items: Item[] = [];
	let label = '';
	let price = 0;
	let total = 0;
	let quantity = 1;
	let taxable = true;
	let taxRate = 0.06;
	let discountRate = 0;
	let discountAmount = 0;
	let duplicateItems = [];
	let showMergeModal = false;
	let temp = {};
	let priceInputElement;
	let formElement;

	const taxMultiplier = 1.06;

	$: total = items.reduce((acc, current) => acc + +current?.price, 0);
	$: total *= taxMultiplier;
	$: lastItem = items[0] || {};
	$: console.log(items, { total });

	// function addItem() {
	// 	if (!price) return Toast.add('Specify price to add item.');
	// 	if (isNaN(price) || price <= 0) return Toast.add('Price is invalid.');
	// 	const duplicateItems = matchLabels({ label, price, quantity, taxable }, priceList);
	// 	if (!duplicateItems.length) {
	// 		priceList = [...priceList, { ...temp }];
	// 		temp = {};
	// 	} else showMergeModal = true;
	// }

	function handleSubmit(event: SubmitEvent) {
		const [label, price] = event.target;
		let amount = +price.value;
		amount = amount % 1 ? amount.toFixed(2) : amount;
		lastItem = {
			label: label.value,
			price: amount,
			quantity,
			taxable,
			discountType: 'pct',
			discount: 0
		};
		console.log(lastItem);
		items = [lastItem, ...items];
		event.target.reset();
		priceInputElement.focus();
	}

	function handleUndo() {
		items = items.slice(1);
	}

	function handleRepeat() {
		items = [items[0], ...items];
	}
</script>

<div class="display-total">
	<span class="total-amount">${total.toFixed(2)}</span>
</div>

<div class="item-list">
	{#each items as item}
		<Item price={item.price} />
	{/each}
</div>

<div class="input-area">
	{#if items.length}
		<div class="mod-buttons">
			<button on:click|preventDefault={handleUndo}
				><img src="/minus-circle.svg" />${lastItem.price}</button
			>
			<button on:click|preventDefault={handleRepeat}
				><img src="/plus-circle.svg" />${lastItem.price}</button
			>
		</div>
	{/if}
	<form bind:this={formElement} on:submit|preventDefault={handleSubmit}>
		<!-- {#each priceList as item}
			<span>{item.label} {item.price * item.quantity * } {item.price}</span> -->
		<section>
			<span class="name-input">
				<label for="name-input">
					Item
					<input type="text" placeholder="Name (optional)" />
				</label>
			</span>

			<span class="price-input">
				<span class="dollar-sign">$</span>
				<input
					bind:this={priceInputElement}
					id="price-input"
					inputmode="decimal"
					type="number"
					step="any"
					tabindex="1"
					required
					min="0.01"
				/>
			</span>
			<span class="q-t">
				<label for="quantity-input">
					Quantity
					<input id="quantity-input" type="number" step="1" value={quantity} min="1" />
				</label>
			</span>
			<span class="q-t">
				<label for="taxable-checkbox">
					Taxable
					<span style="padding: 4px">
						<input
							id="taxable-checkbox"
							type="checkbox"
							checked={taxable}
							on:change={() => (taxable = !taxable)}
						/>
					</span>
				</label>
			</span>
			<button id="submit"><img src="/arrow-right.svg" /></button>
		</section>
		<!-- <div class="temp">
			<p>Price: {price}</p>
			<p>Taxable? {taxable}</p>
		</div> -->
	</form>
</div>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
	#price-input {
		font-size: 2rem;
		height: 100%;
		border: 1px solid #0003;
	}
	#submit {
		position: relative;
		top: -3px;
	}
	.display-total {
		padding: 0.5rem;
		text-align: right;
		display: flex;
		flex-direction: column;
		background: #fff;
	}
	.total-amount {
		font-weight: 500;
		text-transform: uppercase;
		text-align: right;
		font-size: 1.5rem;
	}
	.item-list {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 0.5rem;
	}
	form {
		display: flex;
		flex-direction: column;
		margin: auto;
		position: relative;
		/* width: 100%; */
		bottom: -8px;
		background: white;
		padding: 0.75rem 0.75rem 2rem;
		justify-content: stretch;
		font-size: 2rem;
	}
	form section {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		/* gap: 1rem; */
		flex-wrap: wrap;
		justify-content: flex-end;
		width: 100%;
	}
	label {
		font-size: 0.75rem;
	}
	.mod-buttons {
		display: flex;
		justify-content: flex-end;
		justify-self: center;
		align-self: center;
	}
	.mod-buttons button {
		background: #fff8;
	}
	.mod-buttons button img {
		padding-right: 2px;
	}
	button {
		padding: 0 8px;
		margin: 0 4px;
		background: #0003;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		min-width: 40px;
	}
	.input-area {
		position: fixed;
		display: flex;
		flex-direction: column;
		/* height: 150px; */
		width: 100%;
		bottom: -12px;
	}
	.price-input {
		width: 100%;
		/* padding-left: 1rem; */
		display: flex;
		align-items: center;
		flex: 3;
		max-width: 160px;
	}
	.price-input input {
		width: 100%;
		height: 2rem;
	}
	.name-input {
		flex: 5;
		display: none;
	}
	.name-input input {
		width: 100%;
	}
	.q-t {
		flex: 1;
		align-self: baseline;
		display: none;
	}
	.q-t input {
		width: 100%;
		display: none;
	}
	input[type='checkbox'] {
		margin-top: 0.5rem;
	}
	@media screen and (min-width: 200px) {
		form {
			max-width: 480px;
			border-radius: 8px;
		}
	}
</style>
