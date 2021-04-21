import {BlockchainEvent} from "@o-platform/o-events/dist/blockchainEvent";

export interface TrustRelation extends BlockchainEvent {
    from: string
    to: string
    limit: number
}
