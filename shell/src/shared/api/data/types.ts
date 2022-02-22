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

export enum AccountType {
  Organisation = 'Organisation',
  Person = 'Person'
}

export type AddMemberResult = {
  __typename?: 'AddMemberResult';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type AggregatePayload = Contacts | CrcBalances | Erc20Balances | Members | Memberships | Offers | Purchases | Sales;

export enum AggregateType {
  Contacts = 'Contacts',
  CrcBalances = 'CrcBalances',
  Erc20Balances = 'Erc20Balances',
  Members = 'Members',
  Memberships = 'Memberships',
  Offers = 'Offers',
  Purchases = 'Purchases',
  Sales = 'Sales'
}

export type AnnouncePaymentResult = {
  __typename?: 'AnnouncePaymentResult';
  invoiceId: Scalars['Int'];
  transactionHash: Scalars['String'];
};

export type AssetBalance = {
  __typename?: 'AssetBalance';
  token_address: Scalars['String'];
  token_balance: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
  token_symbol?: Maybe<Scalars['String']>;
};

export type Capability = {
  __typename?: 'Capability';
  type?: Maybe<CapabilityType>;
};

export enum CapabilityType {
  Invite = 'Invite',
  Verify = 'Verify'
}

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
  contactAddress_Profile?: Maybe<Profile>;
  lastContactAt: Scalars['String'];
  metadata: Array<ContactPoint>;
};

export type ContactAggregateFilter = {
  addresses: Array<Scalars['String']>;
};

export enum ContactDirection {
  In = 'In',
  Out = 'Out'
}

export type ContactPoint = {
  __typename?: 'ContactPoint';
  directions: Array<ContactDirection>;
  name: Scalars['String'];
  timestamps: Array<Scalars['String']>;
  values: Array<Scalars['String']>;
};

export type Contacts = IAggregatePayload & {
  __typename?: 'Contacts';
  contacts: Array<Contact>;
  lastUpdatedAt: Scalars['String'];
};

export type CrcBalanceAggregateFilter = {
  tokenAddresses: Array<Scalars['String']>;
};

export type CrcBalances = IAggregatePayload & {
  __typename?: 'CrcBalances';
  balances: Array<AssetBalance>;
  lastUpdatedAt: Scalars['String'];
};

export type CrcHubTransfer = IEventPayload & {
  __typename?: 'CrcHubTransfer';
  flow: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  tags: Array<Tag>;
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

export enum Direction {
  In = 'in',
  Out = 'out'
}

export enum DisplayCurrency {
  Crc = 'CRC',
  Eurs = 'EURS',
  TimeCrc = 'TIME_CRC'
}

export type Erc20Balances = IAggregatePayload & {
  __typename?: 'Erc20Balances';
  balances: Array<AssetBalance>;
  lastUpdatedAt: Scalars['String'];
};

export type Erc20Transfer = IEventPayload & {
  __typename?: 'Erc20Transfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type EthTransfer = IEventPayload & {
  __typename?: 'EthTransfer';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  tags: Array<Tag>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
};

export type EventPayload = ChatMessage | CrcHubTransfer | CrcMinting | CrcSignup | CrcTokenTransfer | CrcTrust | Erc20Transfer | EthTransfer | GnosisSafeEthTransfer | InvitationCreated | InvitationRedeemed | MemberAdded | MembershipAccepted | MembershipOffer | MembershipRejected | OrganisationCreated | PurchaseEvent | SafeVerified | SaleEvent | WelcomeMessage;

export enum EventType {
  ChatMessage = 'ChatMessage',
  CrcHubTransfer = 'CrcHubTransfer',
  CrcMinting = 'CrcMinting',
  CrcSignup = 'CrcSignup',
  CrcTokenTransfer = 'CrcTokenTransfer',
  CrcTrust = 'CrcTrust',
  Erc20Transfer = 'Erc20Transfer',
  EthTransfer = 'EthTransfer',
  GnosisSafeEthTransfer = 'GnosisSafeEthTransfer',
  InvitationCreated = 'InvitationCreated',
  InvitationRedeemed = 'InvitationRedeemed',
  MemberAdded = 'MemberAdded',
  MembershipAccepted = 'MembershipAccepted',
  MembershipOffer = 'MembershipOffer',
  MembershipRejected = 'MembershipRejected',
  OrganisationCreated = 'OrganisationCreated',
  PurchaseEvent = 'PurchaseEvent',
  SafeVerified = 'SafeVerified',
  SaleEvent = 'SaleEvent',
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
  tags: Array<Tag>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash: Scalars['String'];
  value: Scalars['String'];
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
  redeemedBy?: Maybe<Scalars['String']>;
  redeemedBy_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Invoice = {
  __typename?: 'Invoice';
  buyerAddress: Scalars['String'];
  buyerProfile?: Maybe<Profile>;
  buyerSignature?: Maybe<Scalars['Boolean']>;
  buyerSignedDate?: Maybe<Scalars['String']>;
  cancelReason?: Maybe<Scalars['String']>;
  cancelledAt?: Maybe<Scalars['String']>;
  cancelledBy?: Maybe<Profile>;
  id: Scalars['Int'];
  lines: Array<InvoiceLine>;
  paymentTransactionHash?: Maybe<Scalars['String']>;
  pickupCode?: Maybe<Scalars['String']>;
  purchase?: Maybe<Purchase>;
  purchaseId: Scalars['Int'];
  sellerAddress: Scalars['String'];
  sellerProfile?: Maybe<Profile>;
  sellerSignature?: Maybe<Scalars['Boolean']>;
  sellerSignedDate?: Maybe<Scalars['String']>;
};

export type InvoiceLine = {
  __typename?: 'InvoiceLine';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  offer: Offer;
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
  announcePayment: AnnouncePaymentResult;
  authenticateAt: DelegateAuthInit;
  claimInvitation: ClaimInvitationResult;
  completePurchase: Invoice;
  completeSale: Invoice;
  consumeDepositedChallenge: ConsumeDepositedChallengeResponse;
  createTestInvitation: CreateInvitationResult;
  depositChallenge: DepositChallengeResponse;
  exchangeToken: ExchangeTokenResponse;
  importOrganisationsOfAccount: Array<Organisation>;
  logout: LogoutResponse;
  purchase: Array<Invoice>;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  rejectMembership?: Maybe<RejectMembershipResult>;
  removeMember?: Maybe<RemoveMemberResult>;
  requestInvitationOffer: Offer;
  requestSessionChallenge: Scalars['String'];
  requestUpdateSafe: RequestUpdateSafeResponse;
  revokeSafeVerification: VerifySafeResult;
  sendMessage: SendMessageResult;
  tagTransaction: TagTransactionResult;
  updateSafe: UpdateSafeResponse;
  upsertOrganisation: CreateOrganisationResult;
  upsertProfile: Profile;
  upsertRegion: CreateOrganisationResult;
  upsertTag: Tag;
  verifySafe: VerifySafeResult;
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
  memberAddress: Scalars['String'];
};


export type MutationAnnouncePaymentArgs = {
  invoiceId: Scalars['Int'];
  transactionHash: Scalars['String'];
};


export type MutationAuthenticateAtArgs = {
  appId: Scalars['String'];
};


export type MutationClaimInvitationArgs = {
  code: Scalars['String'];
};


export type MutationCompletePurchaseArgs = {
  invoiceId: Scalars['Int'];
  revoke?: Maybe<Scalars['Boolean']>;
};


export type MutationCompleteSaleArgs = {
  invoiceId: Scalars['Int'];
  revoke?: Maybe<Scalars['Boolean']>;
};


export type MutationConsumeDepositedChallengeArgs = {
  delegateAuthCode: Scalars['String'];
};


export type MutationDepositChallengeArgs = {
  jwt: Scalars['String'];
};


export type MutationPurchaseArgs = {
  lines: Array<PurchaseLineInput>;
};


export type MutationRejectMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationRemoveMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
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


export type MutationRevokeSafeVerificationArgs = {
  safeAddress: Scalars['String'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String'];
  fromSafeAddress?: Maybe<Scalars['String']>;
  toSafeAddress: Scalars['String'];
};


export type MutationTagTransactionArgs = {
  tag: CreateTagInput;
  transactionHash: Scalars['String'];
};


export type MutationUpdateSafeArgs = {
  data: UpdateSafeInput;
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


export type MutationVerifySafeArgs = {
  safeAddress: Scalars['String'];
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
  createdAt: Scalars['String'];
  createdByAddress: Scalars['String'];
  createdByProfile?: Maybe<Profile>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  pictureMimeType: Scalars['String'];
  pictureUrl: Scalars['String'];
  pricePerUnit: Scalars['String'];
  timeCirclesPriceShare: Scalars['Int'];
  title: Scalars['String'];
  version: Scalars['Int'];
};

export type Offers = IAggregatePayload & {
  __typename?: 'Offers';
  lastUpdatedAt: Scalars['String'];
  offers: Array<Offer>;
};

export type OffersAggregateFilter = {
  createdByAddresses?: Maybe<Array<Scalars['String']>>;
  offerIds?: Maybe<Array<Scalars['Int']>>;
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
  displayCurrency?: Maybe<DisplayCurrency>;
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
  continueAt?: Maybe<Scalars['String']>;
  continueAtId?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  order: SortOrder;
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
  displayCurrency?: Maybe<DisplayCurrency>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  dream?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastEvent?: Maybe<ProfileEvent>;
  lastName?: Maybe<Scalars['String']>;
  memberships?: Maybe<Array<Membership>>;
  newsletter?: Maybe<Scalars['Boolean']>;
  origin?: Maybe<ProfileOrigin>;
  status?: Maybe<Scalars['String']>;
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  verifications?: Maybe<Array<Verification>>;
};

export type ProfileAggregate = {
  __typename?: 'ProfileAggregate';
  payload: AggregatePayload;
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  type: Scalars['String'];
};

export type ProfileAggregateFilter = {
  contacts?: Maybe<ContactAggregateFilter>;
  crcBalance?: Maybe<CrcBalanceAggregateFilter>;
  offers?: Maybe<OffersAggregateFilter>;
  purchases?: Maybe<PurchasesAggregateFilter>;
  sales?: Maybe<SalesAggregateFilter>;
};

export type ProfileEvent = {
  __typename?: 'ProfileEvent';
  block_number?: Maybe<Scalars['Int']>;
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
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

export type ProfileEventFilter = {
  direction?: Maybe<Direction>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  with?: Maybe<Scalars['String']>;
};

export type ProfileOrOrganisation = Organisation | Profile;

export enum ProfileOrigin {
  CirclesGarden = 'CirclesGarden',
  CirclesLand = 'CirclesLand',
  Unknown = 'Unknown'
}

export type ProofPaymentResult = {
  __typename?: 'ProofPaymentResult';
  acknowledged: Scalars['Boolean'];
};

export type PublicEvent = {
  __typename?: 'PublicEvent';
  block_number?: Maybe<Scalars['Int']>;
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
  payload?: Maybe<EventPayload>;
  timestamp: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
  transaction_index?: Maybe<Scalars['Int']>;
  type: Scalars['String'];
};

export type Purchase = {
  __typename?: 'Purchase';
  createdAt: Scalars['String'];
  createdByAddress: Scalars['String'];
  createdByProfile?: Maybe<Profile>;
  id: Scalars['Int'];
  invoices: Array<Invoice>;
  lines: Array<PurchaseLine>;
  paymentTransaction?: Maybe<ProfileEvent>;
  total: Scalars['String'];
};

export type PurchaseEvent = IEventPayload & {
  __typename?: 'PurchaseEvent';
  invoice?: Maybe<Invoice>;
  seller: Scalars['String'];
  seller_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type PurchaseLine = {
  __typename?: 'PurchaseLine';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  offer: Offer;
};

export type PurchaseLineInput = {
  amount: Scalars['Int'];
  offerId: Scalars['Int'];
};

export type Purchases = IAggregatePayload & {
  __typename?: 'Purchases';
  lastUpdatedAt: Scalars['String'];
  purchases: Array<Purchase>;
};

export type PurchasesAggregateFilter = {
  createdByAddresses?: Maybe<Array<Scalars['String']>>;
  pickupCode?: Maybe<Scalars['String']>;
  purchaseIds?: Maybe<Array<Scalars['Int']>>;
};

export type Query = {
  __typename?: 'Query';
  aggregates: Array<ProfileAggregate>;
  cities: Array<City>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  commonTrust: Array<CommonTrust>;
  directPath: TransitivePath;
  events: Array<ProfileEvent>;
  findInvitationCreator?: Maybe<Profile>;
  findSafesByOwner: Array<SafeInfo>;
  hubSignupTransaction?: Maybe<ProfileEvent>;
  invitationTransaction?: Maybe<ProfileEvent>;
  invoice?: Maybe<Scalars['String']>;
  myInvitations: Array<CreatedInvitation>;
  myProfile?: Maybe<Profile>;
  organisations: Array<Organisation>;
  organisationsByAddress: Array<Organisation>;
  profilesById: Array<Profile>;
  profilesBySafeAddress: Array<Profile>;
  profilesCount: Scalars['Int'];
  recentProfiles: Array<Profile>;
  regions: Array<Organisation>;
  safeInfo?: Maybe<SafeInfo>;
  search: Array<Profile>;
  sessionInfo: SessionInfo;
  tagById?: Maybe<Tag>;
  tags: Array<Tag>;
  trustRelations: Array<TrustRelation>;
  verifications: Array<Verification>;
  verificationsCount: Scalars['Int'];
  version: Version;
  whoami?: Maybe<Scalars['String']>;
};


export type QueryAggregatesArgs = {
  filter?: Maybe<ProfileAggregateFilter>;
  safeAddress: Scalars['String'];
  types: Array<AggregateType>;
};


export type QueryCitiesArgs = {
  query: QueryCitiesInput;
};


export type QueryCommonTrustArgs = {
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
};


export type QueryDirectPathArgs = {
  amount: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
};


export type QueryEventsArgs = {
  filter?: Maybe<ProfileEventFilter>;
  pagination: PaginationArgs;
  safeAddress: Scalars['String'];
  types: Array<EventType>;
};


export type QueryFindInvitationCreatorArgs = {
  code: Scalars['String'];
};


export type QueryFindSafesByOwnerArgs = {
  owner: Scalars['String'];
};


export type QueryInvoiceArgs = {
  invoiceId: Scalars['Int'];
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


export type QueryRecentProfilesArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryRegionsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QuerySafeInfoArgs = {
  safeAddress?: Maybe<Scalars['String']>;
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


export type QueryVerificationsArgs = {
  filter?: Maybe<VerifiedSafesFilter>;
  pagination?: Maybe<PaginationArgs>;
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

export type QueryProfileInput = {
  circlesAddress?: Maybe<Array<Scalars['String']>>;
  country?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Array<Scalars['Int']>>;
  lastName?: Maybe<Scalars['String']>;
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

export type SafeAddressByOwnerResult = {
  __typename?: 'SafeAddressByOwnerResult';
  safeAddress: Scalars['String'];
  type: Scalars['String'];
};

export type SafeInfo = {
  __typename?: 'SafeInfo';
  lastUbiAt?: Maybe<Scalars['String']>;
  randomValue?: Maybe<Scalars['String']>;
  safeAddress: Scalars['String'];
  safeProfile?: Maybe<Profile>;
  tokenAddress?: Maybe<Scalars['String']>;
  type: AccountType;
};

export type SafeVerified = IEventPayload & {
  __typename?: 'SafeVerified';
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  safe_address: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Sale = {
  __typename?: 'Sale';
  buyerAddress: Scalars['String'];
  buyerProfile?: Maybe<Profile>;
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  invoices: Array<Invoice>;
  lines: Array<SalesLine>;
  paymentTransaction?: Maybe<ProfileEvent>;
  sellerAddress: Scalars['String'];
  sellerProfile?: Maybe<Profile>;
  total: Scalars['String'];
};

export type SaleEvent = IEventPayload & {
  __typename?: 'SaleEvent';
  buyer: Scalars['String'];
  buyer_profile?: Maybe<Profile>;
  invoice?: Maybe<Invoice>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Sales = IAggregatePayload & {
  __typename?: 'Sales';
  lastUpdatedAt: Scalars['String'];
  sales: Array<Sale>;
};

export type SalesAggregateFilter = {
  createdByAddresses?: Maybe<Array<Scalars['String']>>;
  pickupCode?: Maybe<Scalars['String']>;
  salesIds?: Maybe<Array<Scalars['Int']>>;
};

export type SalesLine = {
  __typename?: 'SalesLine';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  offer: Offer;
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
  capabilities: Array<Capability>;
  hasProfile?: Maybe<Scalars['Boolean']>;
  isLoggedOn: Scalars['Boolean'];
  lastAcknowledgedAt?: Maybe<Scalars['String']>;
  profile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['Int']>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

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

export type TransitivePath = {
  __typename?: 'TransitivePath';
  flow: Scalars['String'];
  requestedAmount: Scalars['String'];
  transfers: Array<TransitiveTransfer>;
};

export type TransitiveTransfer = {
  __typename?: 'TransitiveTransfer';
  from: Scalars['String'];
  to: Scalars['String'];
  token: Scalars['String'];
  tokenOwner: Scalars['String'];
  value: Scalars['String'];
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

export type UpsertOrganisationInput = {
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
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
  displayCurrency?: Maybe<DisplayCurrency>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  dream?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  status: Scalars['String'];
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
};

export type UpsertTagInput = {
  id?: Maybe<Scalars['Int']>;
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type Verification = {
  __typename?: 'Verification';
  createdAt: Scalars['String'];
  revokedAt?: Maybe<Scalars['String']>;
  revokedProfile?: Maybe<Profile>;
  verificationRewardTransaction?: Maybe<ProfileEvent>;
  verificationRewardTransactionHash: Scalars['String'];
  verifiedProfile?: Maybe<Profile>;
  verifiedSafeAddress: Scalars['String'];
  verifierProfile?: Maybe<Organisation>;
  verifierSafeAddress: Scalars['String'];
};

export type VerifiedSafesFilter = {
  addresses?: Maybe<Array<Scalars['String']>>;
};

export type VerifySafeResult = {
  __typename?: 'VerifySafeResult';
  success: Scalars['Boolean'];
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export type WelcomeMessage = IEventPayload & {
  __typename?: 'WelcomeMessage';
  invitedBy: Scalars['String'];
  invitedBy_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type CreatePurchaseMutationVariables = Exact<{
  lines: Array<PurchaseLineInput> | PurchaseLineInput;
}>;


export type CreatePurchaseMutation = (
  { __typename?: 'Mutation' }
  & { purchase: Array<(
    { __typename?: 'Invoice' }
    & Pick<Invoice, 'id' | 'buyerAddress' | 'sellerAddress' | 'purchaseId'>
    & { buyerProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl'>
    )>, sellerProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl'>
    )>, lines: Array<(
      { __typename?: 'InvoiceLine' }
      & Pick<InvoiceLine, 'id' | 'amount'>
      & { offer: (
        { __typename?: 'Offer' }
        & Pick<Offer, 'id' | 'version' | 'createdByAddress' | 'pricePerUnit' | 'title' | 'description'>
        & { createdByProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl'>
        )> }
      ) }
    )> }
  )> }
);

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
  fromSafeAddress?: Maybe<Scalars['String']>;
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
      ) | { __typename?: 'Erc20Transfer' } | (
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
      ) | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'MemberAdded' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipRejected' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'PurchaseEvent' } | { __typename?: 'SafeVerified' } | { __typename?: 'SaleEvent' } | { __typename?: 'WelcomeMessage' }> }
    )> }
  ) }
);

export type AddMemberMutationVariables = Exact<{
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
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
  memberAddress: Scalars['String'];
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
  displayCurrency?: Maybe<DisplayCurrency>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
}>;


export type UpsertProfileMutation = (
  { __typename?: 'Mutation' }
  & { upsertProfile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'circlesAddress' | 'circlesSafeOwner' | 'newsletter' | 'displayCurrency' | 'displayTimeCircles' | 'successorOfCirclesAddress' | 'cityGeonameid' | 'status'>
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

export type UpsertRegionMutationVariables = Exact<{
  organisation: UpsertOrganisationInput;
}>;


export type UpsertRegionMutation = (
  { __typename?: 'Mutation' }
  & { upsertRegion: (
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

export type ImportOrganisationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ImportOrganisationsMutation = (
  { __typename?: 'Mutation' }
  & { importOrganisationsOfAccount: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'name' | 'description' | 'avatarUrl'>
  )> }
);

export type CompletePurchaseMutationVariables = Exact<{
  invoiceId: Scalars['Int'];
  revoke?: Maybe<Scalars['Boolean']>;
}>;


export type CompletePurchaseMutation = (
  { __typename?: 'Mutation' }
  & { completePurchase: (
    { __typename?: 'Invoice' }
    & Pick<Invoice, 'id' | 'sellerAddress' | 'paymentTransactionHash' | 'buyerAddress' | 'pickupCode' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate'>
    & { sellerProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl'>
    )> }
  ) }
);

export type CompleteSaleMutationVariables = Exact<{
  invoiceId: Scalars['Int'];
  revoke?: Maybe<Scalars['Boolean']>;
}>;


export type CompleteSaleMutation = (
  { __typename?: 'Mutation' }
  & { completeSale: (
    { __typename?: 'Invoice' }
    & Pick<Invoice, 'id' | 'sellerAddress' | 'paymentTransactionHash' | 'buyerAddress' | 'pickupCode' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate'>
    & { sellerProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl'>
    )> }
  ) }
);

export type VerifySafeMutationVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type VerifySafeMutation = (
  { __typename?: 'Mutation' }
  & { verifySafe: (
    { __typename?: 'VerifySafeResult' }
    & Pick<VerifySafeResult, 'success'>
  ) }
);

export type RevokeSafeVerificationMutationVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type RevokeSafeVerificationMutation = (
  { __typename?: 'Mutation' }
  & { revokeSafeVerification: (
    { __typename?: 'VerifySafeResult' }
    & Pick<VerifySafeResult, 'success'>
  ) }
);

export type AnnouncePaymentMutationVariables = Exact<{
  invoiceId: Scalars['Int'];
  transactionHash: Scalars['String'];
}>;


export type AnnouncePaymentMutation = (
  { __typename?: 'Mutation' }
  & { announcePayment: (
    { __typename?: 'AnnouncePaymentResult' }
    & Pick<AnnouncePaymentResult, 'transactionHash' | 'invoiceId'>
  ) }
);

export type SessionInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionInfoQuery = (
  { __typename?: 'Query' }
  & { sessionInfo: (
    { __typename?: 'SessionInfo' }
    & Pick<SessionInfo, 'isLoggedOn' | 'hasProfile' | 'profileId' | 'lastAcknowledgedAt'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'origin' | 'circlesAddress' | 'circlesSafeOwner' | 'firstName' | 'lastName' | 'avatarUrl'>
    )>, capabilities: Array<(
      { __typename?: 'Capability' }
      & Pick<Capability, 'type'>
    )> }
  ) }
);

export type WhoamiQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoamiQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'whoami'>
);

export type ProfilesCountQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfilesCountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'profilesCount'>
);

export type VerificationsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type VerificationsCountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'verificationsCount'>
);

export type FindSafesByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
}>;


export type FindSafesByOwnerQuery = (
  { __typename?: 'Query' }
  & { findSafesByOwner: Array<(
    { __typename?: 'SafeInfo' }
    & Pick<SafeInfo, 'type' | 'safeAddress' | 'lastUbiAt' | 'randomValue' | 'tokenAddress'>
    & { safeProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'origin' | 'circlesAddress' | 'circlesSafeOwner' | 'successorOfCirclesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'displayCurrency' | 'cityGeonameid'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
      )>, verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
          )> }
        )> }
      )>> }
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

export type HubSignupTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type HubSignupTransactionQuery = (
  { __typename?: 'Query' }
  & { hubSignupTransaction?: Maybe<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'transaction_hash'>
    & { payload?: Maybe<{ __typename?: 'ChatMessage' } | { __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | (
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'token'>
    ) | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust' } | { __typename?: 'Erc20Transfer' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'MemberAdded' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipRejected' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'PurchaseEvent' } | { __typename?: 'SafeVerified' } | { __typename?: 'SaleEvent' } | { __typename?: 'WelcomeMessage' }> }
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

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'successorOfCirclesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'displayCurrency' | 'cityGeonameid'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'avatarMimeType' | 'displayCurrency'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
  )> }
);

export type ProfilesQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'origin' | 'circlesAddress' | 'circlesSafeOwner' | 'successorOfCirclesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid' | 'status' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'avatarMimeType' | 'displayCurrency'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
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
    & Pick<Profile, 'id' | 'origin' | 'circlesSafeOwner' | 'circlesAddress' | 'successorOfCirclesAddress' | 'avatarUrl' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name'>
    )>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
  )> }
);

export type GetRecentProfilesQueryVariables = Exact<{
  pagination?: Maybe<PaginationArgs>;
}>;


export type GetRecentProfilesQuery = (
  { __typename?: 'Query' }
  & { recentProfiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'origin' | 'successorOfCirclesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
  )> }
);

export type ProfilesByCirclesAddressQueryVariables = Exact<{
  circlesAddresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type ProfilesByCirclesAddressQuery = (
  { __typename?: 'Query' }
  & { profilesBySafeAddress: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'origin' | 'successorOfCirclesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'avatarMimeType' | 'displayCurrency'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
  )> }
);

export type SafeInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SafeInfoQuery = (
  { __typename?: 'Query' }
  & { safeInfo?: Maybe<(
    { __typename?: 'SafeInfo' }
    & Pick<SafeInfo, 'lastUbiAt' | 'safeAddress' | 'tokenAddress' | 'randomValue'>
  )> }
);

export type ProfilesByIdsQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesByIdsQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'origin' | 'successorOfCirclesAddress' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'cityGeonameid' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
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
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'origin' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency'>
    )>, otherSafeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'origin' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency'>
      & { verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
          )> }
        )> }
      )>> }
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
    & Pick<Profile, 'id' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'origin' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name'>
    )>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
  )> }
);

export type ProfileBySafeAddressQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type ProfileBySafeAddressQuery = (
  { __typename?: 'Query' }
  & { profilesBySafeAddress: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'firstName' | 'origin' | 'lastName' | 'dream' | 'country' | 'cityGeonameid' | 'displayCurrency'>
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
      ) | { __typename?: 'Erc20Transfer' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'MemberAdded' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipRejected' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'PurchaseEvent' } | { __typename?: 'SafeVerified' } | { __typename?: 'SaleEvent' } | { __typename?: 'WelcomeMessage' }> }
    )>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'avatarMimeType' | 'displayCurrency'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )>> }
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
    & Pick<Organisation, 'id' | 'circlesAddress' | 'createdAt' | 'name' | 'avatarMimeType' | 'avatarUrl' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'latitude' | 'longitude' | 'name' | 'population'>
    )> }
  )> }
);

export type RegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type RegionsQuery = (
  { __typename?: 'Query' }
  & { regions: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'createdAt' | 'name' | 'avatarMimeType' | 'avatarUrl' | 'displayCurrency'>
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
    & Pick<Organisation, 'id' | 'circlesAddress' | 'createdAt' | 'name' | 'avatarMimeType' | 'avatarUrl' | 'displayCurrency'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'latitude' | 'longitude' | 'name' | 'population'>
    )>, members?: Maybe<Array<(
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'circlesAddress' | 'createdAt' | 'name' | 'avatarMimeType' | 'displayCurrency' | 'avatarUrl'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'latitude' | 'longitude' | 'name' | 'population'>
      )> }
    ) | (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'origin' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'avatarUrl' | 'firstName' | 'lastName' | 'dream' | 'country' | 'cityGeonameid' | 'displayCurrency'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'country' | 'name'>
      )>, verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
          )> }
        )> }
      )>> }
    )>> }
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
      & Pick<Profile, 'id' | 'origin' | 'firstName' | 'lastName' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency'>
      & { verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
          )> }
        )> }
      )>> }
    )> }
  )> }
);

export type StreamQueryVariables = Exact<{
  types: Array<EventType> | EventType;
  safeAddress: Scalars['String'];
  pagination: PaginationArgs;
  filter?: Maybe<ProfileEventFilter>;
}>;


export type StreamQuery = (
  { __typename?: 'Query' }
  & { events: Array<(
    { __typename?: 'ProfileEvent' }
    & Pick<ProfileEvent, 'timestamp' | 'transaction_hash' | 'block_number' | 'safe_address' | 'contact_address' | 'direction' | 'type'>
    & { contact_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'displayCurrency'>
    )>, payload?: Maybe<(
      { __typename?: 'ChatMessage' }
      & Pick<ChatMessage, 'from' | 'to' | 'text'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'transaction_hash' | 'from' | 'to' | 'flow'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )>, transfers: Array<(
        { __typename?: 'CrcTokenTransfer' }
        & Pick<CrcTokenTransfer, 'token' | 'from' | 'to' | 'value'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
        )> }
      )>, tags: Array<(
        { __typename?: 'Tag' }
        & Pick<Tag, 'id' | 'typeId' | 'value'>
      )> }
    ) | (
      { __typename?: 'CrcMinting' }
      & Pick<CrcMinting, 'transaction_hash' | 'token' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'transaction_hash' | 'user' | 'token'>
    ) | { __typename?: 'CrcTokenTransfer' } | (
      { __typename?: 'CrcTrust' }
      & Pick<CrcTrust, 'transaction_hash' | 'address' | 'can_send_to' | 'limit'>
    ) | (
      { __typename?: 'Erc20Transfer' }
      & Pick<Erc20Transfer, 'transaction_hash' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'origin' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'EthTransfer' }
      & Pick<EthTransfer, 'transaction_hash' | 'from' | 'to' | 'value'>
    ) | (
      { __typename?: 'GnosisSafeEthTransfer' }
      & Pick<GnosisSafeEthTransfer, 'transaction_hash' | 'initiator' | 'from' | 'to' | 'value'>
    ) | (
      { __typename?: 'InvitationCreated' }
      & Pick<InvitationCreated, 'name' | 'code'>
    ) | (
      { __typename?: 'InvitationRedeemed' }
      & Pick<InvitationRedeemed, 'name' | 'code' | 'redeemedBy'>
      & { redeemedBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'MemberAdded' }
      & Pick<MemberAdded, 'createdBy' | 'isAdmin' | 'member' | 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'MembershipAccepted' }
      & Pick<MembershipAccepted, 'createdBy' | 'member' | 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'MembershipOffer' }
      & Pick<MembershipOffer, 'createdBy' | 'organisation' | 'isAdmin'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'MembershipRejected' }
      & Pick<MembershipRejected, 'member' | 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'OrganisationCreated' }
      & Pick<OrganisationCreated, 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | { __typename?: 'PurchaseEvent' } | (
      { __typename?: 'SafeVerified' }
      & Pick<SafeVerified, 'safe_address'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'SaleEvent' }
      & Pick<SaleEvent, 'buyer'>
      & { buyer_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )>, invoice?: Maybe<(
        { __typename?: 'Invoice' }
        & Pick<Invoice, 'id' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate' | 'cancelledAt' | 'cancelReason'>
        & { lines: Array<(
          { __typename?: 'InvoiceLine' }
          & Pick<InvoiceLine, 'amount'>
          & { offer: (
            { __typename?: 'Offer' }
            & Pick<Offer, 'id' | 'title' | 'pictureUrl'>
          ) }
        )> }
      )> }
    ) | (
      { __typename?: 'WelcomeMessage' }
      & Pick<WelcomeMessage, 'invitedBy'>
      & { invitedBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    )> }
  )> }
);

export type AggregatesQueryVariables = Exact<{
  types: Array<AggregateType> | AggregateType;
  safeAddress: Scalars['String'];
  filter?: Maybe<ProfileAggregateFilter>;
}>;


export type AggregatesQuery = (
  { __typename?: 'Query' }
  & { aggregates: Array<(
    { __typename?: 'ProfileAggregate' }
    & Pick<ProfileAggregate, 'type' | 'safe_address'>
    & { safe_address_profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
    )>, payload: (
      { __typename?: 'Contacts' }
      & Pick<Contacts, 'lastUpdatedAt'>
      & { contacts: Array<(
        { __typename?: 'Contact' }
        & Pick<Contact, 'lastContactAt' | 'contactAddress'>
        & { metadata: Array<(
          { __typename?: 'ContactPoint' }
          & Pick<ContactPoint, 'name' | 'directions' | 'values' | 'timestamps'>
        )>, contactAddress_Profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'type' | 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country'>
          )>, memberships?: Maybe<Array<(
            { __typename?: 'Membership' }
            & Pick<Membership, 'isAdmin'>
            & { organisation: (
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'circlesAddress' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'avatarMimeType' | 'displayCurrency'>
              & { city?: Maybe<(
                { __typename?: 'City' }
                & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
              )> }
            ) }
          )>>, verifications?: Maybe<Array<(
            { __typename?: 'Verification' }
            & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
            & { verifierProfile?: Maybe<(
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
              & { city?: Maybe<(
                { __typename?: 'City' }
                & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
              )> }
            )> }
          )>> }
        )> }
      )> }
    ) | (
      { __typename?: 'CrcBalances' }
      & Pick<CrcBalances, 'lastUpdatedAt'>
      & { balances: Array<(
        { __typename?: 'AssetBalance' }
        & Pick<AssetBalance, 'token_address' | 'token_owner_address' | 'token_balance'>
        & { token_owner_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
        )> }
      )> }
    ) | (
      { __typename?: 'Erc20Balances' }
      & Pick<Erc20Balances, 'lastUpdatedAt'>
      & { balances: Array<(
        { __typename?: 'AssetBalance' }
        & Pick<AssetBalance, 'token_address' | 'token_owner_address' | 'token_balance'>
        & { token_owner_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'type' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
        )> }
      )> }
    ) | (
      { __typename?: 'Members' }
      & Pick<Members, 'lastUpdatedAt'>
      & { members: Array<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress'>
      ) | (
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'circlesAddress'>
      )> }
    ) | (
      { __typename?: 'Memberships' }
      & Pick<Memberships, 'lastUpdatedAt'>
      & { organisations: Array<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress'>
      )> }
    ) | (
      { __typename?: 'Offers' }
      & Pick<Offers, 'lastUpdatedAt'>
      & { offers: Array<(
        { __typename?: 'Offer' }
        & Pick<Offer, 'id' | 'version' | 'createdByAddress' | 'createdAt' | 'title' | 'pictureUrl' | 'pictureMimeType' | 'description' | 'pricePerUnit' | 'timeCirclesPriceShare'>
        & { createdByProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'displayCurrency'>
        )> }
      )> }
    ) | (
      { __typename?: 'Purchases' }
      & Pick<Purchases, 'lastUpdatedAt'>
      & { purchases: Array<(
        { __typename?: 'Purchase' }
        & Pick<Purchase, 'id' | 'createdAt' | 'createdByAddress' | 'total'>
        & { createdByProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'type' | 'id' | 'firstName' | 'lastName' | 'avatarCid' | 'displayCurrency'>
        )>, lines: Array<(
          { __typename?: 'PurchaseLine' }
          & Pick<PurchaseLine, 'id' | 'amount'>
          & { offer: (
            { __typename?: 'Offer' }
            & Pick<Offer, 'id' | 'version' | 'title' | 'description' | 'pictureUrl' | 'pricePerUnit' | 'timeCirclesPriceShare'>
            & { createdByProfile?: Maybe<(
              { __typename?: 'Profile' }
              & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'displayCurrency'>
            )> }
          ) }
        )>, invoices: Array<(
          { __typename?: 'Invoice' }
          & Pick<Invoice, 'id' | 'sellerAddress' | 'paymentTransactionHash' | 'buyerAddress' | 'pickupCode' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate' | 'cancelledAt' | 'cancelReason'>
          & { sellerProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'origin' | 'successorOfCirclesAddress' | 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'displayCurrency'>
          )> }
        )> }
      )> }
    ) | (
      { __typename?: 'Sales' }
      & Pick<Sales, 'lastUpdatedAt'>
      & { sales: Array<(
        { __typename?: 'Sale' }
        & Pick<Sale, 'id' | 'createdAt' | 'total'>
        & { sellerProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'successorOfCirclesAddress' | 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarCid' | 'displayCurrency'>
        )>, buyerProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'successorOfCirclesAddress' | 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarCid' | 'displayCurrency'>
          & { verifications?: Maybe<Array<(
            { __typename?: 'Verification' }
            & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
            & { verifierProfile?: Maybe<(
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
              & { city?: Maybe<(
                { __typename?: 'City' }
                & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
              )> }
            )> }
          )>> }
        )>, lines: Array<(
          { __typename?: 'SalesLine' }
          & Pick<SalesLine, 'id' | 'amount'>
          & { offer: (
            { __typename?: 'Offer' }
            & Pick<Offer, 'id' | 'version' | 'title' | 'description' | 'pictureUrl' | 'pricePerUnit' | 'timeCirclesPriceShare'>
            & { createdByProfile?: Maybe<(
              { __typename?: 'Profile' }
              & Pick<Profile, 'successorOfCirclesAddress' | 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'displayCurrency'>
            )> }
          ) }
        )>, invoices: Array<(
          { __typename?: 'Invoice' }
          & Pick<Invoice, 'id' | 'sellerAddress' | 'paymentTransactionHash' | 'buyerAddress' | 'pickupCode' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate' | 'cancelledAt' | 'cancelReason'>
          & { buyerProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'successorOfCirclesAddress' | 'type' | 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'displayCurrency'>
            & { verifications?: Maybe<Array<(
              { __typename?: 'Verification' }
              & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
              & { verifierProfile?: Maybe<(
                { __typename?: 'Organisation' }
                & Pick<Organisation, 'circlesAddress' | 'avatarUrl' | 'name'>
                & { city?: Maybe<(
                  { __typename?: 'City' }
                  & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
                )> }
              )> }
            )>> }
          )> }
        )> }
      )> }
    ) }
  )> }
);

export type DirectPathQueryVariables = Exact<{
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
}>;


export type DirectPathQuery = (
  { __typename?: 'Query' }
  & { directPath: (
    { __typename?: 'TransitivePath' }
    & Pick<TransitivePath, 'flow'>
    & { transfers: Array<(
      { __typename?: 'TransitiveTransfer' }
      & Pick<TransitiveTransfer, 'from' | 'to' | 'token' | 'tokenOwner' | 'value'>
    )> }
  ) }
);

export type InvoiceQueryVariables = Exact<{
  invoiceId: Scalars['Int'];
}>;


export type InvoiceQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'invoice'>
);

export type VerificationsQueryVariables = Exact<{
  pagination?: Maybe<PaginationArgs>;
  filter?: Maybe<VerifiedSafesFilter>;
}>;


export type VerificationsQuery = (
  { __typename?: 'Query' }
  & { verifications: Array<(
    { __typename?: 'Verification' }
    & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress' | 'verifiedSafeAddress'>
    & { verifierProfile?: Maybe<(
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'avatarUrl' | 'name'>
    )>, verifiedProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'circlesAddress' | 'avatarUrl' | 'firstName' | 'lastName'>
    )> }
  )> }
);

export type FindInvitationCreatorQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type FindInvitationCreatorQuery = (
  { __typename?: 'Query' }
  & { findInvitationCreator?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl'>
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


export const CreatePurchaseDocument = gql`
    mutation createPurchase($lines: [PurchaseLineInput!]!) {
  purchase(lines: $lines) {
    id
    buyerAddress
    buyerProfile {
      id
      circlesAddress
      firstName
      lastName
      avatarUrl
    }
    sellerAddress
    sellerProfile {
      id
      circlesAddress
      firstName
      lastName
      avatarUrl
    }
    purchaseId
    lines {
      id
      amount
      offer {
        id
        version
        createdByAddress
        createdByProfile {
          id
          circlesAddress
          firstName
          lastName
          avatarUrl
        }
        pricePerUnit
        title
        description
      }
    }
  }
}
    `;
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
    mutation sendMessage($fromSafeAddress: String, $toSafeAddress: String!, $content: String!) {
  sendMessage(
    fromSafeAddress: $fromSafeAddress
    toSafeAddress: $toSafeAddress
    content: $content
  ) {
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
    mutation addMember($groupId: String!, $memberAddress: String!) {
  addMember(groupId: $groupId, memberAddress: $memberAddress) {
    error
    success
  }
}
    `;
export const RemoveMemberDocument = gql`
    mutation removeMember($groupId: String!, $memberAddress: String!) {
  removeMember(groupId: $groupId, memberAddress: $memberAddress) {
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
    mutation upsertProfile($id: Int, $firstName: String!, $lastName: String, $dream: String, $country: String, $avatarUrl: String, $avatarCid: String, $avatarMimeType: String, $circlesAddress: String, $circlesSafeOwner: String, $newsletter: Boolean, $displayCurrency: DisplayCurrency, $displayTimeCircles: Boolean, $cityGeonameid: Int, $status: String!, $successorOfCirclesAddress: String) {
  upsertProfile(
    data: {id: $id, firstName: $firstName, lastName: $lastName, dream: $dream, country: $country, avatarUrl: $avatarUrl, avatarCid: $avatarCid, avatarMimeType: $avatarMimeType, circlesAddress: $circlesAddress, circlesSafeOwner: $circlesSafeOwner, newsletter: $newsletter, displayCurrency: $displayCurrency, displayTimeCircles: $displayTimeCircles, cityGeonameid: $cityGeonameid, status: $status, successorOfCirclesAddress: $successorOfCirclesAddress}
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
    displayCurrency
    displayTimeCircles
    successorOfCirclesAddress
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
export const UpsertRegionDocument = gql`
    mutation upsertRegion($organisation: UpsertOrganisationInput!) {
  upsertRegion(organisation: $organisation) {
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
export const ImportOrganisationsDocument = gql`
    mutation importOrganisations {
  importOrganisationsOfAccount {
    id
    circlesAddress
    name
    description
    avatarUrl
  }
}
    `;
export const CompletePurchaseDocument = gql`
    mutation completePurchase($invoiceId: Int!, $revoke: Boolean) {
  completePurchase(invoiceId: $invoiceId, revoke: $revoke) {
    id
    sellerAddress
    paymentTransactionHash
    buyerAddress
    pickupCode
    buyerSignature
    buyerSignedDate
    sellerSignature
    sellerSignedDate
    sellerProfile {
      type
      id
      circlesAddress
      firstName
      lastName
      avatarUrl
    }
  }
}
    `;
export const CompleteSaleDocument = gql`
    mutation completeSale($invoiceId: Int!, $revoke: Boolean) {
  completeSale(invoiceId: $invoiceId, revoke: $revoke) {
    id
    sellerAddress
    paymentTransactionHash
    buyerAddress
    pickupCode
    buyerSignature
    buyerSignedDate
    sellerSignature
    sellerSignedDate
    sellerProfile {
      type
      id
      circlesAddress
      firstName
      lastName
      avatarUrl
    }
  }
}
    `;
export const VerifySafeDocument = gql`
    mutation verifySafe($safeAddress: String!) {
  verifySafe(safeAddress: $safeAddress) {
    success
  }
}
    `;
export const RevokeSafeVerificationDocument = gql`
    mutation revokeSafeVerification($safeAddress: String!) {
  revokeSafeVerification(safeAddress: $safeAddress) {
    success
  }
}
    `;
export const AnnouncePaymentDocument = gql`
    mutation announcePayment($invoiceId: Int!, $transactionHash: String!) {
  announcePayment(invoiceId: $invoiceId, transactionHash: $transactionHash) {
    transactionHash
    invoiceId
  }
}
    `;
export const SessionInfoDocument = gql`
    query sessionInfo {
  sessionInfo {
    isLoggedOn
    hasProfile
    profileId
    lastAcknowledgedAt
    profile {
      origin
      circlesAddress
      circlesSafeOwner
      firstName
      lastName
      avatarUrl
    }
    capabilities {
      type
    }
  }
}
    `;
export const WhoamiDocument = gql`
    query whoami {
  whoami
}
    `;
export const ProfilesCountDocument = gql`
    query profilesCount {
  profilesCount
}
    `;
export const VerificationsCountDocument = gql`
    query verificationsCount {
  verificationsCount
}
    `;
export const FindSafesByOwnerDocument = gql`
    query findSafesByOwner($owner: String!) {
  findSafesByOwner(owner: $owner) {
    type
    safeAddress
    lastUbiAt
    randomValue
    tokenAddress
    safeProfile {
      id
      origin
      circlesAddress
      circlesSafeOwner
      successorOfCirclesAddress
      firstName
      lastName
      dream
      country
      avatarUrl
      avatarCid
      avatarMimeType
      newsletter
      displayTimeCircles
      displayCurrency
      cityGeonameid
      city {
        geonameid
        name
        country
        latitude
        longitude
        population
      }
      verifications {
        createdAt
        revokedAt
        verifierSafeAddress
        verifierProfile {
          circlesAddress
          avatarUrl
          name
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
export const MyProfileDocument = gql`
    query myProfile {
  myProfile {
    id
    circlesAddress
    circlesSafeOwner
    successorOfCirclesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    displayTimeCircles
    displayCurrency
    cityGeonameid
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        circlesSafeOwner
        name
        description
        avatarUrl
        avatarMimeType
        displayCurrency
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
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
  }
}
    `;
export const ProfilesDocument = gql`
    query profiles($id: [Int!]!) {
  profilesById(ids: $id) {
    id
    origin
    circlesAddress
    circlesSafeOwner
    successorOfCirclesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    cityGeonameid
    status
    displayCurrency
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        circlesSafeOwner
        name
        description
        avatarUrl
        avatarMimeType
        displayCurrency
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
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
    origin
    circlesSafeOwner
    circlesAddress
    successorOfCirclesAddress
    avatarUrl
    firstName
    lastName
    dream
    country
    cityGeonameid
    displayCurrency
    city {
      geonameid
      country
      name
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
  }
}
    `;
export const GetRecentProfilesDocument = gql`
    query getRecentProfiles($pagination: PaginationArgs) {
  recentProfiles(pagination: $pagination) {
    id
    circlesAddress
    origin
    successorOfCirclesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    cityGeonameid
    displayCurrency
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
  }
}
    `;
export const ProfilesByCirclesAddressDocument = gql`
    query profilesByCirclesAddress($circlesAddresses: [String!]!) {
  profilesBySafeAddress(safeAddresses: $circlesAddresses) {
    id
    circlesAddress
    origin
    successorOfCirclesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    cityGeonameid
    displayCurrency
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        circlesSafeOwner
        name
        description
        avatarUrl
        avatarMimeType
        displayCurrency
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
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
  }
}
    `;
export const SafeInfoDocument = gql`
    query safeInfo {
  safeInfo {
    lastUbiAt
    safeAddress
    tokenAddress
    randomValue
  }
}
    `;
export const ProfilesByIdsDocument = gql`
    query profilesByIds($id: [Int!]!) {
  profilesById(ids: $id) {
    id
    circlesAddress
    origin
    successorOfCirclesAddress
    firstName
    lastName
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    cityGeonameid
    displayCurrency
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
      origin
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
    }
    direction
    otherSafeAddress
    otherSafeAddressProfile {
      id
      firstName
      lastName
      avatarUrl
      origin
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      verifications {
        createdAt
        revokedAt
        verifierSafeAddress
        verifierProfile {
          circlesAddress
          avatarUrl
          name
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
    }
  }
}
    `;
export const ProfileByIdDocument = gql`
    query profileById($id: Int!) {
  profilesById(ids: [$id]) {
    id
    successorOfCirclesAddress
    circlesSafeOwner
    circlesAddress
    avatarUrl
    origin
    firstName
    lastName
    dream
    country
    cityGeonameid
    displayCurrency
    city {
      geonameid
      country
      name
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
  }
}
    `;
export const ProfileBySafeAddressDocument = gql`
    query profileBySafeAddress($safeAddress: String!) {
  profilesBySafeAddress(safeAddresses: [$safeAddress]) {
    id
    successorOfCirclesAddress
    circlesSafeOwner
    circlesAddress
    avatarUrl
    firstName
    origin
    lastName
    dream
    country
    cityGeonameid
    displayCurrency
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
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        circlesSafeOwner
        name
        description
        avatarUrl
        avatarMimeType
        displayCurrency
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
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        circlesAddress
        avatarUrl
        name
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
    displayCurrency
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
export const RegionsDocument = gql`
    query regions {
  regions {
    id
    circlesAddress
    createdAt
    name
    avatarMimeType
    avatarUrl
    displayCurrency
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
    displayCurrency
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
        displayCurrency
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
        origin
        successorOfCirclesAddress
        circlesSafeOwner
        circlesAddress
        avatarUrl
        firstName
        lastName
        dream
        country
        cityGeonameid
        displayCurrency
        city {
          geonameid
          country
          name
        }
        verifications {
          createdAt
          revokedAt
          verifierSafeAddress
          verifierProfile {
            circlesAddress
            avatarUrl
            name
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
      }
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
      origin
      firstName
      lastName
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      verifications {
        createdAt
        revokedAt
        verifierSafeAddress
        verifierProfile {
          circlesAddress
          avatarUrl
          name
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
    }
  }
}
    `;
export const StreamDocument = gql`
    query stream($types: [EventType!]!, $safeAddress: String!, $pagination: PaginationArgs!, $filter: ProfileEventFilter) {
  events(
    types: $types
    safeAddress: $safeAddress
    pagination: $pagination
    filter: $filter
  ) {
    timestamp
    transaction_hash
    block_number
    safe_address
    contact_address
    contact_address_profile {
      successorOfCirclesAddress
      origin
      circlesAddress
      firstName
      lastName
      avatarUrl
      displayCurrency
    }
    direction
    type
    payload {
      ... on CrcHubTransfer {
        transaction_hash
        from
        from_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        to
        to_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        flow
        transfers {
          token
          from
          from_profile {
            successorOfCirclesAddress
            origin
            type
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
          }
          to
          to_profile {
            successorOfCirclesAddress
            origin
            type
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
          }
          value
        }
        tags {
          id
          typeId
          value
        }
      }
      ... on CrcTrust {
        transaction_hash
        address
        can_send_to
        limit
      }
      ... on CrcSignup {
        transaction_hash
        user
        token
      }
      ... on CrcMinting {
        transaction_hash
        token
        from
        from_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        to
        to_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        value
      }
      ... on EthTransfer {
        transaction_hash
        from
        to
        value
      }
      ... on Erc20Transfer {
        transaction_hash
        from
        from_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        to
        to_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        value
      }
      ... on GnosisSafeEthTransfer {
        transaction_hash
        initiator
        from
        to
        value
      }
      ... on ChatMessage {
        from
        from_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        to
        to_profile {
          successorOfCirclesAddress
          origin
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        text
      }
      ... on MembershipOffer {
        createdBy
        organisation
        organisation_profile {
          name
          avatarUrl
          circlesAddress
          displayCurrency
        }
        isAdmin
      }
      ... on MembershipAccepted {
        createdBy
        member
        organisation
        organisation_profile {
          name
          avatarUrl
          circlesAddress
          displayCurrency
        }
      }
      ... on MembershipRejected {
        member
        organisation
        organisation_profile {
          name
          avatarUrl
          circlesAddress
          displayCurrency
        }
      }
      ... on WelcomeMessage {
        invitedBy
        invitedBy_profile {
          successorOfCirclesAddress
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
      }
      ... on InvitationCreated {
        name
        code
      }
      ... on InvitationRedeemed {
        name
        code
        redeemedBy
        redeemedBy_profile {
          successorOfCirclesAddress
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
      }
      ... on SaleEvent {
        buyer
        buyer_profile {
          successorOfCirclesAddress
          type
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
        }
        invoice {
          id
          buyerSignature
          buyerSignedDate
          sellerSignature
          sellerSignedDate
          cancelledAt
          cancelReason
          lines {
            amount
            offer {
              id
              title
              pictureUrl
            }
          }
        }
      }
      ... on OrganisationCreated {
        organisation
        organisation_profile {
          name
          avatarUrl
          circlesAddress
          displayCurrency
        }
      }
      ... on MemberAdded {
        createdBy
        isAdmin
        member
        organisation
        organisation_profile {
          name
          avatarUrl
          circlesAddress
          displayCurrency
        }
      }
      ... on SafeVerified {
        safe_address
        organisation_profile {
          name
          avatarUrl
          circlesAddress
          displayCurrency
        }
      }
    }
  }
}
    `;
export const AggregatesDocument = gql`
    query aggregates($types: [AggregateType!]!, $safeAddress: String!, $filter: ProfileAggregateFilter) {
  aggregates(types: $types, safeAddress: $safeAddress, filter: $filter) {
    type
    safe_address
    safe_address_profile {
      origin
      successorOfCirclesAddress
      firstName
      lastName
      avatarUrl
      circlesAddress
      displayCurrency
    }
    payload {
      ... on Offers {
        lastUpdatedAt
        offers {
          id
          version
          createdByProfile {
            origin
            successorOfCirclesAddress
            type
            id
            circlesAddress
            firstName
            lastName
            avatarUrl
            displayCurrency
          }
          createdByAddress
          createdAt
          title
          pictureUrl
          pictureMimeType
          description
          pricePerUnit
          timeCirclesPriceShare
        }
      }
      ... on CrcBalances {
        lastUpdatedAt
        balances {
          token_address
          token_owner_address
          token_owner_profile {
            origin
            successorOfCirclesAddress
            type
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
          }
          token_balance
        }
      }
      ... on Erc20Balances {
        lastUpdatedAt
        balances {
          token_address
          token_owner_address
          token_owner_profile {
            origin
            successorOfCirclesAddress
            type
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
          }
          token_balance
        }
      }
      ... on Contacts {
        lastUpdatedAt
        contacts {
          metadata {
            name
            directions
            values
            timestamps
          }
          lastContactAt
          contactAddress
          contactAddress_Profile {
            origin
            successorOfCirclesAddress
            type
            id
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            city {
              geonameid
              name
              country
            }
            memberships {
              isAdmin
              organisation {
                id
                circlesAddress
                circlesSafeOwner
                name
                description
                avatarUrl
                avatarMimeType
                displayCurrency
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
            verifications {
              createdAt
              revokedAt
              verifierSafeAddress
              verifierProfile {
                circlesAddress
                avatarUrl
                name
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
          }
        }
      }
      ... on Members {
        lastUpdatedAt
        members {
          ... on Profile {
            successorOfCirclesAddress
            circlesAddress
          }
          ... on Organisation {
            circlesAddress
          }
        }
      }
      ... on Memberships {
        lastUpdatedAt
        organisations {
          circlesAddress
        }
      }
      ... on Purchases {
        lastUpdatedAt
        purchases {
          id
          createdAt
          createdByAddress
          createdByProfile {
            origin
            successorOfCirclesAddress
            type
            id
            firstName
            lastName
            avatarCid
            displayCurrency
          }
          total
          lines {
            id
            amount
            offer {
              id
              version
              title
              description
              pictureUrl
              pricePerUnit
              timeCirclesPriceShare
              createdByProfile {
                origin
                successorOfCirclesAddress
                type
                id
                circlesAddress
                firstName
                lastName
                avatarUrl
                displayCurrency
              }
            }
          }
          invoices {
            id
            sellerAddress
            paymentTransactionHash
            buyerAddress
            pickupCode
            buyerSignature
            buyerSignedDate
            sellerSignature
            sellerSignedDate
            cancelledAt
            cancelReason
            sellerProfile {
              origin
              successorOfCirclesAddress
              type
              id
              circlesAddress
              firstName
              lastName
              avatarUrl
              displayCurrency
            }
          }
        }
      }
      ... on Sales {
        lastUpdatedAt
        sales {
          id
          createdAt
          sellerProfile {
            successorOfCirclesAddress
            type
            id
            circlesAddress
            firstName
            lastName
            avatarCid
            displayCurrency
          }
          buyerProfile {
            successorOfCirclesAddress
            type
            id
            circlesAddress
            firstName
            lastName
            avatarCid
            displayCurrency
            verifications {
              createdAt
              revokedAt
              verifierSafeAddress
              verifierProfile {
                circlesAddress
                avatarUrl
                name
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
          }
          total
          lines {
            id
            amount
            offer {
              id
              version
              title
              description
              pictureUrl
              pricePerUnit
              timeCirclesPriceShare
              createdByProfile {
                successorOfCirclesAddress
                type
                id
                circlesAddress
                firstName
                lastName
                avatarUrl
                displayCurrency
              }
            }
          }
          invoices {
            id
            sellerAddress
            paymentTransactionHash
            buyerAddress
            pickupCode
            buyerSignature
            buyerSignedDate
            sellerSignature
            sellerSignedDate
            cancelledAt
            cancelReason
            buyerProfile {
              successorOfCirclesAddress
              type
              id
              circlesAddress
              firstName
              lastName
              avatarUrl
              displayCurrency
              verifications {
                createdAt
                revokedAt
                verifierSafeAddress
                verifierProfile {
                  circlesAddress
                  avatarUrl
                  name
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
            }
          }
        }
      }
    }
  }
}
    `;
export const DirectPathDocument = gql`
    query directPath($from: String!, $to: String!, $amount: String!) {
  directPath(from: $from, to: $to, amount: $amount) {
    flow
    transfers {
      from
      to
      token
      tokenOwner
      value
    }
  }
}
    `;
export const InvoiceDocument = gql`
    query invoice($invoiceId: Int!) {
  invoice(invoiceId: $invoiceId)
}
    `;
export const VerificationsDocument = gql`
    query verifications($pagination: PaginationArgs, $filter: VerifiedSafesFilter) {
  verifications(pagination: $pagination, filter: $filter) {
    createdAt
    revokedAt
    verifierSafeAddress
    verifierProfile {
      avatarUrl
      name
    }
    verifiedSafeAddress
    verifiedProfile {
      circlesAddress
      avatarUrl
      firstName
      lastName
    }
  }
}
    `;
export const FindInvitationCreatorDocument = gql`
    query findInvitationCreator($code: String!) {
  findInvitationCreator(code: $code) {
    circlesAddress
    firstName
    lastName
    avatarUrl
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
    createPurchase(variables: CreatePurchaseMutationVariables): Promise<CreatePurchaseMutation> {
      return withWrapper(() => client.request<CreatePurchaseMutation>(print(CreatePurchaseDocument), variables));
    },
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
    upsertRegion(variables: UpsertRegionMutationVariables): Promise<UpsertRegionMutation> {
      return withWrapper(() => client.request<UpsertRegionMutation>(print(UpsertRegionDocument), variables));
    },
    importOrganisations(variables?: ImportOrganisationsMutationVariables): Promise<ImportOrganisationsMutation> {
      return withWrapper(() => client.request<ImportOrganisationsMutation>(print(ImportOrganisationsDocument), variables));
    },
    completePurchase(variables: CompletePurchaseMutationVariables): Promise<CompletePurchaseMutation> {
      return withWrapper(() => client.request<CompletePurchaseMutation>(print(CompletePurchaseDocument), variables));
    },
    completeSale(variables: CompleteSaleMutationVariables): Promise<CompleteSaleMutation> {
      return withWrapper(() => client.request<CompleteSaleMutation>(print(CompleteSaleDocument), variables));
    },
    verifySafe(variables: VerifySafeMutationVariables): Promise<VerifySafeMutation> {
      return withWrapper(() => client.request<VerifySafeMutation>(print(VerifySafeDocument), variables));
    },
    revokeSafeVerification(variables: RevokeSafeVerificationMutationVariables): Promise<RevokeSafeVerificationMutation> {
      return withWrapper(() => client.request<RevokeSafeVerificationMutation>(print(RevokeSafeVerificationDocument), variables));
    },
    announcePayment(variables: AnnouncePaymentMutationVariables): Promise<AnnouncePaymentMutation> {
      return withWrapper(() => client.request<AnnouncePaymentMutation>(print(AnnouncePaymentDocument), variables));
    },
    sessionInfo(variables?: SessionInfoQueryVariables): Promise<SessionInfoQuery> {
      return withWrapper(() => client.request<SessionInfoQuery>(print(SessionInfoDocument), variables));
    },
    whoami(variables?: WhoamiQueryVariables): Promise<WhoamiQuery> {
      return withWrapper(() => client.request<WhoamiQuery>(print(WhoamiDocument), variables));
    },
    profilesCount(variables?: ProfilesCountQueryVariables): Promise<ProfilesCountQuery> {
      return withWrapper(() => client.request<ProfilesCountQuery>(print(ProfilesCountDocument), variables));
    },
    verificationsCount(variables?: VerificationsCountQueryVariables): Promise<VerificationsCountQuery> {
      return withWrapper(() => client.request<VerificationsCountQuery>(print(VerificationsCountDocument), variables));
    },
    findSafesByOwner(variables: FindSafesByOwnerQueryVariables): Promise<FindSafesByOwnerQuery> {
      return withWrapper(() => client.request<FindSafesByOwnerQuery>(print(FindSafesByOwnerDocument), variables));
    },
    claimedInvitation(variables?: ClaimedInvitationQueryVariables): Promise<ClaimedInvitationQuery> {
      return withWrapper(() => client.request<ClaimedInvitationQuery>(print(ClaimedInvitationDocument), variables));
    },
    invitationTransaction(variables?: InvitationTransactionQueryVariables): Promise<InvitationTransactionQuery> {
      return withWrapper(() => client.request<InvitationTransactionQuery>(print(InvitationTransactionDocument), variables));
    },
    hubSignupTransaction(variables?: HubSignupTransactionQueryVariables): Promise<HubSignupTransactionQuery> {
      return withWrapper(() => client.request<HubSignupTransactionQuery>(print(HubSignupTransactionDocument), variables));
    },
    myInvitations(variables?: MyInvitationsQueryVariables): Promise<MyInvitationsQuery> {
      return withWrapper(() => client.request<MyInvitationsQuery>(print(MyInvitationsDocument), variables));
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
    getRecentProfiles(variables?: GetRecentProfilesQueryVariables): Promise<GetRecentProfilesQuery> {
      return withWrapper(() => client.request<GetRecentProfilesQuery>(print(GetRecentProfilesDocument), variables));
    },
    profilesByCirclesAddress(variables: ProfilesByCirclesAddressQueryVariables): Promise<ProfilesByCirclesAddressQuery> {
      return withWrapper(() => client.request<ProfilesByCirclesAddressQuery>(print(ProfilesByCirclesAddressDocument), variables));
    },
    safeInfo(variables?: SafeInfoQueryVariables): Promise<SafeInfoQuery> {
      return withWrapper(() => client.request<SafeInfoQuery>(print(SafeInfoDocument), variables));
    },
    profilesByIds(variables: ProfilesByIdsQueryVariables): Promise<ProfilesByIdsQuery> {
      return withWrapper(() => client.request<ProfilesByIdsQuery>(print(ProfilesByIdsDocument), variables));
    },
    trustRelations(variables: TrustRelationsQueryVariables): Promise<TrustRelationsQuery> {
      return withWrapper(() => client.request<TrustRelationsQuery>(print(TrustRelationsDocument), variables));
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
    regions(variables?: RegionsQueryVariables): Promise<RegionsQuery> {
      return withWrapper(() => client.request<RegionsQuery>(print(RegionsDocument), variables));
    },
    organisationsByAddress(variables: OrganisationsByAddressQueryVariables): Promise<OrganisationsByAddressQuery> {
      return withWrapper(() => client.request<OrganisationsByAddressQuery>(print(OrganisationsByAddressDocument), variables));
    },
    commonTrust(variables: CommonTrustQueryVariables): Promise<CommonTrustQuery> {
      return withWrapper(() => client.request<CommonTrustQuery>(print(CommonTrustDocument), variables));
    },
    stream(variables: StreamQueryVariables): Promise<StreamQuery> {
      return withWrapper(() => client.request<StreamQuery>(print(StreamDocument), variables));
    },
    aggregates(variables: AggregatesQueryVariables): Promise<AggregatesQuery> {
      return withWrapper(() => client.request<AggregatesQuery>(print(AggregatesDocument), variables));
    },
    directPath(variables: DirectPathQueryVariables): Promise<DirectPathQuery> {
      return withWrapper(() => client.request<DirectPathQuery>(print(DirectPathDocument), variables));
    },
    invoice(variables: InvoiceQueryVariables): Promise<InvoiceQuery> {
      return withWrapper(() => client.request<InvoiceQuery>(print(InvoiceDocument), variables));
    },
    verifications(variables?: VerificationsQueryVariables): Promise<VerificationsQuery> {
      return withWrapper(() => client.request<VerificationsQuery>(print(VerificationsDocument), variables));
    },
    findInvitationCreator(variables: FindInvitationCreatorQueryVariables): Promise<FindInvitationCreatorQuery> {
      return withWrapper(() => client.request<FindInvitationCreatorQuery>(print(FindInvitationCreatorDocument), variables));
    },
    events(variables?: EventsSubscriptionVariables): Promise<EventsSubscription> {
      return withWrapper(() => client.request<EventsSubscription>(print(EventsDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;