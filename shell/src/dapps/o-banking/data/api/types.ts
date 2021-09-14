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

export type BalanceQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type BalanceQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'balance'>
);

export type BalancesByAssetQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type BalancesByAssetQuery = (
  { __typename?: 'Query' }
  & { balancesByAsset: Array<(
    { __typename?: 'AssetBalance' }
    & Pick<AssetBalance, 'token_address' | 'token_owner_address' | 'token_balance'>
    & { token_owner_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>
    )> }
  )> }
);

export type TransactionTimelineQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type TransactionTimelineQuery = (
  { __typename?: 'Query' }
  & { events: Array<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'timestamp' | 'type' | 'value' | 'safe_address' | 'transaction_hash' | 'transaction_index' | 'block_number' | 'direction'>
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
    ) | (
      { __typename?: 'CrcMinting' }
      & Pick<CrcMinting, 'id' | 'token' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )> }
    ) | { __typename?: 'CrcSignup' } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' }> }
  )> }
);

export type TransactionByHashQueryVariables = Exact<{
  safeAddress: Scalars['String'];
  transactionHash: Scalars['String'];
}>;


export type TransactionByHashQuery = (
  { __typename?: 'Query' }
  & { eventByTransactionHash: Array<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'timestamp' | 'type' | 'value' | 'safe_address' | 'transaction_hash' | 'transaction_index' | 'block_number' | 'direction'>
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
    ) | (
      { __typename?: 'CrcMinting' }
      & Pick<CrcMinting, 'id' | 'token' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )> }
    ) | { __typename?: 'CrcSignup' } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' }> }
  )> }
);


export const BalanceDocument = gql`
    query balance($safeAddress: String!) {
  balance(safeAddress: $safeAddress)
}
    `;
export const BalancesByAssetDocument = gql`
    query balancesByAsset($safeAddress: String!) {
  balancesByAsset(safeAddress: $safeAddress) {
    token_address
    token_owner_address
    token_owner_profile {
      id
      firstName
      lastName
      avatarUrl
    }
    token_balance
  }
}
    `;
export const TransactionTimelineDocument = gql`
    query transactionTimeline($safeAddress: String!) {
  events(safeAddress: $safeAddress, types: ["crc_hub_transfer", "crc_minting"]) {
    timestamp
    type
    value
    safe_address
    safe_address_profile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    transaction_hash
    transaction_index
    block_number
    direction
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
      ... on CrcMinting {
        id
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
  }
}
    `;
export const TransactionByHashDocument = gql`
    query transactionByHash($safeAddress: String!, $transactionHash: String!) {
  eventByTransactionHash(
    safeAddress: $safeAddress
    transactionHash: $transactionHash
    types: ["crc_hub_transfer", "crc_minting"]
  ) {
    timestamp
    type
    value
    safe_address
    safe_address_profile {
      id
      firstName
      lastName
      avatarUrl
      circlesAddress
    }
    transaction_hash
    transaction_index
    block_number
    direction
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
      ... on CrcMinting {
        id
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
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    balance(variables: BalanceQueryVariables): Promise<BalanceQuery> {
      return withWrapper(() => client.request<BalanceQuery>(print(BalanceDocument), variables));
    },
    balancesByAsset(variables: BalancesByAssetQueryVariables): Promise<BalancesByAssetQuery> {
      return withWrapper(() => client.request<BalancesByAssetQuery>(print(BalancesByAssetDocument), variables));
    },
    transactionTimeline(variables: TransactionTimelineQueryVariables): Promise<TransactionTimelineQuery> {
      return withWrapper(() => client.request<TransactionTimelineQuery>(print(TransactionTimelineDocument), variables));
    },
    transactionByHash(variables: TransactionByHashQueryVariables): Promise<TransactionByHashQuery> {
      return withWrapper(() => client.request<TransactionByHashQuery>(print(TransactionByHashDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;