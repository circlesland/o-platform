import {me, Profile} from "../../shared/stores/me";
import {Subscription} from "rxjs";
import {Safe} from "./data/circles/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {emptySafe} from "./data/emptySafe";
import {Queries} from "./data/circles/queries";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {DelayedTrigger} from "@o-platform/o-utils/dist/delayedTrigger";
import {Banking, InitAction} from "./init2";

let _currentSafe: Safe | null = emptySafe;
let profile: Profile | undefined;
let blockChainEventsSubscription: Subscription | null;
let shellEventSubscription: Subscription | undefined;
let unsubscribeMe: () => void;
let bankingInstance: Banking;

export function tryGetCurrentSafe() {
  return _currentSafe;
}

const transferTrigger = new DelayedTrigger(100, async () => {
  if (!bankingInstance) return;
  await bankingInstance.onTokenTransfer().forEach(progress => {
    reportProgress(bankingInstance.safe, progress.message, progress.percent, !progress.updateUi);
  });
  reportProgress(bankingInstance.safe);
});

const trustTrigger = new DelayedTrigger(1, async () => {
  if (!bankingInstance) return;
  await bankingInstance.onTrustChange().forEach(progress => {
    reportProgress(bankingInstance.safe, progress.message, progress.percent, !progress.updateUi);
  });
  reportProgress(bankingInstance.safe);
});

const mountTrigger = new DelayedTrigger(100, async () => {
  if (!bankingInstance) return;
  await bankingInstance.onMount().forEach(progress => {
    reportProgress(bankingInstance.safe, progress.message, progress.percent, !progress.updateUi);
  });
  reportProgress(bankingInstance.safe);
  await subscribeChainEvents(bankingInstance.safe);
});

export async function init() {
  if (shellEventSubscription) {
    shellEventSubscription.unsubscribe();
  }
  if (unsubscribeMe) {
    unsubscribeMe();
  }

  unsubscribeMe = me.subscribe(async profileOrNull => {
    profile = profileOrNull;
    if (!bankingInstance && RpcGateway.get().utils.isAddress(profileOrNull.circlesAddress ?? "")) {
      bankingInstance = new Banking(RpcGateway.get().utils.toChecksumAddress(profile.circlesAddress));
    } else {
      return;
    }
    if (profileOrNull) {
      mountTrigger.trigger();
    }
  });

  mountTrigger.trigger();

  shellEventSubscription = window.o.events.subscribe(async (event: PlatformEvent & {
    profile: Profile
  }) => {
    if (event.type == "shell.loggedOut") {
      localStorage.removeItem("safe");
      localStorage.removeItem("circlesAddress");
      localStorage.removeItem("circlesKey");
      localStorage.removeItem("lastUBI");
      profile = null;
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: null
      });
      _currentSafe = null;
      return;
    }
  });

  return function stop() {
    shellEventSubscription.unsubscribe();
    unsubscribeMe();
    if (blockChainEventsSubscription) {
      blockChainEventsSubscription.unsubscribe();
    }
  }
}

function reportProgress(safe: Safe, message?:string, progressPercent?:number, dontUpdateData?: boolean) {
  safe.ui = {
    loadingPercent: progressPercent,
    loadingText: message
  };

  if (!dontUpdateData || !_currentSafe) {
    _currentSafe = safe;

    const refreshEvent = <any>{
      type: "shell.refresh",
      dapp: "banking:1",
      data: safe
    };

    console.log(`shell.refresh:`, refreshEvent);
    window.o.publishEvent(refreshEvent);
  }

  const progressEvent = <PlatformEvent><any>{
    type: "shell.progress",
    dapp: "banking:1",
    message: message,
    percent: progressPercent
  };
  console.log(`shell.progress:`, progressEvent);
  window.o.publishEvent(progressEvent);

  _currentSafe.ui = safe.ui;
}

async function subscribeChainEvents(safe: Safe)
{
  if (blockChainEventsSubscription) {
    blockChainEventsSubscription.unsubscribe();
  }

  if (safe && RpcGateway.get().utils.isAddress(safe.safeAddress)) {
    blockChainEventsSubscription = Queries.tokenEvents(safe).subscribe((event: any) => {
      console.log("NEW TRANSFER EVENT:", event);
      transferTrigger.trigger();
    });

    (await Queries.trustEvents(safe)).subscribe((event:any) => {
      console.log("NEW TRUST EVENT:", event);
      trustTrigger.trigger();
    });
  } else {
    console.warn("safe is not set supplied.")
  }
}