<script lang="ts">
import { identify } from "../../o-passport/processes/identify/identify2";

async function login() {
  window.o.runProcess(identify, { redirectTo: "/home" });
}
</script>

<nav class="relative flex items-center justify-center w-full lg:space-x-16">
  <ul class="flex items-center hidden space-x-8 lg:flex">
    <li>
      <a
        href="https://discord.gg/CS6xq7jECR"
        target="_blank"
        aria-label="Our product"
        title="Our product"
        class="font-bold tracking-wide transition-colors duration-200  hover:text-primary"
        >Chat</a>
    </li>
    <li>
      <a
        href="https://aboutcircles.com"
        target="_blank"
        aria-label="Our product"
        title="Our product"
        class="font-bold tracking-wide transition-colors duration-200  hover:text-primary"
        >Forum</a>
    </li>
  </ul>
  <a
    href="/"
    aria-label="Company"
    title="Company"
    class="inline-flex items-center h-10 md:h-12 ">
    <img src="/circles.png" alt="CirclesLAND" class="h-8 md:h-12" />
  </a>
  <ul class="flex items-center hidden space-x-8 lg:flex">
    <li>
      <a
        href="https://blog.circles.land/"
        target="_blank"
        aria-label="About us"
        title="About us"
        class="font-bold tracking-wide transition-colors duration-200  hover:text-primary"
        >Blog</a>
    </li>
    <li>
      <a
        href="https://blog.circles.land/whitepaper/"
        target="_blank"
        aria-label="Sign in"
        title="Sign in"
        class="font-bold tracking-wide transition-colors duration-200  hover:text-primary"
        >Whitepaper</a>
    </li>
  </ul>
  <div class="absolute right-0 self-center w-12 justify-self-end">
    <button class="btn-link" on:click="{login}">Log in</button>
  </div>
  <!-- Mobile menu -->
</nav>
