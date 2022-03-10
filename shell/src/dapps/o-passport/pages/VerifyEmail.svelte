<script lang="ts">
import { me } from "../../../shared/stores/me";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { _ } from "svelte-i18n";

export let status: string = undefined;

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <!-- <section class="flex items-center justify-center mx-4 mb-2 -mt-2">
    <Card>
      <div class="text-xs font-bold text-left text-primary">EMAIL</div>
      <div class="flex items-center w-full space-x-2 bg-white sm:space-x-6">
        <div class="mr-2 text-center">{email}</div>
      </div>
    </Card>
  </section> -->
  <section class="mx-4 mb-2 -mt-2">
    <div
      class="flex flex-col w-full px-3 py-2 space-x-2 bg-white rounded-lg shadow-md ">
      <div class="flex flex-col space-y-2">
        <div class="text-left">
          {#if status && status == "success"}
            <h1>Thank you</h1>
            <p class="mt-4">
              Your Email address has been verified and changed.
            </p>
            <p class="mt-4">
              <a href="/#/home" class="link link-primary"
                >Go to the dashboard</a>
            </p>
          {:else if status && status == "failed"}
            <h1>Oops</h1>
            <p class="mt-4">Your Email address verification failed.</p>
            <p class="mt-4">
              It is possible that this link has expired.<br />
              Please note that you have to click the verification link within 24
              hours of receiving the email.
            </p>
            <p class="mt-4">
              Please <a href="/" class="link link-primary">Log in</a> and go to your
              Passport settings to enter your new Email address again to restart
              the verification process.
            </p>
          {/if}
        </div>
      </div>
    </div>
  </section>
</div>
