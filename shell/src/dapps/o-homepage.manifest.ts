import Home from "./o-homepage/pages/Home.svelte";
import Invite from "./o-homepage/pages/Invite.svelte";
import Citizens from "./o-homepage/pages/Citizens.svelte";
import Countries from "./o-homepage/pages/Countries.svelte";
import Imprint from "./o-homepage/pages/Imprint.svelte";
import Milestones from "./o-homepage/pages/Milestones.svelte";
import Privacy from "./o-homepage/pages/Privacy.svelte";
import Tos from "./o-homepage/pages/Tos.svelte";
import Learn from "./o-homepage/pages/Learn.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "Support",
  icon: "chat",
  routeParts: ["=chat"],
  openInNewTab: true,
  url: () => "https://discord.gg/CS6xq7jECR",
};
const externalForum: Link<any, DappState> = {
  type: "link",
  title: "Forum",
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

const externalBlog: Link<any, DappState> = {
  type: "link",
  title: "Blog",
  icon: "blog",
  routeParts: ["=blog"],
  openInNewTab: true,
  url: () => "https://blog.circles.land/",
};

const externalWhitepaper: Link<any, DappState> = {
  type: "link",
  title: "Whitepaper",
  icon: "whitepaper",
  routeParts: ["=whitepaper"],
  openInNewTab: true,
  url: () => "https://blog.circles.land/whitepaper/",
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

const citizens: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=citizens"],
  component: Citizens,
  title: "Circles Land",
  type: "page",
};
const countries: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=countries"],
  component: Countries,
  title: "Circles Land",
  type: "page",
};
const imprint: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=imprint"],
  component: Imprint,
  title: "Circles Land",
  type: "page",
};
const milestones: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=milestones"],
  component: Milestones,
  title: "Circles Land",
  type: "page",
};
const privacy: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=privacy"],
  component: Privacy,
  title: "Circles Land",
  type: "page",
};
const tos: Link<any, DappState> = {
  type: "link",
  routeParts: ["=tos"],
  title: "Terms of Service",
  openInNewTab: true,
  url: () => "https://coda.io/@circlesland/terms",
};

const learn: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=learn"],
  component: Learn,
  title: "Circles Land",
  type: "page",
};

export interface DappState {
  // put state here
}

export const homepage: DappManifest<DappState> = {
  type: "dapp",
  dappId: "homepage:1",
  noAuthentication: true,
  isSingleton: true,
  isHidden: true,
  icon: "home",
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
    citizens,
    countries,
    imprint,
    milestones,
    learn,
    login,
    externalChat,
    externalForum,
  ],
};
