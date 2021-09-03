<script>
	import { onMount } from 'svelte';

	export let value = '';
	export let placeholder = '';
	export let autofocus = false;

	let textareaEl;

	$: if (textareaEl && !value) {
		textareaEl.style.height = '5rem';
	} else if (textareaEl) {
		textareaEl.style.height = 'unset';
	}

	onMount(() => {
		if (autofocus) textareaEl.focus();
	});
</script>

<style>
	.input-grow {
		/* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
		display: grid;
	}
	.input-grow::after {
		/* Note the weird space! Needed to preventy jumpy behavior */
		content: attr(data-replicated-value) ' ';

		/* This is how textarea text behaves */
		white-space: pre-wrap;

		/* Hidden from view, clicks, and screen readers */
		visibility: hidden;
	}
	.input-grow > textarea {
		/* You could leave this, but after a user resizes, then it ruins the auto sizing */
		resize: none;

		/* Firefox shows scrollbar on growth, you can hide like this. */
		overflow: hidden;
	}
	.input-grow > textarea,
	.input-grow::after {
		/* Identical styling required!! */
		@apply border border-gray-300 shadow-inner p-2 mt-4;
		min-height: 5rem;

		/* Place on top of each other */
		grid-area: 1 / 1 / 2 / 2;
	}
</style>

<div class="input-grow">
	<textarea
		{placeholder}
		bind:value
		bind:this={textareaEl}
		onInput="this.parentNode.dataset.replicatedValue = this.value"
	/>
</div>
