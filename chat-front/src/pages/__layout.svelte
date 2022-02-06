<script>
	import UserListModal from '$components/chat/UserListModal.svelte';
	import CreateRoomModal from '$components/home/modals/CreateRoomModal.svelte';
	import CreateUserModal from '$components/home/modals/CreateUserModal.svelte';
	import { modalStore, setModalClose } from '$stores/modal';
</script>

<div class="w-4/12 mx-auto h-full drop-shadow-md rounded-md bg-white flex flex-col">
	<slot />
</div>

<CreateUserModal />
<CreateRoomModal />
<UserListModal />
<div
	id="wrapper"
	on:click={setModalClose}
	class="bg-black/20 h-full w-full absolute top-0 z-10 {$modalStore.isOpen ? 'block' : 'hidden'}"
/>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
	body {
		@apply font-noto-sans;
		font-size: 18px;
	}
</style>
