export type ContactEventType =
    "INCOMING_UBI:1"
    |"INCOMING_CIRCLES_TRANSACTION:1"
    |"INCOMING_XDAI_TRANSACTION:1"
    |"INCOMING_TRUST:1"
    |"INCOMING_TRUST_REVOKED:1"
    |"INCOMING_MESSAGE:1"
    |"OUTGOING_CIRCLES_TRANSACTION:1"
    |"OUTGOING_XDAI_TRANSACTION:1"
    |"OUTGOING_TRUST:1"
    |"OUTGOING_TRUST_REVOKED:1"
    |"OUTGOING_MESSAGE:1"
    |"CREATED_OFFER:1"
    |"UPDATED_OFFER:1"
    |"REMOVED_OFFER:1"
    |"PURCHASING_OFFER:1"
    |"PURCHASED_OFFER:1"
    |"FOLLOW_OFFER:1"
    |"UNFOLLOW_OFFER:1"
    |"FOLLOW_PROFILE:1"
    |"UNFOLLOW_PROFILE:1";

export interface ContactEvent {
    id: string;
    timestamp: string;
    type: ContactEventType;
}

export interface INCOMING_TRANSACTION extends ContactEvent {
    fromAddress: string;
    value: string;
}
export interface OUTGOING_TRANSACTION extends ContactEvent {
    toAddress: string;
    value: string;
}
export interface TRUST_EVENT extends ContactEvent {
    limit: number;
}
export interface MESSAGE_EVENT extends ContactEvent {
    messageId: number;
}
export interface MARKET_EVENT extends ContactEvent {
    offerId: number;
}

export interface INCOMING_UBI extends INCOMING_TRANSACTION {
    type: "INCOMING_UBI:1"
}
export interface INCOMING_CIRCLES_TRANSACTION extends INCOMING_TRANSACTION {
    type: "INCOMING_CIRCLES_TRANSACTION:1"
}
export interface INCOMING_XDAI_TRANSACTION extends INCOMING_TRANSACTION {
    type: "INCOMING_XDAI_TRANSACTION:1"
}
export interface INCOMING_TRUST extends TRUST_EVENT {
    type: "INCOMING_TRUST:1"
    fromAddress: string;
}
export interface INCOMING_TRUST_REVOKED extends TRUST_EVENT {
    type: "INCOMING_TRUST_REVOKED:1"
    fromAddress: string;
}
export interface INCOMING_MESSAGE extends MESSAGE_EVENT {
    type: "INCOMING_MESSAGE:1"
}

export interface OUTGOING_CIRCLES_TRANSACTION extends OUTGOING_TRANSACTION {
    type: "OUTGOING_CIRCLES_TRANSACTION:1"
}
export interface OUTGOING_XDAI_TRANSACTION extends OUTGOING_TRANSACTION {
    type: "OUTGOING_XDAI_TRANSACTION:1"
}
export interface OUTGOING_TRUST extends TRUST_EVENT {
    type: "OUTGOING_TRUST:1"
    toAddress: string;
}
export interface OUTGOING_TRUST_REVOKED extends TRUST_EVENT {
    type: "OUTGOING_TRUST_REVOKED:1"
    toAddress: string;
}
export interface OUTGOING_MESSAGE extends MESSAGE_EVENT {
    type: "OUTGOING_MESSAGE:1"
}