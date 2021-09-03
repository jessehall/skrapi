<script>
  import { onMount } from 'svelte';
  import Hamburger from './Hamburger.svelte';
  import links from '$lib/data/nav.json';

  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
}

  function closeMenu() {
    menuOpen = false;
  }

  onMount(() => {
    window.onresize = (e) => {
      if (menuOpen && e.target.outerWidth >= 1024) closeMenu();
    };
  });
</script>

<style>
  nav.desktop a {
    @apply text-white mx-2 px-2 py-2 font-light select-none;
  }
  :global(nav.desktop a.active),
  nav.desktop a:hover {
    @apply underline;
  }
  nav.mobile {
    transition: transform .2s ease-in-out;
    transform-origin: top;
  }
  nav.mobile a {
    @apply block text-white text-lg font-light mb-10 pb-3 border-b border-gray-600;
  }
</style>

<header class="fixed w-full z-50 h-16 md:h-20 bg-indigo-800">
  <div class="container flex items-center h-full">
    <!-- Logo -->
    <a class="text-indigo-50" href="/" on:click={closeMenu}>
      <svg style="width: 4rem; height:4rem" viewBox="0 0 24 24">
        <path fill="currentColor" d="M16 12C16 10.9 16.9 10 18 10S20 10.9 20 12 19.1 14 18 14 16 13.1 16 12M10 12C10 10.9 10.9 10 12 10S14 10.9 14 12 13.1 14 12 14 10 13.1 10 12M4 12C4 10.9 4.9 10 6 10S8 10.9 8 12 7.1 14 6 14 4 13.1 4 12M13 18C13 16.9 13.9 16 15 16S17 16.9 17 18 16.1 20 15 20 13 19.1 13 18M7 18C7 16.9 7.9 16 9 16S11 16.9 11 18 10.1 20 9 20 7 19.1 7 18M13 6C13 4.9 13.9 4 15 4S17 4.9 17 6 16.1 8 15 8 13 7.1 13 6M7 6C7 4.9 7.9 4 9 4S11 4.9 11 6 10.1 8 9 8 7 7.1 7 6" />
      </svg>
    </a>

    <!-- Desktop Nav -->
    {#if !menuOpen}
      <nav class="desktop hidden lg:flex items-center p-1 m-0 ml-8 text-lg">
        {#each links as link}
          <a href={link.slug}>{link.name}</a>
        {/each}
      </nav>
    {/if}

    <Hamburger on:click={toggleMenu} {menuOpen} />
  </div>

  <!-- Mobile menu will animate when menuOpen is set to true. -->
  <nav
    class:open={menuOpen}
    class="mobile inset-0 absolute mt-16 md:mt-20 pt-8 px-10 h-screen z-40 bg-gray-800"
    style={ menuOpen ? 'transform: scaleY(1)' : 'transform: scaleY(0)'}
  >
    {#each links as link}
      <a href={link.slug} on:click={closeMenu}>
        {link.name}
      </a>
    {/each}
  </nav>
</header>
