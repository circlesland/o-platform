<script>
  import { _ } from "svelte-i18n";
</script>

<div class="bg-white">
  <div
    class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    <div class="mx-auto mb-10 lg:max-w-xl sm:text-center">
      <p
        class="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider uppercase rounded-full text-primary bg-teal-accent-400">
        {$_("dapps.o-homepage.components.dreams.ourCitizens")}
      </p>
      <h2
        class="max-w-lg mb-6 text-3xl font-bold tracking-tight text-center sm:text-4xl sm:leading-none">
        {$_("dapps.o-homepage.components.dreams.followingTheirPassions")}
      </h2>
      <p class="text-base text-gray-700 md:text-lg">
        {$_("dapps.o-homepage.components.dreams.seePassionsOtherCitizens")}
      </p>
    </div>
    <div
      class="grid gap-10 mx-auto sm:grid-cols-2 lg:grid-cols-3 lg:max-w-screen-lg">
      <div>
        <div class="mb-4 text-center">
          <div class="inline-flex">
            <div class="w-64 h-64 rounded-full">
              <img
                class="rounded-full"
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=750"
                alt="
                " />
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:text-center">
          <p class="text-lg font-bold ">Oliver Aguilerra</p>
          <p class="mb-5 text-xs text-primary">Citizen 15 from Germany</p>
          <div class="flex items-center space-x-3 sm:justify-center">
            {$_("dapps.o-homepage.components.dreams.isDreaming")}
          </div>
        </div>
      </div>
      <div>
        <div class="mb-4 text-center">
          <div class="inline-flex">
            <div class="w-64 h-64 rounded-full">
              <img
                class="rounded-full"
                src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=750"
                alt="
                " />
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:text-center">
          <p class="text-lg font-bold ">Marta Clermont</p>
          <p class="mb-5 text-xs text-primary">Citizen 16 from France</p>
          <div class="flex items-center space-x-3 sm:justify-center">
            {$_("dapps.o-homepage.components.dreams.isDreaming")}
          </div>
        </div>
      </div>

      <div>
        <div class="mb-4 text-center">
          <div class="inline-flex">
            <div class="w-64 h-64 rounded-full">
              <img
                class="rounded-full"
                src="https://images.pexels.com/photos/3747435/pexels-photo-3747435.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=750"
                alt="
                " />
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:text-center">
          <p class="text-lg font-bold ">Alice Melbourne</p>
          <p class="mb-5 text-xs text-primary">Citizen 17 from Australia</p>
          <div class="flex items-center space-x-3 sm:justify-center">
            {$_("dapps.o-homepage.components.dreams.isDreaming")}
          </div>
        </div>
      </div>

      <div>
        <div class="mb-4 text-center">
          <div class="inline-flex">
            <div class="w-64 h-64 rounded-full">
              <img
                class="rounded-full"
                src="https://images.pexels.com/photos/3747435/pexels-photo-3747435.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=750"
                alt="
                " />
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:text-center">
          <p class="text-lg font-bold ">Doris Auer</p>
          <p class="mb-5 text-xs text-primary">Citizen 18 from Denmark</p>
          <div class="flex items-center space-x-3 sm:justify-center">
            {$_("dapps.o-homepage.components.dreams.isDreaming")}
          </div>
        </div>
      </div>

      <div>
        <div class="mb-4 text-center">
          <div class="inline-flex">
            <div class="w-64 h-64 rounded-full">
              <img
                class="rounded-full"
                src="https://images.pexels.com/photos/3747435/pexels-photo-3747435.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=750"
                alt="
                " />
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:text-center">
          <p class="text-lg font-bold ">John Doe</p>
          <p class="mb-5 text-xs text-primary">Citizen 19 from Nigeria</p>
          <div class="flex items-center space-x-3 sm:justify-center">
            {$_("dapps.o-homepage.components.dreams.isDreaming")}
          </div>
        </div>
      </div>

      <div>
        <div class="mb-4 text-center">
          <div class="inline-flex">
            <div class="w-64 h-64 rounded-full">
              <img
                class="rounded-full"
                src="https://images.pexels.com/photos/3747435/pexels-photo-3747435.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=750"
                alt="
                " />
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:text-center">
          <p class="text-lg font-bold ">Li Pon</p>
          <p class="mb-5 text-xs text-primary">Citizen 20 from Japan</p>
          <div class="flex items-center space-x-3 sm:justify-center">
            {$_("dapps.o-homepage.components.dreams.isDreaming")}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
