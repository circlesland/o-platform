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
import { Profile, UpsertOrganisationDocument } from "../../../shared/api/data/types";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { me } from "../../../shared/stores/me";
import { GnosisSafeProxyFactory } from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { BN } from "ethereumjs-util";
import { Environment } from "../../../shared/environment";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {setWindowLastError} from "../../../shared/processes/actions/setWindowLastError";

export type CreateOrganisationContextData = {
  successAction: (data: CreateOrganisationContextData) => void;
  id: number | undefined;
  avatarMimeType: "image/png";
  avatarUrl: string;
  circlesAddress: string;
  cityGeonameid: string;
  description: string;
  name: string;
  organisationSafeProxy: GnosisSafeProxy;
};

export type CreateOrganisationContext = ProcessContext<CreateOrganisationContextData>;

/**
 * Sends the specified "amount".
 */
async function sendFundsFromEoa(to: string, amount: BN) {
  let $me: Profile = null;
  const unsub = me.subscribe((current) => {
    $me = current;
  });
  unsub();

  if (!$me) throw new Error(window.o.i18n("dapps.o-coop.processes.createOrganisations.notLoggedOn"));
  if (!$me.circlesSafeOwner) throw new Error(window.o.i18n("dapps.o-coop.processes.createOrganisations.noEoa"));

  const privateKey = sessionStorage.getItem("circlesKey");
  if (!privateKey) {
    throw new Error(window.o.i18n("dapps.o-coop.processes.createOrganisations.notUnlockedPrivateKey"));
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
      `You have not enough funds on '${$me.circlesSafeOwner}'. Max. transferable amount is ${web3.utils.fromWei(
        availableForTransfer,
        "ether"
      )}`
    ); //i18n skipped for now
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
    throw new Error(window.o.i18n("dapps.o-coop.processes.createOrganisations.couldNotSend"));
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

  if (!$me) throw new Error(window.o.i18n("dapps.o-coop.processes.createOrganisations.notLoggedOn"));
  if (!$me.circlesSafeOwner) throw new Error(window.o.i18n("dapps.o-coop.processes.createOrganisations.noEoa"));

  const privateKey = sessionStorage.getItem("circlesKey");
  if (!privateKey) {
    throw new Error(window.o.i18n("dapps.o-coop.processes.createOrganisations.notUnlockedPrivateKey"));
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
      `You have not enough funds on '${$me.circlesAddress}'. Max. transferable amount is ${web3.utils.fromWei(
        availableForTransfer,
        "ether"
      )}`
    ); //i18n skipped for now
  }

  const proxy = new GnosisSafeProxy(web3, $me.circlesAddress);
  const receipt = await proxy.transferEth(privateKey, amount, to);
  console.log(receipt);
}

const processDefinition = (processId: string) =>
  createMachine<CreateOrganisationContext, any>({
    id: `${processId}:createOrganisation`,
    initial: "name",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateOrganisationContext, any>("error"),

      name: prompt<CreateOrganisationContext, any>({
        id: "name",
        field: "name",
        component: TextEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.title"),
            description: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.submitButtonText"
            ),
          },
        },
        dataSchema: yup
          .string()
          .required(
            window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.enterOrganisationName"
            )
          ),
        navigation: {
          next: "#country",
        },
      }),
      country: promptCity<CreateOrganisationContext, any>({
        id: "country",
        field: "id",
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.title"),
            description: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.submitButtonText"
            ),
          },
        },
        navigation: {
          next: "#description",
          previous: "#name",
          canSkip: () => true,
        },
      }),
      description: prompt<CreateOrganisationContext, any>({
        field: "description",
        component: TextareaEditor,
        params: {
          view: {
            title: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.title"
            ),
            description: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.submitButtonText"
            ),
          },
        },
        dataSchema: yup
          .string()
          .nullable()
          .notRequired()
          .max(
            150,
            window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.maximumChars")
          ),
        navigation: {
          next: "#avatarUrl",
          canSkip: () => true,
          previous: "#country",
        },
      }),
      avatarUrl: promptFile<CreateOrganisationContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          //context.data.avatarUrl = event.data?.url;
          //context.data.avatarMimeType = event.data?.mimeType;
        },
        params: {
          view: {
            title: window.o.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.title"),
            description: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.submitButtonText"
            ),
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
            target: "#upsertOrganisation",
          },
        ],
      },
      deployOrganisation: {
        id: "deployOrganisation",
        entry: () => {
          console.log(`deployOrganisation ...`);
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.o.i18n("dapps.o-coop.processes.createOrganisations.deployOrganisation.progress"),
          });
        },
        invoke: {
          src: async (context) => {
            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) {
              throw new Error(
                window.o.i18n(
                  "dapps.o-coop.processes.createOrganisations.createOrganisationContext.deployOrganisation.notUnlockedKey"
                )
              );
            }

            let $me: Profile = null;
            const unsub = me.subscribe((current) => {
              $me = current;
            });
            unsub();

            if (!$me?.circlesAddress) {
              throw new Error(
                window.o.i18n(
                  "dapps.o-coop.processes.createOrganisations.createOrganisationContext.deployOrganisation.needFullAccountSetup"
                )
              );
            }

            const proxyFactory = new GnosisSafeProxyFactory(
              RpcGateway.get(),
              Environment.safeProxyFactoryAddress,
              Environment.masterSafeAddress
            );

            context.data.organisationSafeProxy = await proxyFactory.deployNewSafeProxy(privateKey);
            context.data.circlesAddress = context.data.organisationSafeProxy.address;

            console.log(context.data.organisationSafeProxy);
          },
          onDone: "#signupOrganisation",
          onError: {
            actions: setWindowLastError,
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
              throw new Error(
                window.o.i18n(
                  "dapps.o-coop.processes.createOrganisations.createOrganisationContext.signupOrganisation.notUnlockedKey"
                )
              );
            }

            const hub = new CirclesHub(RpcGateway.get(), Environment.circlesHubAddress);
            const receipt = await hub.signupOrganisation(privateKey, context.data.organisationSafeProxy);
            console.log(receipt);
          },
          onDone: "#upsertOrganisation",
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },
      upsertOrganisation: {
        id: "upsertOrganisation",
        entry: () => console.log(`upsertOrganisation ...`),
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

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertOrganisationDocument,
              variables: {
                organisation: organisation,
              },
            });
          },
          onDone: "#success",
          onError: {
            actions: setWindowLastError,
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
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: () => true,
      },
    },
  });

export const createOrganisation: ProcessDefinition<void, CreateOrganisationContext> = {
  name: "createOrganisation",
  stateMachine: <any>processDefinition,
};
