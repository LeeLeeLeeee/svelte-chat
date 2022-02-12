<script>
    import { onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    import { contextStore, setContextClose } from '$stores/context';

    
    export let contextID = '';
    let contextElement;
    let x = 0;
    let y = 0

    $: ((a) => {
        
        if (!contextElement) return;

        const rect = contextElement.getBoundingClientRect();
		x = Math.min(window.innerWidth - rect.width, $contextStore.x);
		if ($contextStore.y > (window.innerHeight - rect.height)) {
            y -= rect.height;
        } else {
            y = $contextStore.y
        }
    })();
    
    
	let isContext = false;
    
	const unsubscribe = contextStore.subscribe((status) => {
		isContext = status.isOpen && status.target === contextID;
	});
    
	onDestroy(() => {
		unsubscribe();
	});
    
    function onOutSidePageClick(e) {
        const { target } = e;
        if (!contextElement) return;
        if (target === contextElement || contextElement.contains(target)) return;
        setContextClose();
    }

</script>
<style>
    div {
        position: absolute;
        display: grid;
        background-color: white;
        z-index: 90;
        @apply p-2 rounded-md bg-gray-100 border border-gray-300 text-sm;
    }
</style>
<svelte:window on:click={onOutSidePageClick} />
{#if isContext}
    <div transition:fade={{ duration: 90 }} bind:this={contextElement} style="top: {y}px; left: {x}px;">
        <slot />
    </div>
{/if}