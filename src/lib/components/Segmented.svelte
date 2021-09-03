<script>
	// Ex:
	// <Segmented
	// 	bind:value={selected}
	// 	buttons={[
	// 		{ label: 'Clients', value: 'clients' },
	// 		{ label: 'Companies', value: 'companies' }
	// 	]}
	// />

	export let buttons = [];
	export let value = '';
</script>

<style>
	.active {
		@apply bg-gray-800 text-white;
	}
</style>

<div class="flex rounded bg-gray-300 overflow-hidden">
	{#each buttons as button}
		<button
			type="button"
			class="flex flex-1 items-center justify-center cursor-pointer text-gray-500 py-1 px-5"
			on:click={() => (value = button.value)}
			class:active={value == button.value}
		>
			{button.label}
		</button>
	{/each}
</div>
