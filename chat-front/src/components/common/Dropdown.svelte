<script>
	import { slide } from '$animations/slide';
	import GoChevronDown from 'svelte-icons/go/GoChevronDown.svelte';
	import { createEventDispatcher } from 'svelte';

	export let label = '';
	export let list = [];
	export let listItemKey = { id: '', label: '' };

	let isOpen = false;

	const dispatch = createEventDispatcher();

	function handleClick(param) {
		dispatch('listItemClick', { param });
	}

	function closeDropDownItem(event) {
		for (const node of document.getElementsByClassName('drop-down-list')) {
			if (!node.contains(event.target)) {
				isOpen = false;
				break;
			}
		}
	}
</script>

<svelte:window on:click={closeDropDownItem} />
<div
	on:click|stopPropagation={() => {
		isOpen = !isOpen;
	}}
	class="relative cursor-pointer flex rounded-md items-center gap-3 border border-gray-300 pt-1 pb-1 pl-2 pr-2"
>
	{#if !isOpen}
		<span class="ping-dot animate-ping absolute rounded-full bg-red-500" />
	{/if}
	<span class="text-sm">{label}</span>
	<div class="icon rounded-full"><GoChevronDown /></div>
	{#if isOpen}
		<ul
			in:slide={{ duration: 100 }}
			out:slide={{ duration: 100 }}
			class="drop-down-list absolute text-xs drop-shadow-md bg-white p-2 rounded-md border border-gray-300"
		>
			{#if typeof list[0] === 'object'}
				{#each list as item (item[listItemKey.id])}
					<li on:click={() => handleClick(item[listItemKey.id])}>
						{item[listItemKey.label]}
					</li>
				{/each}
			{:else}
				{#each list as item}
					<li on:click={() => handleClick(item)}>
						{item}
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

<style>
	.icon {
		width: 20px;
		height: 20px;
		@apply text-slate-800;
	}
	.ping-dot {
		width: 7px;
		height: 7px;
		right: 5px;
		top: 5px;
	}
	ul {
		left: 0px;
		top: 35px;
		width: 100%;
	}
	ul > li {
		text-overflow: ellipsis;
		overflow-x: hidden;
		white-space: nowrap;
		position: relative;
		@apply rounded-md p-1;
		@apply transition ease-in-out duration-150;
	}

	ul > li:not(:last-child) {
		@apply border-b border-gray-200;
	}

	ul > li:hover {
		@apply bg-gray-100;
	}
</style>
