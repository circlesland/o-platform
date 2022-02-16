<script>
  import { _ } from "svelte-i18n";
</script>

<footer class="text-white bg-secondary-dark">
  <div
    class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8"
  >
    <div class="grid gap-10 row-gap-6 mb-8 xs:grid-cols-1 sm:grid-cols-4">
      <div>
        <img src="/circles.png" alt="CirclesLand" class="w-16" />
        <div class="mt-6 lg:max-w-sm">
          <p class="text-sm text-white">{$_("dapps.o-homepage.components.footer.beFree")}</p>
        </div>
      </div>
      <!-- <div>
        <p class="font-semibold tracking-wide text-gray-300 uppercase">
          {$_("dapps.o-homepage.components.footer.navigation")}
        </p>
        <ul class="mt-2 space-y-2">
          <li>
            <a
              href="/"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.home")}</a
            >
          </li>
          <li>
            <a
              href="/#/citizens"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.citizens")}</a
            >
          </li>
          <li>
            <a
              href="/#/countries"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.countries")}</a
            >
          </li>
          <li>
            <a
              href="/#/milestones"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.milestones")}</a
            >
          </li>
        </ul>
      </div> -->
      <div>
        <p class="font-semibold tracking-wide text-gray-300 uppercase">{$_("dapps.o-homepage.components.footer.links")}</p>
        <ul class="mt-2 space-y-2">
          <li>
            <a
              href="https://blog.circles.land/"
              target="_blank"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.blog")}</a
            >
          </li>
          <li>
            <a
              href="https://aboutcircles.com/"
              target="_blank"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.forum")}</a
            >
          </li>
          <li>
            <a
              href="https://discord.com/invite/CS6xq7jECR"
              target="_blank"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.chat")}</a
            >
          </li>
          <li>
            <a
              href="https://blog.circles.land/whitepaper/"
              target="_blank"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.whitepaper")}</a
            >
          </li>
        </ul>
      </div>
      <div>
        <p class="font-semibold tracking-wide text-gray-300 uppercase">
          {$_("dapps.o-homepage.components.footer.social")}
        </p>
        <div class="flex items-center mt-1 space-x-3">
          <a
            href="https://twitter.com/circlesland"
            class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="h-5">
              <path
                d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"
              />
            </svg>
          </a>
          <!-- <a
            href="/"
            class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
          >
            <svg viewBox="0 0 30 30" fill="currentColor" class="h-6">
              <circle cx="15" cy="15" r="4" />
              <path
                d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"
              />
            </svg>
          </a> -->
        </div>
        <ul class="mt-2 space-y-2">
          <li>
            <a
              href="https://blog.circles.land/terms-of-service/"
              target="_blank"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.termsOfService")}</a
            >
          </li>
          <li>
            <a
              href="https://blog.circles.land/privacy/"
              target="_blank"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.dataPrivacy")}</a
            >
          </li>
          <li>
            <a
              href="https://blog.circles.land//legal-notice/"
              target="_blank"
              class="text-white transition-colors duration-300 hover:text-deep-purple-accent-400"
              >{$_("dapps.o-homepage.components.footer.impressum")}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
