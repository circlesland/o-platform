import Contacts from "./o-contacts/pages/Contacts.svelte";
import ProfilePage from "./o-contacts/pages/Profile.svelte";
import ChatDetail from "./o-contacts/pages/ChatDetail.svelte";
import Chat from "./o-contacts/pages/Chat.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Profile } from "./o-banking/data/api/types";
import { me } from "../shared/stores/me";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { init} from "./o-banking/init";
import Graph from "./o-contacts/pages/Graph.svelte";

export interface DappState {
  // put state here
}


const index: Page<any, DappState> = {
  routeParts: [],
  component: Graph,
  title: "Network",
  icon: "network",
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

export const profile: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=profile", ":id"],
  title: "Profile",
  component: ProfilePage,
};

export const chatdetail: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=chat", ":id"],
  title: "Chat",
  component: ChatDetail,
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
