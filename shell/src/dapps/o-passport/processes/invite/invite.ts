import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {promptChoice} from "../identify/prompts/promptChoice";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {transfer} from "../../../o-banking/processes/transfer";
import {loadProfile} from "../identify/services/loadProfile";

export type InviteContextData = {
  safeAddress?:string;
  inviteProfileId?: number;
  circlesSafeOwner?: string;
};

export const INVITE_VALUE = 0.10;

export type InviteContext = ProcessContext<InviteContextData>;


const processDefinition = (processId: string) =>
  createMachine<InviteContext, any>({
    id: `${processId}`,
    initial: "loadProfile",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<InviteContext, any>("error"),

      loadProfile: {
        invoke: {
          src: context => {
            return loadProfile(context.data.inviteProfileId);
          },
          onDone: {
            actions: (context, event) => {
              context.data.circlesSafeOwner = event.data.circlesSafeOwner;
            },
            target: "#amount"
          },
          onError: "#error"
        }
      },

      amount: promptChoice({
        id: "amount",
        promptLabel: "How many invites do you want to send to XXX?",
        options: [{
          key: "1",
          label: "1 invite",
          target: "#transfer"
        }, {
          key: "5",
          label: "5 invites",
          target: "#transfer"
        }, {
          key: "25",
          label: "25 invites",
          target: "#transfer"
        }]
      }),

      transfer: {
        id: "transfer",
        on: <any>{
          ...ipc("transfer"),
        },
        invoke: {
          id: "transfer",
          src: transfer.stateMachine(`transfer`),
          data: {
            data: (context, event) => {
              return {
                safeAddress: context.data.safeAddress,
                recipientAddress: context.data.circlesSafeOwner,
                tokens: {
                  currency: "xdai",
                  amount: parseFloat(context.data.amount.key) * INVITE_VALUE
                }
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: "#success",
          onError: "#error",
        },
      },

      success: {
        id: "success",
        type: "final",
        data: (context) => {
          return context.data;
        },
      },
    }
  });

export const invite: ProcessDefinition<
  void,
  InviteContextData
  > = {
  name: "invite",
  stateMachine: <any>processDefinition,
};
