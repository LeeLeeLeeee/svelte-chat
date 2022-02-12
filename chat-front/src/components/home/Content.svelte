<script>
	import FaRedo from 'svelte-icons/fa/FaRedo.svelte'
	import { userStore } from '$stores/user';
	import { roomStore, enterRoom, getAbleParticipateRoomList, getParticipatedRoomList } from '$stores/room';
	import Card from '$components/common/Card';
	import { goto } from '$app/navigation';
	import { socketStore } from '$stores/socket';
	
	const handleCardClick = async (roomId, userName) => {
		try {
			await enterRoom(roomId, userName);
			await getParticipatedRoomList($userStore.username);
			goto(`/chat/${roomId}`);
		} catch(error) {
			console.log(error);
			/* error handling */
		}
	};

	const handleReloadClick = () => {
		getAbleParticipateRoomList($userStore.username);
	}

	socketStore.subscribe((state) => {
		if(state.socketClient) {
			getAbleParticipateRoomList($userStore.username);
			getParticipatedRoomList($userStore.username);
		}
	})
</script>

<div class="flex-1 flex flex-col bg-slate-50">
	{#if $userStore.username === ''}
		<div class="flex-1 flex items-center justify-center font-bold">계정을 생성해주세요</div>
	{:else}
		<div class="m-1 flex items-center">참여 가능한 방 목록 <div class="icon ml-1" on:click={handleReloadClick}><FaRedo /></div> </div>
		<div class="flex-1 p-2 grid grid-cols-2 gap-4 justify-items-center auto-rows-max">
			{#each $roomStore.roomList as { roomName, userCount, roomId }, i (roomId)}
				<Card on:click={() => handleCardClick(roomId, $userStore.username)} title={roomName}>
					<div slot="content" class="w-full text-right text-sm text-slate-500">
						참여 인원: {userCount}
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>

<style>

</style>