<script>
	/* --------------------------------------------------
	# Autocomplete

	Requires Attributes:
	- options: An array of objects which each have an _id property
	- display: The name of the object property to show in the menu.

	Example:

	const options = [
		{ _id: 123, name: 'Bob', age: 35 },
		{ _id: 234, name: 'Susan', age: 41 },
		{ _id: 345, name: 'Jane', age: 24 }
	]

	<Autocomplete
		options={options}
		display="name"
		bind:value={selectedEmployee}
	/>

	When an existing option is selected, the bound value exposed to the parent component will be the
	full object, like this:
	{ _id: 123, name: 'Bob', age: 35 }

	If a new value is entered, for example if the user typed in "Joe", theb the bound value would be:
	{ name: "Joe" }

	So then in the parent component, the presence of an _id can be checked to determine if this is a
	new entry or an existing one.

	/* ------------------------------------------------ */
	import { onMount } from 'svelte';
	export let value;

	onMount(() => {
		console.log('value:', value);
	});
</script>
