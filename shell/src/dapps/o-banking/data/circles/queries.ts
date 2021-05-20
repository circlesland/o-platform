import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";
import {BlockchainEvent} from "@o-platform/o-events/dist/blockchainEvent";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";
import {Observable, Subject} from "rxjs";
import {CirclesToken} from "@o-platform/o-circles/dist/model/circlesToken";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Safe, Token, Transfer, TrustObject} from "./types";

export class Queries {
  static async addOwnToken(safe: Safe): Promise<Safe> {
    if (RpcGateway.get().utils.isAddress(safe.token?.tokenAddress ?? "")) {
      console.log("skipping addOwnToken()")
      return safe;
    }
    const checksumSafeAddress = RpcGateway.get().utils.toChecksumAddress(safe.safeAddress);
    const foundTokenOrNull = await new CirclesAccount(checksumSafeAddress).tryGetMyToken(!!safe.firstBlock ? safe.firstBlock : undefined);
    if (!foundTokenOrNull) {
      console.log("The safe isn't yet signed-up at the circles hub")
    } else {
      (<any>foundTokenOrNull).limit = 100;
    }

    return {
      ...safe,
      token: foundTokenOrNull
    }
  }

  static async addxDaiBalances(safe: Safe) : Promise<Safe> {
    const accountAddress = localStorage.getItem("circlesKey")
      ? RpcGateway.get().eth.accounts.privateKeyToAccount(localStorage.getItem("circlesKey")).address
      : undefined;

    return {
      ...safe,
      xDaiBalance: await RpcGateway.get().eth.getBalance(safe.safeAddress),
      accountxDai: accountAddress ? await RpcGateway.get().eth.getBalance(accountAddress) : "0",
    }
  }

  static async addTokenBalances(safe: Safe) : Promise<Safe> {
    const tokens = safe.acceptedTokens.tokens;
    const promises = Object.keys(tokens).map(address => tokens[address])
      .map(async token => {
        token.balance = (await new Erc20Token(RpcGateway.get(), token.tokenAddress).getBalanceOf(safe.safeAddress)).toString();
      });

    await Promise.all(promises);

    return {
      ...safe,
      acceptedTokens: {
        ...safe.acceptedTokens,
        tokens
      }
    }
  }

  static async addAcceptedTokens(safe: Safe): Promise<Safe> {
    if (!safe.trustRelations?.trusting) {
      throw new Error(`The 'trusting' property of safe ${safe.safeAddress} must be populated in order to call 'addAcceptedTokens()'`);
    }

    const acceptedTokens = safe.acceptedTokens ?? {
      firstBlock: 0,
      lastBlock: 0,
      tokens: {}
    };

    const trustedBy = Object.keys(safe.trustRelations.trusting).map(address => safe.trustRelations.trusting[address]);
    const requests = trustedBy.map(async trust => {
      const checksumSafeAddress = RpcGateway.get().utils.toChecksumAddress(trust.safeAddress);
      return {
        token: (await this.addOwnToken({safeAddress: checksumSafeAddress})).token,
        limit: trust.limit,
        lastTrustBlock: trust.lastBlock
      };
    });
    const trustedByTokens = await Promise.all(requests);
    trustedByTokens.filter(o => o.token)
      .forEach(acceptedToken => {
        let firstBlock:number = undefined;
        let lastBlock:number = undefined;
        let limit = undefined;
        if (acceptedTokens.tokens[acceptedToken.token.tokenAddress]) {
          firstBlock = acceptedTokens.tokens[acceptedToken.token.tokenAddress].firstBlock;
          lastBlock = acceptedTokens.tokens[acceptedToken.token.tokenAddress].lastBlock;
          limit = acceptedTokens.tokens[acceptedToken.token.tokenAddress].limit;
        }

        const trustIsNewer = acceptedToken.lastTrustBlock > lastBlock;

        acceptedTokens.tokens[acceptedToken.token.tokenAddress] = <(Token & { lastBlock: number, limit: number })>{
          ...acceptedToken.token,
          limit: trustIsNewer || !limit ? acceptedToken.limit : limit,
          firstBlock: this.min(firstBlock, acceptedToken.token.firstBlock),
          lastBlock: this.max(lastBlock, trustIsNewer ? acceptedToken.lastTrustBlock : acceptedToken.token.firstBlock)
        };

        acceptedTokens.firstBlock = this.min(acceptedTokens.firstBlock, acceptedToken.token.firstBlock);
        acceptedTokens.lastBlock = this.max(acceptedTokens.lastBlock, acceptedToken.lastTrustBlock);

        if (acceptedTokens.firstBlock > acceptedTokens.lastBlock) {
          throw new Error("acceptedTokens.firstBlock > acceptedTokens.lastBlock");
        }
      });

    return {
      ...safe,
      acceptedTokens
    };
  }

  static async addHubTransfers(safe: Safe, startBlock?: number): Promise<Safe> {
    const checksumSafeAddress = RpcGateway.get().utils.toChecksumAddress(safe.safeAddress);
    const transfers = JSON.parse(JSON.stringify(safe.transfers ?? {
      rows: [],
      lastBlock: 0,
      firstBlock: 0
    }));

    const startAt = !transfers.lastBlock ? startBlock : transfers.lastBlock + 1;
    console.log("addHubTransfers() is starting at" + startAt)
    await new CirclesAccount(checksumSafeAddress).findHubTransfers(startAt).forEach(hubTransfer => {
      transfers.rows.push({
        _id: `${hubTransfer.blockNumber}${hubTransfer.returnValues.from}${hubTransfer.returnValues.to}`,
        type: "hub",
        symbol: "crc",
        direction: hubTransfer.returnValues.from == checksumSafeAddress ? "out" : "in",
        firstBlock: hubTransfer.blockNumber,
        from: hubTransfer.returnValues.from,
        to: hubTransfer.returnValues.to,
        amount: hubTransfer.returnValues.amount
      });
      transfers.firstBlock = this.min(transfers.firstBlock, hubTransfer.blockNumber);
      transfers.lastBlock = this.max(transfers.lastBlock, hubTransfer.blockNumber);
    });

    transfers.rows = transfers.rows.sort((a, b) =>
      a.firstBlock > b.firstBlock ? -1 : a.firstBlock < b.firstBlock ? 1 : 0);

    return {
      ...safe,
      transfers: transfers
    }
  }

  static tokenEvents(safe:Safe) : Observable<PlatformEvent> {
    if (!safe.token?.tokenAddress) {
      throw new Error(`The safe.token.tokenAddress must be set.`)
    }
    const token = new CirclesToken(safe.token.tokenAddress, safe.safeAddress, safe.token.firstBlock);
    const sub = new Subject<PlatformEvent>();
    const tokensByAddress = {
      ...safe.acceptedTokens.tokens,
      ...{
        [safe.token.tokenAddress]: safe.token
      }
    };
    token.subscribeToTransactions(<any>sub, safe.safeAddress, tokensByAddress, Object.keys(safe.acceptedTokens.tokens).concat(safe.token.tokenAddress && safe.token.tokenAddress !== "0x00" ? [safe.token.tokenAddress] : []))

    return sub;
  }

  static async trustEvents(safe:Safe) : Promise<Observable<PlatformEvent>> {
    if (!safe.safeAddress) {
      throw new Error(`The safe.safeAddress must be set.`)
    }
    const account = new CirclesAccount(safe.safeAddress);
    return <any>account.subscribeToTrustEvents(await RpcGateway.get().eth.getBlockNumber());
  }

  static async addDirectTransfers(
    safe: Safe,
    startBlock?: number,
    progressCallback?:(progress:{count:number, current:number}) => void,
    tokenList?:string[],
    filterPredicate?:(transfer:Transfer) => boolean): Promise<Safe> {
    if (!safe.acceptedTokens) {
      throw new Error(`The 'acceptedTokens' property must be set.`)
    }

    const checksumSafeAddress = RpcGateway.get().utils.toChecksumAddress(safe.safeAddress);
    const transfers = JSON.parse(JSON.stringify(safe.transfers ?? {
      rows: [],
      lastBlock: 0,
      firstBlock: 0
    }));

    let tokenAddresses = tokenList ?? [safe.token.tokenAddress];
    let current = 0;
    for (let tokenAddress of tokenAddresses) {
      current++;
      let token = safe.acceptedTokens.tokens[tokenAddress];
      if (!token && tokenAddress === safe.token.tokenAddress) {
        token = {...safe.token, limit: 100, lastBlock: safe.token.firstBlock};
      }
      console.log(`Direct transfers of token (${tokenAddress}) via web3 ..`);

      const lastDirectTransferBlock = safe.transfers?.rows.filter(o => o.type === "direct").reduce<number>((p,c) => c.firstBlock > (p ?? 0) ? c.firstBlock : (p ?? 0), undefined)
      const startAt = !lastDirectTransferBlock ? (startBlock ?? token.firstBlock) : lastDirectTransferBlock + 1;
      console.log("addDirectTransfers() is starting at" + startAt)
      await new Erc20Token(RpcGateway.get(), tokenAddress)
        .findTransfers(checksumSafeAddress, startAt)
        .forEach(directTransfer => {
          const newTransfer = <Transfer>{
            _id: `${directTransfer.blockNumber}${directTransfer.returnValues.from}${directTransfer.returnValues.to}`,
            type: "direct",
            symbol: "crc",
            direction: directTransfer.returnValues.from == checksumSafeAddress ? "out" : "in",
            firstBlock: directTransfer.blockNumber,
            from: directTransfer.returnValues.from,
            to: directTransfer.returnValues.to,
            amount: directTransfer.returnValues.value,
            token: directTransfer.token.address
          }

          if (!filterPredicate || filterPredicate(newTransfer)) {
            transfers.rows.push(newTransfer);
          }

          transfers.firstBlock = this.min(transfers.firstBlock, directTransfer.blockNumber);
          transfers.lastBlock = this.max(transfers.lastBlock, directTransfer.blockNumber);
          // Update the 'first/lastBlock' of the transferred 'acceptedToken'
          const t = safe.acceptedTokens.tokens[directTransfer.token.address]
          if (t) {
            t.firstBlock = this.min(t.firstBlock, directTransfer.blockNumber);
            t.lastBlock = this.max(t.lastBlock, directTransfer.blockNumber);
          }
        });
      if (progressCallback) {
        progressCallback({
          count:tokenAddresses.length,
          current:current
        });
      }
      console.log(`Direct transfers of token (${tokenAddress}) via web3 .. Done`,);
    }

    transfers.rows = transfers.rows.sort((a, b) =>
      a.firstBlock > b.firstBlock ? -1 : a.firstBlock < b.firstBlock ? 1 : 0);

    return {
      ...safe,
      transfers: transfers
    }
  }

  static max(current: number | undefined, candidate: number): number {
    return !current ? candidate : Math.max(current, candidate);
  }

  static min(current: number | undefined, candidate: number): number {
    return !current ? candidate : Math.min(current, candidate);
  }

  static async addContacts(safe: Safe, startBlock?: number): Promise<Safe> {
    const checksumSafeAddress = RpcGateway.get().utils.toChecksumAddress(safe.safeAddress);
    const startAt = !safe.trustRelations?.lastBlock ? startBlock : safe.trustRelations.lastBlock + 1;
    console.log("addContacts() is starting at" + startAt)
    const trustEvents = await this.readTrustEvents(checksumSafeAddress, startAt);
    const sortedAsc = trustEvents.sort((a, b) =>
      a.blockNumber > b.blockNumber ? 1 : a.blockNumber < b.blockNumber ? -1 : 0);

    const trustRelations = sortedAsc.reduce((p, c) => {
      let trustGiver: string, trustReceiver: string;
      let trustLimit: number = parseInt(c.returnValues.limit);
      if (c.returnValues.user == checksumSafeAddress) {
        // "safeAddress" is the trust-receiver
        trustGiver = c.returnValues.canSendTo;
        const firstBlock = this.min(p.trustedBy[trustGiver]?.firstBlock, c.blockNumber);
        const lastBlock = this.max(p.trustedBy[trustGiver]?.lastBlock, c.blockNumber);
        p.trustedBy[trustGiver] = {
          _id: `${lastBlock}${trustGiver}${safe.safeAddress}`,
          safeAddress: trustGiver,
          firstBlock: firstBlock,
          lastBlock: lastBlock,
          limit: p.trustedBy[trustGiver]?.lastBlock > c.blockNumber ? p.trustedBy[trustGiver]?.limit : trustLimit
        };
      } else {
        // "safeAddress" is the trust-giver
        trustReceiver = c.returnValues.user;
        const firstBlock = this.min(p.trusting[trustReceiver]?.firstBlock, c.blockNumber);
        const lastBlock = this.max(p.trusting[trustReceiver]?.lastBlock, c.blockNumber);
        p.trusting[trustReceiver] = {
          _id: `${lastBlock}${safe.safeAddress}${trustReceiver}`,
          safeAddress: trustReceiver,
          firstBlock: firstBlock,
          lastBlock: lastBlock,
          limit: p.trusting[trustReceiver]?.lastBlock > c.blockNumber ? p.trusting[trustReceiver]?.limit : trustLimit
        };
      }
      p.firstBlock = this.min(p.firstBlock, c.blockNumber);
      p.lastBlock = this.max(p.lastBlock, c.blockNumber);

      return p;
    }, {
      safeAddress: safe.safeAddress,
      firstBlock: safe?.firstBlock ?? 0,
      lastBlock: safe?.lastBlock ?? 0,
      mutualTrusts: safe.trustRelations?.mutualTrusts ?? {},
      trusting: safe.trustRelations?.trusting ?? {},
      trustedBy: safe.trustRelations?.trustedBy ?? {},
      untrusted: safe.trustRelations?.untrusted ?? {}
    });

    Object.keys(trustRelations.trusting).forEach(trustingKey => {
      if (trustRelations.trusting[trustingKey]?.limit === 0) {
        trustRelations.untrusted[trustingKey] = trustRelations.trusting[trustingKey];
        trustRelations.trusting[trustingKey].hide = true;
      }
    });
    Object.keys(trustRelations.trustedBy).forEach(trustingKey => {
      if (trustRelations.trustedBy[trustingKey]?.limit === 0)
        trustRelations.trustedBy[trustingKey].hide = true;
    });

    const pairs: {[safeAddress:string]: {
      _id:string,
      trusting: TrustObject|null,
      trustedBy: TrustObject|null
    }} = {};

    Object.values(trustRelations.trustedBy).forEach(o => {
      if (!pairs[o.safeAddress]) {
        pairs[o.safeAddress] = {
          _id:"",
          trusting: null,
          trustedBy: null
        };
      }
      if (o.limit > 0) {
        pairs[o.safeAddress]._id += o._id;
        pairs[o.safeAddress].trustedBy = o;
      }
    })
    Object.values(trustRelations.trusting).forEach(o => {
      if (!pairs[o.safeAddress]) {
        pairs[o.safeAddress] = {
          _id:"",
          trusting: null,
          trustedBy: null
        };
      }
      if (o.limit > 0) {
        pairs[o.safeAddress]._id += o._id;
        pairs[o.safeAddress].trusting = o;
      }
    })

    trustRelations.mutualTrusts = Object.values(pairs).filter(o => o.trusting && o.trustedBy).reduce((p,c) => {
      p[c.trusting.safeAddress] = c;

      if (trustRelations.trustedBy[c.trusting.safeAddress]) {
        trustRelations.trustedBy[c.trusting.safeAddress].hide = true;
      }
      if (trustRelations.trusting[c.trusting.safeAddress]) {
        trustRelations.trusting[c.trusting.safeAddress].hide = true;
      }
      return p;
    },{});

    return {
      ...safe,
      trustRelations: {
        untrusted: trustRelations.untrusted,
        mutualTrusts: trustRelations.mutualTrusts,
        firstBlock: trustRelations.firstBlock,
        lastBlock: trustRelations.lastBlock,
        trusting: trustRelations.trusting,
        trustedBy: trustRelations.trustedBy
      }
    };
  }

  private static async readTrustEvents(safeAddress: string, startBlock?: number): Promise<BlockchainEvent[]> {
    const contacts: BlockchainEvent[] = [];
    await new CirclesAccount(safeAddress).findTrustEvents(startBlock).forEach(contact => {
      contacts.push(contact);
    });
    return contacts;
  }
}