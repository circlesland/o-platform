export type Token = {
  _id: string;
  tokenAddress: string;
  tokenOwner: string;
  firstBlock: number;
  balance?: string;
  limit?: number;
  ownerProfile?: {
    displayName: string;
    avatarUrl?: string;
  };
};

export type Transfer = {
  _id: string;
  direction: "in" | "out";
  symbol: "crc" | "xdai";
  type: "hub" | "direct";
  token?: string;
  time?: number;
  firstBlock: number;
  lastBlock?: number;
  from: string;
  fromProfile: {
    displayName: string;
    avatarUrl: string;
  };
  to: string;
  toProfile: {
    displayName: string;
    avatarUrl: string;
  };
  amount: string;
  children?: Transfer[];
};

export type TrustObject = {
  _id: string;
  hide?: boolean;
  safeAddress: string;
  firstBlock: number;
  lastBlock: number;
  limit: number;
  profile?: {
    displayName: string;
    avatarUrl: string;
  };
  type?: String;
};

export type Safe = {
  safeAddress: string;
  firstBlock?: number;
  lastBlock?: number;
  token?: Token;
  balance?: string;
  xDaiBalance?: string;
  accountxDai?: string;
  trustRelations?: {
    firstBlock: number;
    lastBlock: number;
    mutualTrusts: {
      [safeAddress: string]: {
        id: string;
        trusting: TrustObject;
        trustedBy: TrustObject;
      };
    };
    trustedBy: {
      [trustGiver: string]: TrustObject;
    };
    trusting: {
      [trustReceiver: string]: TrustObject;
    };
    untrusted: {
      [address: string]: TrustObject;
    };
  };
  acceptedTokens?: {
    firstBlock: number;
    lastBlock: number;
    tokens: {
      [tokenAddress: string]: Token & { lastBlock: number; limit: number };
    };
  };
  transfers?: {
    firstBlock: number;
    lastBlock: number;
    rows: Transfer[];
  };
  ui?: {
    loadingPercent?: number;
    loadingText?: string;
    error?: Error;
  };
};
