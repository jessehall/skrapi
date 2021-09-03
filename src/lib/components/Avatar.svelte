<script>
	export let img, size, alt;

	// Size can be a string like '36px' or '12rem'.
	// If it's just a number like '12', we'll treat it as a Tailwind spacing value.
	if (/^\d+$/.test(String(size))) {
		size = Number(size) / 4 + 'rem';
	}

	let _class = '';
	export { _class as class };
</script>

<div
	class="flex rounded-full overflow-hidden bg-gray-500 {_class}"
	style="height:{size}; width:{size}"
>
	{#if img}
		<img class="h-full w-full rounded-full m-auto" src={img} {alt} />
	{/if}
</div>
