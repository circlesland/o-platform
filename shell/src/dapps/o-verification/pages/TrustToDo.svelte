<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import TrustToDoCard from "../atoms/TrustToDoCard.svelte";
  import {
    EventType,
    InvitationRedeemed, Profile,
    ProfileEvent,
    QueryEventsArgs,
    SortOrder,
    StreamDocument,
    TrustDirection,
    TrustRelation,
    TrustRelationsDocument,
    TrustRelationsQueryVariables,
  } from "../../../shared/api/data/types";
  import {me} from "../../../shared/stores/me";
  import {ApiClient} from "../../../shared/apiConnection";
  import {onMount} from "svelte";
  import {contacts} from "../../../shared/stores/contacts";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  const listArguments = {};
  let untrustedProfiles:Profile[] = [];

  async function load() {
    console.log("Address of deine mudda: ", $me.circlesAddress);

    const invitedPeople = await ApiClient.query<ProfileEvent, QueryEventsArgs>(StreamDocument, {
      safeAddress: $me.circlesAddress,
      types: [EventType.InvitationRedeemed],
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: new Date().toJSON()
      }
    });

    const invitedPeopleByAddresses = invitedPeople.reduce((p, c) => {
      const addr = (<InvitationRedeemed>c.payload).redeemedBy;
      const profile = (<InvitationRedeemed>c.payload).redeemedBy_profile;
      p[addr] = profile;
      return p;
    }, <{ [x: string]: Profile }>{})

    const trustRelations = await ApiClient.query<TrustRelation[], TrustRelationsQueryVariables>(TrustRelationsDocument, {
      safeAddress: $me.circlesAddress
    });

    const trustedAddresses = trustRelations.reduce((p, c) => {
      if (c.direction != TrustDirection.Out
        && c.direction != TrustDirection.Mutual) {
        return p;
      }
      p[c.otherSafeAddress] = true;
      return p;
    }, <{ [x: string]: any }>{});

    const untrustedPeople = Object.keys(invitedPeopleByAddresses).filter(o => !trustedAddresses[o]);
    untrustedProfiles = untrustedPeople.map(o => invitedPeopleByAddresses[o]);
  }

  onMount(() => {
    const sub = contacts.subscribe(() => {
      load();
    })

    return () => sub();
  });
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}"/>

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
    {#each untrustedProfiles as profile}
        <TrustToDoCard param={profile} />
    {/each}
</div>
