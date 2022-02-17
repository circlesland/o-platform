import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import CheckoutSummary from "../../o-marketplace/molecules/CheckoutSummary.svelte";
import CheckoutConfirm from "../../o-marketplace/molecules/CheckoutConfirm.svelte";
import {
  Profile,
  Offer,
  CreatePurchaseDocument,
  PurchaseLineInput,
  Invoice,
} from "../../../shared/api/data/types";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Currency } from "../../../shared/currency";

import {
  fTransferCircles,
  TransitivePath,
} from "../../o-banking/processes/transferCircles";

import { cartContents } from "../stores/shoppingCartStore";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { findDirectTransfers } from "../../o-banking/processes/transfer";

export type PurchaseContextData = {
  items: Offer[];
  sellerProfile?: Profile;
  invoices: Invoice[];
  payableInvoices: {
    invoice: Invoice;
    path: TransitivePath;
  }[];
  paidInvoices: {
    invoice: Invoice;
    path: TransitivePath;
  }[];
};

export type PurchaseContext = ProcessContext<PurchaseContextData>;

let currency = Currency.instance();

const editorContent: { [x: string]: EditorViewContext } = {
  summary: {
    title: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.summary.title"),
    description: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.summary.description"),
    placeholder: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.summary.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.summary.submitButtonText"),
  },
  success: {
    title: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.success.title"),
    description: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.success.description"),
    placeholder: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.success.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.success.submitButtonText"),
  },
};

const processDefinition = (processId: string) =>
  createMachine<PurchaseContext, any>({
    id: `${processId}:createOffer`,
    initial: "init",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PurchaseContext, any>("error"),

      init: {
        id: "init",
        entry: (context) => {
          const cartContents = JSON.parse(localStorage.getItem("cartContents"));
          if (cartContents) {
            context.data.items = cartContents;
            // TODO: THIS ASSUMES ALL ITEMS ARE FROM THE SAME SELLER
            context.data.sellerProfile = cartContents[0].createdByProfile;
          }
        },
        always: "#checkoutSummary",
        // onError: "#error",
      },
      checkoutSummary: prompt<PurchaseContext, any>({
        field: "checkoutSummary",
        component: CheckoutSummary,
        params: {
          view: editorContent.summary,
          submitButtonText: editorContent.summary.submitButtonText,
        },
        navigation: {
          next: "#createPurchase",
        },
      }),
      createPurchase: {
        id: "createPurchase",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.i18n("dapps.o-marketplace.processes.purchases.createPurchase.message"),
          });
        },
        invoke: {
          src: async (context) => {
            const linesGroupedByOffer: { [offerId: number]: number } = {};
            context.data.items.forEach((o) => {
              linesGroupedByOffer[o.id] = linesGroupedByOffer[o.id]
                ? linesGroupedByOffer[o.id] + 1
                : 1;
            });

            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: CreatePurchaseDocument,
              variables: {
                lines: Object.entries(linesGroupedByOffer).map((o) => {
                  return <PurchaseLineInput>{
                    offerId: parseInt(o[0]),
                    amount: o[1],
                  };
                }),
              },
            });

            context.data.invoices = <Invoice[]>result.data.purchase;

            console.log(result);
          },
          onDone: "#calculatePaths",
          onError: {
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
            target: "#showError",
          },
        },
      },
      calculatePaths: {
        id: "calculatePaths",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.i18n("dapps.o-marketplace.processes.purchases.calculatePaths.message"),
          });
        },
        invoke: {
          src: async (context) => {
            context.data.payableInvoices = [];
            context.data.paidInvoices = [];
            for (let invoice of context.data.invoices) {
              const invoiceTotal = invoice.lines.reduce((p, c) => {
                const amount = c.amount;
                const pricePerUnit = parseFloat(c.offer.pricePerUnit);
                return p + amount * pricePerUnit;
              }, 0);
              /* TODO: Cleanup Hardcoded Euro to timecircles conversion here */
              const amount = currency
                .convertEuroToCircles(invoiceTotal, null)
                .toString();

              const circlesValueInWei = RpcGateway.get()
                .utils.toWei(amount.toString() ?? "0", "ether")
                .toString();

              const flow = await findDirectTransfers(
                invoice.buyerAddress,
                invoice.sellerAddress,
                circlesValueInWei
              );

              /*
              const flow = await requestPathToRecipient({
                data: {
                  safeAddress: invoice.buyerAddress,
                  recipientAddress: invoice.sellerAddress,
                  amount: convertTimeCirclesToCircles(
                    invoiceTotal,
                    null
                  ).toString(),
                },
              });
               */

              if (flow.transfers.length > 0) {
                context.data.payableInvoices.push({
                  invoice: invoice,
                  path: flow,
                });
              }
            }

            console.log(JSON.stringify(context.data.payableInvoices, null, 2));
          },
          onDone: [
            {
              cond: (context) =>
                context.data.invoices.length ==
                context.data.payableInvoices.length,
              target: "#pay",
            },
            {
              cond: (context) =>
                context.data.invoices.length !=
                context.data.payableInvoices.length,
              actions: (context, event) => {
                let invoices = JSON.parse(
                  JSON.stringify(context.data.invoices)
                );
                context.data.payableInvoices.forEach((pi) => {
                  const pi_ = context.data.invoices.find(
                    (o) => o.id == pi.invoice.id
                  );
                  const pi_i = context.data.invoices.indexOf(pi_);
                  invoices = invoices.splice(pi_i, 1);
                });
                const errorMessage = window.i18n("dapps.o-marketplace.processes.purchases.calculatePaths.errorMessage") + `${invoices
                  .map((o) => o.sellerAddress)
                  .join(", ")}`;
                window.o.lastError = new Error(errorMessage);
              },
              target: "#showError",
            },
          ],
          onError: {
            target: "#showError",
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
          },
        },
      },
      pay: {
        id: "pay",
        on: <any>{
          ...ipc("pay"),
        },
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.i18n("dapps.o-marketplace.processes.purchases.pay.message"),
          });
        },
        invoke: {
          src: async (context) => {
            const currentInvoice = context.data.payableInvoices.pop();

            const receipt = await fTransferCircles(
              currentInvoice.invoice.buyerAddress,
              sessionStorage.getItem("circlesKey"),
              currentInvoice.path,
              window.i18n("dapps.o-marketplace.processes.purchases.pay.paymentOfInvoice") + `${currentInvoice.invoice.id}`
            );

            context.data.paidInvoices.push(currentInvoice);
          },
          onDone: [
            {
              cond: (context) => context.data.payableInvoices.length == 0,
              target: "#showSuccess",
            },
            {
              cond: (context) => context.data.payableInvoices.length > 0,
              target: "#pay",
            },
          ],
          onError: {
            target: "#showError",
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
          },
        },
      },
      showError: {
        id: "showError",
        entry: show({
          component: ErrorView,
          params: {},
          field: {
            name: "",
            get: () => undefined,
            set: (o: any) => {},
          },
        }),
      },
      showSuccess: prompt({
        id: "showSuccess",
        entry: () => {
          cartContents.set([]);
        },
        field: "__",
        component: CheckoutConfirm,
        params: {
          view: editorContent.success,
          html: () => ``,
          submitButtonText: editorContent.success.submitButtonText,
          hideNav: false,
        },
        navigation: {
          next: "#success",
        },
      }),
      success: {
        type: "final",
        id: "success",

        data: (context, event: PlatformEvent) => {
          window.o.publishEvent({ type: "shell.root" });
          return "yeah!";
        },
      },
    },
  });

export const purchase: ProcessDefinition<void, PurchaseContextData> = {
  name: "purchase",
  stateMachine: <any>processDefinition,
};
