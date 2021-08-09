import Home from "./o-contacts/pages/Home.svelte";
import Contacts from "./o-contacts/pages/Contacts.svelte";
import ProfilePage from "./o-contacts/pages/Profile.svelte";
import ChatDetail from "./o-contacts/pages/ChatDetail.svelte";
import Chat from "./o-contacts/pages/Chat.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Profile } from "./o-banking/data/api/types";
import { me } from "../shared/stores/me";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { loadProfileByProfileId } from "./o-banking/data/loadProfileByProfileId";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { Unsubscriber } from "svelte/store";
import { mySafe } from "./o-banking/stores/safe";
import { setTrust } from "./o-banking/processes/setTrust";
import { transfer } from "./o-banking/processes/transfer";
import { init, tryGetCurrentSafe } from "./o-banking/init";
import Graph from "./o-contacts/pages/Graph.svelte";

const index: Page<any, DappState> = {
  routeParts: [],
  component: Graph,
  title: "Network",
  icon: "network",
  type: "page",
};
export interface DappState {
  // put state here
}

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
    const getRecipientAddress = async () => {
      if (RpcGateway.get().utils.isAddress(params.id)) {
        return params.id;
      } else if (Number.isInteger(params.id)) {
        const profile = await loadProfileByProfileId(parseInt(params.id));
        if (profile) {
          return profile.circlesAddress;
        }
      }
      return undefined;
    };
    const getTrustState = () =>
      new Promise<number | undefined>((resolve, reject) => {
        let safeSub: Unsubscriber = undefined;
        safeSub = mySafe.subscribe((safe) => {
          if (!safe || !safe.trustRelations) {
            resolve(undefined);
            return;
          }
          if (safeSub) safeSub();

          const trustingSafe = Object.entries(
            safe.trustRelations.trusting
          ).find((o) => o[0] === recipientSafeAddress);
          if (!trustingSafe) {
            resolve(undefined);
            return;
          }

          resolve(trustingSafe[1].limit);
        });
      });

    const recipientSafeAddress = params.id
      ? await getRecipientAddress()
      : undefined;
    const trustState = params.id ? await getTrustState() : 0;

    return [
      {
        key: "transfer",
        icon: "sendmoney",
        title: "Send Money",
        action: async () => {
          window.o.runProcess(transfer, {
            safeAddress: tryGetCurrentSafe().safeAddress,
            recipientAddress: recipientSafeAddress,
            privateKey: localStorage.getItem("circlesKey"),
          });
        },
      },
      {
        key: "setTrust",
        icon: "trust",
        title: trustState ? "Untrust" : "Trust",
        action: async () => {
          window.o.runProcess(setTrust, {
            trustLimit: trustState ? 0 : 100,
            trustReceiver: recipientSafeAddress,
            safeAddress: tryGetCurrentSafe().safeAddress,
            privateKey: localStorage.getItem("circlesKey"),
          });
        },
      },
    ];
  },
};

export const profile: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=profile", ":id"],
  title: "Profile",
  component: ProfilePage,
  jumplist: profileJumplist,
};

export const chatdetail: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=chat", ":id"],
  title: "Chat",
  component: ChatDetail,
  jumplist: profileJumplist,
};

const contacts: Page<any, ContactsDappState> = {
  routeParts: ["=contacts"],
  component: Contacts,
  title: "Contacts",
  icon: "friends",
  type: "page",
};

const chat: Page<any, ContactsDappState> = {
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
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    const myProfileResult = await new Promise<Profile>((resolve) => {
      me.subscribe((myProfile) => {
        resolve(myProfile);
      });
    });

    if (myProfileResult) {
      await init();
    }

    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, chat, contacts, profile, chatdetail],
};
