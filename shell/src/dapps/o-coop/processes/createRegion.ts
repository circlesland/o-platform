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
import {Environment} from "../../../shared/environment";

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

  if (!$me) throw new Error(`You're not logged on`);
  if (!$me.circlesSafeOwner) throw new Error(`You have no eoa`);

  const privateKey = sessionStorage.getItem("circlesKey");
  if (!privateKey) {
    throw new Error(`The private key is not unlocked`);
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
      `You have not enough funds on '${
        $me.circlesSafeOwner
      }'. Max. transferable amount is ${web3.utils.fromWei(
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
    throw new Error(`Couldn't send the invitation transaction`);
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

  if (!$me) throw new Error(`You're not logged on`);
  if (!$me.circlesSafeOwner) throw new Error(`You have no eoa`);

  const privateKey = sessionStorage.getItem("circlesKey");
  if (!privateKey) {
    throw new Error(`The private key is not unlocked`);
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
      `You have not enough funds on '${
        $me.circlesAddress
      }'. Max. transferable amount is ${web3.utils.fromWei(
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
            title: "What is the name of your organisation?",
            description: "DESCRIPTION",
            placeholder: "Name",
            submitButtonText: "Save",
          },
        },
        dataSchema: yup.string().required("Please enter an organisation name."),
        navigation: {
          next: "#country",
        },
      }),
      country: promptCity<CreateRegionContext, any>({
        id: "country",
        field: "cityGeonameid",
        params: {
          view: {
            title: "Where is your organisation located?",
            description: "DESCRIPTION",
            placeholder: "City",
            submitButtonText: "Save",
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
            title: "Describe your organisation in a few sentences?",
            description: "DESCRIPTION",
            placeholder: "Description",
            submitButtonText: "Save",
          },
        },
        dataSchema: yup
          .string()
          .nullable()
          .notRequired()
          .max(150, "The maximum amount of characters allowed is 150."),
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
            title: "Profile Image",
            description: "Show the World who you are",
            placeholder: "Upload Image",
            submitButtonText: "Upload Image",
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
              throw new Error(`The private key is not unlocked`);
            }

            let $me: Profile = null;
            const unsub = me.subscribe((current) => {
              $me = current;
            });
            unsub();

            if (!$me?.circlesAddress) {
              throw new Error(
                `You need a fully set-up circles account to create an organisation.`
              );
            }

            const proxyFactory = new GnosisSafeProxyFactory(
              RpcGateway.get(),
              Environment.safeProxyFactoryAddress,
              Environment.masterSafeAddress
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
              throw new Error(`The private key is not unlocked`);
            }

            const hub = new CirclesHub(RpcGateway.get(), Environment.circlesHubAddress);
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
