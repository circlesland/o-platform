<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { _ } from "svelte-i18n";
import { me } from "../../../shared/stores/me";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { contacts } from "../../../shared/stores/contacts";
import { ApiClient } from "../../../shared/apiConnection";
import {
  QueryTrustRelationsArgs,
  TrustRelationsDocument,
  TrustRelation,
} from "../../../shared/api/data/types";
import { inbox } from "../../../shared/stores/inbox";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let allowUtting: any = false;
let allowBasicIncome: any = false;

async function loadOrga(id) {
  if (!id) {
    return null;
  }

  let result = await ApiClient.query<TrustRelation[], QueryTrustRelationsArgs>(
    TrustRelationsDocument,
    {
      safeAddress: id,
    }
  );
  return result.filter((o) => o.otherSafeAddress == $me.circlesAddress).length;
}
function loadLocationPage(route: string) {
  push(`#/marketplace/${route}`);
}
$: {
  if ($inbox.length) {
    console.log("hallo, thorsten");
  }
  /* Don't hate, we'll do this better. very soon... promise... */
  loadOrga("0x29335ee3eee0eace4dbc3fc9e2b16be0261ce653").then(
    (e) => (allowUtting = e)
  );
  loadOrga("0xc5a786eafefcf703c114558c443e4f17969d9573").then(
    (e) => (allowBasicIncome = e)
  );
}
console.log(allowUtting);
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="flex flex-col space-y-10">
    <section class="m-4 -mb-4 text-center">
      <h1>Welcome to the Market</h1>
      <span>Please choose your location</span>
    </section>
    <!-- <section
      class="flex items-start m-4 rounded-xl"
      class:cursor-pointer="{allowUtting}"
      on:click="{() =>
        allowUtting
          ? loadLocationPage('list/0x29335ee3eee0eace4dbc3fc9e2b16be0261ce653')
          : null}">
      <div class="flex flex-col w-full ">
        <header class=" rounded-xl headerImageContainer">
          <div class="relative bg-white rounded-xl image-wrapper">
            <img
              src="/images/market/utting.jpg"
              alt="
                "
              class="w-full rounded-xl opacity-60"
              class:opacity-60="{!allowUtting}" />
            <div
              class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
              <span class="inline-block">Alte Utting</span>
            </div>

            <div
              class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full cursor-pointer bottom-4 bg-alert-lightest has-tooltip"
              class:hidden="{allowUtting}">
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
    </section> -->

    <section
      class="flex items-start m-4 rounded-xl"
      class:cursor-pointer="{allowBasicIncome}"
      on:click="{() =>
        allowBasicIncome
          ? loadLocationPage(
              'market/0xc5a786eafefcf703c114558c443e4f17969d9573'
            )
          : null}">
      <div class="flex flex-col w-full ">
        <header class=" rounded-xl headerImageContainer">
          <div class="relative rounded-xl image-wrapper">
            <img
              src="/images/market/circlesShop.jpg"
              alt="
                "
              class="w-full rounded-xl"
              class:opacity-60="{!allowBasicIncome}" />
            <div
              class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
              <span class="inline-block">Circles.Land Shop</span>
            </div>
            <div
              class="absolute right-0 py-2 pl-4 pr-1 mt-2 text-xs rounded-l-full cursor-pointer bottom-4 bg-alert-lightest has-tooltip"
              class:hidden="{allowBasicIncome}">
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
  </div>
</div>
