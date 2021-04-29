import {me, Profile} from "../../shared/stores/me";
import {Subscription} from "rxjs";
import {Safe} from "./data/circles/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {emptySafe} from "./data/emptySafe";
import {Queries} from "./data/circles/queries";
import {augmentSafeWithProfiles} from "./data/augmentSafeWithProfiles";
import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";
import {BN} from "ethereumjs-util";
import {showToast} from "../../shared/toast";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {DelayedTrigger} from "@o-platform/o-utils/dist/delayedTrigger";
import {augmentSafeWithTime} from "./data/augmentSafeWithTime";

let _currentSafe: Safe | null = emptySafe;
let loading = false;
let profile: Profile | undefined;
let blockChainEventsSubscription: Subscription | null;

export function tryGetCurrentSafe() {
  return _currentSafe;
}

function publishRefreshEvent(safe:Safe) {
  window.o.publishEvent(<any>{
    type: "shell.refresh",
    dapp: "banking:1",
    data: safe
  });
}

async function load(profile: Profile, cachedSafe: Safe | undefined, tokenList?: string[]): Promise<Safe> {
  if (loading) {
    return;
  }

  /*
  Test max. size of localStorage value:
  if (localStorage && !localStorage.getItem('size')) {
    var i = 0;
    try {
      // Test up to 10 MB
      for (i = 250; i <= 10000; i += 250) {
        localStorage.setItem('test', new Array((i * 1024) + 1).join('a'));
      }
    } catch (e) {
      localStorage.removeItem('test');
      localStorage.setItem('size', (i - 250).toString());
    }
  }
   */

  loading = true;

  return new Promise<Safe>(async (resolve, reject) => {
    try {
      if (!RpcGateway.get().utils.isAddress(profile.circlesAddress ?? "")) {
        localStorage.removeItem("safe");
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: emptySafe
        });
        _currentSafe = emptySafe;
        return;
      }

      let safe: Safe = cachedSafe ?? {
        safeAddress: profile.circlesAddress,
        ui: {
          loadingPercent: 0
        }
      };

      let _watchLoadingPercent = safe.ui?.loadingPercent;
      const timeoutHandle = setInterval(() => {
        console.log("RPC watchdog: checking for progress ..")
        if (safe?.ui?.loadingPercent === 0 || safe?.ui?.loadingPercent === null || safe?.ui?.loadingPercent === undefined) {
          console.log("RPC watchdog: checking for progress .. Process got stuck. Sending error ..")
          clearInterval(timeoutHandle);
          reject(new Error("slow_provider"));
          return;
        }
        if (safe.ui?.loadingPercent && safe.ui?.loadingPercent == _watchLoadingPercent) {
          console.log("RPC watchdog: checking for progress .. Process got stuck. Sending error ..")
          clearInterval(timeoutHandle);
          reject(new Error("slow_provider"));
          return;
        } else {
          console.log("RPC watchdog: checking for progress .. Process is moving. Leaving.")
          _watchLoadingPercent = safe.ui?.loadingPercent;
        }
      }, 5000);

      if (tokenList && tokenList.length == 0) {
        // Update only the trusts
        // TODO: Make this nicer
        safe = await Queries.addContacts(safe);
        console.log(new Date().getTime() + ": " + `Added ${Object.keys(safe.trustRelations.trusting).length + Object.keys(safe.trustRelations.trustedBy).length} trust relations.`)
        safe.ui.loadingPercent = 18;
        safe.ui.loadingText = "" +
          "Loading accepted tokens ..";
        await augmentSafeWithProfiles(safe);
        publishRefreshEvent(safe);
        localStorage.setItem("safe", JSON.stringify(safe));
        _currentSafe = safe;
      } else {

        safe = await Queries.addOwnToken(safe);
        console.log(new Date().getTime() + ": " + "Token via web3:", JSON.stringify(safe, null, 2));

        safe.ui.loadingText = "Loading hub transfers ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addHubTransfers(safe, safe.token.firstBlock);
        const hubTransferCount = safe.transfers.rows.length;
        console.log(new Date().getTime() + ": " + `Added ${hubTransferCount} hub transfers.`)
        safe.ui.loadingPercent = 5;
        safe.ui.loadingText = "Loading trust connections ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addContacts(safe);
        console.log(new Date().getTime() + ": " + `Added ${Object.keys(safe.trustRelations.trusting).length + Object.keys(safe.trustRelations.trustedBy).length} trust relations.`)
        safe.ui.loadingPercent = 18;
        safe.ui.loadingText = "" +
          "Loading accepted tokens ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addAcceptedTokens(safe);
        augmentSafeWithProfiles(safe);
        augmentSafeWithTime(safe);
        console.log(new Date().getTime() + ": " + `Added ${Object.keys(safe.acceptedTokens.tokens).length} accepted tokens.`)
        safe.ui.loadingPercent = 22;
        safe.ui.loadingText = "Loading balances ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addxDaiBalances(safe);
        safe = await Queries.addTokenBalances(safe);
        safe.token.balance = (await new Erc20Token(RpcGateway.get(), safe.token.tokenAddress).getBalanceOf(safe.safeAddress)).toString();
        console.log(new Date().getTime() + ": " + `Added balances to ${Object.keys(safe.acceptedTokens.tokens).length} tokens.`)
        publishRefreshEvent(safe);
        _currentSafe = safe;

        const totalBalance = Object.keys(safe.acceptedTokens.tokens).reduce((p: BN, c: string) => p.add(new BN(safe.acceptedTokens.tokens[c].balance)), new BN("0")).add(new BN(safe.token.balance));
        const totalBalanceStr = totalBalance.toString();
        safe.balance = parseFloat(RpcGateway.get().utils.fromWei(totalBalanceStr, "ether")).toFixed(2);
        safe.ui.loadingPercent = 26;
        safe.ui.loadingText = "Loading direct transfers ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        const lastProgress = safe.ui.loadingPercent;
        const remainingPercents = 100 - lastProgress;
        safe = await Queries.addDirectTransfers(safe, undefined, progress => {
          safe.ui.loadingPercent = lastProgress + (remainingPercents / progress.count) * progress.current;
          publishRefreshEvent(safe);
          _currentSafe = safe;
          // publishRefreshEvent(safe);
        }, tokenList);
        console.log(new Date().getTime() + ": " + `Added ${safe.transfers.rows.length - hubTransferCount} direct transfers.`);
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe.ui.loadingPercent = undefined;
        safe.ui.loadingText = undefined;

        clearInterval(timeoutHandle);

        await augmentSafeWithTime(safe);
        localStorage.setItem("safe", JSON.stringify(safe));

        await augmentSafeWithProfiles(safe);
        publishRefreshEvent(safe);
        _currentSafe = safe;

        await subscribeChainEvents(safe);
      }

      return resolve(safe);
    } catch (e) {
      localStorage.removeItem("safe");
      reject(e);
    } finally {
      loading = false;
    }
  });
}

let shellEventSubscription: Subscription | undefined;
let unsubscribeMe: () => void;

export function init() {
  if (shellEventSubscription) {
    shellEventSubscription.unsubscribe();
  }

  unsubscribeMe = me.subscribe(async profileOrNull => {
    profile = profileOrNull;
    if (profileOrNull && RpcGateway.get().utils.isAddress(profileOrNull.circlesAddress ?? "")) {
      for (let i = 0; i < RpcGateway.gateways.length; i++) {
        try {
          await update();
          return;
        } catch (e) {
          if (e.message === "slow_provider") {
            loading = false;
            RpcGateway.rotateProvider();
            console.warn("The provider took too long to answer. Retrying with a different provider ...");
          } else {
            throw e;
          }
        }
      }
    }

    // TODO: When we reach this point all requests failed. Show an error to the user.
    showToast("error", "The connection to the RPC gateway was lost and we weren't " +
      "able to restore it in time. Please refresh the page to give it another try.");

    localStorage.removeItem("safe");
  });

  shellEventSubscription = window.o.events.subscribe(async (event: PlatformEvent & {
    profile: Profile
  }) => {
    if (event.type == "shell.loggedOut") {
      localStorage.removeItem("safe");
      localStorage.removeItem("circlesAddress");
      localStorage.removeItem("circlesKey");
      profile = null;
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: null
      });
      _currentSafe = null;
      return;
    } else if (event.type === "circles.web3providerChanged") {
      if (!loading) {
        await subscribeChainEvents(_currentSafe);
      }
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

async function subscribeChainEvents(safe: Safe) {
  if (blockChainEventsSubscription) {
    blockChainEventsSubscription.unsubscribe();
  }
  let onEventUpdateTrigger = new DelayedTrigger(500, async (tokenList: string[]) => {
    for (let i = 0; i < RpcGateway.gateways.length; i++) {
      try {
        _currentSafe = await update(tokenList);
        return;
      } catch (e) {
        if (e.message === "slow_provider") {
          loading = false;
          RpcGateway.rotateProvider();
          console.warn("The provider took too long to answer. Retrying with a different provider ...");
        } else {
          throw e;
        }
      }
    }

    // TODO: When we reach this point all requests failed. Show an error to the user.
    showToast("error", "The connection to the RPC gateway was lost and we weren't " +
      "able to restore it in time. Please refresh the page to give it another try.");

  });

  if (_currentSafe) {
    blockChainEventsSubscription = Queries.tokenEvents(_currentSafe).subscribe((event: any) => {
      console.log("NEW EVENT:", event);
      onEventUpdateTrigger.trigger([event.token]);
    });
    (await Queries.trustEvents(_currentSafe)).subscribe((event:any) => {
      console.log("NEW EVENT:", event);
      onEventUpdateTrigger.trigger([]);
    });
  } else {
    console.warn("_current safe is not set.")
  }
}

async function update(tokenList?: string[]): Promise<Safe> {
  if (!profile) {
    return;
  }
  if (!_currentSafe || _currentSafe.safeAddress === emptySafe.safeAddress) {
    _currentSafe = await tryRestoreCache();
  }
  if (_currentSafe && _currentSafe.safeAddress !== emptySafe.safeAddress) {
    // Update the cached safe
    _currentSafe = await load(profile, _currentSafe, tokenList);
  } else {
    // Load a completely new safe
    _currentSafe = await load(profile, undefined, tokenList);
  }
  return _currentSafe;
}

async function tryRestoreCache() {
  const cachedSafeJson = localStorage.getItem("safe");
  if (!cachedSafeJson) {
    return;
  } else {
    try {
      const safe = JSON.parse(cachedSafeJson);
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;
      await augmentSafeWithProfiles(safe);
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;
      return safe;
    } catch (e) {
      console.error("An error occurred while restoring or updating the cached safe:", e);
      localStorage.removeItem("safe");
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: emptySafe
      });
      _currentSafe = emptySafe;
      return undefined;
    }
  }
}