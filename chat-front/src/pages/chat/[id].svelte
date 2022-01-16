<script>
    import GoSignOut from 'svelte-icons/go/GoSignOut.svelte'
    import Button from "$components/common/Button.svelte";
    import Input from "$components/common/Input.svelte";
    import { time } from '$stores/time';

</script>
<div class="flex flex-col h-full">
    <div class='border-b border-b-gray-300 p-2 flex justify-between items-center'>
        <span>{$time}</span>
        <div class="icon"><GoSignOut /></div>
    </div>
    <div class='flex-1 bg-amber-50-50'>
        
    </div>
    <div class='border-t border-t-gray-400 p-2 flex'>
        <Input class="flex-1" />
        <div class='border-l border-l-gray-400 m-1'></div>
        <Button>전송</Button>
    </div>
</div>

<style>
    .icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        @apply text-blue-400;
    } 
</style>