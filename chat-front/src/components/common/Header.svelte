<script>
	import Button from '$components/common/Button';
	import { setModalOpen, setModalTarget } from '$stores/modal';
	import { userStore } from '$stores/user';
	import { roomStore } from '$stores/room';
	import Dropdown from './Dropdown.svelte';
	import { goto } from '$app/navigation';

	const createUserModalOpen = () => {
		setModalTarget('create-user');
		setModalOpen();
	};

	const createRoomModalOpen = () => {
		setModalTarget('create-room');
		setModalOpen();
	};

	const handleClick = ({ detail }) => {
		const { roomId } = detail;
		goto(`chat/${roomId}`);
	};
</script>

<div class="p-2 shadow-sm z-10 relative flex justify-between">
	{#if $userStore.username === ''}
		<Button on:click={createUserModalOpen} main>계정 생성</Button>
	{:else}
		<Button on:click={createRoomModalOpen}>방 생성</Button>
		<Dropdown
			listItemKey={{ id: 'roomId', label: 'roomName' }}
			label="참여한 방 목록"
			list={$roomStore.roomList}
			on:listItemClick={handleClick}
		/>
	{/if}
</div>
