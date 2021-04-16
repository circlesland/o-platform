import {PlatformEvent} from "./platformEvent";

export interface BlockchainEvent extends PlatformEvent
{
    cached?:boolean;
    event: string;
    blockNumber: number;
    blockHash: string;
    address: string;
    returnValues: { [key: string]: any };
}
