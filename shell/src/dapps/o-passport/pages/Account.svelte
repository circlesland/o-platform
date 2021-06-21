<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";

  $: me;

  let avatarUrl: string = "";
  $: {
    if ($me && $me.avatarUrl) {
      avatarUrl = $me.avatarUrl;
    } else if ($me) {
      avatarUrl = AvataarGenerator.generate($me.circlesAddress);
    } else {
      avatarUrl = AvataarGenerator.default();
    }
  }

</script>

<PassportHeader />
<div style="margin-top: -2.2rem;">
  <div class="mx-4 mt-4">
    <section class="flex items-center justify-center mb-2  -mt-10">
      <div
        class="flex items-center bg-white shadow px-4 w-full space-x-2 rounded-sm"
      >
        <div class="mr-2 py-2 pt-4 text-center">
          <div class="avatar">
            <div class="rounded-full w-14 h-14 m-auto">
              <img
                src={avatarUrl}
                alt={$me
                  ? $me.lastName
                    ? `${$me.firstName} ${$me.lastName}`
                    : $me.firstName
                  : "avatar"}
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col items-start">
          <h2 class="font-bold mr-2">
            {$me ? $me.firstName : "Martin"}
            {$me && $me.lastName ? $me.lastName : ""}
          </h2>
        </div>
        <div class="flex justify-end flex-1  text-base-300">
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg> -->
          <h3 class="font-bold mr-2 ml-2">UBI</h3>
        </div>
      </div>
    </section>
  </div>
</div>
