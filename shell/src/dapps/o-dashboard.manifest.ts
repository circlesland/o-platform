import Home from "./o-dashboard/pages/Home.svelte";
import Invites from "./o-dashboard/pages/Invites.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import { push } from "svelte-spa-router";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { me } from "../shared/stores/me";
import { Profile } from "../shared/api/data/types";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Home",
  type: "page",
};
const invites: Page<any, DappState> = {
  routeParts: ["=invites"],
  component: Invites,
  isSystem: true,
  title: "Invites",
  position: "modal",
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
  routeParts: ["=home"],
  defaultRoute: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  featuredAction: async () => {
    let $me: Profile = null;
    me.subscribe((e) => ($me = e))();

    if ($me.__typename == "Profile") {
      return {
        text: "My Invites",
        icon: "",
        action: () => {
          push("/home/invites");
        },
      };
    }
  },

  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, invites, externalChat, externalForum],
};
