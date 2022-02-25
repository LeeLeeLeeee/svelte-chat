<script>
	import { slide } from '$animations/slide';
	import GoChevronDown from 'svelte-icons/go/GoChevronDown.svelte';
	import { createEventDispatcher } from 'svelte';
	import { setPosition } from '$stores/context';
	import { messageStore } from '$stores/message';
	export let label = '';
	export let list = [];
	
	export let listItemKey = { id: '', label: '' };
	let drowDownList;
	let className = ''
	export { className as class }

	let isOpen = false;

	const dispatch = createEventDispatcher();

	function handleClick(props) {
		dispatch('listItemClick', { props });
	}

	function handleRightClick(e, props) {
		const contextPosition = { x: e.clientX, y: e.clientY };
		setPosition(contextPosition);
		dispatch('rightClick', { props });
	}

	function closeDropDownItem(event) {
		if(!drowDownList) return
		const { target } = event;
		if(!drowDownList.contains(target)) {
			isOpen = false;
		}
	}
	
</script>

<svelte:window on:click={closeDropDownItem} />

<div
	data-testid="dropdown"
	on:click={() => {
		isOpen = !isOpen;
	}}
	bind:this={drowDownList}
	class="relative cursor-pointer flex rounded-md items-center gap-3 border border-gray-300 pt-1 pb-1 pl-2 pr-2 {className}"
>
	<span class="text-sm">{label}</span>
	<div class="icon rounded-full"><GoChevronDown /></div>
	{#if isOpen}
		<ul
			data-testid="dropdown-list"
			in:slide={{ duration: 100 }}
			out:slide={{ duration: 100 }}
			class="drop-down-list absolute text-xs drop-shadow-md bg-white p-2 rounded-md border border-gray-300"
		>
			{#if typeof list[0] === 'object'}
				{#each list as item (item[listItemKey.id])}
					<li class:active={$messageStore[item[listItemKey.id]]} on:click={() => handleClick(item[listItemKey.id])} on:contextmenu|preventDefault={(e) => handleRightClick(e, item)}>
						{item[listItemKey.label]}
					</li>
				{/each}
			{:else}
				{#each list as item}
					<li on:click={() => handleClick(item)} on:contextmenu|preventDefault={(e) => handleRightClick(e, item)}>
						{item}
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

<style>
	.room-dropdown > ul > .active {
		@apply bg-yellow-200;
	}

	.icon {
		width: 20px;
		height: 20px;
		@apply text-slate-800;
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
