<script>
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	export let label = '';
	export let value = '';
	export let error = false;

	const dispatch = createEventDispatcher();

	const handleKeyup = (event) => {
		dispatch('Keyup', { event })
	}
</script>

<div class="flex flex-col flex-1">
	<div>
		<span class="empty:hidden text-gray-600">{label}</span>
		{#if error}
			<span class="text-red-600 text-xs" out:fade in:fade={{ duration: 150 }}
				>이름이 중복되었습니다.</span
			>
		{/if}
	</div>
	<input
		on:keyup={handleKeyup}
		bind:value
		class={`
        ease-in-out
        p-1
        transition
        duration-75
        border
        ${error ? 'border-red-500' : 'border-gray-400'}
        focus:border
        focus:border-blue-500
        focus:shadow-sky-100
        focus:shadow-md
        focus:outline-none 
    `}
		type="text"
	/>
</div>
