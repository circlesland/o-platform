import {Safe} from "./circles/types";

export const emptySafe: Safe = {
  safeAddress: "0x00",
  balance: "0",
  ui: {
    loadingPercent: -1,
    loadingText: "No safe connected",
    error: undefined
  },
  transfers: {
    firstBlock: 0,
    lastBlock: 0,
    rows: []
  },
  token: {
    _id: "",
    tokenAddress: "0x00",
    balance: "0",
    tokenOwner: "0x00",
    firstBlock: 0
  },
  acceptedTokens: {
    tokens: {},
    lastBlock: 0,
    firstBlock: 0
  },
  lastBlock: 0,
  firstBlock: 0,
  trustRelations: {
    trustedBy: {},
    trusting: {},
    mutualTrusts: {},
    untrusted: {},
    lastBlock: 0,
    firstBlock: 0
  }
};