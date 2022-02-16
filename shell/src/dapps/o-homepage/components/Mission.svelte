<script>
  import { _ } from "svelte-i18n";
</script>

<div class="w-full bg-white">
  <div
    class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 "
  >
    <div class="grid gap-10 lg:grid-cols-2">
      <div class="flex items-center justify-center px-16 -mx-4 lg:p-0 lg:pl-8">
        <img src="/images/homepage/male.png" alt="person" />
      </div>
      <div class="flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg">
        <div class="max-w-xl mb-6 ">
          <h2
            class="max-w-lg mb-6 text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none"
          >
            {$_("dapps.o-homepage.components.mission.yourPassionIsTheMotor")}
          </h2>
          <p class="text-base text-gray-600 md:text-lg">
            {$_("dapps.o-homepage.components.mission.byStarting")}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
