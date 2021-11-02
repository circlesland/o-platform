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

export type AcceptMembershipResult = {
  __typename?: 'AcceptMembershipResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type AddMemberResult = {
  __typename?: 'AddMemberResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type AggregatePayload = Contacts | CrcBalance | Members | Memberships;

export enum AggregateType {
  Contacts = 'Contacts',
  CrcBalance = 'CrcBalance',
  Members = 'Members',
  Memberships = 'Memberships'
}

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

export enum ContactDirection {
  In = 'In',
  Out = 'Out'
}

export type ContactPoint = {
  __typename?: 'ContactPoint';
  contactAddress: Scalars['String'];
  contactAddress_Profile?: Maybe<Profile>;
  lastContactAt: Scalars['String'];
  metadata: Array<ContactPointSource>;
};

export type ContactPointSource = {
  __typename?: 'ContactPointSource';
  directions: Array<ContactDirection>;
  name: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type Contacts = IAggregatePayload & {
  __typename?: 'Contacts';
  contacts: Array<ContactPoint>;
  lastUpdatedAt: Scalars['String'];
};

export type CountryStats = {
  __typename?: 'CountryStats';
  citizenCount: Scalars['Int'];
  name: Scalars['String'];
};

export type CrcBalance = IAggregatePayload & {
  __typename?: 'CrcBalance';
  balances: Array<AssetBalance>;
  lastUpdatedAt: Scalars['String'];
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

export type EventPayload = ChatMessage | CrcHubTransfer | CrcMinting | CrcSignup | CrcTokenTransfer | CrcTrust | EthTransfer | GnosisSafeEthTransfer | InvitationCreated | InvitationRedeemed | MemberAdded | MembershipAccepted | MembershipOffer | MembershipRejected | OrganisationCreated | WelcomeMessage;

export enum EventType {
  ChatMessage = 'ChatMessage',
  CrcHubTransfer = 'CrcHubTransfer',
  CrcMinting = 'CrcMinting',
  CrcSignup = 'CrcSignup',
  CrcTokenTransfer = 'CrcTokenTransfer',
  CrcTrust = 'CrcTrust',
  EthTransfer = 'EthTransfer',
  GnosisSafeEthTransfer = 'GnosisSafeEthTransfer',
  InvitationCreated = 'InvitationCreated',
  InvitationRedeemed = 'InvitationRedeemed',
  MemberAdded = 'MemberAdded',
  MembershipAccepted = 'MembershipAccepted',
  MembershipOffer = 'MembershipOffer',
  MembershipRejected = 'MembershipRejected',
  OrganisationCreated = 'OrganisationCreated',
  WelcomeMessage = 'WelcomeMessage'
}

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

export type IAggregatePayload = {
  lastUpdatedAt?: Maybe<Scalars['String']>;
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

export type InvitationCreated = IEventPayload & {
  __typename?: 'InvitationCreated';
  code: Scalars['String'];
  name: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
};

export type InvitationRedeemed = IEventPayload & {
  __typename?: 'InvitationRedeemed';
  code: Scalars['String'];
  name: Scalars['String'];
  redeemedBy: Scalars['String'];
  redeemedBy_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type LockOfferInput = {
  offerId: Scalars['String'];
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

export type MemberAdded = IEventPayload & {
  __typename?: 'MemberAdded';
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Members = IAggregatePayload & {
  __typename?: 'Members';
  lastUpdatedAt: Scalars['String'];
  members: Array<ProfileOrOrganisation>;
};

export type Membership = {
  __typename?: 'Membership';
  acceptedAt?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  isAdmin: Scalars['Boolean'];
  organisation: Organisation;
  rejectedAt?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
};

export type MembershipAccepted = IEventPayload & {
  __typename?: 'MembershipAccepted';
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type MembershipOffer = IEventPayload & {
  __typename?: 'MembershipOffer';
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type MembershipRejected = IEventPayload & {
  __typename?: 'MembershipRejected';
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Memberships = IAggregatePayload & {
  __typename?: 'Memberships';
  lastUpdatedAt: Scalars['String'];
  organisations: Array<Organisation>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptMembership?: Maybe<AcceptMembershipResult>;
  acknowledge: Scalars['Boolean'];
  addMember?: Maybe<AddMemberResult>;
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
  rejectMembership?: Maybe<RejectMembershipResult>;
  removeMember?: Maybe<RemoveMemberResult>;
  requestInvitationOffer: Offer;
  requestSessionChallenge: Scalars['String'];
  requestUpdateSafe: RequestUpdateSafeResponse;
  sendMessage: SendMessageResult;
  tagTransaction: TagTransactionResult;
  unlistOffer: Scalars['Boolean'];
  updateSafe: UpdateSafeResponse;
  upsertOffer: Offer;
  upsertOrganisation: CreateOrganisationResult;
  upsertProfile: Profile;
  upsertRegion: CreateOrganisationResult;
  upsertTag: Tag;
  verifySessionChallenge?: Maybe<ExchangeTokenResponse>;
};


export type MutationAcceptMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationAcknowledgeArgs = {
  until: Scalars['String'];
};


export type MutationAddMemberArgs = {
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


export type MutationRejectMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationRemoveMemberArgs = {
  groupId: Scalars['String'];
  memberId: Scalars['Int'];
};


export type MutationRequestInvitationOfferArgs = {
  for: Scalars['String'];
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
  offerId: LockOfferInput;
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


export type MutationUpsertRegionArgs = {
  organisation: UpsertOrganisationInput;
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
  id: Scalars['String'];
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

export type OrganisationCreated = IEventPayload & {
  __typename?: 'OrganisationCreated';
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type PaginationArgs = {
  continueAt: Scalars['String'];
  limit: Scalars['Int'];
  order: SortOrder;
};

export type PaymentProof = {
  forOfferId: LockOfferInput;
  transactionHash: Scalars['String'];
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
  memberships?: Maybe<Array<Membership>>;
  newsletter?: Maybe<Scalars['Boolean']>;
  offers?: Maybe<Array<Offer>>;
  status?: Maybe<Scalars['String']>;
  trustsYou?: Maybe<Scalars['Int']>;
  youTrust?: Maybe<Scalars['Int']>;
};

export type ProfileAggregate = {
  __typename?: 'ProfileAggregate';
  payload: AggregatePayload;
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  type: Scalars['String'];
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
  purchasedOfferId: Scalars['String'];
  status: PurchaseStatus;
};

export enum PurchaseStatus {
  Invalid = 'INVALID',
  ItemLocked = 'ITEM_LOCKED',
  PaymentProven = 'PAYMENT_PROVEN'
}

export type Query = {
  __typename?: 'Query';
  aggregates: Array<ProfileAggregate>;
  balance: Scalars['String'];
  balancesByAsset: Array<AssetBalance>;
  blockchainEvents: Array<ProfileEvent>;
  blockchainEventsByTransactionHash: Array<ProfileEvent>;
  chatHistory: Array<ProfileEvent>;
  cities: Array<City>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  commonTrust: Array<CommonTrust>;
  contact?: Maybe<Contact>;
  contacts: Array<Contact>;
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
  regions: Array<Organisation>;
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


export type QueryAggregatesArgs = {
  safeAddress: Scalars['String'];
  types: Array<AggregateType>;
};


export type QueryBalanceArgs = {
  safeAddress: Scalars['String'];
};


export type QueryBalancesByAssetArgs = {
  safeAddress: Scalars['String'];
};


export type QueryBlockchainEventsArgs = {
  fromBlock?: Maybe<Scalars['Int']>;
  pagination?: Maybe<PaginationArgs>;
  safeAddress: Scalars['String'];
  toBlock?: Maybe<Scalars['Int']>;
  types?: Maybe<Array<Scalars['String']>>;
};


export type QueryBlockchainEventsByTransactionHashArgs = {
  safeAddress: Scalars['String'];
  transactionHash: Scalars['String'];
  types?: Maybe<Array<Scalars['String']>>;
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


export type QueryEventsArgs = {
  pagination: PaginationArgs;
  safeAddress: Scalars['String'];
  types: Array<EventType>;
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


export type QueryRegionsArgs = {
  pagination?: Maybe<PaginationArgs>;
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
  id?: Maybe<Scalars['String']>;
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

export type RejectMembershipResult = {
  __typename?: 'RejectMembershipResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
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

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

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
  id?: Maybe<Scalars['String']>;
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

export type WelcomeMessage = IEventPayload & {
  __typename?: 'WelcomeMessage';
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type UpsertOfferMutationVariables = Exact<{
  id?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  pictureUrl: Scalars['String'];
  pictureMimeType: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  categoryTagId: Scalars['Int'];
  geonameid: Scalars['Int'];
  pricePerUnit: Scalars['String'];
  unitTagId: Scalars['Int'];
  maxUnits?: Maybe<Scalars['Int']>;
  deliveryTermsTagId: Scalars['Int'];
}>;


export type UpsertOfferMutation = (
  { __typename?: 'Mutation' }
  & { upsertOffer: (
    { __typename?: 'Offer' }
    & Pick<Offer, 'id' | 'createdByProfileId' | 'publishedAt' | 'unlistedAt' | 'purchasedAt' | 'title' | 'pictureUrl' | 'pictureMimeType' | 'description' | 'categoryTagId' | 'geonameid' | 'pricePerUnit' | 'unitTagId' | 'maxUnits' | 'deliveryTermsTagId'>
    & { createdBy?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'firstName' | 'lastName' | 'avatarUrl' | 'avatarMimeType'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'name' | 'country'>
      )> }
    )>, categoryTag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>, city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name' | 'latitude' | 'longitude' | 'population' | 'feature_code'>
    )> }
  ) }
);

export type OffersQueryVariables = Exact<{
  createdByProfileId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  publishedAt_gt?: Maybe<Scalars['String']>;
  publishedAt_lt?: Maybe<Scalars['String']>;
  categoryTagId?: Maybe<Scalars['Int']>;
}>;


export type OffersQuery = (
  { __typename?: 'Query' }
  & { offers: Array<(
    { __typename?: 'Offer' }
    & Pick<Offer, 'id' | 'createdByProfileId' | 'publishedAt' | 'unlistedAt' | 'purchasedAt' | 'title' | 'pictureUrl' | 'pictureMimeType' | 'description' | 'categoryTagId' | 'geonameid' | 'pricePerUnit' | 'unitTagId' | 'maxUnits' | 'deliveryTermsTagId'>
    & { createdBy?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'avatarMimeType'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'name' | 'country'>
      )> }
    )>, categoryTag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>, unitTag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>, deliveryTermsTag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'typeId' | 'value'>
    )>, city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name' | 'latitude' | 'longitude' | 'population' | 'feature_code'>
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


export const UpsertOfferDocument = gql`
    mutation upsertOffer($id: String, $title: String!, $pictureUrl: String!, $pictureMimeType: String!, $description: String, $categoryTagId: Int!, $geonameid: Int!, $pricePerUnit: String!, $unitTagId: Int!, $maxUnits: Int, $deliveryTermsTagId: Int!) {
  upsertOffer(
    data: {id: $id, geonameid: $geonameid, categoryTagId: $categoryTagId, deliveryTermsTagId: $deliveryTermsTagId, description: $description, maxUnits: $maxUnits, pictureUrl: $pictureUrl, pictureMimeType: $pictureMimeType, pricePerUnit: $pricePerUnit, title: $title, unitTagId: $unitTagId}
  ) {
    id
    createdBy {
      firstName
      lastName
      avatarUrl
      avatarMimeType
      city {
        name
        country
      }
    }
    createdByProfileId
    publishedAt
    unlistedAt
    purchasedAt
    title
    pictureUrl
    pictureMimeType
    description
    categoryTagId
    categoryTag {
      id
      typeId
      value
    }
    geonameid
    pricePerUnit
    unitTagId
    maxUnits
    deliveryTermsTagId
    city {
      geonameid
      country
      name
      latitude
      longitude
      population
      feature_code
    }
  }
}
    `;
export const OffersDocument = gql`
    query offers($createdByProfileId: Int, $id: String, $publishedAt_gt: String, $publishedAt_lt: String, $categoryTagId: Int) {
  offers(
    query: {createdByProfileId: $createdByProfileId, id: $id, publishedAt_gt: $publishedAt_gt, publishedAt_lt: $publishedAt_lt, categoryTagId: $categoryTagId}
  ) {
    id
    createdBy {
      id
      circlesAddress
      firstName
      lastName
      avatarUrl
      avatarMimeType
      city {
        name
        country
      }
    }
    createdByProfileId
    publishedAt
    unlistedAt
    purchasedAt
    title
    pictureUrl
    pictureMimeType
    description
    categoryTagId
    categoryTag {
      id
      typeId
      value
    }
    geonameid
    pricePerUnit
    unitTag {
      id
      typeId
      value
    }
    unitTagId
    maxUnits
    deliveryTermsTag {
      id
      typeId
      value
    }
    deliveryTermsTagId
    city {
      geonameid
      country
      name
      latitude
      longitude
      population
      feature_code
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

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    upsertOffer(variables: UpsertOfferMutationVariables): Promise<UpsertOfferMutation> {
      return withWrapper(() => client.request<UpsertOfferMutation>(print(UpsertOfferDocument), variables));
    },
    offers(variables?: OffersQueryVariables): Promise<OffersQuery> {
      return withWrapper(() => client.request<OffersQuery>(print(OffersDocument), variables));
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
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;