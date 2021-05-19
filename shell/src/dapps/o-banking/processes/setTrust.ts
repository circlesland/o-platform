import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import TextEditor from "../../../../../packages/o-editors/src/TextEditor.svelte";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import gql from "graphql-tag";
import { Choice } from "../../../../../packages/o-editors/src/choiceSelectorContext";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { HUB_ADDRESS } from "@o-platform/o-circles/dist/consts";
import { BN } from "ethereumjs-util";

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

const trustUsersQuery = {
  query: gql`
    query safe($id: String!) {
      safe(id: $id) {
        incoming {
          userAddress
          canSendToAddress
          limit
        }
        outgoing {
          userAddress
          canSendToAddress
          limit
        }
      }
    }
  `,
  variables: {
    id: "0xd460db4cfa021c42edeb7e555d904400dab65ecc",
  },
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
      trustReceiver: prompt<SetTrustContext, any>({
        fieldName: "trustReceiver",
        component: DropdownSelectEditor,
        params: {
          label: strings.labelTrustReceiver,
          graphql: true,
          asyncChoices: async (searchText?: string) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.query({
              query: gql`
                query search($searchString: String!) {
                  search(query: { searchString: $searchString }) {
                    id
                    circlesAddress
                    firstName
                    lastName
                    dream
                    country
                    avatarUrl
                  }
                }
              `,
              variables: {
                searchString: searchText ?? "",
              },
            });

            const items =
              result.data.search && result.data.search.length > 0
                ? result.data.search
                    .map((o) => {
                      return <Choice>{
                        value: o.circlesAddress,
                        label: `${o.firstName} ${o.lastName ? o.lastName : ""}`,
                        avatarUrl: o.avatarUrl,
                      };
                    })
                    .filter((o) => o.value)
                : [];

            return items;
          },
          optionIdentifier: "value",
          getOptionLabel: (option) => option.label,
          getSelectionLabel: (option) => option.label,
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
        fieldName: "trustLimit",
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

            return execResult.toPromise();
          },
          onDone: "#success",
          onError: "#error",
        },
      },
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
