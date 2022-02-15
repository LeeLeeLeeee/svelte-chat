<script context="module">
	export async function load({ params }) {
		return {
			props: {
				roomId: params.id
			}
		};
	}
</script>
<script>
	import GoSignOut from 'svelte-icons/go/GoSignOut.svelte';
	import GiBackup from 'svelte-icons/gi/GiBackup.svelte'
	import Button from '$components/common/Button.svelte';
	import Input from '$components/common/Input.svelte';
	import { time } from '$stores/time';
	import ChatBox from '$components/chat/ChatBox.svelte';
	import { connectSocketClient, socketStore } from '$stores/socket';
	import { onMount } from 'svelte';
	import { userStore, leaveRoom } from '$stores/user';
	import { goto } from '$app/navigation';
	import { getParticipatedClient, roomStore } from '$stores/room';
	import { setModalOpen, setModalTarget } from '$stores/modal';
	
	let chats = []
	let value = '';
	export let roomId = ''
	onMount(() => {
		if ($userStore.username === "") {
			goto("/")
		}
		connectSocketClient();
		$socketStore.socketClient.onListenHandler((e) => {
			const { To: username, Message: message} = JSON.parse(e.data)
			if( username === 'admin') {
				getParticipatedClient(roomId);
			}
			chats = [...chats, { message: message, isMine: false, name: username}]
		})
		getParticipatedClient(roomId);
	})

	let onSendMessage = () => {
		chats = [...chats, { message: value, isMine: true}]
		$socketStore.socketClient.sendMessage(value);
		value = '';
	}

	let handleLeaveRoom = async () => {
		await leaveRoom(roomId);
		// closeSocketClient();
		goto('/')
	}

	const handleUserListModalClick = () => {
		setModalTarget('user-list');
		setModalOpen();
	}
	
</script>

<div class="flex flex-col h-full rounded-lg">
	<div class="border-b border-b-gray-300 p-2 flex justify-between items-center">
		<span>{$time}</span>
		<div on:click={handleLeaveRoom} class="icon"><GoSignOut /></div>
	</div>
	<div class="flex flex-col gap-3 flex-1 bg-amber-50-50 pt-2 pb-2 pl-3 pr-3 bg-zinc-100 overflow-y-auto">
		{#each chats as { isMine, message, name } , i (i)}
			{#if name === 'admin'}
				<div class="text-sm text-center text-zinc-500">{message}</div>
			{:else}
				<ChatBox message={message} isMine={isMine} sender={name} />
			{/if}
			
		{/each}
	</div>
	<div class="p-2 flex items-center">
		<div class="icon relative" on:click={handleUserListModalClick}>
			<span class="badge">{$roomStore.participants.length}</span>
			<GiBackup />
		</div>
		<div class="border-l border-l-gray-400 m-1" />
		<Input bind:value class="flex-1" />
		<div class="border-l border-l-gray-400 m-1" />
		<Button on:click={onSendMessage}>전송</Button>
	</div>
</div>

<style>
	.badge {
		position: absolute;
		width: 14px;
		height: 14px;
		border-radius: 14px;
		top: -7px;
		right: -7px;
		font-size: 8px;
		text-align: center;
		line-height: 14px;
		color: white;
		@apply bg-blue-400;
		@apply shadow-md;		
	}
</style>