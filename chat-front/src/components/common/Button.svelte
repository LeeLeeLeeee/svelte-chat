<svelte:options immutable={true} />

<script>
	export let main = false;
	const checkIsMain = (isMain) =>
		isMain ? 'bg-slate-600 text-white' : 'border-2 border-slate-600';
</script>

<button data-testid="button" on:click|preventDefault class="pt-1 pb-1 p-2 text-sm rounded-md {checkIsMain(main)} ">
	<slot />
</button>

<style>
	button {
		min-width: 50px;
	}
</style>

