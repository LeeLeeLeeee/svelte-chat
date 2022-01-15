<script>
	import Button from '$components/common/Button';
	import { setModalOpen, setModalTarget } from '$stores/modal';

	const createUserModalOpen = () => {
		setModalTarget('create-user');
		setModalOpen();
	};
</script>

<div>
	<Button on:click={createUserModalOpen} main>계정 생성</Button>
</div>
