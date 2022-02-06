<script>
    import Modal from "$components/common/Modal.svelte";
    import { roomStore } from "$stores/room";
    
</script>


<Modal modalId="user-list">
    <div>대화 상대</div>
    {#each $roomStore.participants as userName, i (userName)}
        <div>
            * {userName}
        </div>
    {/each}
</Modal>
