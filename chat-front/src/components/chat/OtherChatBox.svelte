<script>
    export let message = '';
</script>
<!-- TODO: ChatBox 하나로 추상화 합치기 -->
<div class="flex justify-start">
    <div id="thumbnail" />
    <div>
        <div class="text-xs text-right text-gray-500">다른 사람임</div>
        <div class="relative text-sm max-w-sm bg-white p-2 rounded-md ml-2">
            <span class="tri" />
            {message}
        </div>
    </div>
</div>

<style>
    #thumbnail {
        width: 20px;
        height: 20px;
        @apply rounded-md;
        @apply bg-yellow-500;
    }
    .tri {
        position: absolute;
        border-left: 7px solid transparent;
        border-top: 7px solid;
        border-bottom: 7px solid transparent;
        border-right: 7px solid transparent;
        left: -0.3rem;
        top: 2px;
        @apply border-t-white;
        transform: rotate(358deg);
    }
</style>