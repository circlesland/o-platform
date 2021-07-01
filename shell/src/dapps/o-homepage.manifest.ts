import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Home from "./o-homepage/pages/Home.svelte";
import Citizens from "./o-homepage/pages/Citizens.svelte";
import Countries from "./o-homepage/pages/Countries.svelte";
import Imprint from "./o-homepage/pages/Imprint.svelte";
import Milestones from "./o-homepage/pages/Milestones.svelte";
import Privacy from "./o-homepage/pages/Privacy.svelte";
import Tos from "./o-homepage/pages/Tos.svelte";
import Learn from "./o-homepage/pages/Learn.svelte";
import ActionButtonComponent from "../shared/molecules/NextNav/Components/ActionButton.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const login : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["login"],
  component: Home,
  title: "Circles Land",
  type: "page"
};
const index : Page<any, DappState> = {
  isSystem: true,
  routeParts: [""],
  component: Home,
  title: "Circles Land",
  type: "page"
};
const citizens : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["citizens"],
  component: Citizens,
  title: "Circles Land",
  type: "page"
};
const countries : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["countries"],
  component: Countries,
  title: "Circles Land",
  type: "page"
};
const imprint : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["imprint"],
  component: Imprint,
  title: "Circles Land",
  type: "page"
};
const milestones : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["milestones"],
  component: Milestones,
  title: "Circles Land",
  type: "page"
};
const privacy : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["privacy"],
  component: Privacy,
  title: "Circles Land",
  type: "page"
};
const tos : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["tos"],
  component: Tos,
  title: "Circles Land",
  type: "page"
};
const learn : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["learn"],
  component: Learn,
  title: "Circles Land",
  type: "page"
};

export interface DappState {
  // put state here
}

export const homepage: DappManifest<DappState> = {
  type: "dapp",
  dappId: "homepage:1",
  isSingleton: true,
  isHidden: true,
  icon: faPeopleArrows,
  title: "Circles Land",
  routeParts: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: false,
  isFullWidth: true,
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "list",
        action: "homemenu",
      },
    },
    loginPill: {
      isOpen: false,
      actionButton: {
        component: ActionButtonComponent, // action|
        props: {
          disabled: false,
        },
      },
    },
  },
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [
    index,
    citizens,
    countries,
    imprint,
    milestones,
    privacy,
    tos,
    learn,
    login,
  ]
};
