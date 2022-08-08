import Home from "./o-homepage/pages/Home.svelte";

import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import {Environment} from "../shared/environment";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "chat",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => Environment.supportUrl,
};
const externalForum: Link<any, DappState> = {
  type: "link",
  title: "common.forum",
  icon: "forum",
  routeParts: ["=forum"],
  openInNewTab: true,
  url: () => "https://aboutcircles.com/c/earth-circle-dao/13",
};
const login: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=login"],
  component: Home,
  title: "Circles Land",
  type: "page",
};

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Circles Land",
  icon: "home",
  type: "page",
};

const invite: Page<{ inviteCode: string }, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=invite", ":inviteCode"],
  component: Home,
  title: "Circles Land",
  type: "page",
};

export interface DappState {
  // put state here
}

export const homepage: DappManifest<DappState> = {
  type: "dapp",
  dappId: "homepage:1",
  isSingleton: true,
  isHidden: true,
  icon: "home",
  anonymous: true,
  title: "Circles Land",
  routeParts: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: false,
  isFullWidth: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [
    index,
    invite,
    login,
    externalChat,
    externalForum,
  ],
};
