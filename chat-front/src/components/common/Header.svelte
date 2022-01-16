<script>
	import Button from '$components/common/Button';
	import { setModalOpen, setModalTarget } from '$stores/modal';
	import { userStore } from '$stores/user';

	const createUserModalOpen = () => {
		setModalTarget('create-user');
		setModalOpen();
	};
</script>

<div class='p-2 shadow-sm z-10 relative'>
	{#if $userStore.username === ''}
		<Button on:click={createUserModalOpen} main>계정 생성</Button>
	{:else}
		<Button>방 생성</Button>

	{/if}
</div>
