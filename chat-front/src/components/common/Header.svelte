<script>
	import Button from '$components/common/Button';
	import { setModalOpen, setModalTarget } from '$stores/modal';
	import { getNotAssignedUserNameList, setUserName, userStore } from '$stores/user';
	import { roomStore, enterRoom } from '$stores/room';
	import Dropdown from './Dropdown.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { connectSocketClient } from '$stores/socket';
	import IoMdContact from 'svelte-icons/io/IoMdContact.svelte'
	import { setContextOpen, setContextTarget, setContextProps } from '$stores/context';
	import { messageStore, readRoomMessage } from '$stores/message';

	$: isReadAll = Object.values($messageStore).every((on) => !on);
	console.log($messageStore)
	const createUserModalOpen = () => {
		setModalTarget('create-user');
		setModalOpen();
	};

	const createRoomModalOpen = () => {
		setModalTarget('create-room');
		setModalOpen();
	};

	const handleRoomClick = async ({ detail }) => {
		const { props: roomId } = detail;
		readRoomMessage(roomId);
		await enterRoom(roomId, $userStore.username);
		goto(`chat/${roomId}`);
	};

	const handleUserClick = ({ detail }) => {
		const { props: userName } = detail;
		setUserName(userName)
		connectSocketClient()
	}

	const handleContextMenu = ({ detail }) => {
		const { props } = detail;
		setContextTarget('roomListContext')
		setContextOpen();
		setContextProps(props);
	}

	onMount(() => {
		getNotAssignedUserNameList()
	})

</script>

<div class="p-2 shadow-sm z-10 relative flex justify-between">
	{#if $userStore.username === ''}
		<Button on:click={createUserModalOpen} main>계정 생성</Button>
		<Dropdown
			label="생성된 유저 목록"
			list={$userStore.userNameList}
			on:listItemClick={handleUserClick}
		/>

	{:else}
		<Button on:click={createRoomModalOpen}>방 생성</Button>
		<div class="flex items-center">
			<div class="icon">
				<IoMdContact />
			</div>
			<span style={'height: 20px; line-height:20px'} class="text-sm">
				{$userStore.username}님
			</span>
		</div>
		{#if !isReadAll}
			<span class="ping-dot animate-ping absolute rounded-full bg-red-500" />
		{/if}
		<Dropdown
			listItemKey={{ id: 'roomId', label: 'roomName' }}
			label="참여한 방 목록"
			list={$roomStore.enteredRoomList}
			class='room-dropdown'
			on:listItemClick={handleRoomClick}
			on:rightClick={handleContextMenu}
		/>
	{/if}
</div>
<style>
	.ping-dot {
		width: 7px;
		height: 7px;
		right: 5px;
		top: 5px;
	}
</style>