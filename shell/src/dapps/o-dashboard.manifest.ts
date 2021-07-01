import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Home from "./o-dashboard/pages/Home.svelte";
import CreateHub from "./o-dashboard/pages/CreateHub.svelte";
import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
import ActionButtonComponent from "../shared/molecules/NextNav/Components/ActionButton.svelte";
import { logout } from "./o-passport/processes/logout";
import {
  shellProcess,
  ShellProcessContext,
} from "../shared/processes/shellProcess";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const index : Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Dashboard",
  type: "page"
};
const createHub : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["become-a-hub"],
  component: CreateHub,
  title: "Become a hub",
  type: "page"
};

export interface DappState {
  // put state here
}

export const dashboard: DappManifest<DappState> = {
  type: "dapp",
  dappId: "dashboard:1",
  isSingleton: true,
  isHidden: true,
  icon: faPeopleArrows,
  title: "Dashboard",
  routeParts: ["dashboard"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["actions"],
    items: (params, runtimeDapp) => {
      return [{
        key: "logout",
        label: "Logout",
        icon: "logout",
        event: new RunProcess<ShellProcessContext>(
            shellProcess,
            true,
            async (ctx) => {
              ctx.childProcessDefinition = logout;
              return ctx;
            }
        )
      }];
    }
  },
  navigation: {
    navPill: {
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
  routables: [index, createHub],
};
