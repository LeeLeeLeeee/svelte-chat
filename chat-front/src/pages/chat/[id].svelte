<script>
	import GoSignOut from 'svelte-icons/go/GoSignOut.svelte';
	import GiBackup from 'svelte-icons/gi/GiBackup.svelte'
	import Button from '$components/common/Button.svelte';
	import Input from '$components/common/Input.svelte';
	import { time } from '$stores/time';
	import MyChatBox from '$components/chat/MyChatBox.svelte';
import OtherChatBox from '$components/chat/OtherChatBox.svelte';
</script>

<div class="flex flex-col h-full rounded-lg">
	<div class="border-b border-b-gray-300 p-2 flex justify-between items-center">
		<span>{$time}</span>
		<div class="icon"><GoSignOut /></div>
	</div>
	<div class="flex flex-col gap-3 flex-1 bg-amber-50-50 pt-2 pb-2 pl-3 pr-3 bg-zinc-100">
		<MyChatBox message={'안녕하세요'} />
		<MyChatBox message={'혹시 성함이 어떻게 되시나요?'} />
		<OtherChatBox message={'알아서 뭐하시게요??'} />
	</div>
	<div class="p-2 flex items-center">
		<div class="icon"><GiBackup /></div>
		<div class="border-l border-l-gray-400 m-1" />
		<Input class="flex-1" />
		<div class="border-l border-l-gray-400 m-1" />
		<Button>전송</Button>
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
