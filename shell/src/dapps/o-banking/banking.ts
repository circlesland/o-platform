import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {getUBIService} from "./processes/getUBIService";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {GetUbiContextData} from "./processes/getUbi";
import {AvataarGenerator} from "../../shared/avataarGenerator";
import {Profile, ProfileEvent, ProfilesByCirclesAddressDocument, TransactionTimelineDocument} from "./data/api/types";

export class Banking {
    safeAddress: string;
    entries: ProfileEvent[] = [];

    constructor(safeAddress: string) {
        this.safeAddress = safeAddress;
    }

    async onMount() {
        const apiClient = await window.o.apiClient.client.subscribeToResult();
        const timeline = await apiClient.query({
            query: TransactionTimelineDocument,
            variables: {
                safeAddress: this.safeAddress
            }
        });
        if (timeline.errors) {
            throw new Error(`Couldn't load the transaction history for the following reasons: ${timeline.errors.join("\n")}`);
        }
        this.entries = timeline.data.events;
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
                ? safeAddresses.length
                : (batchSize * (i + 1))

            const batch = safeAddresses.slice(begin, end);
            const query = batch.reduce((p, c) => p + `address[]=${RpcGateway.get().utils.toChecksumAddress(c)}&`, "");

            // console.log(`Querying the following profiles from the circles garden api (Batch ${i + 1} of ${batches}. Batch size: ${batchSize}):`, query);

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
}