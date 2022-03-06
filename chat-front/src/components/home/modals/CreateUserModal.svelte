<script>
	import Button from '../../common/Button.svelte';
	import Modal from '../../common/Modal.svelte';
	import Input from '../../common/Input.svelte';
	import { createUserName } from '$stores/user';
	import { setModalClose } from '$stores/modal';
	import { insertToast } from '$stores/toast';
	import { connectSocketClient } from '$stores/socket';
	let value = '';
	let error = false;
	const handleSubmit = async (name) => {
		try {
			await createUserName(name);
			connectSocketClient()
			setModalClose();
			insertToast('success', '유저가 성공적으로 생성되었습니다.');
			value = '';
		} catch (err) {
			console.log(err);
			error = true;
		}
	};
</script>

<Modal modalId="create-user">
	<div slot="header">계정 생성</div>
	<Input {error} bind:value label="이름" />
	<div slot="bottom">
		<Button dataCy='createUserButton' on:click={() => handleSubmit(value)}>생성</Button>
	</div>
</Modal>
