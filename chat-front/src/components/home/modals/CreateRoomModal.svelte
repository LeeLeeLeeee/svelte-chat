<script>
	import Button from '$components/common/Button';
	import Modal from '$components/common/Modal';
	import Input from '$components/common/Input';
	import { setModalClose } from '$stores/modal';
	import { createRoom } from '$stores/room';
	import { insertToast } from '$stores/toast';
	let value = '';
	let error = false;
	const handleSubmit = async (roomName) => {
		try {
			await createRoom(roomName);
			insertToast('success', '방이 성공적으로 생성되었습니다.\n참여가능한 방 목록 우측의 새로고침 버튼을 클릭하여 방 목록을 불러오세요!');
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
		<Button dataCy="createRoomButton" on:click={() => handleSubmit(value)}>생성</Button>
	</div>
</Modal>
