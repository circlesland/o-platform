import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-dashboard/pages/Home.svelte";
import CreateHub from "./o-dashboard/pages/CreateHub.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
import {shellProcess, ShellProcessContext} from "../shared/processes/shellProcess";
import {transfer} from "./o-banking/processes/transfer";

const index : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Dashboard",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};
const createHub : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["create-hub"],
  component: CreateHub,
  title: "Create a hub",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};


export interface DappState {
  // put state here
}

export const dashboard : DappManifest<DappState> = {
  dappId: "dashboard:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faPeopleArrows,
  title: "Dashboard",
  routeParts: ["dashboard"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  actions: [{
    key: "xats",
    label: "Featured xATS TokenSale Campaign",
    event: () => {
      return new RunProcess<ShellProcessContext>(
        shellProcess,
        true,
        async (ctx) => {
          ctx.childProcessDefinition = transfer;
          ctx.childContext = {
            data: {
              recipientAddress: "the-address-where-i-can-buy-stuff",
              tokens: {
                currency: {
                  key: "crc",
                  title: "Circles"
                },
                amount: "0"
              }
            }
          };
          return ctx;
        })
    }
  }],
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false
    };
  },
  pages: [index, createHub]
};