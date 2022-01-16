<script>
	import CreateRoomModal from '$components/common/modals/CreateRoomModal.svelte';
	import CreateUserModal from '$components/common/modals/CreateUserModal.svelte';
	import { modalStore, setModalClose } from '$stores/modal';
</script>

<div class="w-4/12 mx-auto h-full drop-shadow-md rounded-sm bg-white">
	<slot />
</div>

<CreateUserModal />
<CreateRoomModal />

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
