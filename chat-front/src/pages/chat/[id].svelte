<script>
	import GoSignOut from 'svelte-icons/go/GoSignOut.svelte';
	import GiBackup from 'svelte-icons/gi/GiBackup.svelte'
	import Button from '$components/common/Button.svelte';
	import Input from '$components/common/Input.svelte';
	import { time } from '$stores/time';
	import ChatBox from '$components/chat/ChatBox.svelte';
	import { setSocketClient, socketStore } from '$stores/socketClient';
	import { onMount } from 'svelte';
	import { userStore } from '$stores/user';
	import SocketClient from '$lib/socket';
	
	let chats = []
	let value = '';

	onMount(() => {
		if( $socketStore.socketClient === null ) {
			const sc = new SocketClient($userStore.username, 'aaa');
			sc.onListenHandler((e) => {
				chats = [...chats, { message: e.data, isMine: false}]
			})
			setSocketClient(sc);
		} else {
			$socketStore.socketClient.onListenHandler((e) => {
				const { To: username, Message: message} = JSON.parse(e.data)
				chats = [...chats, { message: message, isMine: false, name: username}]
			})
		}
	})

	let onSendMessage = () => {
		chats = [...chats, { message: value, isMine: true}]
		$socketStore.socketClient.sendMessage(value);
		value = '';
	}
	
</script>

<div class="flex flex-col h-full rounded-lg">
	<div class="border-b border-b-gray-300 p-2 flex justify-between items-center">
		<span>{$time}</span>
		<div class="icon"><GoSignOut /></div>
	</div>
	<div class="flex flex-col gap-3 flex-1 bg-amber-50-50 pt-2 pb-2 pl-3 pr-3 bg-zinc-100">
		{#each chats as { isMine, message, name } , i (i)}
			<ChatBox message={message} isMine={isMine} sender={name} />
		{/each}
	</div>
	<div class="p-2 flex items-center">
		<div class="icon"><GiBackup /></div>
		<div class="border-l border-l-gray-400 m-1" />
		<Input bind:value class="flex-1" />
		<div class="border-l border-l-gray-400 m-1" />
		<Button on:click={onSendMessage}>전송</Button>
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
