<script>
	import Button from '$components/common/Button';
	import Modal from '$components/common/Modal';
	import Input from '$components/common/Input';
	import { userStore } from '$stores/user';
	import { setModalClose } from '$stores/modal';
	import { createRoom } from '$stores/room';
	let value = '';
	let error = false;
	const handleSubmit = async (roomName) => {
		try {
			await createRoom(roomName, $userStore.username);
			setModalClose();
			value = '';
		} catch (err) {
			console.log(err);
			error = true;
		}
	};
</script>

<Modal modalId="create-room">
	<div slot="header">방 생성</div>
	<Input {error} bind:value label="방 이름" />
	<div slot="bottom">
		<Button on:click={() => handleSubmit(value)}>생성</Button>
	</div>
</Modal>
