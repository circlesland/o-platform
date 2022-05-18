import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import CheckoutDelivery from "../../o-marketplace/molecules/CheckoutDelivery.svelte";
import CheckoutSummary from "../../o-marketplace/molecules/CheckoutSummary.svelte";
import CheckoutConfirmation from "../../o-marketplace/molecules/CheckoutConfirmation.svelte";
import {
  Profile,
  Offer,
  CreatePurchaseDocument,
  PurchaseLineInput,
  Invoice,
  AnnouncePaymentDocument,
  EventType,
  CreatePurchaseMutationVariables,
  Purchase,
  OffersByIdAndVersionQuery,
  OffersByIdAndVersionDocument,
  OfferByIdAndVersionInput,
  QueryOffersByIdAndVersionArgs,
} from "../../../shared/api/data/types";
import { show } from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Currency } from "../../../shared/currency";

import { fTransferCircles, fTransferCirclesHashOnly, TransitivePath } from "../../o-banking/processes/transferCircles";

import { cartContents } from "../stores/shoppingCartStore";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { findDirectTransfers } from "../../o-banking/processes/transfer";
import { myPurchases } from "../../../shared/stores/myPurchases";
import { Environment } from "../../../shared/environment";
import { setWindowLastError } from "../../../shared/processes/actions/setWindowLastError";
import { ApiClient } from "../../../shared/apiConnection";
import { ShoppingCartItem } from "../types/ShoppingCartItem";

export type PurchaseContextData = {
  items: ShoppingCartItem[];
  metadata?: string;
  sellerProfile?: Profile;
  invoices?: Invoice[];
  pickupCode?: string;
  simplePickupCode?: string;
  payableInvoices?: {
    invoice: Invoice;
    path: TransitivePath;
  }[];
  paidInvoices?: {
    invoice: Invoice;
    path: TransitivePath;
  }[];
  redirectTo?: string;
};

export type PurchaseContext = ProcessContext<PurchaseContextData>;

const processDefinition = (processId: string) =>
  createMachine<PurchaseContext, any>({
    id: `${processId}:purchase`,
    initial: "init",
    states: {
      ...fatalError<PurchaseContext, any>("error"),

      init: {
        id: "init",
        entry: [
          loadAndSetCartContents,
          // TODO: BOTH ACTIONS ASSUME ALL ITEMS ARE FROM THE SAME SELLER
          setFirstSellerAsSellerProfile,
          loadAndSetFirstShopMetadata,
        ],
        invoke: {
          src: async (context: PurchaseContext) => {
            // context.data.items[0].offerId = 8273642837462;
            let offers = await ApiClient.query<Offer[], QueryOffersByIdAndVersionArgs>(OffersByIdAndVersionDocument, {
              query: context.data.items.map((o) => {
                return <OfferByIdAndVersionInput>{
                  offerId: o.offerId,
                  offerVersion: o.version,
                };
              }),
            });

            console.log("ITEM", offers);

            return context.data;
          },
          onDone: "#checkoutDelivery",
        },
      },

      checkoutDelivery: prompt<PurchaseContext, any>({
        id: "checkoutDelivery",
        field: "deliveryMethod",
        component: CheckoutDelivery,
        params: {
          view: editorContent.delivery,
          submitButtonText: editorContent.delivery.submitButtonText,
        },
        navigation: {
          next: "#checkoutSummary",
        },
      }),

      checkoutSummary: prompt<PurchaseContext, any>({
        id: "checkoutSummary",
        field: "metadata",
        component: CheckoutSummary,
        params: {
          view: editorContent.summary,
          submitButtonText: editorContent.summary.submitButtonText,
        },
        navigation: {
          next: "#createPurchase",
          canGoBack: () => true,
        },
      }),

      createPurchase: {
        id: "createPurchase",
        entry: [showCreatePurchaseWaitingMessage, setShopMetadata],
        invoke: {
          src: createPurchaseService,
          onDone: "#calculatePaths",
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },

      calculatePaths: {
        id: "calculatePaths",
        entry: showCalculatePathWaitingMessage,
        invoke: {
          src: calculatePathService,
          onDone: [
            {
              cond: allInvoicesArePayable,
              target: "#pay",
            },
            {
              cond: notAllInvoicesArePayable,
              actions: setNotAllInvoicesArePayableError,
              target: "#showError",
            },
          ],
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },

      pay: {
        id: "pay",
        on: <any>{
          ...ipc("pay"),
        },
        entry: showPaymentTransferWaitingMessage,
        invoke: {
          src: paySingleInvoiceAndRemoveItFromContext,
          onDone: [
            {
              cond: allInvoicesArePayed,
              target: "#showSuccess",
            },
            {
              cond: notAllInvoicesArePayed,
              target: "#pay",
            },
          ],
          onError: {
            target: "#showError",
            actions: setWindowLastError,
          },
        },
      },

      showError: {
        id: "showError",
        entry: showErrorView,
      },

      showSuccess: prompt({
        id: "showSuccess",
        entry: resetCartContents,
        field: "redirectTo",
        component: CheckoutConfirmation,
        params: (context) => {
          return {
            view: {
              title: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.success.title"),
              description: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.success.description"),
              placeholder: "",
              submitButtonText: window.i18n(
                "dapps.o-marketplace.processes.purchases.editorContent.success.submitButtonText"
              ),
            },
            html: ``,
            simplePickupCode: context.data.simplePickupCode,
            pickupCode: context.data.pickupCode,
            submitButtonText: window.i18n(
              "dapps.o-marketplace.processes.purchases.editorContent.success.submitButtonText"
            ),
            hideNav: false,
          };
        },
        navigation: {
          next: "#success",
        },
      }),

      success: {
        type: "final",
        id: "success",
        data: (context, event: PlatformEvent) => {
          return context.data;
        },
      },
    },
  });

const editorContent: { [x: string]: EditorViewContext } = {
  summary: {
    title: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.summary.title"),
    description: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.summary.description"),
    placeholder: "",
    submitButtonText: window.i18n("dapps.o-marketplace.processes.purchases.editorContent.summary.submitButtonText"),
  },
  delivery: {
    title: "Delivery options",
    description: "Please select a delivery option",
    placeholder: "",
    submitButtonText: "Next",
  },
};

const loadAndSetFirstShopMetadata = (context) => {
  context.data.metadata = JSON.parse(
    context.data.items.length > 0 ? Environment.getShopMetadata(context.data.items[0].shopId) : "undefined"
  );
};

const setShopMetadata = (context) =>
  context.data.metadata
    ? Environment.setShopMetadata(context.data.items[0].shopId, JSON.stringify(context.data.metadata))
    : "undefined";

const showCreatePurchaseWaitingMessage = () =>
  window.o.publishEvent(<PlatformEvent>{
    type: "shell.progress",
    message: window.i18n("dapps.o-marketplace.processes.purchases.createPurchase.message"),
  });

const createPurchaseService = async (context) => {
  console.log("METADAATATATA: ", context.data.metadata);
  const linesGroupedByOffer: { [offerId: number]: number } = {};
  context.data.items.forEach((o) => {
    linesGroupedByOffer[o.id] = linesGroupedByOffer[o.id] ? linesGroupedByOffer[o.id] + 1 : 1;
  });

  const result = await ApiClient.mutate<Purchase, CreatePurchaseMutationVariables>(CreatePurchaseDocument, {
    deliveryMethodId: 1,
    lines: Object.entries(linesGroupedByOffer).map((o) => {
      return <PurchaseLineInput>{
        offerId: parseInt(o[0]),
        amount: o[1],
        metadata: JSON.stringify(context.data.metadata),
      };
    }),
  });

  context.data.invoices = result;
  if (context.data.invoices.length > 0) {
    await myPurchases.findSingleItemFallback([EventType.Purchased], context.data.invoices[0].purchaseId.toString());
  }
  myPurchases.refresh();
};

const loadAndSetCartContents = (context: ProcessContext<PurchaseContextData>) => {
  const cartContents = JSON.parse(localStorage.getItem("cartContents"));
  if (cartContents) {
    context.data.items = cartContents;
  }
};

const setFirstSellerAsSellerProfile = (context) => {
  context.data.sellerProfile = context.data.items[0].createdByProfile;
};

const showCalculatePathWaitingMessage = () => {
  window.o.publishEvent(<PlatformEvent>{
    type: "shell.progress",
    message: window.i18n("dapps.o-marketplace.processes.purchases.calculatePaths.message"),
  });
};

const calculatePathService = async (context) => {
  context.data.payableInvoices = [];
  context.data.paidInvoices = [];
  for (let invoice of context.data.invoices) {
    const invoiceTotal = invoice.lines.reduce((p, c) => {
      const amount = c.amount;
      const pricePerUnit = parseFloat(c.offer.pricePerUnit);
      return p + amount * pricePerUnit;
    }, 0);
    /* TODO: Cleanup Hardcoded Euro to timecircles conversion here */
    const currency = Currency.instance();
    const amount = currency.convertEuroToCircles(invoiceTotal, null).toString();

    const circlesValueInWei = RpcGateway.get()
      .utils.toWei(amount.toString() ?? "0", "ether")
      .toString();

    const flow = await findDirectTransfers(invoice.buyerAddress, invoice.sellerAddress, circlesValueInWei);

    if (flow.transfers.length > 0) {
      context.data.payableInvoices.push({
        invoice: invoice,
        path: flow,
      });
    }
  }

  console.log(JSON.stringify(context.data.payableInvoices, null, 2));
};

const showPaymentTransferWaitingMessage = () => {
  window.o.publishEvent(<PlatformEvent>{
    type: "shell.progress",
    message: window.i18n("dapps.o-marketplace.processes.purchases.pay.message"),
  });
};

const allInvoicesArePayable = (context) => context.data.invoices.length == context.data.payableInvoices.length;
const notAllInvoicesArePayable = (context) => context.data.invoices.length != context.data.payableInvoices.length;

const setNotAllInvoicesArePayableError = (context, event) => {
  let invoices = JSON.parse(JSON.stringify(context.data.invoices));
  context.data.payableInvoices.forEach((pi) => {
    const pi_ = context.data.invoices.find((o) => o.id == pi.invoice.id);
    const pi_i = context.data.invoices.indexOf(pi_);
    invoices = invoices.splice(pi_i, 1);
  });
  const errorMessage =
    window.i18n("dapps.o-marketplace.processes.purchases.calculatePaths.errorMessage") +
    `${invoices.map((o) => o.sellerAddress).join(", ")}`;
  window.o.lastError = new Error(errorMessage);
};

const paySingleInvoiceAndRemoveItFromContext = async (context) => {
  const currentInvoice = context.data.payableInvoices.pop();

  // TODO: Calculate the transaction hash and send it to the api so that it can wait for this specific tx
  const txHash = await fTransferCirclesHashOnly(
    currentInvoice.invoice.buyerAddress,
    sessionStorage.getItem("circlesKey"),
    currentInvoice.path
  );

  console.log(`Announcing txHash: ${txHash}`);

  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const announceResult = await apiClient.mutate({
    mutation: AnnouncePaymentDocument,
    variables: {
      transactionHash: txHash,
      invoiceId: currentInvoice.invoice.id,
    },
  });

  context.data.pickupCode = announceResult.data.announcePayment.pickupCode;
  context.data.simplePickupCode = announceResult.data.announcePayment.simplePickupCode;
  console.log(
    `Your pickup code is: ${context.data.pickupCode}. Short pickup code is: ${context.data.simplePickupCode}`
  );

  context.data.invoices = <Invoice[]>context.data.invoices;
  if (context.data.invoices.length > 0) {
    await myPurchases.findSingleItemFallback([EventType.Purchased], context.data.invoices[0].purchaseId.toString());
  }

  myPurchases.refresh();

  const receipt = await fTransferCircles(
    currentInvoice.invoice.buyerAddress,
    sessionStorage.getItem("circlesKey"),
    currentInvoice.path,
    window.i18n("dapps.o-marketplace.processes.purchases.pay.paymentOfInvoice") + `${currentInvoice.invoice.id}`
  );

  context.data.paidInvoices.push(currentInvoice);
};

const allInvoicesArePayed = (context) => context.data.payableInvoices.length == 0;
const notAllInvoicesArePayed = (context) => context.data.payableInvoices.length > 0;

const showErrorView = show({
  component: ErrorView,
  params: {},
  field: {
    name: "",
    get: () => undefined,
    set: (o: any) => {},
  },
});

const resetCartContents = () => cartContents.set([]);

export const purchase: ProcessDefinition<void, PurchaseContextData> = {
  name: "purchase",
  stateMachine: <any>processDefinition,
};
