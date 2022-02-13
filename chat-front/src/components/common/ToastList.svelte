<script>
    import Toast from "./Toast.svelte";
    import { toastStore, deleteToast } from '$stores/toast';
    
    function DeleteToast({ detail }) {
        deleteToast(detail.toastID);
    }

</script>

<div class="absolute m-1 bottom-0 right-0">
    {#each $toastStore.toastList as { type, message, index, isOn } (index) }
        <Toast on:closeClick={DeleteToast} message={message} toastType={type} toastID={index} isOn={isOn} />
    {/each}
</div>
