import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";
import {BlockchainEvent} from "@o-platform/o-events/dist/blockchainEvent";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";

export type Token = {
  tokenAddress: string
  tokenOwner: string
  firstBlock?: number
  balance?: string
}

export type Transfer = {
  direction: "in" | "out"
  symbol: "crc" | "xdai"
  type: "hub" | "direct"
  token?: string
  firstBlock: number
  lastBlock?: number
  from: string
  to: string
  amount: string,
  children?: Transfer[]
}

export type TrustObject = {
  safeAddress: string
  firstBlock: number
  lastBlock: number
  limit: number
}

export type Safe = {
  safeAddress: string
  ownerAddress?: string
  firstBlock?: number
  lastBlock?: number
  token?: Token
  trustRelations?: {
    firstBlock: number
    lastBlock: number
    trustedBy: {
      [trustGiver: string]: TrustObject
    }
    trusting: {
      [trustReceiver: string]: TrustObject
    }
  }
  acceptedTokens?: {
    firstBlock: number
    lastBlock: number
    tokens: {
      [tokenAddress: string]: Token & { lastBlock: number, limit: number }
    }
  }
  transfers?: {
    firstBlock: number
    lastBlock: number
    rows: Transfer[]
  }
};

export class Queries {
  static async addOwnToken(safe: Safe): Promise<Safe> {
    const checksumSafeAddress = RpcGateway.get().utils.toChecksumAddress(safe.safeAddress);
    const foundTokenOrNull = await new CirclesAccount(checksumSafeAddress).tryGetMyToken(!!safe.firstBlock ? safe.firstBlock : undefined);
    if (!foundTokenOrNull) {
      console.log("The safe isn't yet signed-up at the circles hub")
    }

    return {
      ...safe,
      token: foundTokenOrNull
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

    await new CirclesAccount(checksumSafeAddress).findHubTransfers(startBlock).forEach(hubTransfer => {
      transfers.rows.push({
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
      a.blockNumber > b.blockNumber ? 1 : a.blockNumber < b.blockNumber ? -1 : 0);

    return {
      ...safe,
      transfers: transfers
    }
  }

  static async addDirectTransfers(safe: Safe, startBlock?: number): Promise<Safe> {
    if (!safe.acceptedTokens) {
      throw new Error(`The 'acceptedTokens' property must be set.`)
    }

    const checksumSafeAddress = RpcGateway.get().utils.toChecksumAddress(safe.safeAddress);
    const transfers = JSON.parse(JSON.stringify(safe.transfers ?? {
      rows: [],
      lastBlock: 0,
      firstBlock: 0
    }));

    for (let tokenAddress in safe.acceptedTokens.tokens) {
      const token = safe.acceptedTokens.tokens[tokenAddress];
      console.log(`Direct transfers of token (${tokenAddress}) via web3 ..`);
      await new Erc20Token(RpcGateway.get(), tokenAddress)
        .findTransfers(checksumSafeAddress, startBlock ?? token.firstBlock)
        .forEach(directTransfer => {
          transfers.rows.push(<Transfer>{
            type: "direct",
            symbol: "crc",
            direction: directTransfer.returnValues.from == checksumSafeAddress ? "out" : "in",
            firstBlock: directTransfer.blockNumber,
            from: directTransfer.returnValues.from,
            to: directTransfer.returnValues.to,
            amount: directTransfer.returnValues.value,
            token: directTransfer.token.address
          });
          transfers.firstBlock = this.min(transfers.firstBlock, directTransfer.blockNumber);
          transfers.lastBlock = this.max(transfers.lastBlock, directTransfer.blockNumber);
          // Update the 'first/lastBlock' of the transferred 'acceptedToken'
          const t = safe.acceptedTokens.tokens[directTransfer.token.address]
          if (t) {
            t.firstBlock = this.min(t.firstBlock, directTransfer.blockNumber);
            t.lastBlock = this.max(t.lastBlock, directTransfer.blockNumber);
          }
        });
      console.log(`Direct transfers of token (${tokenAddress}) via web3 .. Done`,);
    }

    transfers.rows = transfers.rows.sort((a, b) =>
      a.blockNumber < b.blockNumber ? 1 : a.blockNumber > b.blockNumber ? -1 : 0);

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
    const trustEvents = await this.readTrustEvents(checksumSafeAddress, startBlock);
    const sortedAsc = trustEvents.sort((a, b) =>
      a.blockNumber > b.blockNumber ? 1 : a.blockNumber < b.blockNumber ? -1 : 0);

    const trustRelations = sortedAsc.reduce((p, c) => {
      let trustGiver: string, trustReceiver: string;
      let trustLimit: number = parseInt(c.returnValues.limit);
      if (c.returnValues.user == checksumSafeAddress) {
        // "safeAddress" is the trust-receiver
        trustGiver = c.returnValues.canSendTo
        p.trustedBy[trustGiver] = {
          safeAddress: trustGiver,
          firstBlock: this.min(p.trustedBy[trustGiver]?.firstBlock, c.blockNumber),
          lastBlock: this.max(p.trustedBy[trustGiver]?.lastBlock, c.blockNumber),
          limit: p.trustedBy[trustGiver]?.lastBlock > c.blockNumber ? p.trustedBy[trustGiver]?.limit : trustLimit
        };
      } else {
        // "safeAddress" is the trust-giver
        trustReceiver = c.returnValues.user;
        p.trusting[trustReceiver] = {
          safeAddress: trustReceiver,
          firstBlock: this.min(p.trusting[trustReceiver]?.firstBlock, c.blockNumber),
          lastBlock: this.max(p.trusting[trustReceiver]?.lastBlock, c.blockNumber),
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
      trusting: safe.trustRelations?.trusting ?? {},
      trustedBy: safe.trustRelations?.trustedBy ?? {}
    });

    return {
      ...safe,
      trustRelations: {
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