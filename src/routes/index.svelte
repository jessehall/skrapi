<script>
  import {books} from '$lib/stores/books';
  books.load();
</script>

<svelte:head>
  <title>Skrapi</title>
</svelte:head>



<section class="container">
  <h2>
    Books
  </h2>
  <ul>
    {#each $books.data as book}
      <li>
        {book.name}
      </li>
    {/each}
  </ul>
</section>

