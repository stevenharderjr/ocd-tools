<script lang="ts">
	export let value;
</script>

<input type="range" on:change on:input min="0" max="6" {value} />

<style>
	input {
		pointer-events: auto;
		width: 100%;
		height: 100%;
	}
</style>
