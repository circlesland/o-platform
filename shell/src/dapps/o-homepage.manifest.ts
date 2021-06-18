import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Home from "./o-homepage/pages/Home.svelte";
import Citizens from "./o-homepage/pages/Citizens.svelte";
import Countries from "./o-homepage/pages/Countries.svelte";
import Imprint from "./o-homepage/pages/Imprint.svelte";
import Milestones from "./o-homepage/pages/Milestones.svelte";
import Privacy from "./o-homepage/pages/Privacy.svelte";
import Tos from "./o-homepage/pages/Tos.svelte";
import Learn from "./o-homepage/pages/Learn.svelte";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import ActionButtonComponent from "../shared/molecules/NextNav/Components/ActionButton.svelte";

const login: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["login"],
  component: Home,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const index: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: [""],
  component: Home,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const citizens: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["citizens"],
  component: Citizens,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const countries: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["countries"],
  component: Countries,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const imprint: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["imprint"],
  component: Imprint,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const milestones: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["milestones"],
  component: Milestones,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const privacy: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["privacy"],
  component: Privacy,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const tos: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["tos"],
  component: Tos,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const learn: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["learn"],
  component: Learn,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

export interface DappState {
  // put state here
}

export const homepage: DappManifest<DappState> = {
  dappId: "homepage:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faPeopleArrows,
  title: "Circles Land",
  routeParts: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: false,
  isFullWidth: true,
  actions: [],
  navigation: {
    loginPill: {
      isOpen: false,
      actionButton: {
        component: ActionButtonComponent, // action|
        props: {
          disabled: false,
          actions: ["login"],
        },
      },
    },
  },
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false,
    };
  },
  pages: [
    index,
    citizens,
    countries,
    imprint,
    milestones,
    privacy,
    tos,
    learn,
    login,
  ],
};
