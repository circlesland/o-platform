import Verifications from "./o-verification/pages/Verifications.svelte";
import VerificationDetail from "./o-verification/pages/VerificationDetail.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { ContactsDappState } from "./o-contacts.manifest";

const index: Page<any, ContactsDappState> = {
  routeParts: [],
  component: Verifications,
  title: "Verifications",
  type: "page",
};
const detail: Page<any, ContactsDappState> = {
  routeParts: [":id"],
  component: VerificationDetail,
  title: "Verifications",
  type: "page",
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
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, detail],
};
