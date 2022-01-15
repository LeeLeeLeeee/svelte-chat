<svelte:options immutable={true} />

<script>
	import { createEventDispatcher } from 'svelte';
	export let main = false;
	const checkIsMain = (isMain) =>
		isMain ? 'bg-blue-500 text-white' : 'border-2 border-blue-500';
</script>

<button on:click|preventDefault class="pt-1 pb-1 p-2 text-sm rounded-md {checkIsMain(main)} ">
	<slot />
</button>

<style>
	button {
		min-width: 50px;
	}
</style>
