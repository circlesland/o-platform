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

export type AddMemberResult = {
  __typename?: 'AddMemberResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type AssetBalance = {
  __typename?: 'AssetBalance';
  token_address: Scalars['String'];
  token_balance: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
};

export type ChatMessage = IEventPayload & {
  __typename?: 'ChatMessage';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  text: Scalars['String'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
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
  lastEvent?: Maybe<ProfileEvent>;
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
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
  transfers: Array<CrcTokenTransfer>;
};

export type CrcMinting = IEventPayload & {
  __typename?: 'CrcMinting';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type CrcSignup = IEventPayload & {
  __typename?: 'CrcSignup';
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  user: Scalars['String'];
  user_profile?: Maybe<Profile>;
};

export type CrcTokenTransfer = IEventPayload & {
  __typename?: 'CrcTokenTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type CrcTrust = IEventPayload & {
  __typename?: 'CrcTrust';
  address: Scalars['String'];
  address_profile?: Maybe<Profile>;
  can_send_to: Scalars['String'];
  can_send_to_profile?: Maybe<Profile>;
  limit: Scalars['Int'];
  transaction_hash: Scalars['String'];
};

export type CreateInvitationResult = {
  __typename?: 'CreateInvitationResult';
  createdInviteEoas: Array<CreatedInvitation>;
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CreateOrganisationResult = {
  __typename?: 'CreateOrganisationResult';
  error?: Maybe<Scalars['String']>;
  organisation?: Maybe<Organisation>;
  success: Scalars['Boolean'];
};

export type CreateTagInput = {
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type CreatedInvitation = {
  __typename?: 'CreatedInvitation';
  address: Scalars['String'];
  balance: Scalars['String'];
  claimedAt?: Maybe<Scalars['String']>;
  claimedBy?: Maybe<Profile>;
  claimedByProfileId?: Maybe<Scalars['Int']>;
  code: Scalars['String'];
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  name: Scalars['String'];
};

export type CreatedInviteEoa = {
  __typename?: 'CreatedInviteEoa';
  address: Scalars['String'];
  fee: Scalars['String'];
  for: Scalars['String'];
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
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type EventPayload = ChatMessage | CrcHubTransfer | CrcMinting | CrcSignup | CrcTokenTransfer | CrcTrust | EthTransfer | GnosisSafeEthTransfer;

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type GnosisSafeEthTransfer = IEventPayload & {
  __typename?: 'GnosisSafeEthTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  initiator: Scalars['String'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
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
  transaction_hash?: Maybe<Scalars['String']>;
};

export type InitAggregateState = {
  __typename?: 'InitAggregateState';
  hubSignupTransaction?: Maybe<Scalars['String']>;
  invitation?: Maybe<ClaimedInvitation>;
  invitationTransaction?: Maybe<Scalars['String']>;
  registration?: Maybe<Profile>;
  safeFundingTransaction?: Maybe<Scalars['String']>;
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
  acknowledge: Scalars['Boolean'];
  addMember?: Maybe<AddMemberResult>;
  removeMember?: Maybe<RemoveMemberResult>;
  authenticateAt: DelegateAuthInit;
  claimInvitation: ClaimInvitationResult;
  consumeDepositedChallenge: ConsumeDepositedChallengeResponse;
  createInvitations: CreateInvitationResult;
  createTestInvitation: CreateInvitationResult;
  depositChallenge: DepositChallengeResponse;
  exchangeToken: ExchangeTokenResponse;
  lockOffer: LockOfferResult;
  logout: LogoutResponse;
  provePayment: ProvePaymentResult;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  requestSessionChallenge: Scalars['String'];
  requestUpdateSafe: RequestUpdateSafeResponse;
  sendMessage: SendMessageResult;
  tagTransaction: TagTransactionResult;
  unlistOffer: Scalars['Boolean'];
  updateSafe: UpdateSafeResponse;
  upsertOffer: Offer;
  upsertOrganisation: CreateOrganisationResult;
  upsertProfile: Profile;
  upsertTag: Tag;
  verifySessionChallenge?: Maybe<ExchangeTokenResponse>;
};


export type MutationAcknowledgeArgs = {
  until: Scalars['String'];
};


export type MutationAddMemberArgs = {
  groupId: Scalars['String'];
  memberId: Scalars['Int'];
};


export type MutationRemoveMemberArgs = {
  groupId: Scalars['String'];
  memberId: Scalars['Int'];
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


export type MutationCreateInvitationsArgs = {
  for: Array<Scalars['String']>;
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


export type MutationRequestSessionChallengeArgs = {
  address: Scalars['String'];
};


export type MutationRequestUpdateSafeArgs = {
  data: RequestUpdateSafeInput;
};


export type MutationSendMessageArgs = {
  content: Scalars['String'];
  toSafeAddress: Scalars['String'];
};


export type MutationTagTransactionArgs = {
  tag: CreateTagInput;
  transactionHash: Scalars['String'];
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


export type MutationUpsertOrganisationArgs = {
  organisation: UpsertOrganisationInput;
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};


export type MutationUpsertTagArgs = {
  data: UpsertTagInput;
};


export type MutationVerifySessionChallengeArgs = {
  challenge: Scalars['String'];
  signature: Scalars['String'];
};

export type NotificationEvent = {
  __typename?: 'NotificationEvent';
  type: Scalars['String'];
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

export type Organisation = {
  __typename?: 'Organisation';
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  city?: Maybe<City>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  members?: Maybe<Array<ProfileOrOrganisation>>;
  name: Scalars['String'];
  offers?: Maybe<Array<Offer>>;
  trustsYou?: Maybe<Scalars['Int']>;
};

export type PaginationArgs = {
  continueAt: Scalars['String'];
  limit: Scalars['Int'];
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
  claimedInvitation?: Maybe<ClaimedInvitation>;
  country?: Maybe<Scalars['String']>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  dream?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastEvent?: Maybe<ProfileEvent>;
  lastName?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  offers?: Maybe<Array<Offer>>;
  status?: Maybe<Scalars['String']>;
  trustsYou?: Maybe<Scalars['Int']>;
  youTrust?: Maybe<Scalars['Int']>;
};

export type ProfileEvent = {
  __typename?: 'ProfileEvent';
  block_number?: Maybe<Scalars['Int']>;
  direction: Scalars['String'];
  payload?: Maybe<EventPayload>;
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  tags?: Maybe<Array<Tag>>;
  timestamp: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
  transaction_index?: Maybe<Scalars['Int']>;
  type: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type ProfileOrOrganisation = Organisation | Profile;

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
  findSafeAddressByOwner: Array<Scalars['String']>;
  hubSignupTransaction?: Maybe<ProfileEvent>;
  inbox: Array<ProfileEvent>;
  initAggregateState?: Maybe<InitAggregateState>;
  invitationTransaction?: Maybe<ProfileEvent>;
  lastUBITransaction?: Maybe<Scalars['String']>;
  myInvitations: Array<CreatedInvitation>;
  myProfile?: Maybe<Profile>;
  offers: Array<Offer>;
  organisations: Array<Organisation>;
  organisationsByAddress: Array<Organisation>;
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
  pagination?: Maybe<PaginationArgs>;
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
  pagination?: Maybe<PaginationArgs>;
  safeAddress: Scalars['String'];
  toBlock?: Maybe<Scalars['Int']>;
  types?: Maybe<Array<Scalars['String']>>;
};


export type QueryFindSafeAddressByOwnerArgs = {
  owner: Scalars['String'];
};


export type QueryOffersArgs = {
  query: QueryOfferInput;
};


export type QueryOrganisationsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryOrganisationsByAddressArgs = {
  addresses: Array<Scalars['String']>;
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
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  transactionHash?: Maybe<Scalars['String']>;
};

export type RemoveMemberResult = {
  __typename?: 'RemoveMemberResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
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
  events: NotificationEvent;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type TagTransactionResult = {
  __typename?: 'TagTransactionResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  tag?: Maybe<Tag>;
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

export type UpsertOrganisationInput = {
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
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
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
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

export type RequestSessionChallengeMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type RequestSessionChallengeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'requestSessionChallenge'>
);

export type VerifySessionChallengeMutationVariables = Exact<{
  challenge: Scalars['String'];
  signature: Scalars['String'];
}>;


export type VerifySessionChallengeMutation = (
  { __typename?: 'Mutation' }
  & { verifySessionChallenge?: Maybe<(
    { __typename?: 'ExchangeTokenResponse' }
    & Pick<ExchangeTokenResponse, 'success' | 'errorMessage'>
  )> }
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

export type AcknowledgeMutationVariables = Exact<{
  until: Scalars['String'];
}>;


export type AcknowledgeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'acknowledge'>
);

export type SendMessageMutationVariables = Exact<{
  toSafeAddress: Scalars['String'];
  content: Scalars['String'];
}>;


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & { sendMessage: (
    { __typename?: 'SendMessageResult' }
    & Pick<SendMessageResult, 'success' | 'error'>
    & { event?: Maybe<(
      { __typename?: 'ProfileEvent' }
      & Pick<ProfileEvent, 'block_number' | 'direction' | 'safe_address' | 'timestamp' | 'transaction_hash' | 'transaction_index' | 'type' | 'value'>
      & { safe_address_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, tags?: Maybe<Array<(
        { __typename?: 'Tag' }
        & Pick<Tag, 'id' | 'typeId' | 'value'>
      )>>, payload?: Maybe<(
        { __typename?: 'ChatMessage' }
        & Pick<ChatMessage, 'from' | 'to' | 'text'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )> }
      ) | (
        { __typename?: 'CrcHubTransfer' }
        & Pick<CrcHubTransfer, 'from' | 'to' | 'flow'>
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
        & Pick<EthTransfer, 'from' | 'to' | 'value'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )> }
      ) | (
        { __typename?: 'GnosisSafeEthTransfer' }
        & Pick<GnosisSafeEthTransfer, 'from' | 'to' | 'value'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )> }
      )> }
    )> }
  ) }
);

export type AddMemberMutationVariables = Exact<{
  groupId: Scalars['String'];
  memberId: Scalars['Int'];
}>;


export type AddMemberMutation = (
  { __typename?: 'Mutation' }
  & { addMember?: Maybe<(
    { __typename?: 'AddMemberResult' }
    & Pick<AddMemberResult, 'error' | 'success'>
  )> }
);

export type RemoveMemberMutationVariables = Exact<{
  groupId: Scalars['String'];
  memberId: Scalars['Int'];
}>;


export type RemoveMemberMutation = (
  { __typename?: 'Mutation' }
  & { removeMember?: Maybe<(
    { __typename?: 'RemoveMemberResult' }
    & Pick<RemoveMemberResult, 'error' | 'success'>
  )> }
);

export type RedeemClaimedInvitationMutationVariables = Exact<{ [key: string]: never; }>;


export type RedeemClaimedInvitationMutation = (
  { __typename?: 'Mutation' }
  & { redeemClaimedInvitation: (
    { __typename?: 'RedeemClaimedInvitationResult' }
    & Pick<RedeemClaimedInvitationResult, 'success' | 'error' | 'transactionHash'>
  ) }
);

export type CreateInvitationsMutationVariables = Exact<{
  for: Array<Scalars['String']> | Scalars['String'];
}>;


export type CreateInvitationsMutation = (
  { __typename?: 'Mutation' }
  & { createInvitations: (
    { __typename?: 'CreateInvitationResult' }
    & Pick<CreateInvitationResult, 'success' | 'error'>
    & { createdInviteEoas: Array<(
      { __typename?: 'CreatedInvitation' }
      & Pick<CreatedInvitation, 'name' | 'address'>
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

export type TagTransactionMutationVariables = Exact<{
  transactionHash: Scalars['String'];
  tag: CreateTagInput;
}>;


export type TagTransactionMutation = (
  { __typename?: 'Mutation' }
  & { tagTransaction: (
    { __typename?: 'TagTransactionResult' }
    & Pick<TagTransactionResult, 'success' | 'error'>
    & { tag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )> }
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
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
}>;


export type UpsertProfileMutation = (
  { __typename?: 'Mutation' }
  & { upsertProfile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'circlesAddress' | 'circlesSafeOwner' | 'newsletter' | 'displayTimeCircles' | 'cityGeonameid' | 'status'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name' | 'latitude' | 'longitude' | 'population' | 'feature_code'>
    )> }
  ) }
);

export type UpsertOrganisationMutationVariables = Exact<{
  organisation: UpsertOrganisationInput;
}>;


export type UpsertOrganisationMutation = (
  { __typename?: 'Mutation' }
  & { upsertOrganisation: (
    { __typename?: 'CreateOrganisationResult' }
    & Pick<CreateOrganisationResult, 'success' | 'error'>
    & { organisation?: Maybe<(
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'avatarMimeType' | 'avatarUrl' | 'circlesAddress' | 'circlesSafeOwner' | 'cityGeonameid' | 'createdAt' | 'description' | 'name'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'country' | 'name' | 'latitude' | 'longitude' | 'population' | 'feature_code'>
      )> }
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

export type FindSafeAddressByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
}>;


export type FindSafeAddressByOwnerQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'findSafeAddressByOwner'>
);

export type InitAggregateStateQueryVariables = Exact<{ [key: string]: never; }>;


export type InitAggregateStateQuery = (
  { __typename?: 'Query' }
  & { initAggregateState?: Maybe<(
    { __typename?: 'InitAggregateState' }
    & Pick<InitAggregateState, 'hubSignupTransaction' | 'invitationTransaction' | 'safeFundingTransaction'>
    & { invitation?: Maybe<(
      { __typename?: 'ClaimedInvitation' }
      & Pick<ClaimedInvitation, 'claimedAt'>
    )>, registration?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName'>
    )> }
  )> }
);

export type ClaimedInvitationQueryVariables = Exact<{ [key: string]: never; }>;


export type ClaimedInvitationQuery = (
  { __typename?: 'Query' }
  & { claimedInvitation?: Maybe<(
    { __typename?: 'ClaimedInvitation' }
    & Pick<ClaimedInvitation, 'createdAt' | 'createdByProfileId' | 'claimedAt' | 'claimedByProfileId'>
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

export type HubSignupTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type HubSignupTransactionQuery = (
  { __typename?: 'Query' }
  & { hubSignupTransaction?: Maybe<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'transaction_hash'>
    & { payload?: Maybe<{ __typename?: 'ChatMessage' } | { __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | (
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'token'>
    ) | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' }> }
  )> }
);

export type MyInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyInvitationsQuery = (
  { __typename?: 'Query' }
  & { myInvitations: Array<(
    { __typename?: 'CreatedInvitation' }
    & Pick<CreatedInvitation, 'createdAt' | 'claimedAt' | 'name' | 'address' | 'balance' | 'code'>
    & { claimedBy?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'circlesAddress' | 'circlesSafeOwner' | 'firstName' | 'lastName' | 'avatarUrl'>
    )> }
  )> }
);

export type BalanceQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type BalanceQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'balance'>
);

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'cityGeonameid'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid' | 'status'>
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

export type TransactionTimelineQueryVariables = Exact<{
  safeAddress: Scalars['String'];
  pagination?: Maybe<PaginationArgs>;
}>;


export type TransactionTimelineQuery = (
  { __typename?: 'Query' }
  & { events: Array<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'timestamp' | 'type' | 'value' | 'safe_address' | 'transaction_hash' | 'transaction_index' | 'block_number' | 'direction'>
    & { safe_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )>, tags?: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>>, payload?: Maybe<{ __typename?: 'ChatMessage' } | (
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'from' | 'to' | 'flow'>
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
      & Pick<CrcMinting, 'token' | 'from' | 'to' | 'value'>
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

export type LastUbiTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type LastUbiTransactionQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'lastUBITransaction'>
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
    )>, lastEvent?: Maybe<(
      { __typename?: 'ProfileEvent' }
      & Pick<ProfileEvent, 'block_number' | 'direction' | 'safe_address' | 'timestamp' | 'transaction_hash' | 'transaction_index' | 'type' | 'value'>
      & { payload?: Maybe<{ __typename?: 'ChatMessage' } | (
        { __typename?: 'CrcHubTransfer' }
        & Pick<CrcHubTransfer, 'from' | 'to' | 'flow'>
      ) | { __typename?: 'CrcMinting' } | { __typename?: 'CrcSignup' } | { __typename?: 'CrcTokenTransfer' } | (
        { __typename?: 'CrcTrust' }
        & Pick<CrcTrust, 'address' | 'can_send_to' | 'limit'>
      ) | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' }> }
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
    & Pick<ProfileEvent, 'block_number' | 'direction' | 'safe_address' | 'timestamp' | 'transaction_hash' | 'transaction_index' | 'type' | 'value'>
    & { safe_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )>, tags?: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>>, payload?: Maybe<(
      { __typename?: 'ChatMessage' }
      & Pick<ChatMessage, 'from' | 'to' | 'text'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )> }
    ) | (
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'from' | 'to' | 'flow'>
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
      & Pick<EthTransfer, 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
      )> }
    ) | (
      { __typename?: 'GnosisSafeEthTransfer' }
      & Pick<GnosisSafeEthTransfer, 'from' | 'to' | 'value'>
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

export type InboxQueryVariables = Exact<{ [key: string]: never; }>;


export type InboxQuery = (
  { __typename?: 'Query' }
  & { inbox: Array<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'block_number' | 'direction' | 'safe_address' | 'timestamp' | 'transaction_hash' | 'transaction_index' | 'type' | 'value'>
    & { safe_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )>, tags?: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>>, payload?: Maybe<(
      { __typename?: 'ChatMessage' }
      & Pick<ChatMessage, 'from' | 'to' | 'text'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )> }
    ) | (
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'from' | 'to' | 'flow'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
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
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )>, can_send_to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )> }
    ) | (
      { __typename?: 'EthTransfer' }
      & Pick<EthTransfer, 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )> }
    ) | (
      { __typename?: 'GnosisSafeEthTransfer' }
      & Pick<GnosisSafeEthTransfer, 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'dream'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'name' | 'country'>
        )> }
      )> }
    )> }
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
    & Pick<Profile, 'id' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid' | 'youTrust' | 'trustsYou'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name'>
    )>, lastEvent?: Maybe<(
      { __typename?: 'ProfileEvent' }
      & Pick<ProfileEvent, 'block_number' | 'direction' | 'safe_address' | 'timestamp' | 'transaction_hash' | 'transaction_index' | 'type' | 'value'>
      & { payload?: Maybe<{ __typename?: 'ChatMessage' } | (
        { __typename?: 'CrcHubTransfer' }
        & Pick<CrcHubTransfer, 'from' | 'to' | 'flow'>
      ) | { __typename?: 'CrcMinting' } | { __typename?: 'CrcSignup' } | { __typename?: 'CrcTokenTransfer' } | (
        { __typename?: 'CrcTrust' }
        & Pick<CrcTrust, 'address' | 'can_send_to' | 'limit'>
      ) | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' }> }
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

export type OrganisationsQueryVariables = Exact<{
  pagination?: Maybe<PaginationArgs>;
}>;


export type OrganisationsQuery = (
  { __typename?: 'Query' }
  & { organisations: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'createdAt' | 'name' | 'avatarMimeType' | 'avatarUrl'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'latitude' | 'longitude' | 'name' | 'population'>
    )> }
  )> }
);

export type OrganisationsByAddressQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type OrganisationsByAddressQuery = (
  { __typename?: 'Query' }
  & { organisationsByAddress: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'createdAt' | 'name' | 'avatarMimeType' | 'avatarUrl'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'latitude' | 'longitude' | 'name' | 'population'>
    )>, members?: Maybe<Array<(
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'circlesAddress' | 'createdAt' | 'name' | 'avatarMimeType' | 'avatarUrl'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'latitude' | 'longitude' | 'name' | 'population'>
      )> }
    ) | (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'country' | 'name'>
      )> }
    )>> }
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
    )>, tags?: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>>, payload?: Maybe<{ __typename?: 'ChatMessage' } | (
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'from' | 'to' | 'flow'>
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
      & Pick<CrcMinting, 'token' | 'from' | 'to' | 'value'>
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
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
    )> }
  )> }
);

export type EventsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EventsSubscription = (
  { __typename?: 'Subscription' }
  & { events: (
    { __typename?: 'NotificationEvent' }
    & Pick<NotificationEvent, 'type'>
  ) }
);


export const ExchangeTokenDocument = gql`
    mutation exchangeToken {
  exchangeToken {
    success
    errorMessage
  }
}
    `;
export const RequestSessionChallengeDocument = gql`
    mutation requestSessionChallenge($address: String!) {
  requestSessionChallenge(address: $address)
}
    `;
export const VerifySessionChallengeDocument = gql`
    mutation verifySessionChallenge($challenge: String!, $signature: String!) {
  verifySessionChallenge(challenge: $challenge, signature: $signature) {
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
export const AcknowledgeDocument = gql`
    mutation acknowledge($until: String!) {
  acknowledge(until: $until)
}
    `;
export const SendMessageDocument = gql`
    mutation sendMessage($toSafeAddress: String!, $content: String!) {
  sendMessage(toSafeAddress: $toSafeAddress, content: $content) {
    success
    error
    event {
      block_number
      direction
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
      tags {
        id
        typeId
        value
      }
      payload {
        ... on ChatMessage {
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
          text
        }
        ... on CrcHubTransfer {
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
}
    `;
export const AddMemberDocument = gql`
    mutation addMember($groupId: String!, $memberId: Int!) {
  addMember(groupId: $groupId, memberId: $memberId) {
    error
    success
  }
}
    `;
export const RemoveMemberDocument = gql`
    mutation removeMember($groupId: String!, $memberId: Int!) {
  removeMember(groupId: $groupId, memberId: $memberId) {
    error
    success
  }
}
    `;
export const RedeemClaimedInvitationDocument = gql`
    mutation redeemClaimedInvitation {
  redeemClaimedInvitation {
    success
    error
    transactionHash
  }
}
    `;
export const CreateInvitationsDocument = gql`
    mutation createInvitations($for: [String!]!) {
  createInvitations(for: $for) {
    success
    error
    createdInviteEoas {
      name
      address
    }
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
export const TagTransactionDocument = gql`
    mutation tagTransaction($transactionHash: String!, $tag: CreateTagInput!) {
  tagTransaction(transactionHash: $transactionHash, tag: $tag) {
    success
    error
    tag {
      id
      typeId
      value
    }
  }
}
    `;
export const UpsertProfileDocument = gql`
    mutation upsertProfile($id: Int, $firstName: String!, $lastName: String, $dream: String, $country: String, $avatarUrl: String, $avatarCid: String, $avatarMimeType: String, $circlesAddress: String, $circlesSafeOwner: String, $newsletter: Boolean, $displayTimeCircles: Boolean, $cityGeonameid: Int, $status: String!) {
  upsertProfile(
    data: {id: $id, firstName: $firstName, lastName: $lastName, dream: $dream, country: $country, avatarUrl: $avatarUrl, avatarCid: $avatarCid, avatarMimeType: $avatarMimeType, circlesAddress: $circlesAddress, circlesSafeOwner: $circlesSafeOwner, newsletter: $newsletter, displayTimeCircles: $displayTimeCircles, cityGeonameid: $cityGeonameid, status: $status}
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
    displayTimeCircles
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
export const UpsertOrganisationDocument = gql`
    mutation upsertOrganisation($organisation: UpsertOrganisationInput!) {
  upsertOrganisation(organisation: $organisation) {
    success
    error
    organisation {
      id
      avatarMimeType
      avatarUrl
      circlesAddress
      circlesSafeOwner
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
      createdAt
      description
      name
    }
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
export const FindSafeAddressByOwnerDocument = gql`
    query findSafeAddressByOwner($owner: String!) {
  findSafeAddressByOwner(owner: $owner)
}
    `;
export const InitAggregateStateDocument = gql`
    query initAggregateState {
  initAggregateState {
    hubSignupTransaction
    invitation {
      claimedAt
    }
    invitationTransaction
    safeFundingTransaction
    registration {
      id
      firstName
    }
  }
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
export const HubSignupTransactionDocument = gql`
    query hubSignupTransaction {
  hubSignupTransaction {
    transaction_hash
    payload {
      ... on CrcSignup {
        token
      }
    }
  }
}
    `;
export const MyInvitationsDocument = gql`
    query myInvitations {
  myInvitations {
    createdAt
    claimedAt
    claimedBy {
      circlesAddress
      circlesSafeOwner
      firstName
      lastName
      avatarUrl
    }
    name
    address
    balance
    code
  }
}
    `;
export const BalanceDocument = gql`
    query balance($safeAddress: String!) {
  balance(safeAddress: $safeAddress)
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
    displayTimeCircles
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
    status
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
export const TransactionTimelineDocument = gql`
    query transactionTimeline($safeAddress: String!, $pagination: PaginationArgs) {
  events(
    safeAddress: $safeAddress
    types: ["crc_hub_transfer", "crc_minting"]
    pagination: $pagination
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
    tags {
      id
      typeId
      value
    }
    payload {
      ... on CrcHubTransfer {
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
export const LastUbiTransactionDocument = gql`
    query lastUBITransaction {
  lastUBITransaction
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
    lastEvent {
      block_number
      direction
      safe_address
      timestamp
      transaction_hash
      transaction_index
      type
      value
      payload {
        ... on CrcHubTransfer {
          from
          to
          flow
        }
        ... on CrcTrust {
          address
          can_send_to
          limit
        }
      }
    }
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
    tags {
      id
      typeId
      value
    }
    payload {
      ... on ChatMessage {
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
        text
      }
      ... on CrcHubTransfer {
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
export const InboxDocument = gql`
    query inbox {
  inbox {
    block_number
    direction
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
    tags {
      id
      typeId
      value
    }
    payload {
      ... on ChatMessage {
        from
        from_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
        }
        to
        to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
        }
        text
      }
      ... on CrcHubTransfer {
        from
        from_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
        }
        to
        to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
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
        from
        from_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
        }
        to
        to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
        }
        value
      }
      ... on GnosisSafeEthTransfer {
        from
        from_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
        }
        to
        to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
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
          dream
          city {
            name
            country
          }
        }
        can_send_to
        can_send_to_profile {
          id
          firstName
          lastName
          avatarUrl
          circlesAddress
          dream
          city {
            name
            country
          }
        }
        limit
      }
    }
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
    lastEvent {
      block_number
      direction
      safe_address
      timestamp
      transaction_hash
      transaction_index
      type
      value
      payload {
        ... on CrcHubTransfer {
          from
          to
          flow
        }
        ... on CrcTrust {
          address
          can_send_to
          limit
        }
      }
    }
    youTrust
    trustsYou
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
export const OrganisationsDocument = gql`
    query organisations($pagination: PaginationArgs) {
  organisations(pagination: $pagination) {
    id
    circlesAddress
    createdAt
    name
    avatarMimeType
    avatarUrl
    city {
      geonameid
      latitude
      longitude
      name
      population
    }
  }
}
    `;
export const OrganisationsByAddressDocument = gql`
    query organisationsByAddress($addresses: [String!]!) {
  organisationsByAddress(addresses: $addresses) {
    id
    circlesAddress
    createdAt
    name
    avatarMimeType
    avatarUrl
    city {
      geonameid
      latitude
      longitude
      name
      population
    }
    members {
      ... on Organisation {
        id
        circlesAddress
        createdAt
        name
        avatarMimeType
        avatarUrl
        city {
          geonameid
          latitude
          longitude
          name
          population
        }
      }
      ... on Profile {
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
    tags {
      id
      typeId
      value
    }
    payload {
      ... on CrcHubTransfer {
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
      circlesAddress
    }
    token_balance
  }
}
    `;
export const EventsDocument = gql`
    subscription events {
  events {
    type
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
    requestSessionChallenge(variables: RequestSessionChallengeMutationVariables): Promise<RequestSessionChallengeMutation> {
      return withWrapper(() => client.request<RequestSessionChallengeMutation>(print(RequestSessionChallengeDocument), variables));
    },
    verifySessionChallenge(variables: VerifySessionChallengeMutationVariables): Promise<VerifySessionChallengeMutation> {
      return withWrapper(() => client.request<VerifySessionChallengeMutation>(print(VerifySessionChallengeDocument), variables));
    },
    authenticateAt(variables: AuthenticateAtMutationVariables): Promise<AuthenticateAtMutation> {
      return withWrapper(() => client.request<AuthenticateAtMutation>(print(AuthenticateAtDocument), variables));
    },
    claimInvitation(variables: ClaimInvitationMutationVariables): Promise<ClaimInvitationMutation> {
      return withWrapper(() => client.request<ClaimInvitationMutation>(print(ClaimInvitationDocument), variables));
    },
    acknowledge(variables: AcknowledgeMutationVariables): Promise<AcknowledgeMutation> {
      return withWrapper(() => client.request<AcknowledgeMutation>(print(AcknowledgeDocument), variables));
    },
    sendMessage(variables: SendMessageMutationVariables): Promise<SendMessageMutation> {
      return withWrapper(() => client.request<SendMessageMutation>(print(SendMessageDocument), variables));
    },
    addMember(variables: AddMemberMutationVariables): Promise<AddMemberMutation> {
      return withWrapper(() => client.request<AddMemberMutation>(print(AddMemberDocument), variables));
    },
    removeMember(variables: RemoveMemberMutationVariables): Promise<RemoveMemberMutation> {
      return withWrapper(() => client.request<RemoveMemberMutation>(print(RemoveMemberDocument), variables));
    },
    redeemClaimedInvitation(variables?: RedeemClaimedInvitationMutationVariables): Promise<RedeemClaimedInvitationMutation> {
      return withWrapper(() => client.request<RedeemClaimedInvitationMutation>(print(RedeemClaimedInvitationDocument), variables));
    },
    createInvitations(variables: CreateInvitationsMutationVariables): Promise<CreateInvitationsMutation> {
      return withWrapper(() => client.request<CreateInvitationsMutation>(print(CreateInvitationsDocument), variables));
    },
    consumeDepositedChallenge(variables: ConsumeDepositedChallengeMutationVariables): Promise<ConsumeDepositedChallengeMutation> {
      return withWrapper(() => client.request<ConsumeDepositedChallengeMutation>(print(ConsumeDepositedChallengeDocument), variables));
    },
    logout(variables?: LogoutMutationVariables): Promise<LogoutMutation> {
      return withWrapper(() => client.request<LogoutMutation>(print(LogoutDocument), variables));
    },
    tagTransaction(variables: TagTransactionMutationVariables): Promise<TagTransactionMutation> {
      return withWrapper(() => client.request<TagTransactionMutation>(print(TagTransactionDocument), variables));
    },
    upsertProfile(variables: UpsertProfileMutationVariables): Promise<UpsertProfileMutation> {
      return withWrapper(() => client.request<UpsertProfileMutation>(print(UpsertProfileDocument), variables));
    },
    upsertOrganisation(variables: UpsertOrganisationMutationVariables): Promise<UpsertOrganisationMutation> {
      return withWrapper(() => client.request<UpsertOrganisationMutation>(print(UpsertOrganisationDocument), variables));
    },
    sessionInfo(variables?: SessionInfoQueryVariables): Promise<SessionInfoQuery> {
      return withWrapper(() => client.request<SessionInfoQuery>(print(SessionInfoDocument), variables));
    },
    whoami(variables?: WhoamiQueryVariables): Promise<WhoamiQuery> {
      return withWrapper(() => client.request<WhoamiQuery>(print(WhoamiDocument), variables));
    },
    findSafeAddressByOwner(variables: FindSafeAddressByOwnerQueryVariables): Promise<FindSafeAddressByOwnerQuery> {
      return withWrapper(() => client.request<FindSafeAddressByOwnerQuery>(print(FindSafeAddressByOwnerDocument), variables));
    },
    initAggregateState(variables?: InitAggregateStateQueryVariables): Promise<InitAggregateStateQuery> {
      return withWrapper(() => client.request<InitAggregateStateQuery>(print(InitAggregateStateDocument), variables));
    },
    claimedInvitation(variables?: ClaimedInvitationQueryVariables): Promise<ClaimedInvitationQuery> {
      return withWrapper(() => client.request<ClaimedInvitationQuery>(print(ClaimedInvitationDocument), variables));
    },
    invitationTransaction(variables?: InvitationTransactionQueryVariables): Promise<InvitationTransactionQuery> {
      return withWrapper(() => client.request<InvitationTransactionQuery>(print(InvitationTransactionDocument), variables));
    },
    safeFundingTransaction(variables?: SafeFundingTransactionQueryVariables): Promise<SafeFundingTransactionQuery> {
      return withWrapper(() => client.request<SafeFundingTransactionQuery>(print(SafeFundingTransactionDocument), variables));
    },
    hubSignupTransaction(variables?: HubSignupTransactionQueryVariables): Promise<HubSignupTransactionQuery> {
      return withWrapper(() => client.request<HubSignupTransactionQuery>(print(HubSignupTransactionDocument), variables));
    },
    myInvitations(variables?: MyInvitationsQueryVariables): Promise<MyInvitationsQuery> {
      return withWrapper(() => client.request<MyInvitationsQuery>(print(MyInvitationsDocument), variables));
    },
    balance(variables: BalanceQueryVariables): Promise<BalanceQuery> {
      return withWrapper(() => client.request<BalanceQuery>(print(BalanceDocument), variables));
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
    transactionTimeline(variables: TransactionTimelineQueryVariables): Promise<TransactionTimelineQuery> {
      return withWrapper(() => client.request<TransactionTimelineQuery>(print(TransactionTimelineDocument), variables));
    },
    profilesByCirclesAddress(variables: ProfilesByCirclesAddressQueryVariables): Promise<ProfilesByCirclesAddressQuery> {
      return withWrapper(() => client.request<ProfilesByCirclesAddressQuery>(print(ProfilesByCirclesAddressDocument), variables));
    },
    lastUBITransaction(variables?: LastUbiTransactionQueryVariables): Promise<LastUbiTransactionQuery> {
      return withWrapper(() => client.request<LastUbiTransactionQuery>(print(LastUbiTransactionDocument), variables));
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
    inbox(variables?: InboxQueryVariables): Promise<InboxQuery> {
      return withWrapper(() => client.request<InboxQuery>(print(InboxDocument), variables));
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
    organisations(variables?: OrganisationsQueryVariables): Promise<OrganisationsQuery> {
      return withWrapper(() => client.request<OrganisationsQuery>(print(OrganisationsDocument), variables));
    },
    organisationsByAddress(variables: OrganisationsByAddressQueryVariables): Promise<OrganisationsByAddressQuery> {
      return withWrapper(() => client.request<OrganisationsByAddressQuery>(print(OrganisationsByAddressDocument), variables));
    },
    stats(variables?: StatsQueryVariables): Promise<StatsQuery> {
      return withWrapper(() => client.request<StatsQuery>(print(StatsDocument), variables));
    },
    commonTrust(variables: CommonTrustQueryVariables): Promise<CommonTrustQuery> {
      return withWrapper(() => client.request<CommonTrustQuery>(print(CommonTrustDocument), variables));
    },
    transactionByHash(variables: TransactionByHashQueryVariables): Promise<TransactionByHashQuery> {
      return withWrapper(() => client.request<TransactionByHashQuery>(print(TransactionByHashDocument), variables));
    },
    balancesByAsset(variables: BalancesByAssetQueryVariables): Promise<BalancesByAssetQuery> {
      return withWrapper(() => client.request<BalancesByAssetQuery>(print(BalancesByAssetDocument), variables));
    },
    events(variables?: EventsSubscriptionVariables): Promise<EventsSubscription> {
      return withWrapper(() => client.request<EventsSubscription>(print(EventsDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;