<script>
    import { userStore } from '$stores/user';
    import { fade } from 'svelte/transition';
    
    export let message = '';
    export let sender = ''
    export let isMine = true;
</script>
<div class="flex {isMine ? 'justify-end' : 'justify-start'}">
    {#if !isMine}
        <div class="thumbnail" id="other-thumbnail" />
    {/if}
    <div in:fade={{duration: 100}}>
        <div class="text-xs text-gray-500 { !isMine && 'text-right' }">{ isMine ? $userStore.username : sender}</div>
        <div class="relative text-sm max-w-sm { isMine ? 'bg-lime-200 mr-2' : 'bg-white ml-2'} p-2 rounded-md drop-shadow-md">
            <span class="tri {isMine ? 'mine' : 'other'}" />
            {message}
        </div>
    </div>
    {#if isMine}
        <div class="thumbnail" id="my-thumbnail" />
    {/if}
</div>

<style>
    .thumbnail {
        width: 20px;
        height: 20px;
        @apply rounded-md;
    }

    #my-thumbnail {
        @apply bg-slate-500;
    }

    #other-thumbnail {
        @apply bg-yellow-500;
    }

    .tri {
        position: absolute;
        border-left: 7px solid transparent;
        border-top: 7px solid;
        border-bottom: 7px solid transparent;
        border-right: 7px solid transparent;
        top: 2px;
        transform: rotate(358deg);
    }

    .tri.mine {
        right: -0.3rem;
        @apply border-t-lime-200;
        
    }

    .tri.other {
        left: -0.3rem;
        @apply border-t-white;
    }
    
</style>