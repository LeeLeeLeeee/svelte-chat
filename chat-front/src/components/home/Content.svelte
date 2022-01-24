<script>
	import { userStore } from '$stores/user';
	import { setSocketClient } from '$stores/socketClient';
	import { roomStore, deleteRoom } from '$stores/room';
	import { goto } from '$app/navigation';
	import Card from '$components/common/Card';
	import SocketClient from '$lib/socket';
	
	$: enterAbleRoomList = $roomStore.roomList; //.filter((room) => !room.userList.includes($userStore.username));
	const handleCardClick = (roomName) => {
		try {
			setSocketClient(new SocketClient($userStore.username, roomName));
			goto('/chat/1');
		} catch(error) {
			console.log(error);
			/* error handling */
		}
	};

</script>

<div class="flex-1 flex flex-col bg-slate-50">
	{#if $userStore.username === ''}
		<div class="flex-1 flex items-center justify-center font-bold">계정을 생성해주세요</div>
	{:else}
		<div class="m-1">참여 가능한 방 목록</div>
		<div class="flex-1 p-2 grid grid-cols-2 gap-4 justify-items-center auto-rows-max">
			{#each enterAbleRoomList as { roomName, userList, roomId }, i (roomId)}
				<Card on:click={() => handleCardClick(roomName)} title={roomName}>
					<div slot="content" class="w-full text-right text-sm text-slate-500">
						참여 인원: {userList.length}
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
