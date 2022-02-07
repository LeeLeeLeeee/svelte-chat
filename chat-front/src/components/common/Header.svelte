<script>
	import Button from '$components/common/Button';
	import { setModalOpen, setModalTarget } from '$stores/modal';
	import { getNotAssignedUserNameList, setUserName, userStore } from '$stores/user';
	import { roomStore } from '$stores/room';
	import Dropdown from './Dropdown.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { setSocketClient } from '$stores/socket';
	import IoMdContact from 'svelte-icons/io/IoMdContact.svelte'
	const createUserModalOpen = () => {
		setModalTarget('create-user');
		setModalOpen();
	};

	const createRoomModalOpen = () => {
		setModalTarget('create-room');
		setModalOpen();
	};

	const handleRoomClick = ({ detail }) => {
		const { param: roomId } = detail;
		goto(`chat/${roomId}`);
	};

	const handleUserClick = ({ detail }) => {
		const { param: userName } = detail;
		setUserName(userName)
		setSocketClient(userName)
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
		<Dropdown
			listItemKey={{ id: 'roomId', label: 'roomName' }}
			label="참여한 방 목록"
			list={$roomStore.roomList}
			on:listItemClick={handleRoomClick}
		/>
	{/if}
</div>
