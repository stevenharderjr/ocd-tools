<script lang="ts">
	import Toast from '$lib/Toast.svelte';
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

	const taxMultiplier = 1.06;

	$: total = items.reduce((acc, current) => acc + +current?.price, 0);
	$: total *= taxMultiplier;
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

	function handleSubmit(event) {
		const [label, price, quantity] = event.target;
		console.log({
			label: label.value,
			price: price.value,
			quantity: quantity.value,
			taxable
		});
		items = [
			{
				label: label.value,
				price: price.value,
				quantity: quantity.value || 1,
				taxable,
				discountType: 'pct',
				discount: 0
			},
			...items
		];
		event.target.reset();
	}
</script>

<div class="display-total">
	<span class="total-amount">${total.toFixed(2)}</span>
</div>

<div class="item-list">
	{#each items as item}
		<span class="list-item">{item.label} ${item.price}</span>
	{/each}
</div>

<div class="input-area">
	<form on:submit|preventDefault={handleSubmit}>
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
					id="price-input"
					type="number"
					step="any"
					autofocus
					tabindex="1"
					required
					min="0.01"
				/>
			</span>
			<span class="q-t">
				<label for="quantity-input">
					Quantity
					<input id="quantity-input" type="number" step="1" value="1" min="1" />
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
			<input type="submit" style="display: none;" />
		</section>
		<!-- <div class="temp">
			<p>Price: {price}</p>
			<p>Taxable? {taxable}</p>
		</div> -->
	</form>
</div>

<style>
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
	.item-list span {
		align-self: flex-end;
	}
	form {
		display: flex;
		flex-direction: column;
		margin: auto;
		position: relative;
		width: 100%;
		bottom: -8px;
		background: white;
		padding: 0.5rem 0.75rem 2rem;
		justify-content: stretch;
	}
	form section {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: stretch;
		width: 100%;
	}
	label {
		font-size: 0.75rem;
	}
	.input-area {
		position: fixed;
		display: flex;
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
	}
	.price-input input {
		width: 100%;
		height: 2rem;
	}
	.name-input {
		flex: 5;
	}
	.name-input input {
		width: 100%;
	}
	.q-t {
		flex: 1;
		align-self: baseline;
	}
	.q-t input {
		width: 100%;
	}
	input[type='checkbox'] {
		margin-top: 0.5rem;
	}
	@media screen and (min-width: 480px) {
		form {
			max-width: 480px;
			border-radius: 8px;
		}
	}
</style>
