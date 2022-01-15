<div class="w-4/12 p-1 mx-auto h-full drop-shadow-md rounded-sm bg-white">
	<slot></slot>
</div>

<style lang="postcss" global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
	body {
		@apply font-noto-sans;
	}
</style>