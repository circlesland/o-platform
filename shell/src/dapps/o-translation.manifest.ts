import Translations from "./o-translation/pages/Translations.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { ContactsDappState } from "./o-contacts.manifest";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { Environment } from "../shared/environment";
import { performOauth } from "./o-humanode/processes/performOauth";

const translations: Page<any, ContactsDappState> = {
  routeParts: [],
  component: Translations,
  title: "translations",
  type: "page",
};


export interface DappState {
  // put state here
}

export const translation: DappManifest<DappState> = {
  type: "dapp",
  dappId: "translation:1",
  isSingleton: true,
  isHidden: false,
  icon: "check",
  title: "translation",
  routeParts: ["=translation"],
  defaultRoute: ["translations"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: translation,
      cancelDependencyLoading: false,
    };
  },
  routables: [translations],
};
