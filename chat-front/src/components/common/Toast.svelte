<script>
    import TiTimesOutline from 'svelte-icons/ti/TiTimesOutline.svelte'
    import TiMail from 'svelte-icons/ti/TiMail.svelte'
    import TiTickOutline from 'svelte-icons/ti/TiTickOutline.svelte'
    import TiWarning from 'svelte-icons/ti/TiWarning.svelte'
    import { fade } from 'svelte/transition';
    import { sineIn, sineOut } from 'svelte/easing';
    import { afterUpdate, onDestroy, onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import { toastStore } from '$stores/toast';
    export let toastType = "info"
    export let message = toastType
    export let isOn = true
    export let toastID = 0;
    const dispatch = createEventDispatcher();
    let clearTimeoutID = null;

    afterUpdate(() => {
        if (isOn === false) {
            setTimeout(() => {
                dispatch('closeClick', { toastID })
            }, 300);
        }
    })
    
    onMount(() => {
        clearTimeoutID = setTimeout(() => {
            isOn = false;
        }, $toastStore.duraction);
    })

    onDestroy(() => {
        clearTimeout(clearTimeoutID)
    })

    const closeClick = () => {
        isOn = false;
    }

</script>

{#if isOn}
    <div in:fade={{duration: 300, easing: sineOut}} out:fade={{duration: 300, easing: sineIn}} class="toast-wrapper relative rounded-md toast-{toastType} text-slate-600 p-2 mb-2 text-sm flex justify-between shadow-md">
        <div class="flex flex-1">
            <span class="mr-1">
                {#if toastType === "info"}
                    <TiMail />
                {:else if toastType === "success"}
                    <TiTickOutline />
                {:else if toastType === "warning"}
                    <TiWarning />
                {:else if toastType === "error"}
                    <TiWarning />
                {/if}
            </span>
            {message}
        </div>
        <span on:click={closeClick} class="cursor-pointer ml-1"><TiTimesOutline /></span>
    </div>
{/if}

<style lang="scss">
    .toast-wrapper {
        min-width: 400px;
        max-width: 400px;
        white-space: pre-wrap;
    }

    .toast-wrapper > div {
        line-height: 25px;
    }

    div span {
        width: 25px;
        height: 25px;
        position: relative;
        @apply shadow-sm;
    }

    div.toast-success {
        @apply bg-green-200 border border-green-400;
        & > div > span {
            @apply text-green-700
        }
    }

    div.toast-info {
        @apply bg-blue-200 border border-blue-400;
        & > div > span {
            @apply text-blue-700
        }
    }

    div.toast-warning {
        @apply bg-yellow-200 border border-yellow-400;
        & > div > span {
            @apply text-yellow-700
        }
    }

    div.toast-error {
        @apply bg-red-200 border border-red-400;
        & > div > span {
            @apply text-red-700
        }
    }
</style>
