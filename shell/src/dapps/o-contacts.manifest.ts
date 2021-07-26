import Home from "./o-contacts/pages/Home.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Graph from "./o-contacts/pages/Graph.svelte";
import { init, tryGetCurrentSafe } from "./o-banking/init";
import { Unsubscriber } from "svelte/store";
import { mySafe } from "./o-banking/stores/safe";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { loadProfileByProfileId } from "./o-banking/data/loadProfileByProfileId";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { setTrust } from "./o-banking/processes/setTrust";

export interface DappState {
  // put state here
}

const profileJumplist: Jumplist<any, DappState> = {
  type: "jumplist",
  title: "Actions",
  isSystem: false,
  routeParts: ["=actions"],
  items: async (params, runtimeDapp) => {
    const getRecipientAddress = async () => {
      if (RpcGateway.get().utils.isAddress(params.id)) {
        return params.id;
      } else if (Number.isInteger(params.id)) {
        const profile = await loadProfileByProfileId(parseInt(params.id));
        if (profile) {
          return profile.circlesAddress;
        }
      }
      return undefined;
    };
    const getTrustState = () =>
      new Promise<number | undefined>((resolve, reject) => {
        let safeSub: Unsubscriber = undefined;
        safeSub = mySafe.subscribe((safe) => {
          if (!safe || !safe.trustRelations) {
            resolve(undefined);
            return;
          }
          if (safeSub) safeSub();

          const trustingSafe = Object.entries(
            safe.trustRelations.trusting
          ).find((o) => o[0] === recipientSafeAddress);
          if (!trustingSafe) {
            resolve(undefined);
            return;
          }

          resolve(trustingSafe[1].limit);
        });
      });

    const recipientSafeAddress = params.id
      ? await getRecipientAddress()
      : undefined;
    const trustState = params.id ? await getTrustState() : 0;

    return [
      {
        key: "setTrust",
        icon: "trust",
        title: trustState ? "Untrust" : "Trust",
        action: async () => {
          window.o.runProcess(setTrust, {
            trustLimit: trustState ? 0 : 100,
            trustReceiver: recipientSafeAddress,
            safeAddress: tryGetCurrentSafe().safeAddress,
            privateKey: localStorage.getItem("circlesKey"),
          });
        },
      },
    ];
  },
};

const index: Page<any, DappState> = {
  routeParts: [],
  component: Graph,
  title: "Network",
  icon: "network",
  type: "page",
  jumplist: profileJumplist,
};

export const contacts: DappManifest<DappState> = {
  type: "dapp",
  dappId: "friends:1",
  isSingleton: true,
  icon: "group",
  title: "Friends",
  routeParts: ["=friends"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index],
};
