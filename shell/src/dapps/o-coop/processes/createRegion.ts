import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import { promptFile } from "../../../shared/api/promptFile";
import { promptCity } from "../../../shared/api/promptCity";
import {
  Profile,
  UpsertRegionDocument,
} from "../../../shared/api/data/types";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { me } from "../../../shared/stores/me";
import { GnosisSafeProxyFactory } from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { BN } from "ethereumjs-util";

export type CreateRegionContextData = {
  successAction: (data: CreateRegionContextData) => void;
  id: number | undefined;
  avatarMimeType: "image/png";
  avatarUrl: string;
  circlesAddress: string;
  cityGeonameid: string;
  description: string;
  name: string;
  organisationSafeProxy: GnosisSafeProxy;
};

export type CreateRegionContext = ProcessContext<CreateRegionContextData>;

/**
 * Sends the specified "amount".
 */
async function sendFundsFromEoa(to: string, amount: BN) {
  let $me: Profile = null;
  const unsub = me.subscribe((current) => {
    $me = current;
  });
  unsub();

  if (!$me) throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notLoggedOn"));
  if (!$me.circlesSafeOwner) throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.noEoa"));

  const privateKey = sessionStorage.getItem("circlesKey");
  if (!privateKey) {
    throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notUnlockedKey"));
  }

  const web3 = RpcGateway.get();
  const eoaBalance = new BN(await web3.eth.getBalance($me.circlesSafeOwner));
  const gas = 41000;
  const gasPrice = new BN(await web3.eth.getGasPrice());
  const totalFee = gasPrice.mul(new BN(gas.toString()));
  const nonce = await web3.eth.getTransactionCount($me.circlesSafeOwner);

  const availableForTransfer = eoaBalance.sub(totalFee);
  if (availableForTransfer.lt(amount)) {
    throw new Error(
      `${window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notEnoughPart1")}'${
        $me.circlesSafeOwner
      }'${window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notEnoughPart2")}${web3.utils.fromWei(
        availableForTransfer,
        "ether"
      )}`
    );
  }

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const signedTx = await account.signTransaction({
    from: $me.circlesSafeOwner,
    to: to,
    value: amount,
    gasPrice: gasPrice,
    gas: gas,
    nonce: nonce,
  });

  if (!signedTx?.rawTransaction) {
    throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.couldNotSendInvitation"));
  }

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(receipt);
}

/**
 * Sends the specified "amount".
 */
async function sendFundsFromSafe(to: string, amount: BN) {
  let $me: Profile = null;
  const unsub = me.subscribe((current) => {
    $me = current;
  });
  unsub();

  if (!$me) throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notLoggedOn"));
  if (!$me.circlesSafeOwner) throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.noEoa"));

  const privateKey = sessionStorage.getItem("circlesKey");
  if (!privateKey) {
    throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notUnlockedKey"));
  }

  const web3 = RpcGateway.get();
  const eoaBalance = new BN(await web3.eth.getBalance($me.circlesAddress));
  const gas = 41000;
  const gasPrice = new BN(await web3.eth.getGasPrice());
  const totalFee = gasPrice.mul(new BN(gas.toString()));
  const nonce = await web3.eth.getTransactionCount($me.circlesAddress);

  const availableForTransfer = eoaBalance.sub(totalFee);
  if (availableForTransfer.lt(amount)) {
    throw new Error(
      `${window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notEnoughPart1")}${
        $me.circlesAddress
      }'${window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notEnoughPart2")}${web3.utils.fromWei(
        availableForTransfer,
        "ether"
      )}`
    );
  }

  const proxy = new GnosisSafeProxy(web3, $me.circlesAddress);
  const receipt = await proxy.transferEth(privateKey, amount, to);
  console.log(receipt);
}

const processDefinition = (processId: string) =>
  createMachine<CreateRegionContext, any>({
    id: `${processId}:createOrganisation`,
    initial: "name",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateRegionContext, any>("error"),

      name: prompt<CreateRegionContext, any>({
        id: "name",
        field: "name",
        component: TextEditor,
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.name.title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.name.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.name.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.name.submitButtonText"),
          },
        },
        dataSchema: yup.string().required(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.name.enterOrganisationName")),
        navigation: {
          next: "#country",
        },
      }),
      country: promptCity<CreateRegionContext, any>({
        id: "country",
        field: "cityGeonameid",
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.country.title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.country.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.country.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.country.submitButtonText"),
          },
        },
        navigation: {
          next: "#description",
          previous: "#name",
          canSkip: () => true,
        },
      }),
      description: prompt<CreateRegionContext, any>({
        field: "description",
        component: TextareaEditor,
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.description.title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.description.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.description.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.description.submitButtonContext"),
          },
        },
        dataSchema: yup
          .string()
          .nullable()
          .notRequired()
          .max(150, window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.description.maxChars")),
        navigation: {
          next: "#avatarUrl",
          canSkip: () => true,
          previous: "#country",
        },
      }),
      avatarUrl: promptFile<CreateRegionContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          //context.data.avatarUrl = event.data?.url;
          //context.data.avatarMimeType = event.data?.mimeType;
        },
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.avatar,title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.avatar.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.avatar.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionContext.avatar.submitButtonText"),
          },
        },
        navigation: {
          next: "#checkDeploy",
          previous: "#description",
          canSkip: () => true,
        },
      }),
      checkDeploy: {
        id: "checkDeploy",
        always: [
          {
            cond: () => true,
            target: "#deployOrganisation",
          },
          {
            cond: () => false,
            target: "#upsertRegion",
          },
        ],
      },
      deployOrganisation: {
        id: "deployOrganisation",
        entry: () => console.log(`deployOrganisation ...`),
        invoke: {
          src: async (context) => {
            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionsContext.deployOrganisation.notUnlockedKey"));
            }

            let $me: Profile = null;
            const unsub = me.subscribe((current) => {
              $me = current;
            });
            unsub();

            if (!$me?.circlesAddress) {
              throw new Error(
                window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.createRegionsContext.deployOrganisation.needFullAccountSetup")
              );
            }

            const proxyFactory = new GnosisSafeProxyFactory(
              RpcGateway.get(),
              "__SAFE_PROXY_FACTORY_ADDRESS__",
              "__SAFE_ADDRESS__"
            );

            context.data.organisationSafeProxy =
              await proxyFactory.deployNewSafeProxy(privateKey);
            context.data.circlesAddress =
              context.data.organisationSafeProxy.address;

            console.log(context.data.organisationSafeProxy);
          },
          onDone: "#fundOrganisation",
          onError: {
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
            target: "#showError",
          },
        },
      },
      fundOrganisation: {
        id: "fundOrganisation",
        entry: () => console.log(`fundOrganisation ...`),
        invoke: {
          src: async (context, event) => {
            let $me: Profile = null;
            const unsub = me.subscribe((current) => {
              $me = current;
            });
            unsub();

            await sendFundsFromSafe(
              context.data.organisationSafeProxy.address,
              new BN(RpcGateway.get().utils.toWei("0.01", "ether"))
            );
          },
          onDone: "#signupOrganisation",
          onError: {
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
            target: "#showError",
          },
        },
      },
      signupOrganisation: {
        id: "signupOrganisation",
        entry: () => console.log(`signupOrganisation ...`),
        invoke: {
          src: async (context, event) => {
            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(window.i18n("dapps.o-coop.processes.createOrganisations.createRegions.notUnlockedKey"));
            }

            const hub = new CirclesHub(RpcGateway.get(), "__CIRCLES_HUB_ADDRESS__");
            const receipt = await await hub.signupOrganisation(
              privateKey,
              context.data.organisationSafeProxy
            );
            console.log(receipt);
          },
          onDone: "#upsertRegion",
          onError: {
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
            target: "#showError",
          },
        },
      },
      upsertRegion: {
        id: "upsertRegion",
        entry: () => console.log(`upsertRegion ...`),
        invoke: {
          src: async (context) => {
            // return result.data.upsertProfile;
            const organisation = {
              avatarMimeType: context.data.avatarMimeType,
              avatarUrl: context.data.avatarUrl,
              circlesAddress: context.data.circlesAddress.toLowerCase(),
              cityGeonameid: context.data.cityGeonameid,
              description: context.data.description,
              name: context.data.name,
              id: context.data.id,
            };

            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertRegionDocument,
              variables: {
                organisation: organisation,
              },
            });
          },
          onDone: "#success",
          onError: {
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
            target: "#showError",
          },
        },
      },
      showError: {
        id: "showError",
        entry: show({
          // TODO: fix <any> cast
          component: ErrorView,
          params: {},
          field: {
            name: "",
            get: () => undefined,
            set: (o: any) => {},
          },
        }),
      },
      success: {
        type: "final",
        id: "success",
        /*
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        }
         */
      },
    },
  });

export const createRegion: ProcessDefinition<void, CreateRegionContext> = {
  name: "createRegion",
  stateMachine: <any>processDefinition,
};
