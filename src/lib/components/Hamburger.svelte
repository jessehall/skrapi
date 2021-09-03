<script>
  /*
  Use this in parent component with an on:click handler and pass menuOpen like this:

  let menuOpen = false;

  function toggleMenu() {
    # ...show mobile menu here.
    menuOpen = !menuOpen;
  }
  ...
  <Hamburger on:click={toggleMenu} {menuOpen} />
  */

  export let menuOpen;
</script>

<style>
  span {
    @apply block absolute rounded bg-white m-auto;
    transition: 0.25s ease-in-out;
    height: 2px;
  }
</style>

<div on:click class="lg:hidden ml-auto cursor-pointer">
  <div class="relative w-8 h-5 m-2 mr-0">
    <!-- Top line shinks to center and disappears on menu open -->
    <span class={"top-0" + (menuOpen ? " w-0 left-1/2" : " w-full left-0")} />

    <!-- Middle line 1 rotates to become part of X -->
    <span
      class="top-0 bottom-0 w-full m-auto"
      style={menuOpen ? "transform: rotate(45deg)" : "transform: rotate(0deg)"}
    />

    <!-- Middle line 2 (doubles up on top of line 1) rotates to become other part of X -->
    <span
      class="top-0 bottom-0 w-full m-auto"
      style={menuOpen ? "transform: rotate(-45deg)" : "transform: rotate(0deg)"}
    />

    <!-- Bottom line shrinks to center and disappears -->
    <span class={"bottom-0" + (menuOpen ? " w-0 left-1/2" : " w-full left-0")} />
  </div>
</div>
