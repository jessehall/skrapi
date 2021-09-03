<!--
Material Design SVG Icons

Easily add and style any icons from the MDI library.

1. Install the icon paths.

   npm i @mdi/js


2. Import the path you want to use AND the Icon component

   import { mdiAccountCircle } from '@mdi/js';
   import Icon from 'components';


3. Use with supplied path property like this:

  <Icon path={mdiAccountCircle}/>


# NOTES

** Find icon names here: https://materialdesignicons.com/ **

- As with all nested Svelte components, there's currently no good way to define classes in a
parent component because the "unused" class in the parent will be tree-shaken.

- You can add inline styles including `color` and `width` to override color and size.
  <Icon path={mdiAccountCircle} style="color: red; width: 4rem;"/>

- The click event is also passed through so you can do this kind of thing:
	<Icon on:click={closeWindow} path={mdiClose} />

-->
<script>
	export let path;
	export let style = '';
	let _class = '';
	export { _class as class };
</script>

<svg
	{style}
	viewBox="0 0 24 24"
	fill="currentColor"
	class={_class}
	on:click
>
	<path d={path} />
</svg>
