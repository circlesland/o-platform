import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import TakeASeat from "./o-homepage/pages/TakeASeat.svelte";
import CheckIn from "./o-homepage/pages/CheckIn.svelte";

const takeASeat: Page<any, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=take-a-seat", ":address", ":table"],
  component: TakeASeat,
  title: "Circles Land",
  icon: "home",
  type: "page",
};

const checkIn: Page<any, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=check-in", ":address"],
  component: CheckIn,
  title: "Circles Land",
  icon: "home",
  type: "page",
};

export interface DappState {
  // put state here
}

export const welcome: DappManifest<DappState> = {
  type: "dapp",
  dappId: "welcome:1",
  isSingleton: true,
  isHidden: true,
  icon: "home",
  anonymous: true,
  title: "Circles Land",
  routeParts: ["=welcome"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: false,
  isFullWidth: true,
  routables: [takeASeat, checkIn],
};
