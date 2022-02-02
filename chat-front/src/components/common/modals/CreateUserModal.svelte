<script>
	import Button from '../Button.svelte';
	import Modal from '../Modal.svelte';
	import Input from '../Input.svelte';
	import { createUserName } from '$stores/user';
	import { setModalClose } from '$stores/modal';
	import { setSocketClient } from '$stores/socket';
	let value = '';
	let error = false;
	const handleSubmit = async (name) => {
		try {
			await createUserName(name);
			setSocketClient(name)
			setModalClose();
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
		<Button on:click={() => handleSubmit(value)}>생성</Button>
	</div>
</Modal>
