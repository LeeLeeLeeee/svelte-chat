<script>
    import { userStore } from '$stores/user';
    import { roomStore } from '$stores/room';
    import Card from '$components/common/Card';


</script>

<div class='h-full flex flex-col bg-slate-50'>
    {#if $userStore.username === ''}
        <div class='flex-1 flex items-center justify-center font-bold'>계정을 생성해주세요</div>
    {:else}
        <div class="m-1">참여 가능한 방 목록</div>
        <div class="flex-1 flex p-2 gap-4">
            {#each $roomStore.roomList as { roomId, userList }, i (roomId)}
                <Card title={roomId}>
                    <div slot='content' class='w-full text-right text-sm text-slate-500'>
                        참여 인원: {userList.length}
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</div>