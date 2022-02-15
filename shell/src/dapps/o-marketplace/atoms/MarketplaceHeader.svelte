<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  export let header: string = null;

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
</script>

<TopNav {runtimeDapp} {routable} />

<div
  class="flex flex-col items-stretch w-full text-white bg-cover h-60 justify-items-stretch bg-primary-dark"
  style="background-image: url(/images/common/nice-bg.jpg);">
  <div class="self-center block text-center">
    <div class="inline-flex">
      <div class="mb-4 rounded-full w-36 h-36">
        <!--<img
          class="rounded-full" 
          src={avatarUrl}
          alt={profile
            ? profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.firstName
            : "avatar"}
        />-->
      </div>
    </div>
    <div class="">
      <h2 class="text-2xl">{header ? header : 'Marketplace'}</h2>
    </div>
  </div>
</div>
