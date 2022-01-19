<script>
    export let message = '';
</script>
<div class="flex justify-end">
    <div>
        <div class="text-xs text-gray-500">나임</div>
        <div class="relative text-sm max-w-sm bg-lime-200 p-2 rounded-md mr-2">
            <span class="tri" />
            {message}
        </div>
        
    </div>
    <div id="thumbnail" />
</div>

<style>
    #thumbnail {
        width: 20px;
        height: 20px;
        @apply rounded-md;
        @apply bg-slate-500;
    }
    .tri {
        position: absolute;
        border-left: 7px solid transparent;
        border-top: 7px solid;
        border-bottom: 7px solid transparent;
        border-right: 7px solid transparent;
        right: -0.3rem;
        top: 2px;
        @apply border-t-lime-200;
        transform: rotate(358deg);
    }
</style>