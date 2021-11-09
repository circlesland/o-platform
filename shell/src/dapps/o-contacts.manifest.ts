import Contacts from "./o-contacts/pages/Contacts.svelte";
import ProfilePage from "./o-contacts/pages/Profile.svelte";
import Chat from "./o-contacts/pages/Chat.svelte";
import ChatDetail from "./o-contacts/pages/ChatDetail.svelte";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {me} from "../shared/stores/me";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {init} from "./o-banking/init";
import Graph from "./o-contacts/pages/Graph.svelte";
import {Jumplist} from "@o-platform/o-interfaces/dist/routables/jumplist";
import {
  AggregatesDocument,
  AggregateType,
  Contact,
  ContactDirection,
  EventType,
  Profile,
  ProfileAggregateFilter,
} from "../shared/api/data/types";
import {transfer} from "./o-banking/processes/transfer";
import {push} from "svelte-spa-router";
import {setTrust} from "./o-banking/processes/setTrust";

export interface DappState {
  // put state here
}

const index: Page<any, DappState> = {
  routeParts: [],
  component: Contacts,
  title: "Friends",
  icon: "friends",
  type: "page",
};

export class ContactsDappState {
  /**
   * The currently displayed profile (e.g. in the profile detail)
   */
  currentProfileId?: number;
  /**
   * The address of the currently displayed safe (e.g. in the profile detail)
   */
  currentSafeAddress?: string;

  trusted?: boolean;
}

const profileJumplist: Jumplist<any, ContactsDappState> = {
  type: "jumplist",
  title: "Actions",
  isSystem: false,
  routeParts: ["=actions"],
  items: async (params, runtimeDapp) => {
    let $me:Profile = null;
    const unsub = me.subscribe(e => $me = e);
    unsub();

    const getRecipientProfile = async () => {
      const apiClient = await window.o.apiClient.client.subscribeToResult();
      const result = await apiClient.query({
        query: AggregatesDocument,
        variables: {
          safeAddress: $me.circlesAddress,
          filter: <ProfileAggregateFilter>{
            contacts: {
              addresses: [params.id]
            }
          },
          types: [
            AggregateType.Contacts
          ]
        }
      });

      if (result.errors?.length > 0) {
        throw new Error(`Couldn't read the contacts of safe ${$me.circlesAddress}: \n${result.errors
          .map((o) => o.message)
          .join("\n")}`);
      }

      const contactsList:Contact[] = result.data.aggregates[0].payload.contacts;
      console.log(contactsList);

      if (contactsList.length > 0)
        return contactsList[0];
      else
        return undefined;
    };

    const recipientProfile = params.id
      ? await getRecipientProfile()
      : undefined;

    console.log("recipientProfile:", recipientProfile)

    const trustMetadata = recipientProfile?.metadata.find(o => o.name == EventType.CrcTrust) ?? undefined;
    // let trustsYou = false;
    let youTrust = false;

    if (trustMetadata) {
      /*
      const inTrust = trustMetadata.directions.indexOf(ContactDirection.In);
      if (inTrust > -1) {
        const trustLimit = trustMetadata.values[inTrust];
        trustsYou = parseInt(trustLimit) > 0;
      }*/
      const outTrust = trustMetadata.directions.indexOf(ContactDirection.Out);
      if (outTrust > -1) {
        const trustLimit = trustMetadata.values[outTrust];
        youTrust = parseInt(trustLimit) > 0;
      }
    }

    let actions = [];

    if (recipientProfile?.contactAddress) {
      actions = actions.concat([
        {
          key: "transfer",
          icon: "sendmoney",
          title: "Send Money",
          action: async () => {
            window.o.runProcess(transfer, {
              safeAddress: $me.circlesAddress,
              recipientAddress: recipientProfile.contactAddress,
              privateKey: sessionStorage.getItem("circlesKey"),
            });
          },
        },
        {
          key: "chat",
          icon: "chat",
          title: "Chat",
          action: async () => {
            push("#/friends/chat/" + recipientProfile.contactAddress);
          },
        },
        youTrust
          ? {
              key: "setTrust",
              icon: "untrust",
              title: "Untrust",
              colorClass: "text-alert",
              action: async () => {
                window.o.runProcess(setTrust, {
                  trustLimit: 0,
                  trustReceiver: recipientProfile.contactAddress,
                  safeAddress: $me.circlesAddress,
                  privateKey: sessionStorage.getItem("circlesKey"),
                });
              },
            }
          : {
              key: "setTrust",
              icon: "trust",
              title: "Trust",
              action: async () => {
                window.o.runProcess(setTrust, {
                  trustLimit: 100,
                  trustReceiver: recipientProfile.contactAddress,
                  safeAddress: $me.circlesAddress,
                  privateKey: sessionStorage.getItem("circlesKey"),
                });
              },
            },
      ]);
    }

    if (!recipientProfile) {
      actions = actions.concat({
        key: "setTrust",
        icon: "trust",
        title: "Trust",
        action: async () => {
          window.o.runProcess(setTrust, {
            trustLimit: 100,
            safeAddress: $me.circlesAddress,
            privateKey: sessionStorage.getItem("circlesKey"),
          });
        },
      });
    }

    return actions;
  },
};

export const profile: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: [":id"],
  title: "Profile",
  component: ProfilePage,
};

const graph: Page<any, ContactsDappState> = {
  routeParts: ["=graph"],
  component: Graph,
  title: "Network",
  icon: "network",
  type: "page",
};

export const chatdetail: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=chat", ":id"],
  title: "Chat",
  component: ChatDetail,
};

export const chat: Page<any, ContactsDappState> = {
  routeParts: ["=chat"],
  component: Chat,
  title: "Chat",
  icon: "chat",
  type: "page",
};

export const friends: DappManifest<DappState> = {
  type: "dapp",
  dappId: "friends:1",
  isSingleton: true,
  icon: "group",
  title: "Friends",
  routeParts: ["=friends"],
  defaultRoute: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  jumplist: profileJumplist,
  hideFooter: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    const myProfileResult = await new Promise<Profile>((resolve) => {
      const unsub = me.subscribe((myProfile) => {
        resolve(myProfile);
      });
      unsub();
    });

    if (myProfileResult) {
      await init();
    }

    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [chat, chatdetail, profile],
};
