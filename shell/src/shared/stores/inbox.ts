import {writable} from "svelte/store";
import {
  AcknowledgeDocument,
  Direction,
  EventType, LastAcknowledgedAtDocument, LastAcknowledgedAtQueryVariables,
  Organisation,
  OrganisationsByAddressDocument,
  OrganisationsByAddressQueryVariables,
  PaginationArgs,
  Profile,
  ProfileEvent,
  SortOrder,
  StreamDocument,
  StreamQueryVariables,
  TrustRelation,
  TrustRelationsDocument,
  TrustRelationsQueryVariables,
} from "../api/data/types";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {me} from "./me";
import {fSetTrust} from "../../dapps/o-banking/processes/setTrust";
import {ApiClient} from "../apiConnection";
import {Environment} from "../environment";

let events: ProfileEvent[] = [];
let following: boolean = false;

async function queryEvents(mySafeAddress: string) {
  // const sessionInfo = await me.getSessionInfo(true);
  let $me:Profile = null;
  me.subscribe(me => $me = me)();
  const safeAddress = $me.circlesAddress;

  const lastAcknowledgedAt = await ApiClient.query<string, LastAcknowledgedAtQueryVariables>(
    LastAcknowledgedAtDocument,
    {
      safeAddress: $me.circlesAddress
    }
  );

  let pagination: PaginationArgs = {
    order: SortOrder.Asc,
    limit: 100,
    continueAt: lastAcknowledgedAt ?? new Date(0).toJSON(),
  };

  return await ApiClient.query<ProfileEvent[], StreamQueryVariables>(
    StreamDocument,
    {
      safeAddress: mySafeAddress,
      pagination: pagination,
      filter: {
        direction: Direction.In,
      },
      types: [
        EventType.CrcHubTransfer,
        EventType.CrcMinting,
        EventType.CrcTrust,
        EventType.ChatMessage,
        EventType.CrcSignup,
        EventType.CrcTokenTransfer,
        // EventType.EthTransfer,
        // EventType.GnosisSafeEthTransfer,
        // EventType.InvitationCreated,
        EventType.InvitationRedeemed,
        EventType.MembershipOffer,
        EventType.MembershipAccepted,
        EventType.MembershipRejected,
        EventType.WelcomeMessage
      ],
    }
  );
}

const { subscribe, set, update } = writable<ProfileEvent[] | null>(
  null,
  function start(set) {
    set([]);

    const subscription = window.o.events.subscribe(
      async (
        event: PlatformEvent & {
          profile: Profile;
        }
      ) => {
        if (event.type == "shell.loggedOut") {
          set([]);
          return;
        }
        if ((<any>event).type == "follow_trust") {
          inbox.reload();
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "chat:1"
          });
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "friends:1"
          });
          return;
        }
        if ((<any>event).type == "blockchain_event") {
          inbox.reload();
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "chat:1"
          });
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "friends:1"
          });
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "banking:1"
          });
          return;
        } else if ((<any>event).type == "new_message") {
          inbox.reload();
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "chat:1"
          });
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "friends:1"
          });
          return;
        }
        if (event.type == "shell.authenticated") {
          inbox.reload();
          return;
        }
      }
    );

    return function stop() {
      subscription.unsubscribe();
    };
  }
);

export async function followTrust(profile: Profile | Organisation) {
  if (following) return;
  // Check the trust status of all members
  following = true;
  try {

    const orga = await ApiClient.query<Organisation[], OrganisationsByAddressQueryVariables>(OrganisationsByAddressDocument, {
      addresses: [profile.circlesAddress]
    });

    let allTrustRelations: any[] = [];

    if (!orga || !orga.length) {
      console.warn("Follow trust only works in organisation context.")
      return;
    }

    const orgaTrustRelations = await ApiClient.query<TrustRelation[], TrustRelationsQueryVariables>(TrustRelationsDocument, {
      safeAddress: profile.circlesAddress
    });

    const missingMemberTrusts: { [userAddress: string]: boolean } = {};
    const currentTrust: { [userAddress: string]: boolean } = {};
    const removeTrust: { [userAddress: string]: boolean } = {};
    const addTrust: { [userAddress: string]: boolean } = {};

    orga[0].members.forEach(m => {
      if (m.__typename == "Profile" && !m.verifications?.length) {
        return;
      }
      missingMemberTrusts[m.circlesAddress] = true;
    });

    orgaTrustRelations.forEach(t => {
      delete missingMemberTrusts[t.otherSafeAddress];
      removeTrust[t.otherSafeAddress] = true;
      currentTrust[t.otherSafeAddress] = true;
    });

    Object.keys(missingMemberTrusts).forEach(mmt => {
      addTrust[mmt] = true;
    });

    for (let member of orga[0].members) {
      if (member.__typename == "Profile" && !member.verifications?.length) {
        continue;
      }
      const memberTrustRelations = await ApiClient.query<TrustRelation[], TrustRelationsQueryVariables>(TrustRelationsDocument, {
        safeAddress: member.circlesAddress
      });
      const trusts = memberTrustRelations.filter(o => o.direction == "OUT" || o.direction == "MUTUAL");
      trusts.forEach(t => {
        if (!t.otherSafeAddressProfile.verifications?.length) {
          return;
        }
        delete removeTrust[t.otherSafeAddress];
        if (!currentTrust[t.otherSafeAddress]) {
          addTrust[t.otherSafeAddress] = true;
        }
      });
      allTrustRelations = [...allTrustRelations, ...trusts];
    }

    console.log("Add trust:", addTrust);
    console.log("Remove trust:", removeTrust);

    for (let address of Object.keys(removeTrust)) {
      console.log(`Removing trust to ${address}`);
      await fSetTrust({
        data: {
          safeAddress: profile.circlesAddress,
          trustLimit: 0,
          hubAddress: Environment.circlesHubAddress,
          trustReceiver: address,
          privateKey: sessionStorage.getItem("circlesKey")
        },
        messages: {},
        dirtyFlags: {},
        onlyThesePages: []
      });
    }
    for (let address of Object.keys(addTrust)) {
      console.log(`Adding trust to ${address}`);
      await fSetTrust({
        data: {
          safeAddress: profile.circlesAddress,
          trustLimit: 100,
          hubAddress: Environment.circlesHubAddress,
          trustReceiver: address,
          privateKey: sessionStorage.getItem("circlesKey")
        },
        messages: {},
        dirtyFlags: {},
        onlyThesePages: []
      });
    }
  } finally {
    following = false;
  }
}

export const inbox = {
  subscribe,
  reload: async () => {
    // If we're in an organisation context then find all trust changes of all members since the last update
    let profile: Profile|Organisation|null = null;
    me.subscribe(($me) => {
      profile = $me;
    })();

    if (!profile?.circlesAddress) {
      set([]);
      return;
    }
    events = await queryEvents(profile?.circlesAddress);
    set(events);

    /*
    await followTrust(profile);

    const orga = await ApiClient.query<Organisation[], OrganisationsByAddressQueryVariables>(OrganisationsByAddressDocument, {
      addresses: [profile.circlesAddress]
    });

    if (orga && orga.length) {
      console.log("Reloading in 30 sec.")
      setInterval(() => {
        if (following) {
          return;
        }
        window.location.reload();
      }, 30000);
    }*/
  },
  acknowledge: async (event: ProfileEvent) => {
    let $me:Profile;
    me.subscribe(me => $me = me)();
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    await apiClient.mutate({
      mutation: AcknowledgeDocument,
      variables: {
        safeAddress: $me.circlesAddress,
        until: new Date(event.timestamp).toJSON(),
      },
    });
    const e = events.find((o) => o.timestamp == event.timestamp);
    events.splice(events.indexOf(e), 1);
    update(() => events);
  },
};
