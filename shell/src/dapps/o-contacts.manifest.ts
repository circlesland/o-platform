import ContactsView from "./o-contacts/pages/Contacts.svelte";
import ProfilePage from "./o-contacts/pages/Profile.svelte";
import Chat from "./o-contacts/pages/Chat.svelte";
import ChatDetail from "./o-contacts/pages/ChatDetail.svelte";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {me} from "../shared/stores/me";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {init} from "./o-banking/init";
import Graph from "./o-contacts/pages/Graph.svelte";
import {Jumplist, JumplistItem} from "@o-platform/o-interfaces/dist/routables/jumplist";
import {Contact, ContactDirection, EventType, Profile, ProfileOrigin,} from "../shared/api/data/types";
import {transfer} from "./o-banking/processes/transfer";
import {push} from "svelte-spa-router";
import {setTrust} from "./o-banking/processes/setTrust";
import {contacts as contactStore} from "../shared/stores/contacts";
import {Environment} from "../shared/environment";

export interface DappState {
  // put state here
}

const index: Page<any, DappState> = {
  routeParts: [],
  component: ContactsView,
  title: "Contacts",
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

async function chatAction(circlesAddress: string): Promise<JumplistItem> {
  return {
    key: "chat",
    icon: "chat",
    title: "Chat",
    action: async () => {
      push("#/contacts/chat/" + circlesAddress);
    },
  };
}

async function findContactActions(circlesAddress: string) {
  const recipientProfile: Contact = await contactStore.findBySafeAddress(circlesAddress);
  if (!recipientProfile) {
    return [];
  }

  const trustMetadata = recipientProfile.metadata.find((o) => o.name == EventType.CrcTrust);
  if (!trustMetadata && recipientProfile.contactAddress_Profile.origin == ProfileOrigin.CirclesGarden) {
    // No trust relation but a circles land profile
    return [
      await chatAction(circlesAddress)
    ];
  }

  const inTrustIndex = trustMetadata.directions.indexOf(ContactDirection.In);
  const trustsYou = inTrustIndex > -1
    ? parseInt(trustMetadata.values[inTrustIndex]) > 0
    : false;

  const outTrustIndex = trustMetadata.directions.indexOf(ContactDirection.Out);
  const youTrust = outTrustIndex > -1
    ? parseInt(trustMetadata.values[outTrustIndex]) > 0
    : false;

  const availableActions: JumplistItem[] = [];

  if (trustsYou) {
    // I can send circles to people who trust me
    availableActions.push({
      key: "sendCircles",
      title: "Send money",
      icon: "",
      action: () => {}
    });
  }
}

const profileJumplist: Jumplist<any, ContactsDappState> = {
  type: "jumplist",
  title: "Actions",
  isSystem: false,
  routeParts: ["=actions"],
  items: async (params, runtimeDapp) => {
    let $me: Profile = null;
    me.subscribe((e) => ($me = e))();

    let actions = [];

    if (params.id) {
      const recipientProfile: Contact = await contactStore.findBySafeAddress(
        params.id ?? $me.circlesAddress
      );
      const trustMetadata =
        recipientProfile?.metadata.find((o) => o.name == EventType.CrcTrust) ??
        undefined;
      let trustsYou = false;
      let youTrust = false;

      if (trustMetadata) {
        const inTrust = trustMetadata.directions.indexOf(ContactDirection.In);
        if (inTrust > -1) {
          const trustLimit = trustMetadata.values[inTrust];
          trustsYou = parseInt(trustLimit) > 0;
        }
        const outTrust = trustMetadata.directions.indexOf(ContactDirection.Out);
        if (outTrust > -1) {
          const trustLimit = trustMetadata.values[outTrust];
          youTrust = parseInt(trustLimit) > 0;
        }
      }

      if (recipientProfile?.contactAddress) {
        actions = actions.concat([
          {
            key: "chat",
            icon: "chat",
            title: "Chat",
            action: async () => {
              push("#/contacts/chat/" + recipientProfile.contactAddress);
            },
          },
        ]);
        if (
          recipientProfile.contactAddress_Profile &&
          recipientProfile.contactAddress_Profile.type == "PERSON"
        ) {
          actions = actions.concat(
            trustsYou
              ? [
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
              ]
              : [],
            youTrust
              ? [
                {
                  key: "setTrust",
                  icon: "untrust",
                  title: "Untrust",
                  colorClass: "text-alert",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 0,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: Environment.circlesHubAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
              : [
                {
                  key: "setTrust",
                  icon: "trust",
                  title: "Trust",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 100,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: Environment.circlesHubAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
          );
        }
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
              hubAddress: Environment.circlesHubAddress,
              privateKey: sessionStorage.getItem("circlesKey"),
            });
          },
        });
      }
    } else {
      actions = actions.concat({
        key: "setTrust",
        icon: "trust",
        title: "Trust new friend",
        action: async () => {
          window.o.runProcess(setTrust, {
            trustLimit: 100,
            safeAddress: $me.circlesAddress,
            hubAddress: Environment.circlesHubAddress,
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
  routeParts: ["=profile", ":id"],
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

export const contacts: DappManifest<DappState> = {
  type: "dapp",
  dappId: "contacts:1",
  isSingleton: true,

  icon: "group",
  title: "Contacts",
  routeParts: ["contacts"],
  defaultRoute: ["chat"],
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
      initialRoutable: chat,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, profile, chat, chatdetail],
};
