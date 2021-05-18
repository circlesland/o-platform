<script>
  export let open = false;
</script>

<aside
  class="absolute w-72 h-full bg-gray-200 border-l-2 shadow-lg z-40 lg:hidden"
  class:open
>
  <nav class="pl-4 pt-16 text-xl">
    <a
      href="/"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Home</a
    >

    <a
      href="https://discord.gg/CS6xq7jECR"
      target="_blank"
      aria-label="Our product"
      title="Our product"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Chat</a
    >

    <a
      href="https://aboutcircles.com"
      target="_blank"
      aria-label="Our product"
      title="Our product"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Forum</a
    >

    <a
      href="https://circlesland.ghost.io/"
      target="_blank"
      aria-label="About us"
      title="About us"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Blog</a
    >

    <a
      href="https://circlesland.ghost.io/whitepaper/"
      target="_blank"
      aria-label="Sign in"
      title="Sign in"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Whitepaper</a
    >

    <a
      href="/#/citizens"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Citizens</a
    >

    <a
      href="/#/countries"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Countries</a
    >

    <a
      href="/#/milestones"
      class="block font-bold tracking-wide transition-colors duration-200 text-secondary hover:text-primary mb-10"
      >Milestones</a
    >
  </nav>
</aside>

<style>
  aside {
    left: -100%;
    transition: left 0.3s ease-in-out;
  }

  .open {
    left: 0;
  }
</style>
