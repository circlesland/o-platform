<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { _ } from "svelte-i18n";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

function loadCategoryPage(category: number) {
  return;
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="flex flex-col space-y-10">
    <section class="m-4 -mb-4 text-center">
      <h1>Welcome to the Market</h1>
      <span>Please choose your location</span>
    </section>
    <section class="flex items-start m-4 cursor-pointer rounded-xl">
      <div class="flex flex-col w-full ">
        <header class=" rounded-xl headerImageContainer">
          <div class="relative bg-white rounded-xl image-wrapper">
            <img
              src="https://cantstoptherock.de/utting2.jpg"
              alt="
                "
              class="w-full rounded-xl opacity-60" />
            <div
              class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
              <span class="inline-block">Alte Utting</span>
            </div>

            <div
              class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full cursor-pointer bottom-4 bg-alert-lightest has-tooltip">
              <span
                class="px-2 mt-12 text-sm bg-white rounded shadow-sm right-20 tooltip bottom-10">
                Find one of our friendly circlesland people to trust you for
                this shop.
              </span>
              You need to get trusted by this shop.
            </div>
          </div>
        </header>
      </div>
    </section>

    <section class="flex items-start m-4 cursor-pointer rounded-xl">
      <div class="flex flex-col w-full ">
        <header class=" rounded-xl headerImageContainer">
          <div class="relative rounded-xl image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1571974448718-ac26a9af7d8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4169&q=80"
              alt="
                "
              class="w-full rounded-xl" />
            <div
              class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
              <span class="inline-block">Circles.Land Shop</span>
            </div>
          </div>
        </header>
      </div>
    </section>
  </div>
</div>
