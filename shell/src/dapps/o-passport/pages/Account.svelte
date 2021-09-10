<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import Card from "src/shared/atoms/Card.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

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

<SimpleHeader {runtimeDapp} {routable} />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="mx-4 -mt-2">
    <section class="flex items-center justify-center mb-2">
      <Card>
        <div class="py-2 pt-4 mr-2 text-center">
          <div class="inline-flex">
            <div class="m-auto rounded-full w-14 h-14">
              <img
                class="rounded-full"
                src="{avatarUrl}"
                alt="{$me ? ($me.lastName ? `${$me.firstName} ${$me.lastName}` : $me.firstName) : 'avatar'}" />
            </div>
          </div>
        </div>
        <div class="flex flex-col items-start">
          <h2 class="mr-2 font-bold">
            {$me ? $me.firstName : 'Martin'}
            {$me && $me.lastName ? $me.lastName : ''}
          </h2>
        </div>
        <div class="flex justify-end flex-1 text-base-300">
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
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
          <h3 class="ml-2 mr-2 font-bold">UBI</h3>
        </div>
      </Card>
    </section>
  </div>
</div>
