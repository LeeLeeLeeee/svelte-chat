<script>
	import { modalStore } from '$stores/modal';
	import { onDestroy } from 'svelte';

	export let modalId = '';
	let isModal = false;
	const unsubscribe = modalStore.subscribe((status) => {
		isModal = status.isOpen && status.target === modalId;
	});
	onDestroy(() => {
		unsubscribe();
	});
</script>

<div
	id='container'
	class=" absolute border1 z-20 border-slate-700 shadow-md bg-white p-2 rounded-md {isModal
		? 'flex'
		: 'hidden'}"
>
	<div class="header border-b border-b-slate-200">
		<slot name='header'/>
	</div>
	<div class="content">
		<slot></slot>
	</div>
	<div class="bottom">
		<slot name='bottom'/>
	</div>
</div>

<style>
	div#container {
		min-width: 200px;
		min-height: 200px;
		left: 50%;
		top: 50%;
		flex-direction: column;
		justify-content: space-between;
		transform: translate(-50%, -50%);
		gap: 10px;
	}

	div > .header {

	}

	div > .content {
		flex: 1;
	}

	div > .bottom {
	}
</style>
