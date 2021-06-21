<script>
  export let open = false;

</script>

<button
  class="z-50 mr-4 text-gray-500 border-none cursor-pointer hover:text-gray-700 focus:outline-none"
  class:open
  on:click={() => (open = !open)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-6 h-6 closed"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-6 h-6 open"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</button>

<style>
  svg {
    min-height: 24px;
    transition: transform 0.3s ease-in-out;
    transition: display 0.3s ease-in-out;
  }

  button {
    z-index: 20;
  }

  svg.open {
    display: none;
  }
  svg.closed {
    display: block;
  }
  .open svg.open {
    display: block;
  }
  .open svg.closed {
    display: none;
  }

</style>
