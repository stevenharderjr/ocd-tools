<script lang="ts">
	import Toast from '$lib/Toast.svelte';
	// import { matchLabels, merge } from '$lib/utils/deduplicate';
	interface Item {
		price: number;
		discount: number;
		discountType: 'amt' | 'pct';
		label?: string;
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

	// $ {
	// 	total = priceList.reduce((acc, current) => acc + current?.price);
	// 	total *=
	// }

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
		const [label, price, quantity, taxable] = event.target;
		console.log({
			label: label.value,
			price: price.value,
			quantity: quantity.value,
			taxable: taxable.value
		});
	}
</script>

<form class="floating container" on:submit|preventDefault={handleSubmit}>
	<!-- {#each priceList as item}
		<span>{item.label} {item.price * item.quantity * } {item.price}</span> -->
	<section>
		<input type="text" placeholder="Item name (optional) ..." />
		<label for="price-input">$</label>
		<input id="price-input" type="number" step="any" autofocus tabindex="1" required min="0.01" />
		<label for="quantity-input">Quantity</label>
		<input id="quantity-input" type="number" step="1" value="1" min="1" required />
		<input type="checkbox" checked={taxable} on:change={() => (taxable = !taxable)} />
		<label for="taxable-checkbox">Taxable</label>
		<input type="submit" style="display: none;" />
	</section>
	<p>Price: {price}</p>
	<p>Taxable? {taxable}</p>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
	}
</style>
