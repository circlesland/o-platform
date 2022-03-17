<script lang="ts">
import { push } from "svelte-spa-router";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { NewUser, Profile, ProfileEvent } from "../../../shared/api/data/types";
import { setTrust } from "../../../dapps/o-banking/processes/setTrust";
import Button from "../../../shared/atoms/button/Button.svelte";
import ButtonContext from "../../../shared/atoms/button/buttonContext";
import { me } from "../../../shared/stores/me";
import { Environment } from "../../../shared/environment";

export let param: Profile;
export let event: ProfileEvent;

let buttonContext: ButtonContext;

$: {
  if (event && event.payload?.__typename == "NewUser") {
    const newUser = event.payload as NewUser;
    param = newUser.profile;
  }

  buttonContext = {
    label: "Trust",
    color: "primary",
    style: "square",
    action: async () => {
      window.o.runProcess(setTrust, {
        trustLimit: 0,
        trustReceiver: param.circlesAddress,
        safeAddress: $me.circlesAddress,
        hubAddress: Environment.circlesHubAddress,
        privateKey: sessionStorage.getItem("circlesKey"),
      });
    },
  };
}

function loadDetailPage(path) {
  push(`#/contacts/profile/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(param.circlesAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: param,
      title: param.displayName,
      subTitle: 'verification unknown',
    }}">
    <div slot="itemCardBody" class="w-full">
      <div class="flex-col flex-grow">
        <div
          class="flex flex-row items-center justify-between text-left"
          class:px-3="{param.avatarUrl}">
          <div class="flex-grow min-w-0">
            <h2
              class="overflow-hidden text-base whitespace-nowrap overflow-ellipsis">
              {param.displayName}
            </h2>
          </div>
          <div class="self-end pl-2 mt-4 text-right whitespace-nowrap">
            <Button context="{buttonContext}" />
          </div>
        </div>
        <div class="flex flex-row items-center justify-between px-3 text-left">
          <div class="flex-grow leading-none">
            <span class="inline-block text-xs text-dark-lightest">
              <!-- <Time timestamp="{param.crea}" format="D. MMMM YYYY HH:mm" /> -->
            </span>
          </div>
          <div
            class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
            <slot name="itemCardEndSmallElement" />
          </div>
        </div>
      </div>
    </div>
  </ItemCard>
</div>
