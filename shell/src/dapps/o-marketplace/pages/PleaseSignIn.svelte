<script lang="ts">
import { me } from "../../../shared/stores/me";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { _ } from "svelte-i18n";

export const status: string = undefined;

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader
  runtimeDapp="{runtimeDapp}"
  routable="{routable}"
  headerString="Please Sign In" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <section class="mx-4 mb-2 -mt-2">
    <div
      class="flex flex-col w-full px-3 py-2 space-x-2 bg-white rounded-lg shadow-md ">
      <div class="flex flex-col space-y-2">
        <div class="text-left">
          <h1>Please Sign In</h1>
          <p class="mt-4">
            In order to add this item to your cart you have to sign in.
          </p>
          <p class="mt-4">
            Please <a href="/" class="link link-primary">Sign In</a> and scan the
            QR Code again.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>
