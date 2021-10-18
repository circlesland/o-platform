import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { me } from "../shared/stores/me";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { init} from "./o-banking/init";
import ChatDetail from "./o-chat/pages/ChatDetail.svelte";
import Chat from "./o-chat/pages/Chat.svelte";
import {Profile} from "../shared/api/data/types";

export interface DappState {
  // put state here
}

export class ChatDappState {
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

export const chatdetail: Page<any, ChatDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: [":id"],
  title: "Chat",
  component: ChatDetail,
};

const index: Page<any, ChatDappState> = {
  routeParts: [],
  component: Chat,
  title: "Chat",
  icon: "chat",
  type: "page",
};

export const chat: DappManifest<DappState> = {
  type: "dapp",
  dappId: "chat:1",
  isSingleton: true,
  icon: "group",
  title: "Chat",
  routeParts: ["=chat"],
  defaultRoute: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
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
  routables: [index, chatdetail],
};
