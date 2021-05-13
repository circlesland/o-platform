<script>
  import Navbar from "../atoms/Navigation.svelte";
  import Sidebar from "../atoms/Sidebar.svelte";

  let open = false;
</script>

<Sidebar bind:open />
<Navbar bind:sidebar={open} />
