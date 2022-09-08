<script lang="ts">
import Label from "./Label.svelte";

export let heading: string = "";
</script>

<header class="p-5 pb-6 overflow-hidden text-white bg-cpurple" style="border-radius: 0 0% 85% 69% / 0% 0% 85% 83%; ">
  <div class="w-full text-center">
    <h1 class="text-3xl uppercase  font-heading">
      <Label key="{heading}" />
    </h1>
  </div>
</header>
