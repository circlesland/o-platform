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
import {GetUbiContext, GetUbiContextData} from "./processes/getUbi";
import {getUBIService} from "./processes/getUBIService";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";

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

type LoadParamsFlags = {
  addOwnToken?: boolean,
  addHubTransfers?: boolean,
  addContacts?: boolean,
  addAcceptedTokens?: boolean,
  addBalances?: boolean,
  addDirectTransfers?: boolean
}
type LoadParams = {
  profile: Profile,
  safe: Safe,
  tokenList: string[],
  flags: LoadParamsFlags
}

async function getUBI(safeAddress:string) : Promise<void> {
  try {
    await getUBIService(<ProcessContext<GetUbiContextData>> {
      data: {
        safeAddress,
        privateKey: localStorage.getItem("circlesKey")
      }
    })
    localStorage.setItem("lastUBI", new Date().toJSON());
  } catch (e) {
    console.error("Couldn't retrieve your UBI.")
  }
}

async function checkUBI(safeAddress:string) : Promise<void> {
  const lastUBIDateString = localStorage.getItem("lastUBI");
  if (!lastUBIDateString) {
    return await getUBI(safeAddress);
  } else {
    const date = Date.parse(lastUBIDateString);
    if (date < Date.now() - 24*60*60*1000) {
      return await getUBI(safeAddress);
    }
  }
}

async function load(args: LoadParams): Promise<Safe> {
  if (loading) {
    return;
  }
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

      let safe: Safe = args.safe ?? {
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

      if (args.flags.addOwnToken || args.flags.addOwnToken === undefined) {
        safe = await Queries.addOwnToken(safe);
        console.log(new Date().getTime() + ": " + "Token via web3:", JSON.stringify(safe, null, 2));
      }

      if (args.flags.addHubTransfers || args.flags.addHubTransfers === undefined) {
        safe.ui.loadingText = "Loading hub transfers ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addHubTransfers(safe, safe.token.firstBlock);
        const hubTransferCount = safe.transfers.rows.length;
        console.log(new Date().getTime() + ": " + `Added ${hubTransferCount} hub transfers.`)
      }

      if (args.flags.addContacts || args.flags.addContacts === undefined) {
        safe.ui.loadingPercent = 5;
        safe.ui.loadingText = "Loading trust connections ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addContacts(safe);
        console.log(new Date().getTime() + ": " + `Added ${Object.keys(safe.trustRelations.trusting).length + Object.keys(safe.trustRelations.trustedBy).length} trust relations.`)
      }
      safe.ui.loadingPercent = 18;

      if (args.flags.addAcceptedTokens || args.flags.addAcceptedTokens === undefined) {
        safe.ui.loadingText = "" +
            "Loading accepted tokens ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addAcceptedTokens(safe);
        augmentSafeWithProfiles(safe);
        augmentSafeWithTime(safe);
        console.log(new Date().getTime() + ": " + `Added ${Object.keys(safe.acceptedTokens.tokens).length} accepted tokens.`)
      }

      safe.ui.loadingPercent = 22;

      if (args.flags.addBalances || args.flags.addBalances === undefined) {
        safe.ui.loadingText = "Loading balances ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        safe = await Queries.addxDaiBalances(safe);
        safe = await Queries.addTokenBalances(safe);
        safe.token.balance = (await new Erc20Token(RpcGateway.get(), safe.token.tokenAddress).getBalanceOf(safe.safeAddress)).toString();
        console.log(new Date().getTime() + ": " + `Added balances to ${Object.keys(safe.acceptedTokens.tokens).length} tokens.`)
        publishRefreshEvent(safe);
        _currentSafe = safe;
      }

      const totalBalance = Object.keys(safe.acceptedTokens?.tokens ?? {}).reduce((p: BN, c: string) => p.add(new BN(safe.acceptedTokens.tokens[c].balance)), new BN("0")).add(new BN(safe.token.balance));
      const totalBalanceStr = totalBalance.toString();
      safe.balance = parseFloat(RpcGateway.get().utils.fromWei(totalBalanceStr, "ether")).toFixed(2);

      if (args.flags.addDirectTransfers || args.flags.addDirectTransfers === undefined) {
        safe.ui.loadingPercent = 26;
        safe.ui.loadingText = "Loading direct transfers ..";
        publishRefreshEvent(safe);
        _currentSafe = safe;

        const lastProgress = safe.ui.loadingPercent;
        const remainingPercents = 100 - lastProgress;
        safe = await Queries.addDirectTransfers(
            safe,
            undefined,
            progress => {
              safe.ui.loadingPercent = lastProgress + (remainingPercents / progress.count) * progress.current;
              publishRefreshEvent(safe);
              _currentSafe = safe;
            },
            args.tokenList,
            transfer => transfer.from == "0x0000000000000000000000000000000000000000"
        );
        console.log(new Date().getTime() + ": " + `Added ${safe.transfers.rows.length - safe.transfers?.rows?.length ?? 0} direct transfers.`);
      }

      safe.ui.loadingPercent = 100;
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
          await update(undefined, {});
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
      localStorage.removeItem("lastUBI");
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

  if (_currentSafe) {
    checkUBI(_currentSafe.safeAddress);
  }

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
        _currentSafe = await update(tokenList, {
          addAcceptedTokens: false,
          addContacts: true,
          addDirectTransfers: true,
          addHubTransfers: true,
          addOwnToken: false,
          addBalances: true
        });
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

  if (safe && RpcGateway.get().utils.isAddress(safe.safeAddress)) {
    blockChainEventsSubscription = Queries.tokenEvents(safe).subscribe((event: any) => {
      console.log("NEW EVENT:", event);
      onEventUpdateTrigger.trigger(/*[event.token]*/);
    });
    (await Queries.trustEvents(safe)).subscribe((event:any) => {
      console.log("NEW EVENT:", event);
      onEventUpdateTrigger.trigger(/*[event.token]*/);
    });
  } else {
    console.warn("safe is not set supplied.")
  }
}

async function update(tokenList: string[]|undefined, flags:LoadParamsFlags): Promise<Safe> {
  if (!profile) {
    return;
  }
  if (!_currentSafe || _currentSafe.safeAddress === emptySafe.safeAddress) {
    _currentSafe = await tryRestoreCache();
  }

  _currentSafe = await load({
    safe: _currentSafe,
    tokenList: tokenList,
    profile: profile,
    flags: flags
  });

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