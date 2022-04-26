import Verifications from "./o-verification/pages/Verifications.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import RecentProfiles from "./o-verification/pages/RecentProfiles.svelte";
import TrustToDo from "./o-verification/pages/TrustToDo.svelte";
import { ContactsDappState } from "./o-contacts.manifest";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { Environment } from "../shared/environment";
import { performOauth } from "./o-humanode/processes/performOauth";

const verifications: Page<any, ContactsDappState> = {
  routeParts: ["=verifications"],
  component: Verifications,
  title: "Verifications",
  type: "page",
};

const recentProfiles: Page<any, ContactsDappState> = {
  routeParts: ["=recentProfiles"],
  component: RecentProfiles,
  title: "Recent Profiles",
  type: "page",
};

const trustToDo: Page<any, ContactsDappState> = {
  routeParts: ["=trustToDo"],
  component: TrustToDo,
  title: "Trust Todo",
  type: "page",
};

const verificationJumplist: Jumplist<any, ContactsDappState> = {
  type: "jumplist",
  title: "Actions",
  isSystem: false,
  routeParts: ["=actions"],
  items: async (params, runtimeDapp) => {
    if (Environment.allowVerify) {
      return [
        {
          key: "verify-self",
          icon: "check",
          title: "Verify yourself",
          action: () => {
            window.o.runProcess(performOauth, {
              origin: "dashboard",
              successAction: () => {},
            });
          },
        },
      ];
    } else {
      return [];
    }
  },
};

export interface DappState {
  // put state here
}

export const verification: DappManifest<DappState> = {
  type: "dapp",
  dappId: "verification:1",
  isSingleton: true,
  isHidden: false,
  icon: "check",
  title: "verification",
  routeParts: ["=verification"],
  defaultRoute: ["verifications"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  jumplist: verificationJumplist,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: verifications,
      cancelDependencyLoading: false,
    };
  },
  routables: [verifications, recentProfiles, trustToDo],
};
