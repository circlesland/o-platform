import Verifications from "./o-verification/pages/Verifications.svelte";
import VerificationDetail from "./o-verification/pages/VerificationDetail.svelte";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {ContactsDappState} from "./o-contacts.manifest";
import {Jumplist} from "@o-platform/o-interfaces/dist/routables/jumplist";
import {Profile} from "../shared/api/data/types";
import {me} from "../shared/stores/me";
import {UniquenessCheck} from "../shared/facetec/app";
import {Environment} from "../shared/environment";

const index: Page<any, ContactsDappState> = {
  routeParts: [],
  component: Verifications,
  title: "Verifications",
  type: "page",
};
const detail: Page<any, ContactsDappState> = {
  routeParts: [":id"],
  isSystem: true,
  component: VerificationDetail,
  title: "Verifications",
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
          action: async () => {
            const isUnique = await new UniquenessCheck().isFaceUniqueInGroup("f398jpwoef23rwfß3fiocöafawkpwf")
            console.log("IsUnique:", isUnique);
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
  isHidden: true,
  icon: "check",
  title: "verification",
  routeParts: [],
  defaultRoute: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  jumplist: verificationJumplist,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, detail],
};
