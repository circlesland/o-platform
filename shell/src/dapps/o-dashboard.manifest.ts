import Home from "./o-dashboard/pages/Home.svelte";
import InviteLeaderboard from "./o-dashboard/pages/InviteLeaderboard.svelte";
import Monitor from "./o-dashboard/pages/Monitor.svelte";
import SharePersonalInvite from "./o-dashboard/pages/SharePersonalInvite.svelte";
import RedeemedInvitations from "./o-dashboard/pages/RedeemedInvitations.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";

import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: false,
  routeParts: [],
  component: Home,
  title: "Home",
  type: "page",
};
const monitor: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=monitor"],
  component: Monitor,
  title: "Monitoring",
  type: "page",
};
const invites: Page<any, DappState> = {
  routeParts: ["=invites"],
  component: RedeemedInvitations,
  isSystem: false,
  title: "You invited",
  position: "main",
  type: "page",
};

const sharePersonalInvite: Page<any, DappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=share"],
  title: "Share Profile",
  component: SharePersonalInvite,
};

const inviteLeaderboard: Page<any, DappState> = {
  routeParts: ["=leaderboard"],
  component: InviteLeaderboard,
  isSystem: false,
  title: "Invite Leaderboard",
  type: "page",
};

const externalChat: Link<any, DappState> = {
  type: "link",
  title: "Support",
  icon: "chat",
  routeParts: [],
  openInNewTab: true,
  url: () => "https://discord.gg/CS6xq7jECR",
};
const externalForum: Link<any, DappState> = {
  type: "link",
  title: "Forum",
  icon: "forum",
  routeParts: [],
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
  routeParts: [],
  openInNewTab: true,
  url: () => "https://blog.circles.land/",
};

const externalWhitepaper: Link<any, DappState> = {
  type: "link",
  title: "Whitepaper",
  icon: "whitepaper",
  routeParts: [],
  openInNewTab: true,
  url: () => "https://blog.circles.land/whitepaper/",
};

export interface DappState {
  // put state here
}

export const home: DappManifest<DappState> = {
  type: "dapp",
  dappId: "home:1",
  isSingleton: true,
  isHidden: true,
  icon: "dashboard",
  title: "Home",
  routeParts: ["home"],
  defaultRoute: [""],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  // featuredAction: async () => {
  //   let $me: Profile = null;
  //   me.subscribe((e) => ($me = e))();

  //   if ($me.__typename == "Profile") {
  //     return {
  //       text: "My Invites",
  //       icon: "",
  //       action: () => {
  //         push("/home/invites");
  //       },
  //     };
  //   }
  // },

  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, invites, inviteLeaderboard, sharePersonalInvite, externalChat, externalForum, monitor],
};
