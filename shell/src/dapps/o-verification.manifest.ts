import Verifications from "./o-verification/pages/Verifications.svelte";
import VerificationDetail from "./o-verification/pages/VerificationDetail.svelte";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {ContactsDappState} from "./o-contacts.manifest";
import {Jumplist} from "@o-platform/o-interfaces/dist/routables/jumplist";
import {UniquenessCheck} from "../shared/facetec/uniquenessCheck";
import {Environment} from "../shared/environment";
import {performOauth} from "./o-humanode/processes/performOauth";

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
            //const isUnique = await new UniquenessCheck().isFaceUniqueInGroup("f398jpwoef23rwfß3fiocöafawkpwf")
            //console.log("IsUnique:", isUnique);
            window.o.runProcess(performOauth, {
              origin: "dashboard",
              oauthRequest: {
                clientId: "1087329459459-3t3i510j124ni65r96g4fjoflnelnj3v.apps.googleusercontent.com",
                redirectUri: "https://localhost:5000/",
                scope: "https://www.googleapis.com/auth/drive",
                accessType: "offline",
                responseType: "code",
                prompt: "consent"
              },
              successAction: () => {

              },
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
