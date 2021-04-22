import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type CirclesToken = {
  __typename?: 'CirclesToken';
  address: Scalars['String'];
  createdAt: Scalars['String'];
  createdInBlockHash: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  id: Scalars['Int'];
  owner?: Maybe<CirclesWallet>;
  transfers?: Maybe<Array<CirclesTokenTransfer>>;
};

export type CirclesTokenTransfer = {
  __typename?: 'CirclesTokenTransfer';
  createdAt: Scalars['String'];
  createdInBlockHash: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  id: Scalars['Int'];
  object: CirclesWallet;
  predicate: CirclesTokenTransferPredicate;
  subject: CirclesWallet;
  value: Scalars['String'];
};

export type CirclesTrustRelation = {
  __typename?: 'CirclesTrustRelation';
  createdAt?: Maybe<Scalars['String']>;
  createdInBlockHash: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  id: Scalars['Int'];
  object: CirclesWallet;
  predicate: CirclesTrustRelationPredicate;
  subject: CirclesWallet;
  weight: Scalars['Int'];
};

export type CirclesWallet = {
  __typename?: 'CirclesWallet';
  address: Scalars['String'];
  id: Scalars['Int'];
  ownToken?: Maybe<CirclesToken>;
  tokens?: Maybe<Array<CirclesToken>>;
  transfers?: Maybe<Array<CirclesTokenTransfer>>;
  trustRelations?: Maybe<Array<CirclesTrustRelation>>;
};

export type ConsumeDepositedChallengeResponse = {
  __typename?: 'ConsumeDepositedChallengeResponse';
  challenge?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type DelegateAuthInit = {
  __typename?: 'DelegateAuthInit';
  appId: Scalars['String'];
  challengeType?: Maybe<Scalars['String']>;
  delegateAuthCode?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  validTo?: Maybe<Scalars['String']>;
};

export type DepositChallengeResponse = {
  __typename?: 'DepositChallengeResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCirclesToken: CirclesToken;
  addCirclesTokenTransfer: CirclesTokenTransfer;
  addCirclesTrustRelation: CirclesTrustRelation;
  addCirclesWallet: CirclesWallet;
  authenticateAt: DelegateAuthInit;
  consumeDepositedChallenge: ConsumeDepositedChallengeResponse;
  depositChallenge: DepositChallengeResponse;
  exchangeToken: ExchangeTokenResponse;
  logout: LogoutResponse;
  upsertProfile: Profile;
};


export type MutationAddCirclesTokenArgs = {
  data: AddCirclesTokenInput;
};


export type MutationAddCirclesTokenTransferArgs = {
  data: AddCirclesTokenTransferInput;
};


export type MutationAddCirclesTrustRelationArgs = {
  data: AddCirclesTrustRelationInput;
};


export type MutationAddCirclesWalletArgs = {
  data: AddCirclesWalletInput;
};


export type MutationAuthenticateAtArgs = {
  appId: Scalars['String'];
};


export type MutationConsumeDepositedChallengeArgs = {
  delegateAuthCode: Scalars['String'];
};


export type MutationDepositChallengeArgs = {
  jwt: Scalars['String'];
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};

export type Profile = {
  __typename?: 'Profile';
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  dream: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastName?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  circlesWallets: Array<CirclesWallet>;
  profiles: Array<Profile>;
  search: Array<Profile>;
  sessionInfo: SessionInfo;
  version: Version;
};


export type QueryCirclesWalletsArgs = {
  query: QueryCirclesWalletInput;
};


export type QueryProfilesArgs = {
  query: QueryProfileInput;
};


export type QuerySearchArgs = {
  query: SearchInput;
};

export type Server = {
  __typename?: 'Server';
  version: Scalars['String'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  hasProfile?: Maybe<Scalars['Boolean']>;
  isLoggedOn: Scalars['Boolean'];
  profileId?: Maybe<Scalars['Int']>;
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export enum CirclesTokenTransferPredicate {
  GivingTo = 'GIVING_TO',
  ReceivingFrom = 'RECEIVING_FROM'
}

export enum CirclesTrustRelationPredicate {
  GivingTo = 'GIVING_TO',
  ReceivingFrom = 'RECEIVING_FROM'
}

export type AddCirclesTokenInput = {
  address: Scalars['String'];
  createdAt: Scalars['String'];
  createdInBlockHash: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  ownerAddress: Scalars['String'];
};

export type AddCirclesTokenTransferInput = {
  createdAt: Scalars['String'];
  createdInBlockHash: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  objectAddress: Scalars['String'];
  predicate: CirclesTokenTransferPredicate;
  subjectAddress: Scalars['String'];
  transferredToken: Scalars['String'];
  value: Scalars['String'];
};

export type AddCirclesTrustRelationInput = {
  createdAt: Scalars['String'];
  createdInBlockHash: Scalars['String'];
  createdInBlockNo: Scalars['Int'];
  objectAddress: Scalars['String'];
  predicate: CirclesTrustRelationPredicate;
  subjectAddress: Scalars['String'];
  weight: Scalars['Int'];
};

export type AddCirclesWalletInput = {
  address: Scalars['String'];
  ownToken?: Maybe<AddCirclesTokenInput>;
};

export type DepositChallenge = {
  jwt: Scalars['String'];
};

export type QueryCirclesWalletInput = {
  address?: Maybe<Scalars['String']>;
  isTrustedBy?: Maybe<Scalars['String']>;
  ownTokenAddress?: Maybe<Scalars['String']>;
  trusts?: Maybe<Scalars['String']>;
};

export type QueryProfileInput = {
  circlesAddress?: Maybe<Array<Scalars['String']>>;
  country?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
};

export type QueryUniqueProfileInput = {
  id: Scalars['Int'];
};

export type SearchInput = {
  searchString: Scalars['String'];
};

export type UpsertProfileInput = {
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  dream: Scalars['String'];
  emailAddress?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
};


export type ExchangeTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type ExchangeTokenMutation = (
  { __typename?: 'Mutation' }
  & { exchangeToken: (
    { __typename?: 'ExchangeTokenResponse' }
    & Pick<ExchangeTokenResponse, 'success' | 'errorMessage'>
  ) }
);

export type AuthenticateAtMutationVariables = Exact<{
  appId: Scalars['String'];
}>;


export type AuthenticateAtMutation = (
  { __typename?: 'Mutation' }
  & { authenticateAt: (
    { __typename?: 'DelegateAuthInit' }
    & Pick<DelegateAuthInit, 'appId' | 'success' | 'errorMessage' | 'challengeType' | 'delegateAuthCode' | 'validTo'>
  ) }
);

export type ConsumeDepositedChallengeMutationVariables = Exact<{
  delegateAuthCode: Scalars['String'];
}>;


export type ConsumeDepositedChallengeMutation = (
  { __typename?: 'Mutation' }
  & { consumeDepositedChallenge: (
    { __typename?: 'ConsumeDepositedChallengeResponse' }
    & Pick<ConsumeDepositedChallengeResponse, 'success' | 'challenge'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & { logout: (
    { __typename?: 'LogoutResponse' }
    & Pick<LogoutResponse, 'success'>
  ) }
);

export type UpsertProfileMutationVariables = Exact<{
  id?: Maybe<Scalars['Int']>;
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  dream: Scalars['String'];
  country?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
}>;


export type UpsertProfileMutation = (
  { __typename?: 'Mutation' }
  & { upsertProfile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'circlesAddress'>
  ) }
);

export type SessionInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionInfoQuery = (
  { __typename?: 'Query' }
  & { sessionInfo: (
    { __typename?: 'SessionInfo' }
    & Pick<SessionInfo, 'isLoggedOn' | 'hasProfile' | 'profileId'>
  ) }
);

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { profiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType'>
  )> }
);


export const ExchangeTokenDocument = gql`
    mutation exchangeToken {
  exchangeToken {
    success
    errorMessage
  }
}
    `;
export const AuthenticateAtDocument = gql`
    mutation authenticateAt($appId: String!) {
  authenticateAt(appId: $appId) {
    appId
    success
    errorMessage
    challengeType
    delegateAuthCode
    validTo
  }
}
    `;
export const ConsumeDepositedChallengeDocument = gql`
    mutation consumeDepositedChallenge($delegateAuthCode: String!) {
  consumeDepositedChallenge(delegateAuthCode: $delegateAuthCode) {
    success
    challenge
  }
}
    `;
export const LogoutDocument = gql`
    mutation logout {
  logout {
    success
  }
}
    `;
export const UpsertProfileDocument = gql`
    mutation upsertProfile($id: Int, $firstName: String!, $lastName: String, $dream: String!, $country: String, $avatarUrl: String, $avatarCid: String, $avatarMimeType: String, $circlesAddress: String) {
  upsertProfile(
    data: {id: $id, firstName: $firstName, lastName: $lastName, dream: $dream, country: $country, avatarUrl: $avatarUrl, avatarCid: $avatarCid, avatarMimeType: $avatarMimeType, circlesAddress: $circlesAddress}
  ) {
    id
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    circlesAddress
  }
}
    `;
export const SessionInfoDocument = gql`
    query sessionInfo {
  sessionInfo {
    isLoggedOn
    hasProfile
    profileId
  }
}
    `;
export const MyProfileDocument = gql`
    query myProfile {
  profiles(query: {}) {
    id
    circlesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    exchangeToken(variables?: ExchangeTokenMutationVariables): Promise<ExchangeTokenMutation> {
      return withWrapper(() => client.request<ExchangeTokenMutation>(print(ExchangeTokenDocument), variables));
    },
    authenticateAt(variables: AuthenticateAtMutationVariables): Promise<AuthenticateAtMutation> {
      return withWrapper(() => client.request<AuthenticateAtMutation>(print(AuthenticateAtDocument), variables));
    },
    consumeDepositedChallenge(variables: ConsumeDepositedChallengeMutationVariables): Promise<ConsumeDepositedChallengeMutation> {
      return withWrapper(() => client.request<ConsumeDepositedChallengeMutation>(print(ConsumeDepositedChallengeDocument), variables));
    },
    logout(variables?: LogoutMutationVariables): Promise<LogoutMutation> {
      return withWrapper(() => client.request<LogoutMutation>(print(LogoutDocument), variables));
    },
    upsertProfile(variables: UpsertProfileMutationVariables): Promise<UpsertProfileMutation> {
      return withWrapper(() => client.request<UpsertProfileMutation>(print(UpsertProfileDocument), variables));
    },
    sessionInfo(variables?: SessionInfoQueryVariables): Promise<SessionInfoQuery> {
      return withWrapper(() => client.request<SessionInfoQuery>(print(SessionInfoDocument), variables));
    },
    myProfile(variables?: MyProfileQueryVariables): Promise<MyProfileQuery> {
      return withWrapper(() => client.request<MyProfileQuery>(print(MyProfileDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;