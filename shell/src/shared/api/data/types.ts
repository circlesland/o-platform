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

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type City = ICity & {
  __typename?: 'City';
  country: Scalars['String'];
  feature_code: Scalars['String'];
  geonameid: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  population: Scalars['Int'];
};

export type CityStats = ICity & {
  __typename?: 'CityStats';
  citizenCount: Scalars['Int'];
  country: Scalars['String'];
  feature_code: Scalars['String'];
  geonameid: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  population: Scalars['Int'];
};

export type ClaimInvitationResult = {
  __typename?: 'ClaimInvitationResult';
  claimedInvitation?: Maybe<ClaimedInvitation>;
  success: Scalars['Boolean'];
};

export type ClaimedInvitation = {
  __typename?: 'ClaimedInvitation';
  claimedAt: Scalars['String'];
  claimedBy?: Maybe<Profile>;
  claimedByProfileId: Scalars['Int'];
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
};

export type ConsumeDepositedChallengeResponse = {
  __typename?: 'ConsumeDepositedChallengeResponse';
  challenge?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CountryStats = {
  __typename?: 'CountryStats';
  citizenCount: Scalars['Int'];
  name: Scalars['String'];
};

export type CreateTagInput = {
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
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

export type DepositChallenge = {
  jwt: Scalars['String'];
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

export type Goal = {
  __typename?: 'Goal';
  totalCitizens: Scalars['Int'];
};

export type ICity = {
  country: Scalars['String'];
  feature_code: Scalars['String'];
  geonameid: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  population: Scalars['Int'];
};

export type IndexTransactionLog = {
  __typename?: 'IndexTransactionLog';
  address: Scalars['String'];
  data?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  logIndex: Scalars['Int'];
  topics: Array<Scalars['String']>;
};

export type IndexTransactionRequest = {
  __typename?: 'IndexTransactionRequest';
  blockNumber: Scalars['Int'];
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  id: Scalars['Int'];
  tags?: Maybe<Array<Tag>>;
  transactionHash: Scalars['String'];
  transactionIndex: Scalars['Int'];
};

export type IndexedTransaction = {
  __typename?: 'IndexedTransaction';
  blockHash: Scalars['String'];
  blockNumber: Scalars['Int'];
  confirmations?: Maybe<Scalars['Int']>;
  contractAddress?: Maybe<Scalars['String']>;
  cumulativeGasUsed: Scalars['String'];
  from: Scalars['String'];
  gasUsed: Scalars['String'];
  id: Scalars['Int'];
  logs?: Maybe<Array<IndexTransactionLog>>;
  logsBloom: Scalars['String'];
  root?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Tag>>;
  to: Scalars['String'];
  transactionHash: Scalars['String'];
  transactionIndex: Scalars['Int'];
};

export type LockOfferInput = {
  offerId: Scalars['Int'];
};

export type LockOfferResult = {
  __typename?: 'LockOfferResult';
  lockedUntil?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acknowledge: ProfileEvent;
  authenticateAt: DelegateAuthInit;
  claimInvitation: ClaimInvitationResult;
  consumeDepositedChallenge: ConsumeDepositedChallengeResponse;
  depositChallenge: DepositChallengeResponse;
  exchangeToken: ExchangeTokenResponse;
  lockOffer: LockOfferResult;
  logout: LogoutResponse;
  provePayment: ProvePaymentResult;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  requestIndexTransaction: IndexTransactionRequest;
  requestUpdateSafe: RequestUpdateSafeResponse;
  unlistOffer: Scalars['Boolean'];
  updateSafe: UpdateSafeResponse;
  upsertOffer: Offer;
  upsertProfile: Profile;
  upsertTag: Tag;
};


export type MutationAcknowledgeArgs = {
  eventId: Scalars['Int'];
};


export type MutationAuthenticateAtArgs = {
  appId: Scalars['String'];
};


export type MutationClaimInvitationArgs = {
  code: Scalars['String'];
};


export type MutationConsumeDepositedChallengeArgs = {
  delegateAuthCode: Scalars['String'];
};


export type MutationDepositChallengeArgs = {
  jwt: Scalars['String'];
};


export type MutationLockOfferArgs = {
  data: LockOfferInput;
};


export type MutationProvePaymentArgs = {
  data: PaymentProof;
};


export type MutationRequestIndexTransactionArgs = {
  data: RequestIndexTransactionInput;
};


export type MutationRequestUpdateSafeArgs = {
  data: RequestUpdateSafeInput;
};


export type MutationUnlistOfferArgs = {
  offerId: Scalars['Int'];
};


export type MutationUpdateSafeArgs = {
  data: UpdateSafeInput;
};


export type MutationUpsertOfferArgs = {
  data: UpsertOfferInput;
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};


export type MutationUpsertTagArgs = {
  data: UpsertTagInput;
};

export type Offer = {
  __typename?: 'Offer';
  categoryTag?: Maybe<Tag>;
  categoryTagId: Scalars['Int'];
  city?: Maybe<City>;
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  deliveryTermsTag?: Maybe<Tag>;
  deliveryTermsTagId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  geonameid: Scalars['Int'];
  id: Scalars['Int'];
  maxUnits?: Maybe<Scalars['Int']>;
  pictureMimeType: Scalars['String'];
  pictureUrl: Scalars['String'];
  pricePerUnit: Scalars['String'];
  publishedAt: Scalars['String'];
  purchasedAt?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  unitTag?: Maybe<Tag>;
  unitTagId: Scalars['Int'];
  unlistedAt?: Maybe<Scalars['String']>;
};

export type PaymentProof = {
  destinations: Array<Scalars['String']>;
  forOfferId: Scalars['Int'];
  sources: Array<Scalars['String']>;
  tokenOwners: Array<Scalars['String']>;
  values: Array<Scalars['String']>;
};

export type Profile = {
  __typename?: 'Profile';
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  city?: Maybe<City>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  country?: Maybe<Scalars['String']>;
  dream?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastName?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  offers?: Maybe<Array<Offer>>;
  status?: Maybe<Scalars['String']>;
};

export type ProfileEvent = {
  __typename?: 'ProfileEvent';
  createdAt: Scalars['String'];
  data: Scalars['String'];
  id: Scalars['Int'];
  profileId: Scalars['Int'];
  type: Scalars['String'];
};

export type ProvePaymentResult = {
  __typename?: 'ProvePaymentResult';
  success: Scalars['Boolean'];
};

export type Purchase = {
  __typename?: 'Purchase';
  id: Scalars['Int'];
  purchasedAt: Scalars['String'];
  purchasedBy: Profile;
  purchasedByProfileId: Scalars['Int'];
  purchasedFrom: Profile;
  purchasedFromProfileId: Scalars['Int'];
  purchasedItem: Offer;
  purchasedOfferId: Scalars['Int'];
  status: PurchaseStatus;
};

export enum PurchaseStatus {
  Invalid = 'INVALID',
  ItemLocked = 'ITEM_LOCKED',
  PaymentProven = 'PAYMENT_PROVEN'
}

export type Query = {
  __typename?: 'Query';
  cities: Array<City>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  events: Array<ProfileEvent>;
  invitationTransaction?: Maybe<IndexedTransaction>;
  offers: Array<Offer>;
  profiles: Array<Profile>;
  safeFundingTransaction?: Maybe<IndexedTransaction>;
  search: Array<Profile>;
  sessionInfo: SessionInfo;
  stats?: Maybe<Stats>;
  tagById?: Maybe<Tag>;
  tags: Array<Tag>;
  transactions: Array<IndexedTransaction>;
  version: Version;
  whoami?: Maybe<Scalars['String']>;
};


export type QueryCitiesArgs = {
  query: QueryCitiesInput;
};


export type QueryOffersArgs = {
  query: QueryOfferInput;
};


export type QueryProfilesArgs = {
  query: QueryProfileInput;
};


export type QuerySearchArgs = {
  query: SearchInput;
};


export type QueryTagByIdArgs = {
  id: Scalars['Int'];
};


export type QueryTagsArgs = {
  query: QueryTagsInput;
};


export type QueryTransactionsArgs = {
  query?: Maybe<QueryIndexedTransactionInput>;
};

export type QueryCitiesByGeonameIdInput = {
  geonameid: Array<Scalars['Int']>;
};

export type QueryCitiesByNameInput = {
  languageCode?: Maybe<Scalars['String']>;
  name_like: Scalars['String'];
};

export type QueryCitiesInput = {
  byId?: Maybe<QueryCitiesByGeonameIdInput>;
  byName?: Maybe<QueryCitiesByNameInput>;
};

export type QueryIndexedTransactionInput = {
  fromBlockNo?: Maybe<Scalars['Int']>;
  toBlockNo?: Maybe<Scalars['Int']>;
};

export type QueryOfferInput = {
  categoryTagId?: Maybe<Scalars['Int']>;
  createdByProfileId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  publishedAt_gt?: Maybe<Scalars['String']>;
  publishedAt_lt?: Maybe<Scalars['String']>;
};

export type QueryProfileInput = {
  circlesAddress?: Maybe<Array<Scalars['String']>>;
  country?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Array<Scalars['Int']>>;
  lastName?: Maybe<Scalars['String']>;
};

export type QueryPurchaseInput = {
  purchasedByProfileId: Scalars['String'];
};

export type QueryTagsInput = {
  typeId_in: Array<Scalars['String']>;
  value_like?: Maybe<Scalars['String']>;
};

export type QueryUniqueProfileInput = {
  id: Scalars['Int'];
};

export type RedeemClaimedInvitationResult = {
  __typename?: 'RedeemClaimedInvitationResult';
  redeemRequest?: Maybe<RedeemInvitationRequest>;
  success: Scalars['Boolean'];
};

export type RedeemInvitationRequest = {
  __typename?: 'RedeemInvitationRequest';
  id: Scalars['Int'];
};

export type RequestIndexTransactionInput = {
  tags?: Maybe<Array<CreateTagInput>>;
  transactionHash: Scalars['String'];
};

export type RequestUpdateSafeInput = {
  newSafeAddress: Scalars['String'];
};

export type RequestUpdateSafeResponse = {
  __typename?: 'RequestUpdateSafeResponse';
  challenge?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type SearchInput = {
  searchString: Scalars['String'];
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

export type Stats = {
  __typename?: 'Stats';
  cities: Array<CityStats>;
  cityRank?: Maybe<Scalars['Int']>;
  countries: Array<CountryStats>;
  currentGoal: Scalars['Int'];
  currentGoalFrom: Scalars['Int'];
  goals: Array<Goal>;
  inviteRank: Scalars['Int'];
  nextGoalAt: Scalars['Int'];
  totalCitizens: Scalars['Int'];
};

export type Subscriptions = {
  __typename?: 'Subscriptions';
  events: Array<ProfileEvent>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type UpdateSafeInput = {
  signature: Scalars['String'];
};

export type UpdateSafeResponse = {
  __typename?: 'UpdateSafeResponse';
  errorMessage?: Maybe<Scalars['String']>;
  newSafeAddress?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};


export type UpsertOfferInput = {
  categoryTagId: Scalars['Int'];
  deliveryTermsTagId: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  geonameid: Scalars['Int'];
  id?: Maybe<Scalars['Int']>;
  maxUnits?: Maybe<Scalars['Int']>;
  pictureMimeType?: Maybe<Scalars['String']>;
  pictureUrl?: Maybe<Scalars['String']>;
  pricePerUnit: Scalars['String'];
  title: Scalars['String'];
  unitTagId: Scalars['Int'];
};

export type UpsertProfileInput = {
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  country?: Maybe<Scalars['String']>;
  dream?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  status: Scalars['String'];
};

export type UpsertTagInput = {
  id?: Maybe<Scalars['Int']>;
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export type ProfilesByNameQueryVariables = Exact<{
  searchString: Scalars['String'];
}>;


export type ProfilesByNameQuery = (
  { __typename?: 'Query' }
  & { search: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name'>
    )> }
  )> }
);

export type InvitationTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitationTransactionQuery = (
  { __typename?: 'Query' }
  & { invitationTransaction?: Maybe<(
    { __typename?: 'IndexedTransaction' }
    & Pick<IndexedTransaction, 'transactionHash'>
  )> }
);

export type SafeFundingTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type SafeFundingTransactionQuery = (
  { __typename?: 'Query' }
  & { safeFundingTransaction?: Maybe<(
    { __typename?: 'IndexedTransaction' }
    & Pick<IndexedTransaction, 'transactionHash'>
  )> }
);

export type ProfileByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProfileByIdQuery = (
  { __typename?: 'Query' }
  & { profiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name'>
    )> }
  )> }
);

export type ProfileBySafeAddressQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type ProfileBySafeAddressQuery = (
  { __typename?: 'Query' }
  & { profiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name'>
    )> }
  )> }
);

export type TagsQueryVariables = Exact<{
  typeId_in: Array<Scalars['String']> | Scalars['String'];
  value_like?: Maybe<Scalars['String']>;
}>;


export type TagsQuery = (
  { __typename?: 'Query' }
  & { tags: Array<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'id' | 'typeId' | 'value'>
  )> }
);

export type TagByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TagByIdQuery = (
  { __typename?: 'Query' }
  & { tagById?: Maybe<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'id' | 'typeId' | 'value'>
  )> }
);

export type CitiesByNameQueryVariables = Exact<{
  name: Scalars['String'];
  languageCode?: Maybe<Scalars['String']>;
}>;


export type CitiesByNameQuery = (
  { __typename?: 'Query' }
  & { cities: Array<(
    { __typename?: 'City' }
    & Pick<City, 'geonameid' | 'name' | 'country' | 'population' | 'latitude' | 'longitude' | 'feature_code'>
  )> }
);

export type CitiesByIdQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CitiesByIdQuery = (
  { __typename?: 'Query' }
  & { cities: Array<(
    { __typename?: 'City' }
    & Pick<City, 'geonameid' | 'name' | 'country' | 'population' | 'latitude' | 'longitude' | 'feature_code'>
  )> }
);

export type StatsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatsQuery = (
  { __typename?: 'Query' }
  & { stats?: Maybe<(
    { __typename?: 'Stats' }
    & Pick<Stats, 'cityRank' | 'inviteRank' | 'currentGoal' | 'totalCitizens' | 'currentGoalFrom' | 'nextGoalAt'>
    & { cities: Array<(
      { __typename?: 'CityStats' }
      & Pick<CityStats, 'geonameid' | 'latitude' | 'longitude' | 'name' | 'citizenCount' | 'population'>
    )>, countries: Array<(
      { __typename?: 'CountryStats' }
      & Pick<CountryStats, 'citizenCount' | 'name'>
    )> }
  )> }
);


export const ProfilesByNameDocument = gql`
    query profilesByName($searchString: String!) {
  search(query: {searchString: $searchString}) {
    id
    circlesSafeOwner
    circlesAddress
    avatarUrl
    firstName
    lastName
    dream
    country
    cityGeonameid
    city {
      geonameid
      country
      name
    }
  }
}
    `;
export const InvitationTransactionDocument = gql`
    query invitationTransaction {
  invitationTransaction {
    transactionHash
  }
}
    `;
export const SafeFundingTransactionDocument = gql`
    query safeFundingTransaction {
  safeFundingTransaction {
    transactionHash
  }
}
    `;
export const ProfileByIdDocument = gql`
    query profileById($id: Int!) {
  profiles(query: {id: [$id]}) {
    id
    circlesSafeOwner
    circlesAddress
    avatarUrl
    firstName
    lastName
    dream
    country
    cityGeonameid
    city {
      geonameid
      country
      name
    }
  }
}
    `;
export const ProfileBySafeAddressDocument = gql`
    query profileBySafeAddress($safeAddress: String!) {
  profiles(query: {circlesAddress: [$safeAddress]}) {
    id
    circlesSafeOwner
    circlesAddress
    avatarUrl
    firstName
    lastName
    dream
    country
    cityGeonameid
    city {
      geonameid
      country
      name
    }
  }
}
    `;
export const TagsDocument = gql`
    query tags($typeId_in: [String!]!, $value_like: String) {
  tags(query: {typeId_in: $typeId_in, value_like: $value_like}) {
    id
    typeId
    value
  }
}
    `;
export const TagByIdDocument = gql`
    query tagById($id: Int!) {
  tagById(id: $id) {
    id
    typeId
    value
  }
}
    `;
export const CitiesByNameDocument = gql`
    query citiesByName($name: String!, $languageCode: String) {
  cities(query: {byName: {name_like: $name, languageCode: $languageCode}}) {
    geonameid
    name
    country
    population
    latitude
    longitude
    feature_code
  }
}
    `;
export const CitiesByIdDocument = gql`
    query citiesById($ids: [Int!]!) {
  cities(query: {byId: {geonameid: $ids}}) {
    geonameid
    name
    country
    population
    latitude
    longitude
    feature_code
  }
}
    `;
export const StatsDocument = gql`
    query stats {
  stats {
    cityRank
    inviteRank
    currentGoal
    totalCitizens
    currentGoalFrom
    nextGoalAt
    cities {
      geonameid
      latitude
      longitude
      name
      citizenCount
      population
    }
    countries {
      citizenCount
      name
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    profilesByName(variables: ProfilesByNameQueryVariables): Promise<ProfilesByNameQuery> {
      return withWrapper(() => client.request<ProfilesByNameQuery>(print(ProfilesByNameDocument), variables));
    },
    invitationTransaction(variables?: InvitationTransactionQueryVariables): Promise<InvitationTransactionQuery> {
      return withWrapper(() => client.request<InvitationTransactionQuery>(print(InvitationTransactionDocument), variables));
    },
    safeFundingTransaction(variables?: SafeFundingTransactionQueryVariables): Promise<SafeFundingTransactionQuery> {
      return withWrapper(() => client.request<SafeFundingTransactionQuery>(print(SafeFundingTransactionDocument), variables));
    },
    profileById(variables: ProfileByIdQueryVariables): Promise<ProfileByIdQuery> {
      return withWrapper(() => client.request<ProfileByIdQuery>(print(ProfileByIdDocument), variables));
    },
    profileBySafeAddress(variables: ProfileBySafeAddressQueryVariables): Promise<ProfileBySafeAddressQuery> {
      return withWrapper(() => client.request<ProfileBySafeAddressQuery>(print(ProfileBySafeAddressDocument), variables));
    },
    tags(variables: TagsQueryVariables): Promise<TagsQuery> {
      return withWrapper(() => client.request<TagsQuery>(print(TagsDocument), variables));
    },
    tagById(variables: TagByIdQueryVariables): Promise<TagByIdQuery> {
      return withWrapper(() => client.request<TagByIdQuery>(print(TagByIdDocument), variables));
    },
    citiesByName(variables: CitiesByNameQueryVariables): Promise<CitiesByNameQuery> {
      return withWrapper(() => client.request<CitiesByNameQuery>(print(CitiesByNameDocument), variables));
    },
    citiesById(variables: CitiesByIdQueryVariables): Promise<CitiesByIdQuery> {
      return withWrapper(() => client.request<CitiesByIdQuery>(print(CitiesByIdDocument), variables));
    },
    stats(variables?: StatsQueryVariables): Promise<StatsQuery> {
      return withWrapper(() => client.request<StatsQuery>(print(StatsDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;