import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import EditorView from "@o-platform/o-editors/src/shared/EditorView.svelte";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import CurrencyCreateInvitationEoa from "@o-platform/o-editors/src/CurrencyCreateInvitationEoa.svelte";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { transferXdai } from "./transferXdai";
import { transferCircles } from "./transferCircles";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import { requestPathToRecipient } from "../services/requestPathToRecipient";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { BN } from "ethereumjs-util";
import { AvataarGenerator } from "../../../shared/avataarGenerator";
import { Profile } from "../data/api/types";
import { promptCirclesSafe } from "../../../shared/api/promptCirclesSafe";
import { SetTrustContext } from "./setTrust";

export const empty = true;

// export type CreateInvitationEoaContextData = {
//   safeAddress: string;
//   recipientAddress?: string;
//   recipientProfileId?: number;
//   recipientProfile?: Profile;
//   message?: string;
//   tokens?: {
//     currency: string;
//     amount: string;
//   };
//   maxFlows?: {
//     [currency: string]: string;
//   };
//   summaryHtml?: string;
//   acceptSummary?: boolean;
// };

// /**
//  * This is the context on which the process will work.
//  * The actual fields are defined above in the 'AuthenticateContextData' type.
//  * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
//  */
// export type CreateInvitationEoaContext =
//   ProcessContext<CreateInvitationEoaContextData>;

// // /**
// //  * This is the context on which the process will work.
// //  * The actual fields are defined above in the 'AuthenticateContextData' type.
// //  * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
// //  */
// // export type CreateInvitationEoaContext =
// //   ProcessContext<CreateInvitationEoaContextData>;

// const editorContent = {
//   recipient: {
//     title: "Select the recipient you want to send money to",
//     description: "",
//     placeholder: "Recipient",
//     submitButtonText: "Enter Name",
//   },
//   currency: {
//     title: "Please enter the Amount",
//     description: "",
//     submitButtonText: "Submit",
//   },
//   message: {
//     title: "CreateInvitationEoa Message",
//     description: "",
//     submitButtonText: "Submit",
//   },
//   confirm: {
//     title: "",
//     description: "",
//     submitButtonText: "Send Money",
//   },
//   success: {
//     title: "CreateInvitationEoa successful",
//     description: "",
//     submitButtonText: "Close",
//   },
// };

// //     mainComponent: CurrencyCreateInvitationEoa,
// //     submitButtonText: "Submit",
// //   },
// //   message: {
// //     title: "CreateInvitationEoa Message",
// //     description: "",
// //     mainComponent: TextareaEditor,
// //     submitButtonText: "Submit",
// //   },
// //   confirm: {
// //     title: "",
// //     description: "",
// //     mainComponent: HtmlViewer,
// //     submitButtonText: "Send Money",
// //   },
// //   success: {
// //     title: "CreateInvitationEoa successful",
// //     description: "",
// //     mainComponent: HtmlViewer,
// //     submitButtonText: "Close",
// //   },
// // };

// // const currencyLookup = {
// //   CRC: "Circles",
// //   XDAI: "xDai",
// // };

// // const processDefinition = (processId: string) =>
// //   createMachine<CreateInvitationEoaContext, any>({
// //     id: `${processId}:transfer`,
// //     initial: "checkIsPreFilled",
// //     states: {
// //       // Include a default 'error' state that propagates the error by re-throwing it in an action.
// //       // TODO: Check if this works as intended
// //       ...fatalError<CreateInvitationEoaContext, any>("error"),

// //       checkIsPreFilled: {
// //         id: "checkIsPreFilled",
// //         always: [
// //           {
// //             cond: (context) => {
// //               const web3 = RpcGateway.get();

//               return hasSender && hasRecipient && hasAmount && isXdai;
//             },
//             target: "#loadRecipientProfile",
//           },
//           {
//             target: "#checkRecipientAddress",
//           },
//         ],
//       },
//       checkRecipientAddress: {
//         id: "checkRecipientAddress",
//         always: [
//           {
//             cond: (context) => !!context.data.recipientAddress,
//             target: "#tokens",
//           },
//           {
//             target: "#recipientAddress",
//           },
//         ],
//       },
//       recipientAddress: promptCirclesSafe<SetTrustContext, any>({
//         field: "recipientAddress",
//         onlyWhenDirty: false,
//         params: {
//           view: editorContent.recipient,
//           label: strings.labelRecipientAddress,
//           placeholder: "Recipient",
//           submitButtonText: "Check send limit",
//         },
//         navigation: {
//           next: "#tokens",
//         },
//       }),
//       tokens: prompt<CreateInvitationEoaContext, any>({
//         field: "tokens",
//         component: CurrencyCreateInvitationEoa,
//         params: {
//           view: editorContent.currency,
//           label: strings.tokensLabel,
//           currencies: [
//             {
//               value: "crc",
//               label: strings.currencyCircles,
//               __typename: "Currency",
//             },
//             {
//               value: "xdai",
//               label: strings.currencyXdai,
//               __typename: "Currency",
//             },
//           ],
//         },
//         dataSchema: yup.object().shape({
//           amount: yup
//             .number()
//             .typeError("Please enter a valid Number.")
//             .required("Please enter a valid amount.")
//             .positive("Please enter a valid amount."),
//           currency: yup.string().required("Please select a valid currency."),
//         }),
//         navigation: {
//           next: "#findMaxFlow",
//           previous: "#recipientAddress",
//         },
//       }),
//       findMaxFlow: {
//         id: "findMaxFlow",
//         entry: () => {
//           window.o.publishEvent(<PlatformEvent>{
//             type: "shell.progress",
//             message: `Calculating the maximum transfer amount ..`,
//           });
//         },
//         invoke: {
//           id: "findMaxFlow",
//           src: async (context) => {
//             if (!context.data.recipientAddress) {
//               throw new Error(`No recipient address on context`);
//             }
//             context.data.maxFlows = {};
//             const p1 = new Promise<void>(async (resolve) => {
//               const flow = await requestPathToRecipient({
//                 data: {
//                   recipientAddress: context.data.recipientAddress,
//                   amount: context.data.tokens.amount,
//                   safeAddress: context.data.safeAddress,
//                 },
//               });
//               context.data.maxFlows["crc"] = flow.flow;
//               resolve();
//             });
//             const p2 = await RpcGateway.trigger(async (web3) => {
//               context.data.maxFlows["xdai"] = await web3.eth.getBalance(
//                 web3.utils.toChecksumAddress(context.data.safeAddress)
//               );
//             }, 1000);

//             await Promise.all([p1, p2]);
//           },
//           onDone: "#checkAmount",
//           onError: "#error",
//         },
//       },
//       checkAmount: {
//         id: "checkAmount",
//         always: [
//           {
//             cond: (context, event) => {
//               const maxFlowInWei = new BN(
//                 context.data.maxFlows[
//                   context.data.tokens.currency.toLowerCase()
//                 ]
//               );
//               const amountInWei = new BN(
//                 RpcGateway.get().utils.toWei(
//                   context.data.tokens.amount,
//                   "ether"
//                 )
//               );
//               return maxFlowInWei.gte(amountInWei);
//             },
//             target: "#loadRecipientProfile",
//           },
//           {
//             actions: (context) => {
//               const formattedAmount = parseFloat(
//                 context.data.tokens.amount
//               ).toFixed(2);
//               const formattedMax = parseFloat(
//                 RpcGateway.get().utils.fromWei(
//                   context.data.maxFlows[
//                     context.data.tokens.currency.toLowerCase()
//                   ].toString(),
//                   "ether"
//                 )
//               ).toFixed(2);
//               context.messages[
//                 "tokens"
//               ] = `The chosen amount (${formattedAmount}) exceeds the maximum transferable amount of (${formattedMax}).`;
//             },
//             target: "#tokens",
//           },
//         ],
//       },
//       loadRecipientProfile: {
//         id: "loadRecipientProfile",
//         invoke: {
//           src: async (context) => {
//             if (context.data.recipientProfileId) {
//               // Use the profile id to get the profile but send to the context.data.recipientAddress
//               context.data.recipientProfile = await loadProfileByProfileId(
//                 context.data.recipientProfileId
//               );
//             } else if (context.data.recipientAddress) {
//               context.data.recipientProfile = await loadProfileBySafeAddress(
//                 context.data.recipientAddress
//               );
//             } else {
//               // No profile found
//             }
//           },
//           onDone: [
//             {
//               cond: (context) => !!context.data.recipientProfile,
//               target: "#message",
//             },
//             {
//               target: "#prepareSummary",
//             },
//           ],
//           onError: "#error",
//         },
//       },
//       message: prompt<CreateInvitationEoaContext, any>({
//         field: "message",
//         component: TextareaEditor,
//         params: {
//           view: editorContent.message,
//           label: strings.messageLabel,
//           maxLength: "100",
//         },
//         navigation: {
//           previous: "#tokens",
//           next: "#prepareSummary",
//           canSkip: () => true,
//         },
//       }),
//       prepareSummary: {
//         id: "prepareSummary",
//         invoke: {
//           src: async (context) => {
//             const lastName = context.data.recipientProfile.lastName
//               ? context.data.recipientProfile.lastName
//               : "";
//             const to = context.data.recipientProfile
//               ? context.data.recipientProfile.firstName + " " + lastName
//               : context.data.recipientAddress;

// //             await Promise.all([p1, p2]);
// //           },
// //           onDone: "#checkAmount",
// //           onError: "#error",
// //         },
// //       },
// //       checkAmount: {
// //         id: "checkAmount",
// //         always: [
// //           {
// //             cond: (context, event) => {
// //               const maxFlowInWei = new BN(
// //                 context.data.maxFlows[
// //                   context.data.tokens.currency.toLowerCase()
// //                 ]
// //               );
// //               const amountInWei = new BN(
// //                 RpcGateway.get().utils.toWei(
// //                   context.data.tokens.amount,
// //                   "ether"
// //                 )
// //               );
// //               return maxFlowInWei.gte(amountInWei);
// //             },
// //             target: "#loadRecipientProfile",
// //           },
// //           {
// //             actions: (context) => {
// //               const formattedAmount = parseFloat(
// //                 context.data.tokens.amount
// //               ).toFixed(2);
// //               const formattedMax = parseFloat(
// //                 RpcGateway.get().utils.fromWei(
// //                   context.data.maxFlows[
// //                     context.data.tokens.currency.toLowerCase()
// //                   ].toString(),
// //                   "ether"
// //                 )
// //               ).toFixed(2);
// //               context.messages[
// //                 "tokens"
// //               ] = `The chosen amount (${formattedAmount}) exceeds the maximum transferable amount of (${formattedMax}).`;
// //             },
// //             target: "#tokens",
// //           },
// //         ],
// //       },
// //       loadRecipientProfile: {
// //         id: "loadRecipientProfile",
// //         invoke: {
// //           src: async (context) => {
// //             if (context.data.recipientProfileId) {
// //               // Use the profile id to get the profile but send to the context.data.recipientAddress
// //               context.data.recipientProfile = await loadProfileByProfileId(
// //                 context.data.recipientProfileId
// //               );
// //             } else if (context.data.recipientAddress) {
// //               context.data.recipientProfile = await loadProfileBySafeAddress(
// //                 context.data.recipientAddress
// //               );
// //             } else {
// //               // No profile found
// //             }
// //           },
// //           onDone: [
// //             {
// //               cond: (context) => !!context.data.recipientProfile,
// //               target: "#message",
// //             },
// //             {
// //               target: "#prepareSummary",
// //             },
// //           ],
// //           onError: "#error",
// //         },
// //       },
// //       message: prompt<CreateInvitationEoaContext, any>({
// //         field: "message",
// //         component: EditorView,
// //         params: {
// //           view: editorContent.message,
// //           label: strings.messageLabel,
// //           maxLength: "100",
// //         },
// //         navigation: {
// //           previous: "#tokens",
// //           next: "#prepareSummary",
// //           canSkip: () => true,
// //         },
// //       }),
// //       prepareSummary: {
// //         id: "prepareSummary",
// //         invoke: {
// //           src: async (context) => {
// //             const lastName = context.data.recipientProfile.lastName
// //               ? context.data.recipientProfile.lastName
// //               : "";
// //             const to = context.data.recipientProfile
// //               ? context.data.recipientProfile.firstName + " " + lastName
// //               : context.data.recipientAddress;

// //             let toAvatarUrl = context.data.recipientProfile
// //               ? context.data.recipientProfile.avatarUrl
// //               : null;

//             if (!context.data.tokens) {
//               throw new Error(`No currency or amount selected`);
//             } else {
//               context.data.summaryHtml = `<span>You are about to transfer</span>
//                 <strong class='text-primary text-5xl block mt-2'>
//                     ${context.data.tokens.amount}
//                     ${
//                       currencyLookup[context.data.tokens.currency.toUpperCase()]
//                     }</strong>
//                 <span class='block mt-2'>
//                 to
//                 </span>
//                 <div class="avatar self-center justify-self-center text-center mt-4">
//                   <div class="w-36 h-36 rounded-full mb-4">
//                     <img
//                       src=${toAvatarUrl}
//                       alt=${to}
//                     />
//                   </div>
//                 </div>
//                 <div class="self-center flex-grow justify-self-start text-center">
//                   <h2>
//                     ${to}
//                   </h2>
//                 </div>
//                 <span class='block mt-2'>
//                 ${
//                   context.data.message
//                     ? "<b>Purpose:</b><br/>" + context.data.message
//                     : ""
//                 }
//                 </span>
//                 <strong class='text-primary block mt-4'>
//                 Do you want to continue?
//                 </strong>`;
//             }
//           },
//           onDone: "#acceptSummary",
//           onError: "#error",
//         },
//       },
//       acceptSummary: prompt<CreateInvitationEoaContext, any>({
//         field: "acceptSummary",
//         component: HtmlViewer,
//         params: {
//           view: editorContent.confirm,
//           label: strings.summaryLabel,
//           submitButtonText: "Send Money",
//           html: (context) => context.data.summaryHtml,
//         },
//         navigation: {
//           previous: "#message",
//           next: "#checkChoice",
//         },
//       }),
//       checkChoice: {
//         id: "checkChoice",
//         always: [
//           {
//             cond: (context) => {
//               return context.data.tokens.currency.toLowerCase() == "crc";
//             },
//             target: "callCirclesCreateInvitationEoa",
//           },
//           {
//             cond: (context) => {
//               return context.data.tokens.currency.toLowerCase() == "xdai";
//             },
//             target: "callXdaiCreateInvitationEoa",
//           },
//         ],
//       },
//       callCirclesCreateInvitationEoa: {
//         id: "callCirclesCreateInvitationEoa",
//         on: <any>{
//           ...ipc("callCirclesCreateInvitationEoa"),
//         },
//         invoke: {
//           src: transferCircles.stateMachine(
//             `${processId}:transfer:transferCircles`
//           ),
//           data: {
//             data: (context, event) => {
//               return {
//                 safeAddress: context.data.safeAddress,
//                 recipientAddress: context.data.recipientAddress,
//                 amount: context.data.tokens.amount,
//                 privateKey: sessionStorage.getItem("circlesKey"),
//                 message: context.data.message,
//               };
//             },
//             messages: {},
//             dirtyFlags: {},
//           },
//           onDone: "#showSuccess",
//           onError: "#error",
//         },
//       },
//       callXdaiCreateInvitationEoa: {
//         id: "callXdaiCreateInvitationEoa",
//         on: <any>{
//           ...ipc("callXdaiCreateInvitationEoa"),
//         },
//         invoke: {
//           src: transferXdai.stateMachine(`${processId}:transfer:transferXdai`),
//           data: {
//             data: (context, event) => {
//               return {
//                 safeAddress: context.data.safeAddress,
//                 recipientAddress: context.data.recipientAddress,
//                 amount: context.data.tokens.amount,
//                 privateKey: sessionStorage.getItem("circlesKey"),
//                 message: context.data.message,
//               };
//             },
//             messages: {},
//             dirtyFlags: {},
//           },
//           onDone: "#showSuccess",
//           onError: "#error",
//         },
//       },
//       showSuccess: prompt({
//         id: "showSuccess",
//         field: "__",
//         component: HtmlViewer,
//         params: {
//           view: editorContent.success,
//           html: () => "",
//           submitButtonText: "Close",
//           hideNav: false,
//         },
//         navigation: {
//           next: "#success",
//         },
//       }),
//       success: {
//         id: "success",
//         type: "final",
//         data: (context, event: PlatformEvent) => {
//           return "yeah!";
//         },
//       },
//     },
//   });

// //             if (!context.data.tokens) {
// //               throw new Error(`No currency or amount selected`);
// //             } else {
// //               context.data.summaryHtml = `<span>You are about to transfer</span>
// //                 <strong class='text-primary text-5xl block mt-2'>
// //                     ${context.data.tokens.amount}
// //                     ${
// //                       currencyLookup[context.data.tokens.currency.toUpperCase()]
// //                     }</strong>
// //                 <span class='block mt-2'>
// //                 to
// //                 </span>
// //                 <div class="avatar self-center justify-self-center text-center mt-4">
// //                   <div class="w-36 h-36 rounded-full mb-4">
// //                     <img
// //                       src=${toAvatarUrl}
// //                       alt=${to}
// //                     />
// //                   </div>
// //                 </div>
// //                 <div class="self-center flex-grow justify-self-start text-center">
// //                   <h2>
// //                     ${to}
// //                   </h2>
// //                 </div>
// //                 <span class='block mt-2'>
// //                 ${
// //                   context.data.message
// //                     ? "<b>Purpose:</b><br/>" + context.data.message
// //                     : ""
// //                 }
// //                 </span>
// //                 <strong class='text-primary block mt-4'>
// //                 Do you want to continue?
// //                 </strong>`;
// //             }
// //           },
// //           onDone: "#acceptSummary",
// //           onError: "#error",
// //         },
// //       },
// //       acceptSummary: prompt<CreateInvitationEoaContext, any>({
// //         field: "acceptSummary",
// //         component: EditorView,
// //         params: {
// //           view: editorContent.confirm,
// //           label: strings.summaryLabel,
// //           submitButtonText: "Send Money",
// //           html: (context) => context.data.summaryHtml,
// //         },
// //         navigation: {
// //           previous: "#message",
// //           next: "#checkChoice",
// //         },
// //       }),
// //       checkChoice: {
// //         id: "checkChoice",
// //         always: [
// //           {
// //             cond: (context) => {
// //               return context.data.tokens.currency.toLowerCase() == "crc";
// //             },
// //             target: "callCirclesCreateInvitationEoa",
// //           },
// //           {
// //             cond: (context) => {
// //               return context.data.tokens.currency.toLowerCase() == "xdai";
// //             },
// //             target: "callXdaiCreateInvitationEoa",
// //           },
// //         ],
// //       },
// //       callCirclesCreateInvitationEoa: {
// //         id: "callCirclesCreateInvitationEoa",
// //         on: <any>{
// //           ...ipc("callCirclesCreateInvitationEoa"),
// //         },
// //         invoke: {
// //           src: transferCircles.stateMachine(
// //             `${processId}:transfer:transferCircles`
// //           ),
// //           data: {
// //             data: (context, event) => {
// //               return {
// //                 safeAddress: context.data.safeAddress,
// //                 recipientAddress: context.data.recipientAddress,
// //                 amount: context.data.tokens.amount,
// //                 privateKey: sessionStorage.getItem("circlesKey"),
// //                 message: context.data.message,
// //               };
// //             },
// //             messages: {},
// //             dirtyFlags: {},
// //           },
// //           onDone: "#showSuccess",
// //           onError: "#error",
// //         },
// //       },
// //       callXdaiCreateInvitationEoa: {
// //         id: "callXdaiCreateInvitationEoa",
// //         on: <any>{
// //           ...ipc("callXdaiCreateInvitationEoa"),
// //         },
// //         invoke: {
// //           src: transferXdai.stateMachine(`${processId}:transfer:transferXdai`),
// //           data: {
// //             data: (context, event) => {
// //               return {
// //                 safeAddress: context.data.safeAddress,
// //                 recipientAddress: context.data.recipientAddress,
// //                 amount: context.data.tokens.amount,
// //                 privateKey: sessionStorage.getItem("circlesKey"),
// //                 message: context.data.message,
// //               };
// //             },
// //             messages: {},
// //             dirtyFlags: {},
// //           },
// //           onDone: "#showSuccess",
// //           onError: "#error",
// //         },
// //       },
// //       showSuccess: prompt({
// //         id: "showSuccess",
// //         field: "__",
// //         component: EditorView,
// //         params: {
// //           view: editorContent.success,
// //           html: () => "",
// //           submitButtonText: "Close",
// //           hideNav: false,
// //         },
// //         navigation: {
// //           next: "#success",
// //         },
// //       }),
// //       success: {
// //         id: "success",
// //         type: "final",
// //         data: (context, event: PlatformEvent) => {
// //           return "yeah!";
// //         },
// //       },
// //     },
// //   });

// // export const transfer: ProcessDefinition<void, CreateInvitationEoaContext> = {
// //   name: "transfer",
// //   stateMachine: <any>processDefinition,
// // };
