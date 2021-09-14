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
};

export type AssetBalance = {
  __typename?: 'AssetBalance';
  token_address: Scalars['String'];
  token_balance: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
};

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

export type CommonTrust = {
  __typename?: 'CommonTrust';
  profile?: Maybe<Profile>;
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
  type: Scalars['String'];
};

export type ConsumeDepositedChallengeResponse = {
  __typename?: 'ConsumeDepositedChallengeResponse';
  challenge?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Contact = {
  __typename?: 'Contact';
  contactAddress: Scalars['String'];
  contactAddressProfile?: Maybe<Profile>;
  lastContactAt?: Maybe<Scalars['String']>;
  safeAddress: Scalars['String'];
  safeAddressProfile?: Maybe<Profile>;
  trustsYou?: Maybe<Scalars['Int']>;
  youTrust?: Maybe<Scalars['Int']>;
};

export type CountryStats = {
  __typename?: 'CountryStats';
  citizenCount: Scalars['Int'];
  name: Scalars['String'];
};

export type CrcHubTransfer = IEventPayload & {
  __typename?: 'CrcHubTransfer';
  flow: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  id: Scalars['Int'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_id: Scalars['Int'];
  transfers: Array<CrcTokenTransfer>;
};

export type CrcMinting = IEventPayload & {
  __typename?: 'CrcMinting';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  id: Scalars['Int'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_id: Scalars['Int'];
  value: Scalars['String'];
};

export type CrcSignup = IEventPayload & {
  __typename?: 'CrcSignup';
  id: Scalars['Int'];
  token: Scalars['String'];
  transaction_id: Scalars['Int'];
  user: Scalars['String'];
  user_profile?: Maybe<Profile>;
};

export type CrcTokenTransfer = IEventPayload & {
  __typename?: 'CrcTokenTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  id: Scalars['Int'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_id: Scalars['Int'];
  value: Scalars['String'];
};

export type CrcTrust = IEventPayload & {
  __typename?: 'CrcTrust';
  address: Scalars['String'];
  address_profile?: Maybe<Profile>;
  can_send_to: Scalars['String'];
  can_send_to_profile?: Maybe<Profile>;
  id: Scalars['Int'];
  limit: Scalars['Int'];
  transaction_id: Scalars['Int'];
};

export type CreateInvitationResult = {
  __typename?: 'CreateInvitationResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CreateTagInput = {
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type CreatedInvitation = {
  __typename?: 'CreatedInvitation';
  claimedAt?: Maybe<Scalars['String']>;
  claimedBy?: Maybe<Profile>;
  claimedByProfileId?: Maybe<Scalars['Int']>;
  code: Scalars['String'];
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
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

export type EthTransfer = IEventPayload & {
  __typename?: 'EthTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  id: Scalars['Int'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_id: Scalars['Int'];
  value: Scalars['String'];
};

export type EventPayload = CrcHubTransfer | CrcMinting | CrcSignup | CrcTokenTransfer | CrcTrust | EthTransfer | GnosisSafeEthTransfer;

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type GnosisSafeEthTransfer = IEventPayload & {
  __typename?: 'GnosisSafeEthTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  id: Scalars['Int'];
  initiator: Scalars['String'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_id: Scalars['Int'];
  value: Scalars['String'];
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

export type IEventPayload = {
  id: Scalars['Int'];
  transaction_id: Scalars['Int'];
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
  createInvitation: CreateInvitationResult;
  depositChallenge: DepositChallengeResponse;
  exchangeToken: ExchangeTokenResponse;
  lockOffer: LockOfferResult;
  logout: LogoutResponse;
  provePayment: ProvePaymentResult;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  requestUpdateSafe: RequestUpdateSafeResponse;
  sendMessage?: Maybe<SendMessageResult>;
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


export type MutationCreateInvitationArgs = {
  for: Scalars['String'];
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


export type MutationRequestUpdateSafeArgs = {
  data: RequestUpdateSafeInput;
};


export type MutationSendMessageArgs = {
  content: Scalars['String'];
  toSafeAddress: Scalars['String'];
  type: Scalars['String'];
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
  block_number: Scalars['Int'];
  direction: Scalars['String'];
  id: Scalars['Int'];
  payload?: Maybe<EventPayload>;
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  timestamp: Scalars['String'];
  transaction_hash: Scalars['String'];
  transaction_index: Scalars['Int'];
  type: Scalars['String'];
  value: Scalars['String'];
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
  balance: Scalars['String'];
  balancesByAsset: Array<AssetBalance>;
  chatHistory: Array<ProfileEvent>;
  cities: Array<City>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  commonTrust: Array<CommonTrust>;
  contact?: Maybe<Contact>;
  contacts: Array<Contact>;
  eventByTransactionHash: Array<ProfileEvent>;
  events: Array<ProfileEvent>;
  invitationTransaction?: Maybe<ProfileEvent>;
  myInvitations: Array<CreatedInvitation>;
  myProfile?: Maybe<Profile>;
  offers: Array<Offer>;
  profilesById: Array<Profile>;
  profilesBySafeAddress: Array<Profile>;
  safeFundingTransaction?: Maybe<ProfileEvent>;
  search: Array<Profile>;
  sessionInfo: SessionInfo;
  stats?: Maybe<Stats>;
  tagById?: Maybe<Tag>;
  tags: Array<Tag>;
  trustRelations: Array<TrustRelation>;
  version: Version;
  whoami?: Maybe<Scalars['String']>;
};


export type QueryBalanceArgs = {
  safeAddress: Scalars['String'];
};


export type QueryBalancesByAssetArgs = {
  safeAddress: Scalars['String'];
};


export type QueryChatHistoryArgs = {
  contactSafeAddress: Scalars['String'];
  safeAddress: Scalars['String'];
};


export type QueryCitiesArgs = {
  query: QueryCitiesInput;
};


export type QueryCommonTrustArgs = {
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
};


export type QueryContactArgs = {
  contactAddress: Scalars['String'];
  safeAddress: Scalars['String'];
};


export type QueryContactsArgs = {
  safeAddress: Scalars['String'];
};


export type QueryEventByTransactionHashArgs = {
  safeAddress: Scalars['String'];
  transactionHash: Scalars['String'];
  types?: Maybe<Array<Scalars['String']>>;
};


export type QueryEventsArgs = {
  fromBlock?: Maybe<Scalars['Int']>;
  safeAddress: Scalars['String'];
  toBlock?: Maybe<Scalars['Int']>;
  types?: Maybe<Array<Scalars['String']>>;
};


export type QueryOffersArgs = {
  query: QueryOfferInput;
};


export type QueryProfilesByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryProfilesBySafeAddressArgs = {
  safeAddresses: Array<Scalars['String']>;
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


export type QueryTrustRelationsArgs = {
  safeAddress: Scalars['String'];
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

export type SendMessageResult = {
  __typename?: 'SendMessageResult';
  error?: Maybe<Scalars['String']>;
  event?: Maybe<ProfileEvent>;
  success: Scalars['Boolean'];
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

export type Subscription = {
  __typename?: 'Subscription';
  events: Array<ProfileEvent>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export enum TrustDirection {
  In = 'IN',
  Mutual = 'MUTUAL',
  Out = 'OUT'
}

export type TrustRelation = {
  __typename?: 'TrustRelation';
  direction: TrustDirection;
  otherSafeAddress: Scalars['String'];
  otherSafeAddressProfile?: Maybe<Profile>;
  safeAddress: Scalars['String'];
  safeAddressProfile?: Maybe<Profile>;
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

export type ClaimInvitationMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type ClaimInvitationMutation = (
  { __typename?: 'Mutation' }
  & { claimInvitation: (
    { __typename?: 'ClaimInvitationResult' }
    & Pick<ClaimInvitationResult, 'success'>
    & { claimedInvitation?: Maybe<(
      { __typename?: 'ClaimedInvitation' }
      & Pick<ClaimedInvitation, 'createdAt' | 'createdByProfileId' | 'claimedAt' | 'claimedByProfileId'>
    )> }
  ) }
);

export type RedeemClaimedInvitationMutationVariables = Exact<{ [key: string]: never; }>;


export type RedeemClaimedInvitationMutation = (
  { __typename?: 'Mutation' }
  & { redeemClaimedInvitation: (
    { __typename?: 'RedeemClaimedInvitationResult' }
    & Pick<RedeemClaimedInvitationResult, 'success'>
    & { redeemRequest?: Maybe<(
      { __typename?: 'RedeemInvitationRequest' }
      & Pick<RedeemInvitationRequest, 'id'>
    )> }
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
  dream?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
}>;


export type UpsertProfileMutation = (
  { __typename?: 'Mutation' }
  & { upsertProfile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'circlesAddress' | 'circlesSafeOwner' | 'newsletter' | 'cityGeonameid' | 'status'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name' | 'latitude' | 'longitude' | 'population' | 'feature_code'>
    )> }
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

export type WhoamiQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoamiQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'whoami'>
);

export type ClaimedInvitationQueryVariables = Exact<{ [key: string]: never; }>;


export type ClaimedInvitationQuery = (
  { __typename?: 'Query' }
  & { claimedInvitation?: Maybe<(
    { __typename?: 'ClaimedInvitation' }
    & Pick<ClaimedInvitation, 'createdAt' | 'createdByProfileId' | 'claimedAt' | 'claimedByProfileId'>
  )> }
);

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )> }
  )> }
);

export type ProfilesQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )> }
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

export type ProfilesByCirclesAddressQueryVariables = Exact<{
  circlesAddresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type ProfilesByCirclesAddressQuery = (
  { __typename?: 'Query' }
  & { profilesBySafeAddress: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )> }
  )> }
);

export type ProfilesByIdsQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesByIdsQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )> }
  )> }
);

export type TrustRelationsQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type TrustRelationsQuery = (
  { __typename?: 'Query' }
  & { trustRelations: Array<(
    { __typename?: 'TrustRelation' }
    & Pick<TrustRelation, 'safeAddress' | 'direction' | 'otherSafeAddress'>
    & { safeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )>, otherSafeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )> }
  )> }
);

export type ContactsQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type ContactsQuery = (
  { __typename?: 'Query' }
  & { contacts: Array<(
    { __typename?: 'Contact' }
    & Pick<Contact, 'contactAddress' | 'safeAddress' | 'lastContactAt' | 'youTrust' | 'trustsYou'>
    & { contactAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )>, safeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )> }
  )> }
);

export type ContactQueryVariables = Exact<{
  safeAddress: Scalars['String'];
  contactAddress: Scalars['String'];
}>;


export type ContactQuery = (
  { __typename?: 'Query' }
  & { contact?: Maybe<(
    { __typename?: 'Contact' }
    & Pick<Contact, 'contactAddress' | 'safeAddress' | 'lastContactAt' | 'youTrust' | 'trustsYou'>
    & { contactAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )>, safeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )> }
  )> }
);

export type ChatHistoryQueryVariables = Exact<{
  safeAddress: Scalars['String'];
  contactSafeAddress: Scalars['String'];
}>;


export type ChatHistoryQuery = (
  { __typename?: 'Query' }
  & { chatHistory: Array<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'block_number' | 'direction' | 'id' | 'safe_address' | 'timestamp' | 'transaction_hash' | 'transaction_index' | 'type' | 'value'>
    & { safe_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )>, payload?: Maybe<(
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'id' | 'from' | 'to' | 'flow'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, transfers: Array<(
        { __typename?: 'CrcTokenTransfer' }
        & Pick<CrcTokenTransfer, 'token' | 'from' | 'to' | 'value'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )> }
      )> }
    ) | { __typename?: 'CrcMinting' } | { __typename?: 'CrcSignup' } | { __typename?: 'CrcTokenTransfer' } | (
      { __typename?: 'CrcTrust' }
      & Pick<CrcTrust, 'address' | 'can_send_to' | 'limit'>
      & { address_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, can_send_to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )> }
    ) | (
      { __typename?: 'EthTransfer' }
      & Pick<EthTransfer, 'id' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )> }
    ) | (
      { __typename?: 'GnosisSafeEthTransfer' }
      & Pick<GnosisSafeEthTransfer, 'id' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )> }
    )> }
  )> }
);

export type InvitationTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitationTransactionQuery = (
  { __typename?: 'Query' }
  & { invitationTransaction?: Maybe<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'transaction_hash'>
  )> }
);

export type SafeFundingTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type SafeFundingTransactionQuery = (
  { __typename?: 'Query' }
  & { safeFundingTransaction?: Maybe<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'transaction_hash'>
  )> }
);

export type ProfileByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProfileByIdQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
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
  & { profilesBySafeAddress: Array<(
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

export type CommonTrustQueryVariables = Exact<{
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
}>;


export type CommonTrustQuery = (
  { __typename?: 'Query' }
  & { commonTrust: Array<(
    { __typename?: 'CommonTrust' }
    & Pick<CommonTrust, 'type' | 'safeAddress1' | 'safeAddress2'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )> }
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
export const ClaimInvitationDocument = gql`
    mutation claimInvitation($code: String!) {
  claimInvitation(code: $code) {
    success
    claimedInvitation {
      createdAt
      createdByProfileId
      claimedAt
      claimedByProfileId
    }
  }
}
    `;
export const RedeemClaimedInvitationDocument = gql`
    mutation redeemClaimedInvitation {
  redeemClaimedInvitation {
    redeemRequest {
      id
    }
    success
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
    mutation upsertProfile($id: Int, $firstName: String!, $lastName: String, $dream: String, $country: String, $avatarUrl: String, $avatarCid: String, $avatarMimeType: String, $circlesAddress: String, $circlesSafeOwner: String, $newsletter: Boolean, $cityGeonameid: Int, $status: String!) {
  upsertProfile(
    data: {id: $id, firstName: $firstName, lastName: $lastName, dream: $dream, country: $country, avatarUrl: $avatarUrl, avatarCid: $avatarCid, avatarMimeType: $avatarMimeType, circlesAddress: $circlesAddress, circlesSafeOwner: $circlesSafeOwner, newsletter: $newsletter, cityGeonameid: $cityGeonameid, status: $status}
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
    circlesSafeOwner
    newsletter
    cityGeonameid
    city {
      geonameid
      country
      name
      latitude
      longitude
      population
      feature_code
    }
    status
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
export const WhoamiDocument = gql`
    query whoami {
  whoami
}
    `;
export const ClaimedInvitationDocument = gql`
    query claimedInvitation {
  claimedInvitation {
    createdAt
    createdByProfileId
    claimedAt
    claimedByProfileId
  }
}
    `;
export const MyProfileDocument = gql`
    query myProfile {
  myProfile {
    id
    circlesAddress
    circlesSafeOwner
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    cityGeonameid
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
  }
}
    `;
export const ProfilesDocument = gql`
    query profiles($id: [Int!]!) {
  profilesById(ids: $id) {
    id
    circlesAddress
    circlesSafeOwner
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    cityGeonameid
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
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
export const ProfilesByCirclesAddressDocument = gql`
    query profilesByCirclesAddress($circlesAddresses: [String!]!) {
  profilesBySafeAddress(safeAddresses: $circlesAddresses) {
    id
    circlesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    cityGeonameid
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
  }
}
    `;
export const ProfilesByIdsDocument = gql`
    query profilesByIds($id: [Int!]!) {
  profilesById(ids: $id) {
    id
    circlesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    cityGeonameid
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
  }
}
    `;
export const TrustRelationsDocument = gql`
    query trustRelations($safeAddress: String!) {
  trustRelations(safeAddress: $safeAddress) {
    safeAddress
    safeAddressProfile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    direction
    otherSafeAddress
    otherSafeAddressProfile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
  }
}
    `;
export const ContactsDocument = gql`
    query contacts($safeAddress: String!) {
  contacts(safeAddress: $safeAddress) {
    contactAddress
    contactAddressProfile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    safeAddress
    safeAddressProfile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    lastContactAt
    youTrust
    trustsYou
  }
}
    `;
export const ContactDocument = gql`
    query contact($safeAddress: String!, $contactAddress: String!) {
  contact(safeAddress: $safeAddress, contactAddress: $contactAddress) {
    contactAddress
    contactAddressProfile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    safeAddress
    safeAddressProfile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    lastContactAt
    youTrust
    trustsYou
  }
}
    `;
export const ChatHistoryDocument = gql`
    query chatHistory($safeAddress: String!, $contactSafeAddress: String!) {
  chatHistory(safeAddress: $safeAddress, contactSafeAddress: $contactSafeAddress) {
    block_number
    direction
    id
    safe_address
    safe_address_profile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    timestamp
    transaction_hash
    transaction_index
    type
    value
    payload {
      ... on CrcHubTransfer {
        id
        from
        from_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        to
        to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        flow
        transfers {
          token
          from
          from_profile {
            id
            firstName
            lastName
            avatarUrl
            circlesAddress
          }
          to
          to_profile {
            id
            firstName
            lastName
            avatarUrl
            circlesAddress
          }
          value
        }
      }
      ... on EthTransfer {
        id
        from
        from_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        to
        to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        value
      }
      ... on GnosisSafeEthTransfer {
        id
        from
        from_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        to
        to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        value
      }
      ... on CrcTrust {
        address
        address_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        can_send_to
        can_send_to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
        }
        limit
      }
    }
  }
}
    `;
export const InvitationTransactionDocument = gql`
    query invitationTransaction {
  invitationTransaction {
    transaction_hash
  }
}
    `;
export const SafeFundingTransactionDocument = gql`
    query safeFundingTransaction {
  safeFundingTransaction {
    transaction_hash
  }
}
    `;
export const ProfileByIdDocument = gql`
    query profileById($id: Int!) {
  profilesById(ids: [$id]) {
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
  profilesBySafeAddress(safeAddresses: [$safeAddress]) {
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
export const CommonTrustDocument = gql`
    query commonTrust($safeAddress1: String!, $safeAddress2: String!) {
  commonTrust(safeAddress1: $safeAddress1, safeAddress2: $safeAddress2) {
    type
    safeAddress1
    safeAddress2
    profile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
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
    claimInvitation(variables: ClaimInvitationMutationVariables): Promise<ClaimInvitationMutation> {
      return withWrapper(() => client.request<ClaimInvitationMutation>(print(ClaimInvitationDocument), variables));
    },
    redeemClaimedInvitation(variables?: RedeemClaimedInvitationMutationVariables): Promise<RedeemClaimedInvitationMutation> {
      return withWrapper(() => client.request<RedeemClaimedInvitationMutation>(print(RedeemClaimedInvitationDocument), variables));
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
    whoami(variables?: WhoamiQueryVariables): Promise<WhoamiQuery> {
      return withWrapper(() => client.request<WhoamiQuery>(print(WhoamiDocument), variables));
    },
    claimedInvitation(variables?: ClaimedInvitationQueryVariables): Promise<ClaimedInvitationQuery> {
      return withWrapper(() => client.request<ClaimedInvitationQuery>(print(ClaimedInvitationDocument), variables));
    },
    myProfile(variables?: MyProfileQueryVariables): Promise<MyProfileQuery> {
      return withWrapper(() => client.request<MyProfileQuery>(print(MyProfileDocument), variables));
    },
    profiles(variables: ProfilesQueryVariables): Promise<ProfilesQuery> {
      return withWrapper(() => client.request<ProfilesQuery>(print(ProfilesDocument), variables));
    },
    citiesByName(variables: CitiesByNameQueryVariables): Promise<CitiesByNameQuery> {
      return withWrapper(() => client.request<CitiesByNameQuery>(print(CitiesByNameDocument), variables));
    },
    citiesById(variables: CitiesByIdQueryVariables): Promise<CitiesByIdQuery> {
      return withWrapper(() => client.request<CitiesByIdQuery>(print(CitiesByIdDocument), variables));
    },
    profilesByName(variables: ProfilesByNameQueryVariables): Promise<ProfilesByNameQuery> {
      return withWrapper(() => client.request<ProfilesByNameQuery>(print(ProfilesByNameDocument), variables));
    },
    profilesByCirclesAddress(variables: ProfilesByCirclesAddressQueryVariables): Promise<ProfilesByCirclesAddressQuery> {
      return withWrapper(() => client.request<ProfilesByCirclesAddressQuery>(print(ProfilesByCirclesAddressDocument), variables));
    },
    profilesByIds(variables: ProfilesByIdsQueryVariables): Promise<ProfilesByIdsQuery> {
      return withWrapper(() => client.request<ProfilesByIdsQuery>(print(ProfilesByIdsDocument), variables));
    },
    trustRelations(variables: TrustRelationsQueryVariables): Promise<TrustRelationsQuery> {
      return withWrapper(() => client.request<TrustRelationsQuery>(print(TrustRelationsDocument), variables));
    },
    contacts(variables: ContactsQueryVariables): Promise<ContactsQuery> {
      return withWrapper(() => client.request<ContactsQuery>(print(ContactsDocument), variables));
    },
    contact(variables: ContactQueryVariables): Promise<ContactQuery> {
      return withWrapper(() => client.request<ContactQuery>(print(ContactDocument), variables));
    },
    chatHistory(variables: ChatHistoryQueryVariables): Promise<ChatHistoryQuery> {
      return withWrapper(() => client.request<ChatHistoryQuery>(print(ChatHistoryDocument), variables));
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
    stats(variables?: StatsQueryVariables): Promise<StatsQuery> {
      return withWrapper(() => client.request<StatsQuery>(print(StatsDocument), variables));
    },
    commonTrust(variables: CommonTrustQueryVariables): Promise<CommonTrustQuery> {
      return withWrapper(() => client.request<CommonTrustQuery>(print(CommonTrustDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;