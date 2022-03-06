<script>
	export let title = '';
    export let dataCy = '';
	import { slide } from '$animations/slide';
</script>

<div
    data-cy='{dataCy}'
	on:click
	in:slide
	out:slide
	id="card"
	class={`
    border
    inline-flex
    pb-1 pt-1 pl-2 pr-2
    shadow-md
    rounded-md
    bg-white
    hover:translate-y-1
    transition-transform
    cursor-pointer
    ease-out
    items-center
    justify-center
    flex-col
    relative
`}
>
	<div class="text-left w-full flex-1">{title}</div>
	<slot name="content" />
</div>

<style>
	#card {
		width: 288px;
		height: 110px;
	}
</style>
