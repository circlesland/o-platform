import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import TextEditor from "@o-platform/o-editors/src//TextEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { HUB_ADDRESS } from "@o-platform/o-circles/dist/consts";
import { BN } from "ethereumjs-util";
import HtmlViewer from "@o-platform/o-editors/src//HtmlViewer.svelte";
import {promptCirclesSafe} from "../../../shared/api/promptCirclesSafe";
import {Subscription} from "rxjs";
import {CreateTagInput, RequestIndexTransactionDocument} from "../data/api/types";

export type SetTrustContextData = {
  safeAddress: string;
  privateKey: string;
  trustReceiver?: string;
  trustLimit?: number;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type SetTrustContext = ProcessContext<SetTrustContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelTrustReceiver: "Enter the address of the account that you want to trust",
  labelTrustLimit: "Enter the trust limit (0-100)",
};

const processDefinition = (processId: string) =>
  createMachine<SetTrustContext, any>({
    id: `${processId}:setTrust`,
    initial: "checkTrustReceiver",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<SetTrustContext, any>("error"),

      checkTrustReceiver: {
        id: "checkTrustReceiver",
        always: [
          {
            cond: (context) => !!context.data.trustReceiver,
            target: "#checkTrustLimit",
          },
          {
            target: "#trustReceiver",
          },
        ],
      },
      trustReceiver: promptCirclesSafe<SetTrustContext, any>({
        field: "trustReceiver",
        onlyWhenDirty: false,
        params: {
          label: strings.labelTrustReceiver,
          placeholder: "Person to trust",
          submitButtonText: "Set trust",
        },
        navigation: {
          next: "#checkTrustLimit",
        },
      }),
      checkTrustLimit: {
        id: "checkTrustLimit",
        always: [
          {
            cond: (context) =>
              context.data.trustReceiver.toLowerCase() ==
              context.data.safeAddress.toLowerCase(),
            actions: (context) => {
              context.messages["trustReceiver"] =
                '"As soon as you trust yourself, you will know how to live." --Johann Wolfgang von Goethe';
            },
            target: "#trustReceiver",
          },
          {
            cond: (context) =>
              context.data.trustLimit !== undefined &&
              context.data.trustLimit !== null,
            target: "#setTrust",
          },
          {
            target: "#trustLimit",
          },
        ],
      },
      trustLimit: prompt<SetTrustContext, any>({
        field: "trustLimit",
        component: TextEditor,
        params: {
          label: strings.labelTrustLimit,
        },
        navigation: {
          previous: "#checkTrustReceiver",
          next: "#setTrust",
        },
      }),
      // The code was either manually entered or pre-configured at launch.
      // Exchange it for the actual token and redirect the user to the application.
      setTrust: {
        id: "setTrust",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: `Updating trust ..`,
          });
        },
        invoke: {
          src: async (context) => {
            const ownerAddress =
              RpcGateway.get().eth.accounts.privateKeyToAccount(
                context.data.privateKey
              ).address;

            const gnosisSafeProxy = new GnosisSafeProxy(
              RpcGateway.get(),
              context.data.safeAddress
            );

            const execResult = await new CirclesHub(
              RpcGateway.get(),
              HUB_ADDRESS
            ).setTrust(
              context.data.privateKey,
              gnosisSafeProxy,
              context.data.trustReceiver,
              new BN(context.data.trustLimit.toString())
            );

            let txHashSubscription: Subscription;
            txHashSubscription = execResult.observable.subscribe(async o => {
              if (o.type != "transactionHash") {
                return;
              }
              if (txHashSubscription) {
                txHashSubscription.unsubscribe();
              }

              const transactionTags: CreateTagInput[] = [];
              const trustMessage:string  = undefined; // TODO: Ask if the user wants to send a message together with the un/trust
              if (trustMessage) {
                transactionTags.push({
                  typeId: "o-banking:trust:message:1",
                  value: trustMessage
                });
              }

              const api = await window.o.apiClient.client.subscribeToResult();
              const indexedTransaction = await api.mutate({
                mutation: RequestIndexTransactionDocument,
                variables: {
                  data: {
                    tags: transactionTags,
                    transactionHash: o.data
                  }
                }
              });
              // console.log(indexedTransaction);
            });
            return execResult.toPromise();
          },
          onDone: "#showSuccess",
          onError: "#error",
        },
      },
      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        component: HtmlViewer,
        params: {
          html: () => `<p>Trust changed</p>`,
          submitButtonText: "Close",
          hideNav: true,
        },
        navigation: {
          next: "#success",
        },
      }),
      success: {
        type: "final",
        id: "success",
        data: (context, event: PlatformEvent) => {
          return "yeah!";
        },
      },
    },
  });

export const setTrust: ProcessDefinition<void, SetTrustContext> = {
  name: "setTrust",
  stateMachine: <any>processDefinition,
};
