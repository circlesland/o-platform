<script lang="ts">
  import { transfer } from "../../o-banking/processes/transfer";
  import { setTrust } from "../../o-banking/processes/setTrust";
  import { mySafe } from "../../o-banking/stores/safe";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { invite } from "../../o-passport/processes/invite/invite";
  import { getCountryName } from "../../../shared/countries";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { upsertIdentityOnlyWhereDirty } from "../../o-passport/processes/upsertIdentity";
  import { me } from "../../../shared/stores/me";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import { loadProfileBySafeAddress } from "../../o-banking/data/loadProfileBySafeAddress";
  import { loadProfileByProfileId } from "../../o-banking/data/loadProfileByProfileId";
  import { onDestroy, onMount } from "svelte";
  import { Subscription } from "rxjs";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { Profile } from "../../o-banking/data/api/types";
  import DetailActionBar from "../../../shared/molecules/DetailActionBar.svelte";
  import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
  import { Page } from "@o-platform/o-interfaces/dist/routables/page";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import ChatCard from "../atoms/ChatCard.svelte";
  import "simplebar";
  import "simplebar/dist/simplebar.css";
  export let id: string;

  /*
  let jumplist: Jumplist<any, any> | undefined;
  */
  onMount(() => {
    /*
    if (nextRoutable.type === "page") {
      jumplist = (<Page<any, any>>nextRoutable).jumplist;
    } else {
      jumplist = undefined;
    }
     */
    shellEventSubscription = window.o.events.subscribe(
      async (event: PlatformEvent) => {
        if (event.type != "shell.refresh" || (<any>event).dapp != "banking:1") {
          return;
        }
        await loadProfile();
        // console.log("AWAIT LOADPRO");
      }
    );

    if (id) {
      isLoading = true;
      // console.log("LOADPRO IF CONTEXT");
      loadProfile();
    }
  });

  $: {
    if (id) {
      isLoading = true;
      // console.log("LOADPRO NOCHMAL");
      loadProfile();
    }
  }

  let shellEventSubscription: Subscription;

  onDestroy(() => shellEventSubscription.unsubscribe());

  let isEditable: boolean = false;
  let isLoading: boolean = true;
  let isMe: boolean = false;
  let name: string;

  let profile: {
    id?: number;
    dream?: string;
    country?: string;
    safeAddress?: string;
    displayName: string;
    avatarUrl?: string;
    avatarCid?: string;
    avatarMimeType?: string;
    firstName?: string;
    lastName?: string;
    circlesAddress?: string;
    circlesSafeOwner?: string;
    cityGeonameid?: number;
    city: any;
    // The incoming trust limit
    trustedBy?: number;
    // The outgoing trust limit
    trusting?: number;
  } = {};

  async function loadProfile() {
    // console.log("LOADING PROFILE!!!");
    if (!id) {
      console.warn(
        `No profile specified ('id' must contain safeAddress or profileId)`
      );
      return;
    }

    if (Number.parseInt(id) && !id.startsWith("0x")) {
      const profile = await loadProfileByProfileId(Number.parseInt(id));
      setProfile(profile);
    } else if (RpcGateway.get().utils.isAddress(id)) {
      const profile = await loadProfileBySafeAddress(id);
      setProfile(profile);
    } else {
      throw new Error(`id isn't an integer nor an eth address.`);
    }
    isMe = profile.id == ($me ? $me.id : 0);
    isLoading = false;
    name = profile.safeAddress;

    // console.log("PROFILE: ", profile);
  }

  function loadTrustRelation(
    safeAddress: string
  ): {
    trusting?: number;
    trustedBy?: number;
  } {
    safeAddress = RpcGateway.get().utils.toChecksumAddress(safeAddress);
    if (!$mySafe.trustRelations) {
      return {
        trusting: undefined,
        trustedBy: undefined,
      };
    }

    const trust: {
      trusting?: number;
      trustedBy?: number;
    } = {};

    const trusting = $mySafe.trustRelations.trusting[safeAddress];
    if (trusting) {
      trust.trusting = trusting.limit;
    }

    const trustedBy = $mySafe.trustRelations.trustedBy[safeAddress];
    if (trustedBy) {
      trust.trustedBy = trustedBy.limit;
    }

    return trust;
  }

  function setProfile(apiProfile: Profile) {
    const trust = apiProfile.circlesAddress
      ? loadTrustRelation(apiProfile.circlesAddress)
      : undefined;

    isEditable = $me && $me.id === apiProfile.id;

    if (!apiProfile.avatarUrl) {
      apiProfile.avatarUrl = AvataarGenerator.generate(
        apiProfile.circlesAddress
      );
    }

    profile = {
      id: apiProfile.id,
      avatarUrl: apiProfile.avatarUrl,
      dream: apiProfile.dream,
      country: apiProfile.country,
      safeAddress: apiProfile.circlesAddress,
      firstName: apiProfile.firstName,
      lastName: apiProfile.lastName,
      circlesAddress: apiProfile.circlesAddress,
      circlesSafeOwner: apiProfile.circlesSafeOwner,
      displayName: `${apiProfile.firstName} ${
        apiProfile.lastName ? apiProfile.lastName : ""
      }`,
      trusting: trust ? trust.trusting : undefined,
      trustedBy: trust ? trust.trustedBy : undefined,
      cityGeonameid: apiProfile.cityGeonameid,
      city: apiProfile.city,
    };
  }
</script>

{#if isLoading}
  <LoadingIndicator />
{:else}
  <div data-simplebar>
    <header class="grid place-content-center ">
      <div
        class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center">

        {#if profile && profile.safeAddress}
          <div class="mt-4 text-3xl tracking-wide uppercase font-heading">
            {profile ? (profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.firstName) : profile.safeAddress}
          </div>
        {/if}

      </div>
    </header>

    <div class="flex flex-col p-6 space-y-4">
      <ChatCard
        outgoing="{false}"
        name="Martina Köppelfrau"
        time="5min ago"
        image="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/"
        text="alksj fna skfn aksjdn flkasbflkasbflkasnfkjan" />

      <ChatCard
        name="Jakob Lund"
        time="10mins ago"
        image="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/"
        text="alksj fna skfn aksjdn flkasbflkasbflkasnfkjan skjfnas kfnaskjfnk
        asnfasfasfasfd alkjsdnf l" />

      <ChatCard
        name="Jakob Lund"
        time="15mins ago"
        image="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/"
        text="alksj fna skfn aksjdn flkasbflkasbflkasnfkjan skjfnas kfnaskjfnk
        asnfasfasfasfd alkjsdnf l asdkjna
        lskfnjaslfnkaslökfnaslkfnlkasnfölaksflkasmflkasflknasklfnaslkfnaslkfnlkasfnlka
        nsdkfnaslkfnakfnlaknsf" />

      <ChatCard
        outgoing="{false}"
        name="Martina Köppelfrau"
        time="30mins ago"
        image="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/"
        text="alksj fna skfn aksjdn flkasbflkasbflkasnfkjan" />

      <div class="flex flex-row order-1 w-full py-2 space-x-4 ">
        <div class="flex-grow">
          <input
            type="text"
            name="searchTerm"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            placeholder="message content"
            class="order-1 w-full input input-bordered text-dark"
            style="" />
        </div>
        <div>
          <button type="submit" class="btn btn-primary btn-square">
            <svg
              class="w-6"
              viewBox="0 0 23 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.5 15L15.5 11M15.5 11L11.5 7M15.5 11H7.5M21.5 11C21.5
                16.5228 17.0228 21 11.5 21C5.97715 21 1.5 16.5228 1.5 11C1.5
                5.47715 5.97715 1 11.5 1C17.0228 1 21.5 5.47715 21.5 11Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
