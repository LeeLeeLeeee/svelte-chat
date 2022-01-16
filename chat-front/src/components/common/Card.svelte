<script>
    export let title = '';
</script>
<div id='card' class={`
    border
    inline-flex
    pb-1 pt-1 pl-2 pr-2
    shadow-md
    rounded-md
    bg-white
    hover:translate-y-1
    transition-transform
    cursor-pointer
    ease-out
    items-center
    justify-center
    flex-col
    relative
`}>
    <div class='text-left w-full flex-1'>{title}</div>
    <slot name='content'></slot>
</div>
<style>
    #card {
        width: 288px;
        height: 90px;
    }
</style>