import Home from "./o-homepage/pages/Home.svelte";

import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import { Environment } from "../shared/environment";
import Terms from "./o-homepage/pages/Terms.svelte";
import Privacy from "./o-homepage/pages/Privacy.svelte";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "common.support",
  icon: "chat",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => window.o.i18n("common.supportUrl"),
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

const terms: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  anonymous: true,
  title: "common.termsOfService",
  routeParts: ["=terms"],
  icon: "forum",
  component: Terms,
};

const privacy: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  anonymous: true,
  title: "common.privacyPolicy",
  routeParts: ["=privacy"],
  icon: "forum",
  component: Privacy,
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
  routables: [index, invite, login, terms, privacy, externalChat, externalForum],
};
