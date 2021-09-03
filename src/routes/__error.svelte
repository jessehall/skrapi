<script context="module">
  export function load({ error, status }) {
    return {
      props: { error, status },
    };
  }
</script>

<script>
  export let error, status;
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="container md:px-24">
  <h1 class="font-bold my-40 tracking-tighter">
    <h2 class="text-brand-blue-light text-7xl">{status}</h2>
    <span class="text-4xl">{error.message}</span>
  </h1>
</div>
