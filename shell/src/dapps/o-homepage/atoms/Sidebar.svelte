<script>
import { clickOutside } from "src/shared/functions/clickOutside.ts";
import Hamburger from "./Hamburger.svelte";
import Label from "../../../shared/atoms/Label.svelte";
import { Environment } from "../../../shared/environment";
export let open = false;

function handleClickOutside(event) {
  open = false;
}
</script>

<aside
  class="absolute z-40 h-full bg-gray-200 border-l-2 shadow-lg w-72 lg:hidden"
  class:open
  use:clickOutside
  on:click_outside="{handleClickOutside}">
  <nav class="z-50 mt-3 ml-1 lg:hidden">
    <Hamburger bind:open />
  </nav>
  <nav class="pt-16 pl-4 text-xl">
    <a href="/" class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      ><Label key="dapps.o-homepage.atoms.sidebar.home" /></a>

    <a
      href="{window.o.i18n('common.supportUrl')}"
      target="_blank"
      aria-label="Our product"
      title="Our product"
      class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      ><Label key="dapps.o-homepage.atoms.sidebar.chat" /></a>

    <a
      href="https://aboutcircles.com"
      target="_blank"
      aria-label="Our product"
      title="Our product"
      class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      ><Label key="dapps.o-homepage.atoms.sidebar.forum" /></a>

    <a
      href="https://blog.circles.land/"
      target="_blank"
      aria-label="About us"
      title="About us"
      class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      ><Label key="dapps.o-homepage.atoms.sidebar.blog" /></a>

    <a
      href="https://blog.circles.land/whitepaper/"
      target="_blank"
      aria-label="Sign in"
      title="Sign in"
      class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      ><Label key="dapps.o-homepage.atoms.sidebar.whitepaper" /></a>

    <!-- <a
      href="/#/citizens"
      class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      >Citizens</a
    >

    <a
      href="/#/countries"
      class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      >Countries</a
    >

    <a
      href="/#/milestones"
      class="block mb-10 font-bold tracking-wide transition-colors duration-200 hover:text-primary"
      >Milestones</a
    > -->
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
