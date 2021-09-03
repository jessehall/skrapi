<script>
  import { skrapi } from '$lib/utils';
  import "../app.postcss";
  import { Header, Footer } from '$lib/components';

  // Set the base url for skrapi to prepend to all requests.
  import config from '../../skrapi.config.json';
  skrapi.setUrl(config.apiUrl);
</script>

<Header />

<main>
  <slot />
</main>

<Footer />
