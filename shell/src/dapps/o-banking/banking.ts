import {Safe, Transfer, TrustObject} from "./data/circles/types";
import {emptySafe} from "./data/emptySafe";
import {Queries} from "./data/circles/queries";
import {HUB_BLOCK} from "@o-platform/o-circles/dist/consts";
import {BN} from "ethereumjs-util";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Observable, Subscriber} from "rxjs";
import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";
import {Profile, ProfilesByCirclesAddressDocument} from "./data/api/types";
import {getUBIService} from "./processes/getUBIService";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {GetUbiContextData} from "./processes/getUbi";
import {AvataarGenerator} from "../../shared/avataarGenerator";
import {Web3Contract} from "@o-platform/o-circles/dist/web3Contract";

export const INITIAL_ACCOUNT_XDAI = new BN(RpcGateway.get().utils.toWei("0.025", "ether"));

export type InitAction<TResult> = {
    id?: string
    message?: string
    run: () => Promise<TResult>
    updateUi?: boolean
};

export type InitActionProgress<TResult> = {
    id?: string
    message?: string
    percent: number
    result?: TResult
    updateUi?: boolean
}

export class Banking {
    private _safe: Safe = emptySafe;

    get safe(): Safe {
        return this._safe;
    }

    constructor(safeAddress: string) {
        this._safe.safeAddress = RpcGateway.get().utils.toChecksumAddress(safeAddress);
    }

    onTokenTransfer() : Observable<InitActionProgress<any>> {
        if (!this._safe?.transfers?.rows?.length) {
            return this.onMount();
        }

        return Banking.execute("onTokenTransfer", "Updating token transfers ..", [{
            id: "hubTransfers",
            message: "Loading past Circles transfers ..",
            run: async () => this.refreshHubTransfers()
        }, {
            id: "tokenMinting",
            message: "Loading UBI ..",
            run: async () => this.refreshDirectTransfersOfToken(
                this._safe.token.tokenAddress,
                undefined,
                transfer => {
                    return transfer.from == "0x0000000000000000000000000000000000000000"
                }
            )
        }, {
            id: "balances",
            message: "Loading balances ..",
            run: async () => this.refreshBalances()
        }, {
            id: "sort",
            message: "Sorting all entries ..",
            run: async () => this.sortEntries()
        }, {
            id: "blockTimes",
            message: "Loading block timestamps ..",
            run: async () => this.augmentBlockTimes()
        }, {
            id: "augmentProfiles",
            message: "Loading profiles ..",
            run: async () => this.augmentProfiles()
        }, {
            id: "cacheSafe",
            message: "Writing transactions to cache ..",
            run: async () => this.cacheSafe()
        }]);
    }

    onTrustChange() : Observable<InitActionProgress<any>> {
        if (!this._safe?.transfers?.rows?.length) {
            return this.onMount();
        }

        return Banking.execute("onTrustChange", "Updating trust relations ..", [{
            id: "trust",
            message: "Loading trust relations ..",
            run: async () => this.refreshTrusts(),
            updateUi: true
        }, {
            id: "acceptedTokens",
            message: "Loading accepted Circles tokens ..",
            run: async () => this.refreshAcceptedTokens()
        }, {
            id: "balances",
            message: "Loading balances ..",
            run: async () => this.refreshBalances()
        }, {
            id: "sort",
            message: "Sorting all entries ..",
            run: async () => this.sortEntries()
        }, {
            id: "blockTimes",
            message: "Loading block timestamps ..",
            run: async () => this.augmentBlockTimes()
        }, {
            id: "augmentProfiles",
            message: "Loading profiles ..",
            run: async () => this.augmentProfiles()
        }, {
            id: "cacheSafe",
            message: "Writing transactions to cache ..",
            run: async () => this.cacheSafe()
        }]);
    }

    onMount() : Observable<InitActionProgress<any>> {
        // Refresh the whole safe
        return Banking.execute("onMount", "Initializing safe ..", [{
            id: "tryToRestoreCache",
            message: "Trying to restore the cache ..",
            run: async () => this.tryToRestoreCache(),
            updateUi: true
        }, {
            id: "ownToken",
            message: "Loading own Circles token ..",
            run: async () => this.refreshOwnToken()
        }, {
            id: "trust",
            message: "Loading trust relations ..",
            run: async () => this.refreshTrusts()
        }, {
            id: "hubTransfers",
            message: "Loading past Circles transfers ..",
            run: async () => this.refreshHubTransfers()
        }, {
            id: "acceptedTokens",
            message: "Loading accepted Circles tokens ..",
            run: async () => this.refreshAcceptedTokens()
        }, {
            id: "tokenMinting",
            message: "Loading UBI ..",
            run: async () => this.refreshDirectTransfersOfToken(
                this._safe.token.tokenAddress,
                undefined,
                transfer => {
                    return transfer.from == "0x0000000000000000000000000000000000000000"
                }
            )
        }, {
            id: "balances",
            message: "Loading balances ..",
            run: async () => this.refreshBalances()
        }, {
            id: "sort",
            message: "Sorting all entries ..",
            run: async () => this.sortEntries()
        }, {
            id: "blockTimes",
            message: "Loading block timestamps ..",
            run: async () => this.augmentBlockTimes()
        }, {
            id: "augmentProfiles",
            message: "Loading profiles ..",
            run: async () => this.augmentProfiles()
        }, {
            id: "cacheSafe",
            message: "Writing transactions to cache ..",
            run: async () => this.cacheSafe()
        }]);
    }

    private cacheSafe() {
        const safeCopy: Safe = JSON.parse(JSON.stringify(this._safe));

        // Remove all image data image urls
        if (safeCopy.token?.ownerProfile?.avatarUrl?.startsWith("data:image")) {
            safeCopy.token.ownerProfile.avatarUrl = undefined;
        }

        // Remove all data urls from the one way trusts
        Object.values(safeCopy.trustRelations?.trustedBy ?? {})
            .concat(Object.values(safeCopy.trustRelations?.trusting ?? {}))
            .concat(Object.values(safeCopy.trustRelations?.untrusted ?? {}))
            .filter(oneWayTrust => oneWayTrust.profile?.avatarUrl?.startsWith("data:image"))
            .forEach(oneWayTrust => {
                //generatedAvatars[oneWayTrust.safeAddress] = oneWayTrust.profile.avatarUrl;
                oneWayTrust.profile.avatarUrl = undefined
            });

        // Remove all data urls from the mutual trusts
        Object.values(safeCopy.trustRelations?.mutualTrusts ?? {})
            .filter(o => o.trustedBy.profile?.avatarUrl?.startsWith("data:image"))
            .forEach(o => {
                //generatedAvatars[o.trustedBy.safeAddress] = o.trustedBy.profile.avatarUrl;
                o.trustedBy.profile.avatarUrl = undefined;
            });

        Object.values(safeCopy.trustRelations?.mutualTrusts ?? {})
            .filter(o => o.trusting.profile?.avatarUrl?.startsWith("data:image"))
            .forEach(o => {
                //generatedAvatars[o.trusting.safeAddress] = o.trusting.profile.avatarUrl;
                o.trusting.profile.avatarUrl = undefined;
            });

        // Remove all data urls from the transactions
        safeCopy.transfers?.rows?.forEach(transfer => {
            if (transfer.fromProfile?.avatarUrl?.startsWith("data:image")) {
                //generatedAvatars[transfer.from] = transfer.fromProfile.avatarUrl;
                transfer.fromProfile.avatarUrl = undefined;
            }
            if (transfer.toProfile?.avatarUrl?.startsWith("data:image")) {
                //generatedAvatars[transfer.to] = transfer.toProfile.avatarUrl;
                transfer.toProfile.avatarUrl = undefined;
            }
        });

        // Remove all data urls from the accepted tokens
        for (let tokensKey in safeCopy.acceptedTokens.tokens) {
            if (safeCopy.acceptedTokens.tokens[tokensKey].ownerProfile?.avatarUrl?.startsWith("data:image")) {
                safeCopy.acceptedTokens.tokens[tokensKey].ownerProfile.avatarUrl = undefined;
            }
        }

        safeCopy.ui = {};
        localStorage.setItem("safe", JSON.stringify(safeCopy))
    }

    private tryToRestoreCache() {
        const cachedSafeJson = localStorage.getItem("safe");
        if (!cachedSafeJson) {
            return;
        } else {
            try {
                const frankenstein:Safe = JSON.parse(cachedSafeJson) ?? emptySafe;

                if (frankenstein.__schemaVersion !== "__SAFE_SCHEMA_VERSION__") {
                    localStorage.removeItem("safe");
                    this._safe = emptySafe;
                    return;
                }

                this._safe.ui = {};

                // Add all data urls for the one way trusts
                Object.values(frankenstein.trustRelations?.trustedBy ?? {})
                    .concat(Object.values(frankenstein.trustRelations?.trusting ?? {}))
                    .concat(Object.values(frankenstein.trustRelations?.untrusted ?? {}))
                    .filter(oneWayTrust => oneWayTrust.profile && !oneWayTrust.profile.avatarUrl)
                    .forEach((oneWayTrust:TrustObject) => {
                        //generatedAvatars[oneWayTrust.safeAddress] = oneWayTrust.profile.avatarUrl;
                        oneWayTrust.profile.avatarUrl = AvataarGenerator.generate(oneWayTrust.safeAddress);
                    });

                // Add all data urls for the mutual trusts
                Object.values(frankenstein.trustRelations?.mutualTrusts ?? {})
                    .filter(o => o.trustedBy.profile && !o.trustedBy.profile.avatarUrl)
                    .forEach(o => {
                        //generatedAvatars[o.trustedBy.safeAddress] = o.trustedBy.profile.avatarUrl;
                        o.trustedBy.profile.avatarUrl = AvataarGenerator.generate(o.trustedBy.safeAddress);
                    });

                Object.values(frankenstein.trustRelations?.mutualTrusts ?? {})
                    .filter(o => o.trusting.profile && !o.trusting.profile.avatarUrl)
                    .forEach(o => {
                        //generatedAvatars[o.trusting.safeAddress] = o.trusting.profile.avatarUrl;
                        o.trusting.profile.avatarUrl = AvataarGenerator.generate(o.trusting.safeAddress);
                    });

                // Add all data urls for the transactions
                frankenstein.transfers?.rows?.forEach(transfer => {
                    if (transfer.fromProfile && !transfer.fromProfile.avatarUrl) {
                        //generatedAvatars[transfer.from] = transfer.fromProfile.avatarUrl;
                        transfer.fromProfile.avatarUrl = AvataarGenerator.generate(transfer.from);
                    }
                    if (transfer.toProfile && !transfer.toProfile.avatarUrl) {
                        //generatedAvatars[transfer.to] = transfer.toProfile.avatarUrl;
                        transfer.toProfile.avatarUrl = AvataarGenerator.generate(transfer.to);
                    }
                });

                this._safe = frankenstein;
            } catch (e) {
                this._safe = emptySafe;
                console.error("An error occurred while restoring the cached safe:", e);
                localStorage.removeItem("safe");
            }
        }
    }

    async tryGetUbi() : Promise<void> {
        if (!this._safe.safeAddress) {
            return;
        }
        const lastUBIDateString = localStorage.getItem("lastUBI");
        if (!lastUBIDateString) {
            return await Banking.getUbi(this._safe.safeAddress);
        } else {
            const date = Date.parse(lastUBIDateString);
            if (date < Date.now() - 24*60*60*1000) {
                return await Banking.getUbi(this._safe.safeAddress);
            }
        }
    }

    private static async getUbi(safeAddress:string) : Promise<void> {
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

    private sortEntries() {
        // Sort the transactions in descending order by block no.
        if (this._safe.transfers) {
            this._safe.transfers.rows = this._safe.transfers.rows.sort((a, b) =>
                a.firstBlock > b.firstBlock ? -1 : a.firstBlock < b.firstBlock ? 1 : 0);
        }

        // Sort the trusts alphabetically by display name
        if (this._safe.trustRelations) {

            let mutual: { [safeAddresss: string]: TrustObject } = {};
            Object.values(this._safe.trustRelations.mutualTrusts).forEach(o => mutual[o.trusting.safeAddress] = o.trustedBy);
            mutual = this.sortTrustRelation(mutual);

            let mutual2:{
                [safeAddress: string]: {
                    id: string;
                    trusting: TrustObject;
                    trustedBy: TrustObject;
                };
            } = {};
            Object.keys(mutual).forEach(o => {
                mutual2[o] = {
                    id: this._safe.trustRelations.mutualTrusts[o].id,
                    trusting: this._safe.trustRelations.mutualTrusts[o].trusting,
                    trustedBy:this._safe.trustRelations.mutualTrusts[o].trustedBy
                }
            })

            this._safe.trustRelations.mutualTrusts = mutual2;
            this._safe.trustRelations.trustedBy = this.sortTrustRelation(this._safe.trustRelations.trustedBy);
            this._safe.trustRelations.trusting = this.sortTrustRelation(this._safe.trustRelations.trusting);
            this._safe.trustRelations.untrusted = this.sortTrustRelation(this._safe.trustRelations.untrusted);
        }
    }

    private sortTrustRelation(trustRelation:{[p: string]: TrustObject})
    {
        const collator = new Intl.Collator('en', {numeric: true, sensitivity: 'base'});
        let trustObjects = Object.values(trustRelation);
        trustObjects = trustObjects.sort((a, b) => collator.compare(
            a.profile?.displayName ?? a.safeAddress,
            b.profile?.displayName ?? a.safeAddress));

        const newTrustRelation : {[p: string]: TrustObject} = {};
        trustObjects.forEach(o => newTrustRelation[o.safeAddress] = o);

        return newTrustRelation;
    }

    private async augmentProfiles()
    {
        const allKnownAddresses = this.allKnownSafeAddresses;

        const gardenProfiles = await Banking.findCirclesGardenProfiles(allKnownAddresses);
        const gardenMap = Banking.createProfileMap(gardenProfiles);

        const landProfiles = await Banking.findCirclesLandProfiles(allKnownAddresses);
        const landMap = Banking.createProfileMap(landProfiles);

        const mappedAddresses = Object.keys(gardenMap)
            .concat(Object.keys(landMap))
            .reduce((p,c) => {
                p[c] = true;
                return p;
            }, {});

        const anonProfiles = allKnownAddresses
            .filter(o => !mappedAddresses[o] && o != "0x0000000000000000000000000000000000000000")
            .map(unmapped => {
                return {
                    safeAddress: unmapped,
                    displayName: unmapped.substr(0, 12) + "..",
                    avatarUrl: AvataarGenerator.generate(unmapped)
                }
            });

        const anonMap = Banking.createProfileMap(anonProfiles);

        this.applyProfileMap(gardenMap);
        this.applyProfileMap(landMap);
        this.applyProfileMap(anonMap);
    }

    private async augmentBlockTimes()
    {
        let avgBlockTime: number = 5.2;
        let sampleRate: number = 20;
        let lastTimestamp: number = null;
        let lastTimestampBlockNo: number = null;

        let allTransactions = Object.values(this._safe.transfers.rows);

        for (let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++) {
            const transaction = allTransactions[transactionIndex];

            try {
                if (!lastTimestamp || transactionIndex % sampleRate == 0) {
                    if (transaction.time) {
                        lastTimestamp = transaction.time;
                        lastTimestampBlockNo = transaction.firstBlock;
                    } else {
                        const block = await RpcGateway.get().eth.getBlock(transaction.firstBlock);
                        if (typeof block.timestamp === "string") {
                            lastTimestamp = parseInt(block.timestamp);
                        } else {
                            lastTimestamp = block.timestamp;
                        }
                        lastTimestampBlockNo = transaction.firstBlock;
                    }
                }

                const passedBlocksSinceLastTimestampBlockNo = lastTimestampBlockNo - transaction.firstBlock;
                const passedSecondsSinceLastTimestamp = passedBlocksSinceLastTimestampBlockNo * avgBlockTime;
                const currentBlockTimestamp = lastTimestamp - passedSecondsSinceLastTimestamp;

                if (!transaction.time) {
                    transaction.time = parseInt(currentBlockTimestamp.toFixed());
                }
            } catch (e) {
                console.warn("Couldn't determine the time of block " + transaction.firstBlock + ": " + e.toString());
            }
        }
    }

    static async findCirclesLandProfiles(safeAddresses: string[]) : Promise<Profile & {
        displayName: string
        safeAddress: string
    }[]>
    {
        const apiClient = await window.o.apiClient.client.subscribeToResult();
        const result = await apiClient.query({
            query: ProfilesByCirclesAddressDocument,
            variables: {
                circlesAddresses: safeAddresses.map(o => o.toLowerCase())
            }
        });

        return (result.data ?? []).profiles.map(p => {
            return {
                ...p,
                circlesAddress : RpcGateway.get().utils.toChecksumAddress(p.circlesAddress),
                safeAddress : RpcGateway.get().utils.toChecksumAddress(p.circlesAddress),
                displayName: `${p.firstName}${!!p.lastName ? " " + p.lastName : ""}`,
                avatarUrl: p.avatarUrl ? p.avatarUrl : AvataarGenerator.generate(p.circlesAddress)
            };
        });
    }

    public static async findCirclesGardenProfiles(safeAddresses: string[]) : Promise<{
        safeAddress: string,
        displayName: string,
        avatarUrl?: string
    }[]>
    {
        if (safeAddresses.length == 0) {
            return [];
        }

        const batchSize = 50;
        const batches = Math.ceil(safeAddresses.length / batchSize);

        let circlesGardenProfiles = [];

        for (let i = 0; i < batches; i++)
        {
            const begin = batchSize * i;
            const end = (batchSize * (i + 1)) - 1 > safeAddresses.length
                ? safeAddresses.length - 1
                : (batchSize * (i + 1)) - 1

            const batch = safeAddresses.slice(begin, end);
            const query = batch.reduce((p, c) => p + `address[]=${RpcGateway.get().utils.toChecksumAddress(c)}&`, "");

            console.log(`Querying the following profiles from the circles garden api (Batch ${i + 1} of ${batches}. Batch size: ${batchSize}):`, query);

            const result = await fetch(`__CIRCLES_GARDEN_API__?${query}`);
            const resultJson = await result.json();
            circlesGardenProfiles = circlesGardenProfiles.concat(resultJson.data.map(o => {
                return {
                    ...o,
                    displayName: o.username,
                    avatarUrl: o.avatarUrl ? o.avatarUrl : AvataarGenerator.generate(o.safeAddress)
                }
            }) ?? []);
        }

        return circlesGardenProfiles;
    }

    private get allKnownSafeAddresses() {
        const addresses: {[safeAddress:string]: null} = {};
        addresses[this._safe.safeAddress] = null;

        // First: Add the own address
        if (this._safe.safeAddress) {
            addresses[this._safe.safeAddress] = null;
        }

        // Then add all transfer participants
        if (this._safe.transfers?.rows) {
            this._safe.transfers.rows.forEach(transfer => {
                addresses[transfer.from] = null;
                addresses[transfer.to] = null;
            });
        }

        const trusts = Object.values(this._safe.trustRelations?.trusting ?? {})
            .concat(Object.values(this._safe.trustRelations?.trustedBy ?? {}));

        trusts.forEach(trust => {
            addresses[trust.safeAddress] = null;
        });

        return Object.keys(addresses);
    }

    private static createProfileMap(profiles:{
        safeAddress: string
        displayName: string
        avatarUrl?: string
    }[]) {
        const map:{
            [safeAddress:string]:{
                safeAddress: string
                displayName: string
                avatarUrl: string
            }
        } = {};
        profiles.forEach(profile => {
            map[profile.safeAddress] = {
                safeAddress: profile.safeAddress,
                displayName: profile.displayName,
                avatarUrl: profile.avatarUrl
            };
        });
        return map;
    }

    private applyProfileMap(map:{
        [safeAddress: string]: {
            safeAddress: string,
            displayName: string,
            avatarUrl: string
        }}) {

        // First: Add the own address
        if (this._safe.safeAddress && this._safe.token && map[this._safe.safeAddress]) {
            this._safe.token.ownerProfile = map[this._safe.safeAddress]
        }

        // Then add all transfer participants
        if (this._safe.transfers?.rows) {
            this._safe.transfers.rows.forEach(transfer => {
                if (map[transfer.from]) {
                    transfer.fromProfile = map[transfer.from];
                }
                if (map[transfer.to]) {
                    transfer.toProfile = map[transfer.to];
                }
            });
        }

        const trusts = Object.values(this._safe.trustRelations?.trusting ?? {})
            .concat(Object.values(this._safe.trustRelations?.trustedBy ?? {}))
            .concat(Object.values(this._safe.trustRelations?.untrusted ?? {}));

        trusts.forEach(trust => {
            if (map[trust.safeAddress]) {
                trust.profile = map[trust.safeAddress];
            }
        });

        if (this._safe.acceptedTokens && this._safe.acceptedTokens.tokens) {
            for (let tokensKey in this._safe.acceptedTokens.tokens) {
                this._safe.acceptedTokens.tokens[tokensKey].ownerProfile = map[this._safe.acceptedTokens.tokens[tokensKey].tokenOwner]
                    ?? this._safe.acceptedTokens.tokens[tokensKey].ownerProfile;
            }
        }
    }

    private async refreshOwnToken() {
        this._safe = await Queries.addOwnToken(this._safe);
    }

    private async refreshHubTransfers() {
        this._safe = await Queries.addHubTransfers(this._safe, this._safe.token?.firstBlock ?? HUB_BLOCK.toNumber());
    }

    private async refreshTrusts() {
        this._safe = await Queries.addContacts(this._safe);
    }

    private async refreshAcceptedTokens() {
        this._safe = await Queries.addAcceptedTokens(this._safe);
    }

    private async refreshBalances() {
        this._safe = await Queries.addxDaiBalances(this._safe);
        this._safe = await Queries.addTokenBalances(this._safe);

        this._safe.token.balance = (await new Erc20Token(RpcGateway.get(), this._safe.token.tokenAddress)
            .getBalanceOf(this._safe.safeAddress)).toString();

        const totalBalance = Object.keys(this._safe.acceptedTokens?.tokens ?? {})
            .reduce((p: BN, c: string) => p.add(new BN(this._safe.acceptedTokens.tokens[c].balance)), new BN("0"))
            .add(new BN(this._safe.token.balance));

        this._safe.balance = parseFloat(RpcGateway.get().utils
            .fromWei(totalBalance.toString(), "ether"))
            .toFixed(2);
    }

    private refreshDirectTransfersOfTokens(
        tokens: {
            address: string,
            defaultStartBlock?: number,
            filterPredicate?: (transfer: Transfer) => boolean
        }[])
        : Observable<InitActionProgress<any>>
    {
        // Generate all InitActions according to the supplied tokens
        const actions = tokens.map(token => <InitAction<any>>{
            id: `refreshDirectTransfers_${token.address}`,
            message: `Loading direct transfers of ${token.address.substr(0, 6)} ..`,
            run: async () => {
                await this.refreshDirectTransfersOfToken(
                    token.address,
                    token.defaultStartBlock,
                    token.filterPredicate)
            }
        });

        // Execute all generated actions in order
        return Banking.execute(
            "refreshDirectTransfers",
            `Loading direct transfers of ${tokens.length} tokens ..`,
            actions);
    }

    private async refreshDirectTransfersOfToken(
        tokenAddress: string,
        defaultStartBlock?: number,
        filterPredicate?: (transfer: Transfer) => boolean)
    {
        if (!this._safe.acceptedTokens?.tokens[tokenAddress] && this._safe.token.tokenAddress != tokenAddress) {
            console.warn(`The direct transfers of token ${tokenAddress} could not be loaded because it doesn't appear list of 'acceptedTokens' nor is it the own token.`)
            return;
        }

        let token = this._safe.acceptedTokens.tokens[tokenAddress];

        // Is the supplied token address the own token?
        if (!token && tokenAddress === this._safe.token.tokenAddress) {
            token = {
                ...this._safe.token,
                limit: 100,
                lastBlock: this._safe.token.firstBlock
            };
        }

        // Find the block no. of the last known transfer of this token
        const lastKnownTransactionBlock = this._safe.transfers?.rows
            .filter(o => o.type === "direct")
            .reduce<number>((p, c) => c.firstBlock > (p ?? 0)
                ? c.firstBlock
                : (p ?? 0), undefined);

        // If there is no last known transaction use the defaultStartBlock
        const refreshFromBlockNo = !lastKnownTransactionBlock
            ? (defaultStartBlock ?? token.firstBlock)
            : lastKnownTransactionBlock + 1;

        // Copy the existing transfers of the safe or initialize an empty transfer row array
        const transfers = JSON.parse(JSON.stringify(this._safe.transfers ?? {
            rows: [],
            lastBlock: 0,
            firstBlock: 0
        }));

        const max = (current: number | undefined, candidate: number) => {
            return !current ? candidate : Math.max(current, candidate);
        }

        const min = (current: number | undefined, candidate: number) => {
            return !current ? candidate : Math.min(current, candidate);
        }

        await new Erc20Token(RpcGateway.get(), tokenAddress)
            .findTransfers(this._safe.safeAddress, refreshFromBlockNo)
            .forEach(directTransfer => {
                const newTransfer = <Transfer>{
                    _id: `${directTransfer.blockNumber}${directTransfer.returnValues.from}${directTransfer.returnValues.to}`,
                    type: "direct",
                    symbol: "crc",
                    direction: directTransfer.returnValues.from == this._safe.safeAddress ? "out" : "in",
                    firstBlock: directTransfer.blockNumber,
                    from: directTransfer.returnValues.from,
                    to: directTransfer.returnValues.to,
                    amount: directTransfer.returnValues.value,
                    token: directTransfer.token.address
                }

                if (!filterPredicate || filterPredicate(newTransfer)) {
                    transfers.rows.push(newTransfer);
                }

                transfers.firstBlock = min(transfers.firstBlock, directTransfer.blockNumber);
                transfers.lastBlock = max(transfers.lastBlock, directTransfer.blockNumber);

                // Update the 'first/lastBlock' of the transferred 'acceptedToken'
                const t = this._safe.acceptedTokens.tokens[directTransfer.token.address]
                if (t) {
                    t.firstBlock = min(t.firstBlock, directTransfer.blockNumber);
                    t.lastBlock = max(t.lastBlock, directTransfer.blockNumber);
                }
            });

        this._safe.transfers = transfers;
    }

    private static executeRecursive<TResult>(
        id: string,
        message: string,
        subscriber: Subscriber<InitActionProgress<TResult>>,
        next: (previousAction?: InitAction<TResult>, previousResult?: TResult) => InitAction<TResult>,
        current?: InitAction<TResult>
    ) {
        let currentAction: InitAction<TResult> = current ?? next();
        if (!currentAction) {
            return;
        }

        console.log(`Executing ${currentAction.id ?? id} ..`)

        currentAction.run()
            .then(result => {
                console.log(`Executed ${currentAction.id ?? id}.`)
                const nextAction = next(currentAction, result);
                this.executeRecursive(
                    nextAction.id ?? id,
                    nextAction.message ?? message,
                    subscriber,
                    next,
                    nextAction
                );
            })
            .catch(error => subscriber.error(error))
    }

    /**
     * Transfers all xDai from the specified account (derived from key) to the safeAddress.
     */
    static async transferAllAccountXdaiToSafe(safeAddress:string, accountPrivateKey:string)
    {
        const ownerAddress = RpcGateway.get().eth.accounts.privateKeyToAccount(accountPrivateKey).address;
        const totalAccountBalance = new BN(await RpcGateway.get().eth.getBalance(ownerAddress));
        const transferAmount = totalAccountBalance.sub(INITIAL_ACCOUNT_XDAI);

        if (transferAmount.gt(new BN(RpcGateway.get().utils.toWei("0.01", "ether")))) {
            const signedRawTransaction = await Web3Contract.signRawTransaction(
                ownerAddress,
                accountPrivateKey,
                safeAddress,
                "0x00",
                new BN(RpcGateway.get().utils.toWei("28000", "wei")),
                transferAmount);

            const execResult = await Web3Contract.sendSignedRawTransaction(signedRawTransaction);
            const receipt = await execResult.toPromise();
            console.log(receipt);
        }
    }

    private static execute<TResult>(id: string, message: string, actions: InitAction<TResult>[])
        : Observable<InitActionProgress<TResult>> {
        return new Observable(subscriber => {
            let remainingActionCount = actions.length;

            const next = (previousAction?: InitAction<TResult>, previousResult?: TResult) => {
                const currentIndex = actions.length - (remainingActionCount--);
                const progress = {
                    id: previousAction?.id ?? id,
                    message: previousAction?.message ?? message,
                    percent: (100 / actions.length) * currentIndex,
                    result: previousResult,
                    updateUi: previousAction?.updateUi
                };
                subscriber.next(progress);

                if (remainingActionCount < 0) {
                    subscriber.complete();
                    return undefined;
                }

                return actions[currentIndex];
            };

            this.executeRecursive(
                id,
                message,
                subscriber,
                next
            );
        });
    }
}