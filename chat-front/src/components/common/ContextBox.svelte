<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    export let x = 0;
    export let y = 0;
    let contextElement;
    const dispatch = createEventDispatcher();
    $: (() => {
        if (!contextElement) return;

        const rect = contextElement.getBoundingClientRect();
        console.log(window.innerWidth, rect.width)
		x = Math.min(window.innerWidth - rect.width, x);
		if (y > (window.innerHeight - rect.height)) {
            y -= rect.height;
        }
    })(x, y);

    

    function onOutSidePageClick(e) {
        const { target } = e;
        if (target === contextElement || contextElement.contains(target)) return;
        dispatch('clickoutside');
    }

</script>
<style>
    div {
        position: absolute;
        display: grid;
        background-color: white;
        z-index: 90;
        @apply p-2 rounded-md bg-white border-gray-300;
    }
</style>
<svelte:window on:click={onOutSidePageClick} />
<div transition:fade={{ duration: 100 }} bind:this={contextElement} style="top: {y}px; left: {x}px;">
    <slot />
</div>