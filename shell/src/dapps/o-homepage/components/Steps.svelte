<script>
  import { _ } from "svelte-i18n";
</script>

<div class="bg-white">
  <div
    class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-48"
  >
    <div class="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
      <div>
        <p
          class="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider uppercase rounded-full text-primary"
        >
          {$_("dapps.o-homepage.components.steps.howDoesItWork")}
        </p>
      </div>
      <h2
        class="max-w-lg mb-6 text-3xl font-bold leading-none tracking-tight   sm:text-4xl md:mx-auto"
      >
        <span class="relative inline-block">
          <svg
            viewBox="0 0 52 24"
            fill="currentColor"
            class="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
          >
            <defs>
              <pattern
                id="bfcc89c7-3b4a-491a-bc7e-53e26502ff69"
                x="0"
                y="0"
                width=".135"
                height=".30"
              >
                <circle cx="1" cy="1" r=".7" />
              </pattern>
            </defs>
            <rect
              fill="url(#bfcc89c7-3b4a-491a-bc7e-53e26502ff69)"
              width="52"
              height="24"
            />
          </svg>
        </span>
          {$_("dapps.o-homepage.components.steps.becomeCitizen")}
      </h2>
      <p class="text-base text-gray-600 md:text-lg">
        {$_("dapps.o-homepage.components.steps.introducing")}
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 row-gap-8 lg:grid-cols-3">
      <div class="p-4 bg-white border rounded-lg shadow-2xl sm:text-center">
        <div
          class="flex items-center justify-center w-full px-8 py-12 sm:mx-auto"
        >
          <img src="/illustrations/passport.svg" alt="Passport" />
        </div>
        <h6 class="mt-8 mb-2 text-lg font-semibold leading-5 uppercase ">
          {$_("dapps.o-homepage.components.steps.createPassport")}
        </h6>
        <p class="max-w-md mb-3 text-sm text-gray-600 sm:mx-auto">
          {$_("dapps.o-homepage.components.steps.createPassportDescription")}
        </p>
      </div>
      <div class="p-4 bg-white border rounded-lg shadow-2xl sm:text-center ">
        <div
          class="flex items-center justify-center w-full px-16 py-4 mt-6 sm:mx-auto"
        >
          <img src="/illustrations/invite.svg" alt="Invite" />
        </div>
        <h6 class="mb-2 text-lg font-semibold leading-5 uppercase ">
          {$_("dapps.o-homepage.components.steps.getInvited")}
        </h6>
        <p class="max-w-md mb-3 text-sm text-gray-600 sm:mx-auto">
          {$_("dapps.o-homepage.components.steps.getInvitedDescription")}
        </p>
      </div>
      <div class="p-4 bg-white border rounded-lg shadow-2xl sm:text-center ">
        <div class="flex items-center justify-center w-full p-8 sm:mx-auto">
          <img src="/illustrations/ubi.svg" alt="Invite" />
        </div>
        <h6 class="mb-2 text-lg font-semibold leading-5 uppercase ">
          {$_("dapps.o-homepage.components.steps.unlockUbi")}
        </h6>
        <p class="max-w-md mb-3 text-sm text-gray-600 sm:mx-auto">
          {$_("dapps.o-homepage.components.steps.unlockUbiDescription")}
        </p>
      </div>
    </div>
  </div>
</div>
