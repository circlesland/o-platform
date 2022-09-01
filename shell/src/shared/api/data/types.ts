import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  Date: any;
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

export type AggregatePayload = Contacts | CrcBalances | Erc20Balances | Erc721Tokens | Members | Memberships | Offers | Purchases | Sales;

export enum AggregateType {
  Contacts = 'Contacts',
  CrcBalances = 'CrcBalances',
  Erc20Balances = 'Erc20Balances',
  Erc721Tokens = 'Erc721Tokens',
  Members = 'Members',
  Memberships = 'Memberships',
  Offers = 'Offers',
  Purchases = 'Purchases',
  Sales = 'Sales'
}

export type AnnouncePaymentResult = {
  __typename?: 'AnnouncePaymentResult';
  invoiceId: Scalars['Int'];
  pickupCode: Scalars['String'];
  simplePickupCode?: Maybe<Scalars['String']>;
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
  PreviewFeatures = 'PreviewFeatures',
  Tickets = 'Tickets',
  Translate = 'Translate',
  VerifiedByHumanode = 'VerifiedByHumanode',
  Verify = 'Verify'
}

export type ChatMessage = IEventPayload & {
  __typename?: 'ChatMessage';
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  id: Scalars['Int'];
  text: Scalars['String'];
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type ChatMessageEventFilter = {
  id: Scalars['Int'];
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
  total?: Maybe<Scalars['String']>;
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
  value?: InputMaybe<Scalars['String']>;
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

export type DeliveryMethod = {
  __typename?: 'DeliveryMethod';
  id: Scalars['Int'];
  name: Scalars['String'];
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

export type Erc721Token = {
  __typename?: 'Erc721Token';
  token_address: Scalars['String'];
  token_name?: Maybe<Scalars['String']>;
  token_no: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
  token_symbol?: Maybe<Scalars['String']>;
  token_url: Scalars['String'];
};

export type Erc721Tokens = IAggregatePayload & {
  __typename?: 'Erc721Tokens';
  balances: Array<Erc721Token>;
  lastUpdatedAt: Scalars['String'];
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

export type EventPayload = ChatMessage | CrcHubTransfer | CrcMinting | CrcSignup | CrcTokenTransfer | CrcTrust | Erc20Transfer | EthTransfer | GnosisSafeEthTransfer | InvitationCreated | InvitationRedeemed | MemberAdded | MembershipAccepted | MembershipOffer | MembershipRejected | NewUser | OrganisationCreated | Purchased | SafeVerified | SaleEvent | WelcomeMessage;

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
  NewUser = 'NewUser',
  OrganisationCreated = 'OrganisationCreated',
  Purchased = 'Purchased',
  SafeVerified = 'SafeVerified',
  SaleEvent = 'SaleEvent',
  WelcomeMessage = 'WelcomeMessage'
}

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ExportProfile = {
  __typename?: 'ExportProfile';
  avatarUrl?: Maybe<Scalars['String']>;
  circlesAddress: Scalars['String'];
  displayName: Scalars['String'];
  lastChange: Scalars['Date'];
};

export type ExportTrustRelation = {
  __typename?: 'ExportTrustRelation';
  lastChange: Scalars['Date'];
  trustLimit: Scalars['Int'];
  trusteeAddress: Scalars['String'];
  trusterAddress: Scalars['String'];
};

export type FibonacciGoals = {
  __typename?: 'FibonacciGoals';
  currentValue: Scalars['Int'];
  lastGoal: Scalars['Int'];
  nextGoal: Scalars['Int'];
};

export enum Gender {
  Divers = 'DIVERS',
  Female = 'FEMALE',
  Male = 'MALE'
}

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
  createdAt?: Maybe<Scalars['String']>;
  deliveryAddress?: Maybe<PostAddress>;
  deliveryMethod: DeliveryMethod;
  id: Scalars['Int'];
  invoiceNo: Scalars['String'];
  lines?: Maybe<Array<InvoiceLine>>;
  paymentTransaction?: Maybe<ProfileEvent>;
  paymentTransactionHash?: Maybe<Scalars['String']>;
  pickupCode?: Maybe<Scalars['String']>;
  purchase?: Maybe<Purchase>;
  purchaseId: Scalars['Int'];
  sellerAddress: Scalars['String'];
  sellerProfile?: Maybe<Profile>;
  sellerSignature?: Maybe<Scalars['Boolean']>;
  sellerSignedDate?: Maybe<Scalars['String']>;
  simplePickupCode?: Maybe<Scalars['String']>;
};

export type InvoiceLine = {
  __typename?: 'InvoiceLine';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  metadata?: Maybe<Scalars['String']>;
  offer?: Maybe<Offer>;
  shop?: Maybe<Shop>;
};

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry';
  createdByCirclesAddress: Scalars['String'];
  createdByProfile?: Maybe<Profile>;
  inviteCount: Scalars['Int'];
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
  addNewLang?: Maybe<Scalars['Int']>;
  announcePayment: AnnouncePaymentResult;
  claimInvitation: ClaimInvitationResult;
  completePurchase: Invoice;
  completeSale: Invoice;
  confirmLegalAge: Scalars['Boolean'];
  createNewStringAndKey?: Maybe<I18n>;
  createTestInvitation: CreateInvitationResult;
  deleteShippingAddress?: Maybe<PostAddress>;
  importOrganisationsOfAccount: Array<Organisation>;
  logout: LogoutResponse;
  payWithPath: TransitivePath;
  proofUniqueness: ProofUniquenessResult;
  purchase: Array<Invoice>;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  rejectMembership?: Maybe<RejectMembershipResult>;
  removeMember?: Maybe<RemoveMemberResult>;
  requestSessionChallenge: Scalars['String'];
  requestUpdateSafe: RequestUpdateSafeResponse;
  revokeSafeVerification: VerifySafeResult;
  sendMessage: SendMessageResult;
  tagTransaction: TagTransactionResult;
  updateSafe: UpdateSafeResponse;
  updateValue?: Maybe<I18n>;
  upsertOffer: Offer;
  upsertOrganisation: CreateOrganisationResult;
  upsertProfile: Profile;
  upsertRegion: CreateOrganisationResult;
  upsertShippingAddress?: Maybe<PostAddress>;
  upsertShop: Shop;
  upsertShopCategories: UpsertShopCategoriesResult;
  upsertShopCategoryEntries: UpsertShopCategoryEntriesResult;
  upsertTag: Tag;
  verifySafe: VerifySafeResult;
  verifySessionChallenge?: Maybe<ExchangeTokenResponse>;
};


export type MutationAcceptMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationAcknowledgeArgs = {
  safeAddress?: InputMaybe<Scalars['String']>;
  until: Scalars['Date'];
};


export type MutationAddMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
};


export type MutationAddNewLangArgs = {
  langToCopyFrom?: InputMaybe<Scalars['String']>;
  langToCreate?: InputMaybe<Scalars['String']>;
};


export type MutationAnnouncePaymentArgs = {
  invoiceId: Scalars['Int'];
  transactionHash: Scalars['String'];
};


export type MutationClaimInvitationArgs = {
  code: Scalars['String'];
};


export type MutationCompletePurchaseArgs = {
  invoiceId: Scalars['Int'];
  revoke?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCompleteSaleArgs = {
  invoiceId: Scalars['Int'];
  revoke?: InputMaybe<Scalars['Boolean']>;
};


export type MutationConfirmLegalAgeArgs = {
  age: Scalars['Int'];
};


export type MutationCreateNewStringAndKeyArgs = {
  createdBy?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteShippingAddressArgs = {
  id: Scalars['Int'];
};


export type MutationPayWithPathArgs = {
  amount: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
};


export type MutationProofUniquenessArgs = {
  humanodeToken: Scalars['String'];
};


export type MutationPurchaseArgs = {
  deliveryAddressId?: InputMaybe<Scalars['Int']>;
  deliveryMethodId: Scalars['Int'];
  lines: Array<PurchaseLineInput>;
};


export type MutationRejectMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationRemoveMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
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
  fromSafeAddress?: InputMaybe<Scalars['String']>;
  toSafeAddress: Scalars['String'];
};


export type MutationTagTransactionArgs = {
  tag: CreateTagInput;
  transactionHash: Scalars['String'];
};


export type MutationUpdateSafeArgs = {
  data: UpdateSafeInput;
};


export type MutationUpdateValueArgs = {
  createdBy?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};


export type MutationUpsertOfferArgs = {
  offer: OfferInput;
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


export type MutationUpsertShippingAddressArgs = {
  data: PostAddressInput;
};


export type MutationUpsertShopArgs = {
  shop: ShopInput;
};


export type MutationUpsertShopCategoriesArgs = {
  shopCategories: Array<ShopCategoryInput>;
};


export type MutationUpsertShopCategoryEntriesArgs = {
  shopCategoryEntries: Array<ShopCategoryEntryInput>;
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

export type MyInviteRank = {
  __typename?: 'MyInviteRank';
  rank: Scalars['Int'];
  redeemedInvitationsCount: Scalars['Int'];
};

export type NewUser = IEventPayload & {
  __typename?: 'NewUser';
  profile: Profile;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type NotificationEvent = {
  __typename?: 'NotificationEvent';
  from: Scalars['String'];
  itemId?: Maybe<Scalars['Int']>;
  to: Scalars['String'];
  transaction_hash?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type Offer = {
  __typename?: 'Offer';
  allergens?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  createdByAddress: Scalars['String'];
  createdByProfile?: Maybe<Profile>;
  currentInventory?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  minAge?: Maybe<Scalars['Int']>;
  pictureMimeType: Scalars['String'];
  pictureUrl: Scalars['String'];
  pricePerUnit: Scalars['String'];
  tags?: Maybe<Array<Tag>>;
  timeCirclesPriceShare: Scalars['Int'];
  title: Scalars['String'];
  version: Scalars['Int'];
};

export type OfferByIdAndVersionInput = {
  offerId: Scalars['Int'];
  offerVersion?: InputMaybe<Scalars['Int']>;
};

export type OfferInput = {
  allergens?: InputMaybe<Scalars['String']>;
  createdByProfileId: Scalars['Int'];
  currentInventory?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  minAge?: InputMaybe<Scalars['Int']>;
  pictureMimeType: Scalars['String'];
  pictureUrl: Scalars['String'];
  pricePerUnit: Scalars['String'];
  timeCirclesPriceShare: Scalars['Int'];
  title: Scalars['String'];
};

export type Offers = IAggregatePayload & {
  __typename?: 'Offers';
  lastUpdatedAt: Scalars['String'];
  offers: Array<Offer>;
};

export type OffersAggregateFilter = {
  createdByAddresses?: InputMaybe<Array<Scalars['String']>>;
  offerIds?: InputMaybe<Array<Scalars['Int']>>;
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
  displayName?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  largeBannerUrl?: Maybe<Scalars['String']>;
  members?: Maybe<Array<ProfileOrOrganisation>>;
  name: Scalars['String'];
  offers?: Maybe<Array<Offer>>;
  productListingType?: Maybe<ProductListingType>;
  shopEnabled?: Maybe<Scalars['Boolean']>;
  shops?: Maybe<Array<Shop>>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  trustsYou?: Maybe<Scalars['Int']>;
};

export type OrganisationCreated = IEventPayload & {
  __typename?: 'OrganisationCreated';
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type PaginationArgs = {
  continueAt?: InputMaybe<Scalars['String']>;
  continueAtId?: InputMaybe<Scalars['Int']>;
  limit: Scalars['Int'];
  order: SortOrder;
};

export type PostAddress = {
  __typename?: 'PostAddress';
  city: Scalars['String'];
  cityGeonameid?: Maybe<Scalars['Int']>;
  country: Scalars['String'];
  hereLocationId?: Maybe<Scalars['String']>;
  house: Scalars['String'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  osmId?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  street: Scalars['String'];
  zip: Scalars['String'];
};

export type PostAddressInput = {
  cityGeonameid: Scalars['Int'];
  house: Scalars['String'];
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  street: Scalars['String'];
  zip: Scalars['String'];
};

export enum ProductListingType {
  List = 'LIST',
  Tiles = 'TILES'
}

export type Profile = {
  __typename?: 'Profile';
  age?: Maybe<Scalars['Int']>;
  askedForEmailAddress: Scalars['Boolean'];
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  balances?: Maybe<ProfileBalances>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  city?: Maybe<City>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  confirmedLegalAge?: Maybe<Scalars['Int']>;
  contacts?: Maybe<Array<Contact>>;
  country?: Maybe<Scalars['String']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  displayName?: Maybe<Scalars['String']>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  dream?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender?: Maybe<Gender>;
  id: Scalars['Int'];
  invitationLink?: Maybe<Scalars['String']>;
  invitationTransaction?: Maybe<ProfileEvent>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  members?: Maybe<Array<Profile>>;
  memberships?: Maybe<Array<Membership>>;
  newsletter?: Maybe<Scalars['Boolean']>;
  offers?: Maybe<Array<Offer>>;
  origin?: Maybe<ProfileOrigin>;
  productListingType?: Maybe<ProductListingType>;
  provenUniqueness?: Maybe<Scalars['Boolean']>;
  purchases?: Maybe<Array<Purchase>>;
  sales?: Maybe<Array<Sale>>;
  shippingAddresses?: Maybe<Array<PostAddress>>;
  shops?: Maybe<Array<Shop>>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  type?: Maybe<ProfileType>;
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
  contacts?: InputMaybe<ContactAggregateFilter>;
  crcBalance?: InputMaybe<CrcBalanceAggregateFilter>;
  offers?: InputMaybe<OffersAggregateFilter>;
  purchases?: InputMaybe<PurchasesAggregateFilter>;
  sales?: InputMaybe<SalesAggregateFilter>;
};

export type ProfileBalances = {
  __typename?: 'ProfileBalances';
  crcBalances?: Maybe<CrcBalances>;
  erc20Balances?: Maybe<Erc20Balances>;
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
  chatMessage?: InputMaybe<ChatMessageEventFilter>;
  direction?: InputMaybe<Direction>;
  from?: InputMaybe<Scalars['String']>;
  purchased?: InputMaybe<PurchasedEventFilter>;
  sale?: InputMaybe<SaleEventFilter>;
  to?: InputMaybe<Scalars['String']>;
  transactionHash?: InputMaybe<Scalars['String']>;
  with?: InputMaybe<Scalars['String']>;
};

export type ProfileOrOrganisation = Organisation | Profile;

export enum ProfileOrigin {
  CirclesGarden = 'CirclesGarden',
  CirclesLand = 'CirclesLand',
  Unknown = 'Unknown'
}

export enum ProfileType {
  Organisation = 'ORGANISATION',
  Person = 'PERSON',
  Region = 'REGION'
}

export type ProofPaymentResult = {
  __typename?: 'ProofPaymentResult';
  acknowledged: Scalars['Boolean'];
};

export type ProofUniquenessResult = {
  __typename?: 'ProofUniquenessResult';
  existingSafe?: Maybe<Scalars['String']>;
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
  deliveryAddress?: Maybe<PostAddress>;
  deliveryMethod: DeliveryMethod;
  id: Scalars['Int'];
  invoices?: Maybe<Array<Invoice>>;
  lines?: Maybe<Array<PurchaseLine>>;
  total: Scalars['String'];
};

export type PurchaseLine = {
  __typename?: 'PurchaseLine';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  metadata?: Maybe<Scalars['String']>;
  offer?: Maybe<Offer>;
  shop?: Maybe<Shop>;
};

export type PurchaseLineInput = {
  amount: Scalars['Int'];
  metadata?: InputMaybe<Scalars['String']>;
  offerId: Scalars['Int'];
  shopId: Scalars['Int'];
};

export type Purchased = IEventPayload & {
  __typename?: 'Purchased';
  purchase: Purchase;
  seller: Scalars['String'];
  seller_profile?: Maybe<Profile>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type PurchasedEventFilter = {
  id: Scalars['Int'];
};

export type Purchases = IAggregatePayload & {
  __typename?: 'Purchases';
  lastUpdatedAt: Scalars['String'];
  purchases: Array<Purchase>;
};

export type PurchasesAggregateFilter = {
  createdByAddresses?: InputMaybe<Array<Scalars['String']>>;
  pickupCode?: InputMaybe<Scalars['String']>;
  purchaseIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type Query = {
  __typename?: 'Query';
  aggregates: Array<ProfileAggregate>;
  allProfiles: Array<Maybe<ExportProfile>>;
  allTrusts: Array<ExportTrustRelation>;
  cities: Array<City>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  clientAssertionJwt: Scalars['String'];
  commonTrust: Array<CommonTrust>;
  deliveryMethods?: Maybe<Array<Maybe<DeliveryMethod>>>;
  directPath: TransitivePath;
  events: Array<ProfileEvent>;
  findInvitationCreator?: Maybe<Profile>;
  findSafesByOwner: Array<SafeInfo>;
  getAllStrings?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByLanguage?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByMaxVersion?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByMaxVersionAndLang?: Maybe<Array<Maybe<I18n>>>;
  getAvailableLanguages?: Maybe<Array<Maybe<I18n>>>;
  getOlderVersionsByKeyAndLang?: Maybe<Array<Maybe<I18n>>>;
  getRandomAccount?: Maybe<RandomAccount>;
  getStringByLanguage?: Maybe<Array<I18n>>;
  getStringByMaxVersion?: Maybe<I18n>;
  hubSignupTransaction?: Maybe<ProfileEvent>;
  init: SessionInfo;
  invitationTransaction?: Maybe<ProfileEvent>;
  invoice?: Maybe<Scalars['String']>;
  lastAcknowledgedAt?: Maybe<Scalars['Date']>;
  myInvitations: Array<CreatedInvitation>;
  myProfile?: Maybe<Profile>;
  offerById: Offer;
  offersByIdAndVersion: Array<Offer>;
  organisations: Array<Organisation>;
  organisationsByAddress: Array<Organisation>;
  paymentPath: TransitivePath;
  profilesById: Array<Profile>;
  profilesBySafeAddress: Array<Profile>;
  recentProfiles: Array<Profile>;
  regions: Array<Organisation>;
  safeInfo?: Maybe<SafeInfo>;
  search: Array<Profile>;
  sessionInfo: SessionInfo;
  shop?: Maybe<Shop>;
  shops: Array<Shop>;
  shopsById: Array<Shop>;
  signMessage: Scalars['String'];
  stats: Stats;
  tagById?: Maybe<Tag>;
  tags: Array<Tag>;
  trustRelations: Array<TrustRelation>;
  verifications: Array<Verification>;
  version: Version;
};


export type QueryAggregatesArgs = {
  filter?: InputMaybe<ProfileAggregateFilter>;
  safeAddress: Scalars['String'];
  types: Array<AggregateType>;
};


export type QueryAllProfilesArgs = {
  sinceLastChange?: InputMaybe<Scalars['Date']>;
};


export type QueryAllTrustsArgs = {
  sinceLastChange?: InputMaybe<Scalars['Date']>;
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
  filter?: InputMaybe<ProfileEventFilter>;
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


export type QueryGetAllStringsByLanguageArgs = {
  lang?: InputMaybe<Scalars['String']>;
};


export type QueryGetAllStringsByMaxVersionAndLangArgs = {
  lang?: InputMaybe<Scalars['String']>;
};


export type QueryGetOlderVersionsByKeyAndLangArgs = {
  key?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
};


export type QueryGetStringByLanguageArgs = {
  lang?: InputMaybe<Scalars['String']>;
};


export type QueryGetStringByMaxVersionArgs = {
  key?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
};


export type QueryInvoiceArgs = {
  invoiceId: Scalars['Int'];
};


export type QueryLastAcknowledgedAtArgs = {
  safeAddress: Scalars['String'];
};


export type QueryOfferByIdArgs = {
  id: Scalars['Int'];
};


export type QueryOffersByIdAndVersionArgs = {
  query: Array<OfferByIdAndVersionInput>;
};


export type QueryOrganisationsArgs = {
  pagination?: InputMaybe<PaginationArgs>;
};


export type QueryOrganisationsByAddressArgs = {
  addresses: Array<Scalars['String']>;
};


export type QueryPaymentPathArgs = {
  amount: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
};


export type QueryProfilesByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryProfilesBySafeAddressArgs = {
  safeAddresses: Array<Scalars['String']>;
};


export type QueryRecentProfilesArgs = {
  pagination?: InputMaybe<PaginationArgs>;
};


export type QueryRegionsArgs = {
  pagination?: InputMaybe<PaginationArgs>;
};


export type QuerySafeInfoArgs = {
  safeAddress?: InputMaybe<Scalars['String']>;
};


export type QuerySearchArgs = {
  query: SearchInput;
};


export type QueryShopArgs = {
  id: Scalars['Int'];
  ownerId?: InputMaybe<Scalars['Int']>;
};


export type QueryShopsArgs = {
  ownerId?: InputMaybe<Scalars['Int']>;
};


export type QueryShopsByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QuerySignMessageArgs = {
  key: Scalars['String'];
  message: Scalars['String'];
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
  filter?: InputMaybe<VerifiedSafesFilter>;
  pagination?: InputMaybe<PaginationArgs>;
};

export type QueryCitiesByGeonameIdInput = {
  geonameid: Array<Scalars['Int']>;
};

export type QueryCitiesByNameInput = {
  languageCode?: InputMaybe<Scalars['String']>;
  name_like: Scalars['String'];
};

export type QueryCitiesInput = {
  byId?: InputMaybe<QueryCitiesByGeonameIdInput>;
  byName?: InputMaybe<QueryCitiesByNameInput>;
};

export type QueryProfileInput = {
  circlesAddress?: InputMaybe<Array<Scalars['String']>>;
  country?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Array<Scalars['Int']>>;
  lastName?: InputMaybe<Scalars['String']>;
};

export type QueryTagsInput = {
  typeId_in: Array<Scalars['String']>;
  value_like?: InputMaybe<Scalars['String']>;
};

export type QueryUniqueProfileInput = {
  id: Scalars['Int'];
};

export type RandomAccount = {
  __typename?: 'RandomAccount';
  address?: Maybe<Scalars['String']>;
  privateKey?: Maybe<Scalars['String']>;
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
  invoices?: Maybe<Array<Invoice>>;
  lines?: Maybe<Array<SalesLine>>;
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

export type SaleEventFilter = {
  invoiceId?: InputMaybe<Scalars['Int']>;
  pickupCode?: InputMaybe<Scalars['String']>;
};

export type Sales = IAggregatePayload & {
  __typename?: 'Sales';
  lastUpdatedAt: Scalars['String'];
  sales: Array<Sale>;
};

export type SalesAggregateFilter = {
  createdByAddresses?: InputMaybe<Array<Scalars['String']>>;
  pickupCode?: InputMaybe<Scalars['String']>;
  salesIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type SalesLine = {
  __typename?: 'SalesLine';
  amount: Scalars['Int'];
  id: Scalars['Int'];
  metadata?: Maybe<Scalars['String']>;
  offer: Offer;
  shop?: Maybe<Shop>;
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
  profile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['Int']>;
  useShortSignup?: Maybe<Scalars['Boolean']>;
};

export type Shop = {
  __typename?: 'Shop';
  adultOnly?: Maybe<Scalars['Boolean']>;
  categories?: Maybe<Array<ShopCategory>>;
  createdAt: Scalars['Date'];
  deliveryMethods?: Maybe<Array<DeliveryMethod>>;
  description: Scalars['String'];
  enabled?: Maybe<Scalars['Boolean']>;
  healthInfosLink?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  largeBannerUrl: Scalars['String'];
  legalText?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  openingHours?: Maybe<Scalars['String']>;
  owner: Organisation;
  ownerId?: Maybe<Scalars['Int']>;
  pickupAddress?: Maybe<PostAddress>;
  privacyPolicyLink?: Maybe<Scalars['String']>;
  private?: Maybe<Scalars['Boolean']>;
  productListingStyle: ProductListingType;
  purchaseMetaDataKeys?: Maybe<Scalars['String']>;
  shopListingStyle: ShopListingStyle;
  smallBannerUrl: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
  tosLink?: Maybe<Scalars['String']>;
};

export type ShopCategory = {
  __typename?: 'ShopCategory';
  createdAt?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  entries?: Maybe<Array<ShopCategoryEntry>>;
  id: Scalars['Int'];
  largeBannerUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  private?: Maybe<Scalars['Boolean']>;
  productListingStyle?: Maybe<ProductListingType>;
  shop?: Maybe<Shop>;
  shopId: Scalars['Int'];
  smallBannerUrl?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
};

export type ShopCategoryEntry = {
  __typename?: 'ShopCategoryEntry';
  createdAt: Scalars['Date'];
  enabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  private?: Maybe<Scalars['Boolean']>;
  product?: Maybe<Offer>;
  productId: Scalars['Int'];
  productVersion: Scalars['Int'];
  shopCategory?: Maybe<ShopCategory>;
  shopCategoryId: Scalars['Int'];
  sortOrder?: Maybe<Scalars['Int']>;
};

export type ShopCategoryEntryInput = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  private?: InputMaybe<Scalars['Boolean']>;
  productId: Scalars['Int'];
  productVersion: Scalars['Int'];
  shopCategoryId: Scalars['Int'];
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export type ShopCategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  largeBannerUrl?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  private?: InputMaybe<Scalars['Boolean']>;
  productListingStyle?: InputMaybe<ProductListingType>;
  shopId: Scalars['Int'];
  smallBannerUrl?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export type ShopInput = {
  adultOnly?: InputMaybe<Scalars['Boolean']>;
  deliveryMethodIds?: InputMaybe<Array<Scalars['Int']>>;
  description: Scalars['String'];
  enabled: Scalars['Boolean'];
  healthInfosLink?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  largeBannerUrl: Scalars['String'];
  legalText?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  openingHours?: InputMaybe<Scalars['String']>;
  ownerId: Scalars['Int'];
  privacyPolicyLink?: InputMaybe<Scalars['String']>;
  private?: InputMaybe<Scalars['Boolean']>;
  productListingStyle: ProductListingType;
  shopListingStyle: ShopListingStyle;
  smallBannerUrl: Scalars['String'];
  sortOrder?: InputMaybe<Scalars['Int']>;
  tosLink?: InputMaybe<Scalars['String']>;
};

export enum ShopListingStyle {
  Featured = 'FEATURED',
  Regular = 'REGULAR'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Stats = {
  __typename?: 'Stats';
  goals: FibonacciGoals;
  leaderboard: Array<LeaderboardEntry>;
  myRank: MyInviteRank;
  profilesCount: Scalars['Int'];
  verificationsCount: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  events: NotificationEvent;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  order?: Maybe<Scalars['Int']>;
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
  success: Scalars['Boolean'];
  transfers: Array<TransitiveTransfer>;
};

export type TransitiveTransfer = {
  __typename?: 'TransitiveTransfer';
  from: Scalars['String'];
  isHubTransfer?: Maybe<Scalars['Boolean']>;
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
  avatarMimeType?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  circlesAddress?: InputMaybe<Scalars['String']>;
  cityGeonameid?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  displayCurrency?: InputMaybe<DisplayCurrency>;
  id?: InputMaybe<Scalars['Int']>;
  largeBannerUrl?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  productListingType?: InputMaybe<ProductListingType>;
  smallBannerUrl?: InputMaybe<Scalars['String']>;
};

export type UpsertProfileInput = {
  age?: InputMaybe<Scalars['Int']>;
  askedForEmailAddress?: InputMaybe<Scalars['Boolean']>;
  avatarCid?: InputMaybe<Scalars['String']>;
  avatarMimeType?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  circlesAddress?: InputMaybe<Scalars['String']>;
  circlesSafeOwner?: InputMaybe<Scalars['String']>;
  circlesTokenAddress?: InputMaybe<Scalars['String']>;
  cityGeonameid?: InputMaybe<Scalars['Int']>;
  country?: InputMaybe<Scalars['String']>;
  displayCurrency?: InputMaybe<DisplayCurrency>;
  displayTimeCircles?: InputMaybe<Scalars['Boolean']>;
  dream?: InputMaybe<Scalars['String']>;
  emailAddress?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender?: InputMaybe<Gender>;
  id?: InputMaybe<Scalars['Int']>;
  lastName?: InputMaybe<Scalars['String']>;
  newsletter?: InputMaybe<Scalars['Boolean']>;
  status: Scalars['String'];
  successorOfCirclesAddress?: InputMaybe<Scalars['String']>;
};

export type UpsertShopCategoriesResult = {
  __typename?: 'UpsertShopCategoriesResult';
  inserted: Scalars['Int'];
  updated: Scalars['Int'];
};

export type UpsertShopCategoryEntriesResult = {
  __typename?: 'UpsertShopCategoryEntriesResult';
  inserted: Scalars['Int'];
  updated: Scalars['Int'];
};

export type UpsertTagInput = {
  id?: InputMaybe<Scalars['Int']>;
  typeId: Scalars['String'];
  value?: InputMaybe<Scalars['String']>;
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
  addresses?: InputMaybe<Array<Scalars['String']>>;
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

export type I18n = {
  __typename?: 'i18n';
  createdBy?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type UpsertShippingAddressMutationVariables = Exact<{
  data: PostAddressInput;
}>;


export type UpsertShippingAddressMutation = { __typename?: 'Mutation', upsertShippingAddress?: { __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, cityGeonameid?: number | null, city: string, state?: string | null, country: string } | null };

export type CreatePurchaseMutationVariables = Exact<{
  lines: Array<PurchaseLineInput> | PurchaseLineInput;
  deliveryMethodId: Scalars['Int'];
  deliveryAddressId?: InputMaybe<Scalars['Int']>;
}>;


export type CreatePurchaseMutation = { __typename?: 'Mutation', purchase: Array<{ __typename?: 'Invoice', id: number, buyerAddress: string, sellerAddress: string, purchaseId: number, buyerProfile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null } | null, sellerProfile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null } | null, lines?: Array<{ __typename?: 'InvoiceLine', id: number, amount: number, offer?: { __typename?: 'Offer', id: number, version: number, createdByAddress: string, pricePerUnit: string, title: string, description?: string | null, createdByProfile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null } | null } | null }> | null }> };

export type RequestSessionChallengeMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type RequestSessionChallengeMutation = { __typename?: 'Mutation', requestSessionChallenge: string };

export type VerifySessionChallengeMutationVariables = Exact<{
  challenge: Scalars['String'];
  signature: Scalars['String'];
}>;


export type VerifySessionChallengeMutation = { __typename?: 'Mutation', verifySessionChallenge?: { __typename?: 'ExchangeTokenResponse', success: boolean, errorMessage?: string | null } | null };

export type AddNewLangMutationVariables = Exact<{
  langToCreate?: InputMaybe<Scalars['String']>;
  langToCopyFrom?: InputMaybe<Scalars['String']>;
}>;


export type AddNewLangMutation = { __typename?: 'Mutation', addNewLang?: number | null };

export type UpdateValueMutationVariables = Exact<{
  lang?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
}>;


export type UpdateValueMutation = { __typename?: 'Mutation', updateValue?: { __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, value?: string | null, version?: number | null } | null };

export type CreateNewStringAndKeyMutationVariables = Exact<{
  lang?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  createdBy?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['String']>;
}>;


export type CreateNewStringAndKeyMutation = { __typename?: 'Mutation', createNewStringAndKey?: { __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, version?: number | null, value?: string | null } | null };

export type ClaimInvitationMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type ClaimInvitationMutation = { __typename?: 'Mutation', claimInvitation: { __typename?: 'ClaimInvitationResult', success: boolean, claimedInvitation?: { __typename?: 'ClaimedInvitation', createdAt: string, createdByProfileId: number, claimedAt: string, claimedByProfileId: number } | null } };

export type AcknowledgeMutationVariables = Exact<{
  until: Scalars['Date'];
  safeAddress?: InputMaybe<Scalars['String']>;
}>;


export type AcknowledgeMutation = { __typename?: 'Mutation', acknowledge: boolean };

export type SendMessageMutationVariables = Exact<{
  fromSafeAddress?: InputMaybe<Scalars['String']>;
  toSafeAddress: Scalars['String'];
  content: Scalars['String'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'SendMessageResult', success: boolean, error?: string | null, event?: { __typename?: 'ProfileEvent', block_number?: number | null, direction: string, safe_address: string, timestamp: string, transaction_hash?: string | null, transaction_index?: number | null, type: string, value?: string | null, safe_address_profile?: { __typename?: 'Profile', id: number, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null } | null, tags?: Array<{ __typename?: 'Tag', id: number, typeId: string, value?: string | null }> | null, payload?: { __typename?: 'ChatMessage', id: number, from: string, to: string, text: string, from_profile?: { __typename?: 'Profile', id: number, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null } | null, to_profile?: { __typename?: 'Profile', id: number, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null } | null } | { __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | { __typename?: 'CrcSignup' } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust' } | { __typename?: 'Erc20Transfer' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'MemberAdded' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipRejected' } | { __typename?: 'NewUser' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'Purchased' } | { __typename?: 'SafeVerified' } | { __typename?: 'SaleEvent' } | { __typename?: 'WelcomeMessage' } | null } | null } };

export type AddMemberMutationVariables = Exact<{
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
}>;


export type AddMemberMutation = { __typename?: 'Mutation', addMember?: { __typename?: 'AddMemberResult', error?: string | null, success: boolean } | null };

export type RemoveMemberMutationVariables = Exact<{
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
}>;


export type RemoveMemberMutation = { __typename?: 'Mutation', removeMember?: { __typename?: 'RemoveMemberResult', error?: string | null, success: boolean } | null };

export type RedeemClaimedInvitationMutationVariables = Exact<{ [key: string]: never; }>;


export type RedeemClaimedInvitationMutation = { __typename?: 'Mutation', redeemClaimedInvitation: { __typename?: 'RedeemClaimedInvitationResult', success: boolean, error?: string | null, transactionHash?: string | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', success: boolean } };

export type TagTransactionMutationVariables = Exact<{
  transactionHash: Scalars['String'];
  tag: CreateTagInput;
}>;


export type TagTransactionMutation = { __typename?: 'Mutation', tagTransaction: { __typename?: 'TagTransactionResult', success: boolean, error?: string | null, tag?: { __typename?: 'Tag', id: number, typeId: string, value?: string | null } | null } };

export type UpsertProfileMutationVariables = Exact<{
  id?: InputMaybe<Scalars['Int']>;
  firstName: Scalars['String'];
  lastName?: InputMaybe<Scalars['String']>;
  emailAddress?: InputMaybe<Scalars['String']>;
  askedForEmailAddress: Scalars['Boolean'];
  dream?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  avatarCid?: InputMaybe<Scalars['String']>;
  avatarMimeType?: InputMaybe<Scalars['String']>;
  circlesAddress?: InputMaybe<Scalars['String']>;
  circlesSafeOwner?: InputMaybe<Scalars['String']>;
  newsletter?: InputMaybe<Scalars['Boolean']>;
  displayCurrency?: InputMaybe<DisplayCurrency>;
  displayTimeCircles?: InputMaybe<Scalars['Boolean']>;
  cityGeonameid?: InputMaybe<Scalars['Int']>;
  status: Scalars['String'];
  successorOfCirclesAddress?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  age?: InputMaybe<Scalars['Int']>;
}>;


export type UpsertProfileMutation = { __typename?: 'Mutation', upsertProfile: { __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, circlesSafeOwner?: string | null, invitationLink?: string | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, emailAddress?: string | null, askedForEmailAddress: boolean, dream?: string | null, country?: string | null, avatarUrl?: string | null, avatarCid?: string | null, avatarMimeType?: string | null, newsletter?: boolean | null, displayTimeCircles?: boolean | null, cityGeonameid?: number | null, age?: number | null, gender?: Gender | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string, latitude: number, longitude: number, population: number } | null, memberships?: Array<{ __typename?: 'Membership', isAdmin: boolean, organisation: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null } }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null } };

export type UpsertOrganisationMutationVariables = Exact<{
  organisation: UpsertOrganisationInput;
}>;


export type UpsertOrganisationMutation = { __typename?: 'Mutation', upsertOrganisation: { __typename?: 'CreateOrganisationResult', success: boolean, error?: string | null, organisation?: { __typename?: 'Organisation', id: number, avatarMimeType?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, circlesSafeOwner?: string | null, cityGeonameid?: number | null, createdAt: string, description?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, country: string, name: string, latitude: number, longitude: number, population: number, feature_code: string } | null } | null } };

export type UpsertRegionMutationVariables = Exact<{
  organisation: UpsertOrganisationInput;
}>;


export type UpsertRegionMutation = { __typename?: 'Mutation', upsertRegion: { __typename?: 'CreateOrganisationResult', success: boolean, error?: string | null, organisation?: { __typename?: 'Organisation', id: number, avatarMimeType?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, circlesSafeOwner?: string | null, cityGeonameid?: number | null, createdAt: string, description?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, country: string, name: string, latitude: number, longitude: number, population: number, feature_code: string } | null } | null } };

export type ImportOrganisationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ImportOrganisationsMutation = { __typename?: 'Mutation', importOrganisationsOfAccount: Array<{ __typename?: 'Organisation', id: number, circlesAddress?: string | null, name: string, description?: string | null, avatarUrl?: string | null }> };

export type CompletePurchaseMutationVariables = Exact<{
  invoiceId: Scalars['Int'];
  revoke?: InputMaybe<Scalars['Boolean']>;
}>;


export type CompletePurchaseMutation = { __typename?: 'Mutation', completePurchase: { __typename?: 'Invoice', id: number, sellerAddress: string, paymentTransactionHash?: string | null, buyerAddress: string, pickupCode?: string | null, buyerSignature?: boolean | null, buyerSignedDate?: string | null, sellerSignature?: boolean | null, sellerSignedDate?: string | null, purchase?: { __typename?: 'Purchase', id: number } | null, sellerProfile?: { __typename?: 'Profile', type?: ProfileType | null, id: number, circlesAddress?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null } | null } };

export type CompleteSaleMutationVariables = Exact<{
  invoiceId: Scalars['Int'];
  revoke?: InputMaybe<Scalars['Boolean']>;
}>;


export type CompleteSaleMutation = { __typename?: 'Mutation', completeSale: { __typename?: 'Invoice', id: number, sellerAddress: string, paymentTransactionHash?: string | null, buyerAddress: string, pickupCode?: string | null, buyerSignature?: boolean | null, buyerSignedDate?: string | null, sellerSignature?: boolean | null, sellerSignedDate?: string | null, sellerProfile?: { __typename?: 'Profile', type?: ProfileType | null, id: number, circlesAddress?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null } | null } };

export type VerifySafeMutationVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type VerifySafeMutation = { __typename?: 'Mutation', verifySafe: { __typename?: 'VerifySafeResult', success: boolean } };

export type RevokeSafeVerificationMutationVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type RevokeSafeVerificationMutation = { __typename?: 'Mutation', revokeSafeVerification: { __typename?: 'VerifySafeResult', success: boolean } };

export type AnnouncePaymentMutationVariables = Exact<{
  invoiceId: Scalars['Int'];
  transactionHash: Scalars['String'];
}>;


export type AnnouncePaymentMutation = { __typename?: 'Mutation', announcePayment: { __typename?: 'AnnouncePaymentResult', transactionHash: string, invoiceId: number, pickupCode: string, simplePickupCode?: string | null } };

export type UpsertShopMutationVariables = Exact<{
  shop: ShopInput;
}>;


export type UpsertShopMutation = { __typename?: 'Mutation', upsertShop: { __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, adultOnly?: boolean | null, private?: boolean | null, productListingStyle: ProductListingType, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, categories?: Array<{ __typename?: 'ShopCategory', id: number, name: string, description?: string | null, sortOrder?: number | null, enabled?: boolean | null, private?: boolean | null, largeBannerUrl?: string | null, smallBannerUrl?: string | null, productListingStyle?: ProductListingType | null, createdAt?: any | null, entries?: Array<{ __typename?: 'ShopCategoryEntry', id: number, sortOrder?: number | null, product?: { __typename?: 'Offer', id: number, version: number, title: string, description?: string | null, currentInventory?: number | null, pictureUrl: string, pricePerUnit: string, createdByProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null } | null } | null }> | null }> | null } };

export type UpsertShopCategoriesMutationVariables = Exact<{
  shopCategories: Array<ShopCategoryInput> | ShopCategoryInput;
}>;


export type UpsertShopCategoriesMutation = { __typename?: 'Mutation', upsertShopCategories: { __typename?: 'UpsertShopCategoriesResult', inserted: number, updated: number } };

export type UpsertShopCategoryEntriesMutationVariables = Exact<{
  shopCategoryEntries: Array<ShopCategoryEntryInput> | ShopCategoryEntryInput;
}>;


export type UpsertShopCategoryEntriesMutation = { __typename?: 'Mutation', upsertShopCategoryEntries: { __typename?: 'UpsertShopCategoryEntriesResult', inserted: number, updated: number } };

export type ConfirmLegalAgeMutationVariables = Exact<{
  age: Scalars['Int'];
}>;


export type ConfirmLegalAgeMutation = { __typename?: 'Mutation', confirmLegalAge: boolean };

export type UpsertOfferMutationVariables = Exact<{
  offer: OfferInput;
}>;


export type UpsertOfferMutation = { __typename?: 'Mutation', upsertOffer: { __typename?: 'Offer', id: number, version: number, createdAt: string, createdByAddress: string, title: string, description?: string | null, pictureUrl: string, pricePerUnit: string, minAge?: number | null, currentInventory?: number | null, timeCirclesPriceShare: number, tags?: Array<{ __typename?: 'Tag', typeId: string, value?: string | null }> | null } };

export type ProofUniquenessMutationVariables = Exact<{
  humanodeToken: Scalars['String'];
}>;


export type ProofUniquenessMutation = { __typename?: 'Mutation', proofUniqueness: { __typename?: 'ProofUniquenessResult', existingSafe?: string | null } };

export type InitQueryVariables = Exact<{ [key: string]: never; }>;


export type InitQuery = { __typename?: 'Query', init: { __typename?: 'SessionInfo', isLoggedOn: boolean, hasProfile?: boolean | null, profileId?: number | null, useShortSignup?: boolean | null, capabilities: Array<{ __typename?: 'Capability', type?: CapabilityType | null }>, profile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, confirmedLegalAge?: number | null, circlesSafeOwner?: string | null, invitationLink?: string | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, emailAddress?: string | null, askedForEmailAddress: boolean, dream?: string | null, country?: string | null, avatarUrl?: string | null, avatarCid?: string | null, avatarMimeType?: string | null, newsletter?: boolean | null, displayTimeCircles?: boolean | null, cityGeonameid?: number | null, provenUniqueness?: boolean | null, circlesTokenAddress?: string | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string, cityGeonameid?: number | null }> | null, shops?: Array<{ __typename?: 'Shop', id: number }> | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, memberships?: Array<{ __typename?: 'Membership', isAdmin: boolean, organisation: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null } }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null, claimedInvitation?: { __typename?: 'ClaimedInvitation', claimedAt: string } | null, invitationTransaction?: { __typename?: 'ProfileEvent', timestamp: string, transaction_hash?: string | null } | null } | null } };

export type DeliveryMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type DeliveryMethodsQuery = { __typename?: 'Query', deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string } | null> | null };

export type LastAcknowledgedAtQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type LastAcknowledgedAtQuery = { __typename?: 'Query', lastAcknowledgedAt?: any | null };

export type SessionInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionInfoQuery = { __typename?: 'Query', sessionInfo: { __typename?: 'SessionInfo', isLoggedOn: boolean, hasProfile?: boolean | null, profileId?: number | null, useShortSignup?: boolean | null, capabilities: Array<{ __typename?: 'Capability', type?: CapabilityType | null }> } };

export type ClaimedInvitationQueryVariables = Exact<{ [key: string]: never; }>;


export type ClaimedInvitationQuery = { __typename?: 'Query', claimedInvitation?: { __typename?: 'ClaimedInvitation', createdAt: string, createdByProfileId: number, claimedAt: string, claimedByProfileId: number } | null };

export type InvitationTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitationTransactionQuery = { __typename?: 'Query', invitationTransaction?: { __typename?: 'ProfileEvent', transaction_hash?: string | null } | null };

export type HubSignupTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type HubSignupTransactionQuery = { __typename?: 'Query', hubSignupTransaction?: { __typename?: 'ProfileEvent', transaction_hash?: string | null, payload?: { __typename?: 'ChatMessage' } | { __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | { __typename?: 'CrcSignup', token: string } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust' } | { __typename?: 'Erc20Transfer' } | { __typename?: 'EthTransfer' } | { __typename?: 'GnosisSafeEthTransfer' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'MemberAdded' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipRejected' } | { __typename?: 'NewUser' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'Purchased' } | { __typename?: 'SafeVerified' } | { __typename?: 'SaleEvent' } | { __typename?: 'WelcomeMessage' } | null } | null };

export type SafeInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SafeInfoQuery = { __typename?: 'Query', safeInfo?: { __typename?: 'SafeInfo', lastUbiAt?: string | null, safeAddress: string, tokenAddress?: string | null, randomValue?: string | null } | null };

export type StatsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatsQuery = { __typename?: 'Query', stats: { __typename?: 'Stats', profilesCount: number, verificationsCount: number, goals: { __typename?: 'FibonacciGoals', lastGoal: number, currentValue: number, nextGoal: number }, myRank: { __typename?: 'MyInviteRank', rank: number, redeemedInvitationsCount: number }, leaderboard: Array<{ __typename?: 'LeaderboardEntry', createdByCirclesAddress: string, inviteCount: number, createdByProfile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, circlesSafeOwner?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string, latitude: number, longitude: number, population: number } | null } | null }> } };

export type FindSafesByOwnerQueryVariables = Exact<{
  owner: Scalars['String'];
}>;


export type FindSafesByOwnerQuery = { __typename?: 'Query', findSafesByOwner: Array<{ __typename?: 'SafeInfo', type: AccountType, safeAddress: string, lastUbiAt?: string | null, randomValue?: string | null, tokenAddress?: string | null, safeProfile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, circlesSafeOwner?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string, latitude: number, longitude: number, population: number } | null } | null }> };

export type MyInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyInvitationsQuery = { __typename?: 'Query', myInvitations: Array<{ __typename?: 'CreatedInvitation', createdAt: string, claimedAt?: string | null, name: string, address: string, balance: string, code: string, claimedBy?: { __typename?: 'Profile', circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, circlesSafeOwner?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null } | null }> };

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = { __typename?: 'Query', myProfile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, circlesSafeOwner?: string | null, invitationLink?: string | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, emailAddress?: string | null, askedForEmailAddress: boolean, dream?: string | null, country?: string | null, avatarUrl?: string | null, avatarCid?: string | null, avatarMimeType?: string | null, newsletter?: boolean | null, displayTimeCircles?: boolean | null, cityGeonameid?: number | null, provenUniqueness?: boolean | null, shops?: Array<{ __typename?: 'Shop', id: number }> | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string, latitude: number, longitude: number, population: number } | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string }> | null, memberships?: Array<{ __typename?: 'Membership', isAdmin: boolean, organisation: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, shops?: Array<{ __typename?: 'Shop', id: number }> | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null } }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null } | null };

export type ProfilesQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesQuery = { __typename?: 'Query', profilesById: Array<{ __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, circlesSafeOwner?: string | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, avatarUrl?: string | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string }> | null, memberships?: Array<{ __typename?: 'Membership', isAdmin: boolean, organisation: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null } }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, displayName?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null }> };

export type CitiesByNameQueryVariables = Exact<{
  name: Scalars['String'];
  languageCode?: InputMaybe<Scalars['String']>;
}>;


export type CitiesByNameQuery = { __typename?: 'Query', cities: Array<{ __typename?: 'City', geonameid: number, name: string, country: string, population: number, latitude: number, longitude: number, feature_code: string }> };

export type CitiesByIdQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CitiesByIdQuery = { __typename?: 'Query', cities: Array<{ __typename?: 'City', geonameid: number, name: string, country: string, population: number, latitude: number, longitude: number, feature_code: string }> };

export type ProfilesByNameQueryVariables = Exact<{
  searchString: Scalars['String'];
}>;


export type ProfilesByNameQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Profile', id: number, origin?: ProfileOrigin | null, circlesSafeOwner?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, successorOfCirclesAddress?: string | null, avatarUrl?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, country?: string | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, displayName?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null }> };

export type GetRecentProfilesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationArgs>;
}>;


export type GetRecentProfilesQuery = { __typename?: 'Query', recentProfiles: Array<{ __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, origin?: ProfileOrigin | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, country?: string | null, avatarUrl?: string | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, displayName?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null }> };

export type ProfilesByCirclesAddressQueryVariables = Exact<{
  circlesAddresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type ProfilesByCirclesAddressQuery = { __typename?: 'Query', profilesBySafeAddress: Array<{ __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, origin?: ProfileOrigin | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, avatarUrl?: string | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string }> | null, memberships?: Array<{ __typename?: 'Membership', isAdmin: boolean, organisation: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null } }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, displayName?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null }> };

export type ProfilesByIdsQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesByIdsQuery = { __typename?: 'Query', profilesById: Array<{ __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, origin?: ProfileOrigin | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, avatarUrl?: string | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, displayName?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null }> };

export type TrustRelationsQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type TrustRelationsQuery = { __typename?: 'Query', trustRelations: Array<{ __typename?: 'TrustRelation', safeAddress: string, direction: TrustDirection, otherSafeAddress: string, safeAddressProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, origin?: ProfileOrigin | null, avatarUrl?: string | null, successorOfCirclesAddress?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, otherSafeAddressProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, successorOfCirclesAddress?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null } | null }> };

export type ProfileByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProfileByIdQuery = { __typename?: 'Query', profilesById: Array<{ __typename?: 'Profile', id: number, successorOfCirclesAddress?: string | null, circlesSafeOwner?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string } | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, displayName?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null }> };

export type ProfileBySafeAddressQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type ProfileBySafeAddressQuery = { __typename?: 'Query', profilesBySafeAddress: Array<{ __typename?: 'Profile', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, circlesSafeOwner?: string | null, invitationLink?: string | null, successorOfCirclesAddress?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, emailAddress?: string | null, askedForEmailAddress: boolean, dream?: string | null, country?: string | null, avatarUrl?: string | null, avatarCid?: string | null, avatarMimeType?: string | null, newsletter?: boolean | null, displayTimeCircles?: boolean | null, cityGeonameid?: number | null, provenUniqueness?: boolean | null, circlesTokenAddress?: string | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string, cityGeonameid?: number | null }> | null, shops?: Array<{ __typename?: 'Shop', id: number }> | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, memberships?: Array<{ __typename?: 'Membership', isAdmin: boolean, organisation: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null } }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null, claimedInvitation?: { __typename?: 'ClaimedInvitation', claimedAt: string } | null, invitationTransaction?: { __typename?: 'ProfileEvent', timestamp: string, transaction_hash?: string | null } | null }> };

export type TagsQueryVariables = Exact<{
  typeId_in: Array<Scalars['String']> | Scalars['String'];
  value_like?: InputMaybe<Scalars['String']>;
}>;


export type TagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', typeId: string, id: number, value?: string | null, order?: number | null }> };

export type OrganisationsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationArgs>;
}>;


export type OrganisationsQuery = { __typename?: 'Query', organisations: Array<{ __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, createdAt: string, name: string, avatarUrl?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, shops?: Array<{ __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, largeBannerUrl: string, smallBannerUrl: string }> | null }> };

export type RegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type RegionsQuery = { __typename?: 'Query', regions: Array<{ __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, createdAt: string, name: string, avatarUrl?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null }> };

export type OrganisationsByAddressQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type OrganisationsByAddressQuery = { __typename?: 'Query', organisationsByAddress: Array<{ __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, createdAt: string, name: string, avatarUrl?: string | null, displayName?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, shops?: Array<{ __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string }> | null, members?: Array<{ __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, createdAt: string, name: string, displayName?: string | null, avatarUrl?: string | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | { __typename?: 'Profile', id: number, successorOfCirclesAddress?: string | null, circlesSafeOwner?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string } | null, shippingAddresses?: Array<{ __typename?: 'PostAddress', id: number, name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null }> | null }> };

export type CommonTrustQueryVariables = Exact<{
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
}>;


export type CommonTrustQuery = { __typename?: 'Query', commonTrust: Array<{ __typename?: 'CommonTrust', type: string, safeAddress1: string, safeAddress2: string, profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, successorOfCirclesAddress?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null }> };

export type TagByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type TagByIdQuery = { __typename?: 'Query', tagById?: { __typename?: 'Tag', id: number, typeId: string, value?: string | null } | null };

export type StreamQueryVariables = Exact<{
  types: Array<EventType> | EventType;
  safeAddress: Scalars['String'];
  pagination: PaginationArgs;
  filter?: InputMaybe<ProfileEventFilter>;
}>;


export type StreamQuery = { __typename?: 'Query', events: Array<{ __typename?: 'ProfileEvent', timestamp: string, transaction_hash?: string | null, block_number?: number | null, safe_address: string, contact_address?: string | null, direction: string, type: string, contact_address_profile?: { __typename?: 'Profile', type?: ProfileType | null, successorOfCirclesAddress?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, provenUniqueness?: boolean | null } | null, payload?: { __typename?: 'ChatMessage', id: number, from: string, to: string, text: string, from_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, to_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null } | { __typename?: 'CrcHubTransfer', transaction_hash: string, from: string, to: string, flow: string, from_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, to_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, transfers: Array<{ __typename?: 'CrcTokenTransfer', token: string, from: string, to: string, value: string, from_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, to_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null }>, tags: Array<{ __typename?: 'Tag', id: number, typeId: string, value?: string | null }> } | { __typename?: 'CrcMinting', transaction_hash: string, token: string, from: string, to: string, value: string, from_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, to_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null } | { __typename?: 'CrcSignup', transaction_hash: string, user: string, token: string } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcTrust', transaction_hash: string, address: string, can_send_to: string, limit: number, can_send_to_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null } | { __typename?: 'Erc20Transfer', transaction_hash: string, from: string, to: string, value: string, from_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, to_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null } | { __typename?: 'EthTransfer', transaction_hash: string, from: string, to: string, value: string } | { __typename?: 'GnosisSafeEthTransfer', transaction_hash: string, initiator: string, from: string, to: string, value: string } | { __typename?: 'InvitationCreated', name: string, code: string } | { __typename?: 'InvitationRedeemed', name: string, code: string, redeemedBy?: string | null, redeemedBy_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null } | { __typename?: 'MemberAdded', createdBy: string, isAdmin: boolean, member: string, organisation: string, organisation_profile?: { __typename?: 'Organisation', name: string, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null } | null } | { __typename?: 'MembershipAccepted', createdBy: string, member: string, organisation: string, member_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, organisation_profile?: { __typename?: 'Organisation', name: string, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null } | null } | { __typename?: 'MembershipOffer', createdBy: string, organisation: string, isAdmin: boolean, createdBy_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, organisation_profile?: { __typename?: 'Organisation', name: string, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null } | null } | { __typename?: 'MembershipRejected', member: string, organisation: string, member_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, organisation_profile?: { __typename?: 'Organisation', name: string, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null } | null } | { __typename?: 'NewUser', profile: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, dream?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } } | { __typename?: 'OrganisationCreated', organisation: string, organisation_profile?: { __typename?: 'Organisation', name: string, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null } | null } | { __typename?: 'Purchased', seller_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, purchase: { __typename?: 'Purchase', id: number, createdAt: string, createdByAddress: string, total: string, deliveryMethod: { __typename?: 'DeliveryMethod', id: number, name: string }, deliveryAddress?: { __typename?: 'PostAddress', name?: string | null, id: number, street: string, house: string, zip: string, city: string, state?: string | null, country: string, cityGeonameid?: number | null } | null, lines?: Array<{ __typename?: 'PurchaseLine', id: number, amount: number, metadata?: string | null, shop?: { __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, private?: boolean | null, enabled?: boolean | null, productListingStyle: ProductListingType, shopListingStyle: ShopListingStyle, purchaseMetaDataKeys?: string | null, tosLink?: string | null, privacyPolicyLink?: string | null, healthInfosLink?: string | null, adultOnly?: boolean | null, ownerId?: number | null, pickupAddress?: { __typename?: 'PostAddress', name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string } | null, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string }> | null } | null, offer?: { __typename?: 'Offer', id: number, pictureUrl: string, title: string, description?: string | null, pricePerUnit: string, minAge?: number | null, tags?: Array<{ __typename?: 'Tag', typeId: string, value?: string | null }> | null } | null }> | null, invoices?: Array<{ __typename?: 'Invoice', id: number, pickupCode?: string | null, simplePickupCode?: string | null, paymentTransactionHash?: string | null, createdAt?: string | null, cancelledAt?: string | null, invoiceNo: string, sellerSignature?: boolean | null, buyerSignature?: boolean | null, deliveryMethod: { __typename?: 'DeliveryMethod', id: number, name: string }, buyerProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, sellerProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null }> | null } } | { __typename?: 'SafeVerified', safe_address: string, organisation_profile?: { __typename?: 'Organisation', name: string, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null } | null } | { __typename?: 'SaleEvent', buyer: string, buyer_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, invoice?: { __typename?: 'Invoice', id: number, buyerSignature?: boolean | null, buyerSignedDate?: string | null, sellerSignature?: boolean | null, sellerSignedDate?: string | null, createdAt?: string | null, cancelledAt?: string | null, cancelReason?: string | null, simplePickupCode?: string | null, paymentTransactionHash?: string | null, deliveryMethod: { __typename?: 'DeliveryMethod', id: number, name: string }, deliveryAddress?: { __typename?: 'PostAddress', name?: string | null, id: number, street: string, house: string, zip: string, city: string, state?: string | null, country: string, cityGeonameid?: number | null } | null, lines?: Array<{ __typename?: 'InvoiceLine', amount: number, metadata?: string | null, shop?: { __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, private?: boolean | null, enabled?: boolean | null, productListingStyle: ProductListingType, shopListingStyle: ShopListingStyle, purchaseMetaDataKeys?: string | null, tosLink?: string | null, privacyPolicyLink?: string | null, healthInfosLink?: string | null, adultOnly?: boolean | null, ownerId?: number | null, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string }> | null } | null, offer?: { __typename?: 'Offer', id: number, title: string, pictureUrl: string, pricePerUnit: string, minAge?: number | null, tags?: Array<{ __typename?: 'Tag', typeId: string, value?: string | null }> | null } | null }> | null } | null } | { __typename?: 'WelcomeMessage', invitedBy: string, invitedBy_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null } | null }> };

export type AggregatesQueryVariables = Exact<{
  types: Array<AggregateType> | AggregateType;
  safeAddress: Scalars['String'];
  filter?: InputMaybe<ProfileAggregateFilter>;
}>;


export type AggregatesQuery = { __typename?: 'Query', aggregates: Array<{ __typename?: 'ProfileAggregate', type: string, safe_address: string, safe_address_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, payload: { __typename?: 'Contacts', lastUpdatedAt: string, contacts: Array<{ __typename?: 'Contact', lastContactAt: string, contactAddress: string, metadata: Array<{ __typename?: 'ContactPoint', name: string, directions: Array<ContactDirection>, values: Array<string>, timestamps: Array<string> }>, contactAddress_Profile?: { __typename?: 'Profile', type?: ProfileType | null, id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null, memberships?: Array<{ __typename?: 'Membership', isAdmin: boolean, organisation: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null } }> | null, members?: Array<{ __typename?: 'Profile', type?: ProfileType | null, id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null }> | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null } | null }> } | { __typename?: 'CrcBalances', lastUpdatedAt: string, balances: Array<{ __typename?: 'AssetBalance', token_address: string, token_owner_address: string, token_balance: string, token_owner_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null }> } | { __typename?: 'Erc20Balances', lastUpdatedAt: string, balances: Array<{ __typename?: 'AssetBalance', token_address: string, token_owner_address: string, token_balance: string, token_owner_profile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null }> } | { __typename?: 'Erc721Tokens', lastUpdatedAt: string, balances: Array<{ __typename?: 'Erc721Token', token_no: string, token_symbol?: string | null, token_name?: string | null, token_address: string, token_url: string, token_owner_profile?: { __typename?: 'Profile', id: number, circlesAddress?: string | null, displayName?: string | null, avatarUrl?: string | null, firstName: string, lastName?: string | null, provenUniqueness?: boolean | null } | null }> } | { __typename?: 'Members', lastUpdatedAt: string, members: Array<{ __typename?: 'Organisation', circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null } | { __typename?: 'Profile', successorOfCirclesAddress?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null }> } | { __typename?: 'Memberships', lastUpdatedAt: string, organisations: Array<{ __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, circlesSafeOwner?: string | null, name: string, description?: string | null, avatarUrl?: string | null, cityGeonameid?: number | null, city?: { __typename?: 'City', geonameid: number, country: string, name: string, population: number } | null }> } | { __typename?: 'Offers', lastUpdatedAt: string, offers: Array<{ __typename?: 'Offer', id: number, version: number, createdByAddress: string, createdAt: string, title: string, minAge?: number | null, pictureUrl: string, pictureMimeType: string, description?: string | null, pricePerUnit: string, timeCirclesPriceShare: number, createdByProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, smallBannerUrl?: string | null, provenUniqueness?: boolean | null } | null, tags?: Array<{ __typename?: 'Tag', typeId: string, value?: string | null, order?: number | null }> | null }> } | { __typename?: 'Purchases', lastUpdatedAt: string, purchases: Array<{ __typename?: 'Purchase', id: number, createdAt: string, createdByAddress: string, total: string, createdByProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, deliveryMethod: { __typename?: 'DeliveryMethod', id: number, name: string }, lines?: Array<{ __typename?: 'PurchaseLine', id: number, amount: number, metadata?: string | null, shop?: { __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, private?: boolean | null, enabled?: boolean | null, productListingStyle: ProductListingType, shopListingStyle: ShopListingStyle, purchaseMetaDataKeys?: string | null, tosLink?: string | null, privacyPolicyLink?: string | null, healthInfosLink?: string | null, adultOnly?: boolean | null, ownerId?: number | null, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string }> | null } | null, offer?: { __typename?: 'Offer', id: number, version: number, title: string, description?: string | null, pictureUrl: string, pricePerUnit: string, minAge?: number | null, timeCirclesPriceShare: number, createdByProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, tags?: Array<{ __typename?: 'Tag', typeId: string, value?: string | null }> | null } | null }> | null, invoices?: Array<{ __typename?: 'Invoice', id: number, sellerAddress: string, paymentTransactionHash?: string | null, buyerAddress: string, pickupCode?: string | null, simplePickupCode?: string | null, buyerSignature?: boolean | null, buyerSignedDate?: string | null, sellerSignature?: boolean | null, sellerSignedDate?: string | null, createdAt?: string | null, cancelledAt?: string | null, cancelReason?: string | null, deliveryMethod: { __typename?: 'DeliveryMethod', id: number, name: string }, sellerProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null }> | null }> } | { __typename?: 'Sales', lastUpdatedAt: string, sales: Array<{ __typename?: 'Sale', id: number, createdAt: string, total: string, sellerProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, buyerProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null } | null, lines?: Array<{ __typename?: 'SalesLine', id: number, amount: number, metadata?: string | null, shop?: { __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, private?: boolean | null, enabled?: boolean | null, productListingStyle: ProductListingType, shopListingStyle: ShopListingStyle, purchaseMetaDataKeys?: string | null, tosLink?: string | null, privacyPolicyLink?: string | null, healthInfosLink?: string | null, adultOnly?: boolean | null, ownerId?: number | null, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string }> | null } | null, offer: { __typename?: 'Offer', id: number, version: number, title: string, description?: string | null, pictureUrl: string, pricePerUnit: string, minAge?: number | null, timeCirclesPriceShare: number, createdByProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null, tags?: Array<{ __typename?: 'Tag', typeId: string, value?: string | null }> | null } }> | null, invoices?: Array<{ __typename?: 'Invoice', id: number, sellerAddress: string, paymentTransactionHash?: string | null, buyerAddress: string, pickupCode?: string | null, simplePickupCode?: string | null, buyerSignature?: boolean | null, buyerSignedDate?: string | null, sellerSignature?: boolean | null, sellerSignedDate?: string | null, createdAt?: string | null, cancelledAt?: string | null, cancelReason?: string | null, deliveryMethod: { __typename?: 'DeliveryMethod', id: number, name: string }, deliveryAddress?: { __typename?: 'PostAddress', name?: string | null, id: number, street: string, house: string, zip: string, city: string, state?: string | null, country: string, cityGeonameid?: number | null } | null, buyerProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null, verifications?: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null }> | null } | null }> | null }> } }> };

export type GetAllStringsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStringsQuery = { __typename?: 'Query', getAllStrings?: Array<{ __typename?: 'i18n', lang?: string | null, key?: string | null, version?: number | null, value?: string | null } | null> | null };

export type GetAllStringsByLanguageQueryVariables = Exact<{
  lang?: InputMaybe<Scalars['String']>;
}>;


export type GetAllStringsByLanguageQuery = { __typename?: 'Query', getAllStringsByLanguage?: Array<{ __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, version?: number | null, value?: string | null } | null> | null };

export type GetAllStringsByMaxVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStringsByMaxVersionQuery = { __typename?: 'Query', getAllStringsByMaxVersion?: Array<{ __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, version?: number | null, value?: string | null } | null> | null };

export type GetAllStringsByMaxVersionAndLangQueryVariables = Exact<{
  lang?: InputMaybe<Scalars['String']>;
}>;


export type GetAllStringsByMaxVersionAndLangQuery = { __typename?: 'Query', getAllStringsByMaxVersionAndLang?: Array<{ __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, version?: number | null, value?: string | null } | null> | null };

export type GetStringByMaxVersionQueryVariables = Exact<{
  lang?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
}>;


export type GetStringByMaxVersionQuery = { __typename?: 'Query', getStringByMaxVersion?: { __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, version?: number | null, value?: string | null } | null };

export type GetOlderVersionsByKeyAndLangQueryVariables = Exact<{
  key?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
}>;


export type GetOlderVersionsByKeyAndLangQuery = { __typename?: 'Query', getOlderVersionsByKeyAndLang?: Array<{ __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, version?: number | null, value?: string | null } | null> | null };

export type GetStringByLanguageQueryVariables = Exact<{
  lang?: InputMaybe<Scalars['String']>;
}>;


export type GetStringByLanguageQuery = { __typename?: 'Query', getStringByLanguage?: Array<{ __typename?: 'i18n', lang?: string | null, key?: string | null, createdBy?: string | null, version?: number | null, value?: string | null }> | null };

export type GetAvailableLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableLanguagesQuery = { __typename?: 'Query', getAvailableLanguages?: Array<{ __typename?: 'i18n', lang?: string | null } | null> | null };

export type DirectPathQueryVariables = Exact<{
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
}>;


export type DirectPathQuery = { __typename?: 'Query', directPath: { __typename?: 'TransitivePath', flow: string, transfers: Array<{ __typename?: 'TransitiveTransfer', from: string, to: string, token: string, tokenOwner: string, value: string }> } };

export type InvoiceQueryVariables = Exact<{
  invoiceId: Scalars['Int'];
}>;


export type InvoiceQuery = { __typename?: 'Query', invoice?: string | null };

export type VerificationsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationArgs>;
  filter?: InputMaybe<VerifiedSafesFilter>;
}>;


export type VerificationsQuery = { __typename?: 'Query', verifications: Array<{ __typename?: 'Verification', createdAt: string, revokedAt?: string | null, verifierSafeAddress: string, verifiedSafeAddress: string, verifierProfile?: { __typename?: 'Organisation', id: number, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, avatarUrl?: string | null, name: string, city?: { __typename?: 'City', geonameid: number, name: string, country: string } | null } | null, verifiedProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, provenUniqueness?: boolean | null } | null }> };

export type FindInvitationCreatorQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type FindInvitationCreatorQuery = { __typename?: 'Query', findInvitationCreator?: { __typename?: 'Profile', circlesAddress?: string | null, displayCurrency?: DisplayCurrency | null, displayName?: string | null, firstName: string, lastName?: string | null, avatarUrl?: string | null } | null };

export type ShopQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ShopQuery = { __typename?: 'Query', shop?: { __typename?: 'Shop', id: number, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, private?: boolean | null, enabled?: boolean | null, productListingStyle: ProductListingType, shopListingStyle: ShopListingStyle, purchaseMetaDataKeys?: string | null, tosLink?: string | null, privacyPolicyLink?: string | null, healthInfosLink?: string | null, adultOnly?: boolean | null, ownerId?: number | null, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string }> | null, pickupAddress?: { __typename?: 'PostAddress', name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string } | null, categories?: Array<{ __typename?: 'ShopCategory', id: number, name: string, description?: string | null, sortOrder?: number | null, shopId: number, smallBannerUrl?: string | null, largeBannerUrl?: string | null, private?: boolean | null, enabled?: boolean | null, createdAt?: any | null, productListingStyle?: ProductListingType | null, entries?: Array<{ __typename?: 'ShopCategoryEntry', id: number, sortOrder?: number | null, private?: boolean | null, productId: number, productVersion: number, shopCategoryId: number, enabled?: boolean | null, product?: { __typename?: 'Offer', id: number, version: number, title: string, description?: string | null, pictureUrl: string, pricePerUnit: string, minAge?: number | null, currentInventory?: number | null, createdByProfile?: { __typename?: 'Profile', id: number, displayName?: string | null, avatarUrl?: string | null, circlesAddress?: string | null, provenUniqueness?: boolean | null } | null } | null }> | null }> | null } | null };

export type ShopsQueryVariables = Exact<{
  ownerId?: InputMaybe<Scalars['Int']>;
}>;


export type ShopsQuery = { __typename?: 'Query', shops: Array<{ __typename?: 'Shop', id: number, createdAt: any, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, private?: boolean | null, enabled?: boolean | null, shopListingStyle: ShopListingStyle, productListingStyle: ProductListingType, sortOrder?: number | null, ownerId?: number | null, adultOnly?: boolean | null, tosLink?: string | null, privacyPolicyLink?: string | null, healthInfosLink?: string | null, deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string }> | null, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, pickupAddress?: { __typename?: 'PostAddress', name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string } | null }> };

export type ShopsByIdQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ShopsByIdQuery = { __typename?: 'Query', shopsById: Array<{ __typename?: 'Shop', id: number, createdAt: any, name: string, description: string, legalText?: string | null, smallBannerUrl: string, largeBannerUrl: string, openingHours?: string | null, private?: boolean | null, enabled?: boolean | null, shopListingStyle: ShopListingStyle, productListingStyle: ProductListingType, sortOrder?: number | null, ownerId?: number | null, tosLink?: string | null, adultOnly?: boolean | null, privacyPolicyLink?: string | null, healthInfosLink?: string | null, deliveryMethods?: Array<{ __typename?: 'DeliveryMethod', id: number, name: string }> | null, owner: { __typename?: 'Organisation', id: number, name: string, avatarUrl?: string | null, circlesAddress?: string | null }, pickupAddress?: { __typename?: 'PostAddress', name?: string | null, street: string, house: string, zip: string, city: string, state?: string | null, country: string } | null }> };

export type ClientAssertionJwtQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientAssertionJwtQuery = { __typename?: 'Query', clientAssertionJwt: string };

export type OffersByIdAndVersionQueryVariables = Exact<{
  query: Array<OfferByIdAndVersionInput> | OfferByIdAndVersionInput;
}>;


export type OffersByIdAndVersionQuery = { __typename?: 'Query', offersByIdAndVersion: Array<{ __typename?: 'Offer', id: number, title: string, pictureUrl: string, pricePerUnit: string, currentInventory?: number | null, version: number, tags?: Array<{ __typename?: 'Tag', typeId: string, value?: string | null }> | null }> };

export type EventsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EventsSubscription = { __typename?: 'Subscription', events: { __typename?: 'NotificationEvent', type: string, from: string, to: string, itemId?: number | null, transaction_hash?: string | null } };


export const UpsertShippingAddressDocument = gql`
    mutation upsertShippingAddress($data: PostAddressInput!) {
  upsertShippingAddress(data: $data) {
    id
    name
    street
    house
    zip
    cityGeonameid
    city
    state
    country
  }
}
    `;
export const CreatePurchaseDocument = gql`
    mutation createPurchase($lines: [PurchaseLineInput!]!, $deliveryMethodId: Int!, $deliveryAddressId: Int) {
  purchase(
    lines: $lines
    deliveryMethodId: $deliveryMethodId
    deliveryAddressId: $deliveryAddressId
  ) {
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
export const AddNewLangDocument = gql`
    mutation addNewLang($langToCreate: String, $langToCopyFrom: String) {
  addNewLang(langToCreate: $langToCreate, langToCopyFrom: $langToCopyFrom)
}
    `;
export const UpdateValueDocument = gql`
    mutation updateValue($lang: String, $key: String, $createdBy: String, $value: String) {
  updateValue(lang: $lang, key: $key, createdBy: $createdBy, value: $value) {
    lang
    key
    createdBy
    value
    version
  }
}
    `;
export const CreateNewStringAndKeyDocument = gql`
    mutation createNewStringAndKey($lang: String, $key: String, $createdBy: String, $version: Int, $value: String) {
  createNewStringAndKey(
    lang: $lang
    key: $key
    createdBy: $createdBy
    version: $version
    value: $value
  ) {
    lang
    key
    createdBy
    version
    value
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
    mutation acknowledge($until: Date!, $safeAddress: String) {
  acknowledge(until: $until, safeAddress: $safeAddress)
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
          text
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
    mutation upsertProfile($id: Int, $firstName: String!, $lastName: String, $emailAddress: String, $askedForEmailAddress: Boolean!, $dream: String, $country: String, $avatarUrl: String, $avatarCid: String, $avatarMimeType: String, $circlesAddress: String, $circlesSafeOwner: String, $newsletter: Boolean, $displayCurrency: DisplayCurrency, $displayTimeCircles: Boolean, $cityGeonameid: Int, $status: String!, $successorOfCirclesAddress: String, $gender: Gender, $age: Int) {
  upsertProfile(
    data: {id: $id, firstName: $firstName, lastName: $lastName, emailAddress: $emailAddress, askedForEmailAddress: $askedForEmailAddress, dream: $dream, country: $country, avatarUrl: $avatarUrl, avatarCid: $avatarCid, avatarMimeType: $avatarMimeType, circlesAddress: $circlesAddress, circlesSafeOwner: $circlesSafeOwner, newsletter: $newsletter, displayCurrency: $displayCurrency, displayTimeCircles: $displayTimeCircles, cityGeonameid: $cityGeonameid, status: $status, successorOfCirclesAddress: $successorOfCirclesAddress, gender: $gender, age: $age}
  ) {
    id
    circlesAddress
    displayCurrency
    circlesSafeOwner
    invitationLink
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    emailAddress
    askedForEmailAddress
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    displayTimeCircles
    displayCurrency
    cityGeonameid
    age
    gender
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
        displayCurrency
        displayName
        circlesSafeOwner
        name
        description
        avatarUrl
        cityGeonameid
        city {
          geonameid
          country
          name
          population
        }
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        city {
          geonameid
          name
          country
        }
      }
    }
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
    purchase {
      id
    }
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
    pickupCode
    simplePickupCode
  }
}
    `;
export const UpsertShopDocument = gql`
    mutation upsertShop($shop: ShopInput!) {
  upsertShop(shop: $shop) {
    id
    name
    description
    legalText
    smallBannerUrl
    largeBannerUrl
    openingHours
    adultOnly
    private
    productListingStyle
    owner {
      id
      name
      avatarUrl
      circlesAddress
    }
    categories {
      id
      name
      description
      sortOrder
      enabled
      private
      largeBannerUrl
      smallBannerUrl
      productListingStyle
      createdAt
      entries {
        id
        sortOrder
        product {
          id
          version
          title
          description
          currentInventory
          pictureUrl
          pricePerUnit
          createdByProfile {
            id
            displayName
            avatarUrl
            circlesAddress
          }
        }
      }
    }
  }
}
    `;
export const UpsertShopCategoriesDocument = gql`
    mutation upsertShopCategories($shopCategories: [ShopCategoryInput!]!) {
  upsertShopCategories(shopCategories: $shopCategories) {
    inserted
    updated
  }
}
    `;
export const UpsertShopCategoryEntriesDocument = gql`
    mutation upsertShopCategoryEntries($shopCategoryEntries: [ShopCategoryEntryInput!]!) {
  upsertShopCategoryEntries(shopCategoryEntries: $shopCategoryEntries) {
    inserted
    updated
  }
}
    `;
export const ConfirmLegalAgeDocument = gql`
    mutation confirmLegalAge($age: Int!) {
  confirmLegalAge(age: $age)
}
    `;
export const UpsertOfferDocument = gql`
    mutation upsertOffer($offer: OfferInput!) {
  upsertOffer(offer: $offer) {
    id
    version
    createdAt
    createdByAddress
    title
    description
    pictureUrl
    pricePerUnit
    minAge
    currentInventory
    timeCirclesPriceShare
    tags {
      typeId
      value
    }
  }
}
    `;
export const ProofUniquenessDocument = gql`
    mutation proofUniqueness($humanodeToken: String!) {
  proofUniqueness(humanodeToken: $humanodeToken) {
    existingSafe
  }
}
    `;
export const InitDocument = gql`
    query init {
  init {
    isLoggedOn
    hasProfile
    profileId
    capabilities {
      type
    }
    useShortSignup
    profile {
      id
      circlesAddress
      displayCurrency
      confirmedLegalAge
      circlesSafeOwner
      invitationLink
      successorOfCirclesAddress
      displayName
      firstName
      lastName
      emailAddress
      askedForEmailAddress
      dream
      country
      avatarUrl
      avatarCid
      avatarMimeType
      newsletter
      displayTimeCircles
      displayCurrency
      cityGeonameid
      provenUniqueness
      shippingAddresses {
        id
        name
        street
        house
        zip
        city
        state
        country
      }
      shops {
        id
      }
      city {
        geonameid
        name
        country
      }
      shippingAddresses {
        id
        name
        street
        house
        city
        cityGeonameid
        zip
        state
        country
      }
      memberships {
        isAdmin
        organisation {
          id
          circlesAddress
          displayCurrency
          displayName
          circlesSafeOwner
          name
          description
          avatarUrl
          cityGeonameid
          city {
            geonameid
            country
            name
            population
          }
        }
      }
      verifications {
        createdAt
        revokedAt
        verifierSafeAddress
        verifierProfile {
          id
          circlesAddress
          displayCurrency
          avatarUrl
          name
          city {
            geonameid
            name
            country
          }
        }
      }
      claimedInvitation {
        claimedAt
      }
      invitationTransaction {
        timestamp
        transaction_hash
      }
      circlesTokenAddress
    }
  }
}
    `;
export const DeliveryMethodsDocument = gql`
    query deliveryMethods {
  deliveryMethods {
    id
    name
  }
}
    `;
export const LastAcknowledgedAtDocument = gql`
    query lastAcknowledgedAt($safeAddress: String!) {
  lastAcknowledgedAt(safeAddress: $safeAddress)
}
    `;
export const SessionInfoDocument = gql`
    query sessionInfo {
  sessionInfo {
    isLoggedOn
    hasProfile
    profileId
    capabilities {
      type
    }
    useShortSignup
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
export const StatsDocument = gql`
    query stats {
  stats {
    profilesCount
    verificationsCount
    goals {
      lastGoal
      currentValue
      nextGoal
    }
    myRank {
      rank
      redeemedInvitationsCount
    }
    leaderboard {
      createdByCirclesAddress
      inviteCount
      createdByProfile {
        id
        circlesAddress
        displayCurrency
        circlesSafeOwner
        displayName
        firstName
        lastName
        dream
        avatarUrl
        cityGeonameid
        provenUniqueness
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
      circlesAddress
      displayCurrency
      circlesSafeOwner
      displayName
      firstName
      lastName
      dream
      avatarUrl
      cityGeonameid
      provenUniqueness
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
    `;
export const MyInvitationsDocument = gql`
    query myInvitations {
  myInvitations {
    createdAt
    claimedAt
    claimedBy {
      circlesAddress
      displayCurrency
      circlesSafeOwner
      displayName
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
    displayCurrency
    circlesSafeOwner
    invitationLink
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    emailAddress
    askedForEmailAddress
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    displayTimeCircles
    displayCurrency
    cityGeonameid
    provenUniqueness
    shops {
      id
    }
    city {
      geonameid
      name
      country
      latitude
      longitude
      population
    }
    shippingAddresses {
      id
      name
      street
      house
      zip
      city
      state
      country
    }
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        name
        description
        avatarUrl
        cityGeonameid
        shops {
          id
        }
        city {
          geonameid
          country
          name
          population
        }
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        city {
          geonameid
          name
          country
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
    circlesAddress
    displayCurrency
    circlesSafeOwner
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    avatarUrl
    displayCurrency
    provenUniqueness
    city {
      geonameid
      name
      country
    }
    shippingAddresses {
      id
      name
      street
      house
      zip
      city
      state
      country
    }
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        name
        description
        avatarUrl
        cityGeonameid
        city {
          geonameid
          country
          name
          population
        }
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        displayName
        city {
          geonameid
          name
          country
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
    displayCurrency
    successorOfCirclesAddress
    avatarUrl
    displayName
    firstName
    lastName
    dream
    country
    displayCurrency
    provenUniqueness
    city {
      geonameid
      name
      country
    }
    shippingAddresses {
      id
      name
      street
      house
      zip
      city
      state
      country
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        displayName
        city {
          geonameid
          name
          country
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
    displayCurrency
    origin
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    country
    avatarUrl
    provenUniqueness
    city {
      geonameid
      name
      country
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        displayName
        city {
          geonameid
          name
          country
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
    displayCurrency
    origin
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    avatarUrl
    provenUniqueness
    city {
      geonameid
      name
      country
    }
    shippingAddresses {
      id
      name
      street
      house
      zip
      city
      state
      country
    }
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        name
        description
        avatarUrl
        cityGeonameid
        city {
          geonameid
          country
          name
          population
        }
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        displayName
        city {
          geonameid
          name
          country
        }
      }
    }
  }
}
    `;
export const ProfilesByIdsDocument = gql`
    query profilesByIds($id: [Int!]!) {
  profilesById(ids: $id) {
    id
    circlesAddress
    displayCurrency
    origin
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    dream
    avatarUrl
    provenUniqueness
    city {
      geonameid
      name
      country
    }
    shippingAddresses {
      id
      name
      street
      house
      zip
      city
      state
      country
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        displayName
        city {
          geonameid
          name
          country
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
      displayName
      firstName
      lastName
      origin
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      provenUniqueness
    }
    direction
    otherSafeAddress
    otherSafeAddressProfile {
      id
      displayName
      firstName
      lastName
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      provenUniqueness
      verifications {
        createdAt
        revokedAt
        verifierSafeAddress
        verifierProfile {
          id
          circlesAddress
          displayCurrency
          avatarUrl
          name
          city {
            geonameid
            name
            country
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
    displayCurrency
    avatarUrl
    displayName
    firstName
    lastName
    dream
    city {
      geonameid
      country
      name
    }
    shippingAddresses {
      id
      name
      street
      house
      zip
      city
      state
      country
    }
    provenUniqueness
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        displayName
        city {
          geonameid
          name
          country
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
    circlesAddress
    displayCurrency
    circlesSafeOwner
    invitationLink
    successorOfCirclesAddress
    displayName
    firstName
    lastName
    emailAddress
    askedForEmailAddress
    dream
    country
    avatarUrl
    avatarCid
    avatarMimeType
    newsletter
    displayTimeCircles
    displayCurrency
    cityGeonameid
    provenUniqueness
    shippingAddresses {
      id
      name
      street
      house
      zip
      city
      state
      country
    }
    shops {
      id
    }
    city {
      geonameid
      name
      country
    }
    shippingAddresses {
      id
      name
      street
      house
      city
      cityGeonameid
      zip
      state
      country
    }
    memberships {
      isAdmin
      organisation {
        id
        circlesAddress
        displayCurrency
        displayName
        circlesSafeOwner
        name
        description
        avatarUrl
        cityGeonameid
        city {
          geonameid
          country
          name
          population
        }
      }
    }
    verifications {
      createdAt
      revokedAt
      verifierSafeAddress
      verifierProfile {
        id
        circlesAddress
        displayCurrency
        avatarUrl
        name
        city {
          geonameid
          name
          country
        }
      }
    }
    claimedInvitation {
      claimedAt
    }
    invitationTransaction {
      timestamp
      transaction_hash
    }
    circlesTokenAddress
  }
}
    `;
export const TagsDocument = gql`
    query tags($typeId_in: [String!]!, $value_like: String) {
  tags(query: {typeId_in: $typeId_in, value_like: $value_like}) {
    typeId
    id
    value
    order
  }
}
    `;
export const OrganisationsDocument = gql`
    query organisations($pagination: PaginationArgs) {
  organisations(pagination: $pagination) {
    id
    circlesAddress
    displayCurrency
    createdAt
    name
    avatarUrl
    city {
      geonameid
      name
      country
    }
    shops {
      id
      name
      description
      legalText
      largeBannerUrl
      smallBannerUrl
    }
  }
}
    `;
export const RegionsDocument = gql`
    query regions {
  regions {
    id
    circlesAddress
    displayCurrency
    createdAt
    name
    avatarUrl
    city {
      geonameid
      name
      country
    }
  }
}
    `;
export const OrganisationsByAddressDocument = gql`
    query organisationsByAddress($addresses: [String!]!) {
  organisationsByAddress(addresses: $addresses) {
    id
    circlesAddress
    displayCurrency
    createdAt
    name
    avatarUrl
    displayName
    city {
      geonameid
      name
      country
    }
    shops {
      id
      name
      description
      legalText
      smallBannerUrl
      largeBannerUrl
    }
    members {
      ... on Organisation {
        id
        circlesAddress
        displayCurrency
        createdAt
        name
        displayName
        avatarUrl
        city {
          geonameid
          name
          country
        }
      }
      ... on Profile {
        id
        successorOfCirclesAddress
        circlesSafeOwner
        circlesAddress
        displayCurrency
        avatarUrl
        displayName
        firstName
        lastName
        dream
        provenUniqueness
        city {
          geonameid
          country
          name
        }
        shippingAddresses {
          id
          name
          street
          house
          zip
          city
          state
          country
        }
        verifications {
          createdAt
          revokedAt
          verifierSafeAddress
          verifierProfile {
            id
            circlesAddress
            displayCurrency
            avatarUrl
            name
            city {
              geonameid
              name
              country
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
      displayName
      firstName
      lastName
      avatarUrl
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      provenUniqueness
    }
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
      type
      successorOfCirclesAddress
      circlesAddress
      displayCurrency
      displayName
      firstName
      lastName
      avatarUrl
      provenUniqueness
    }
    direction
    type
    payload {
      ... on CrcHubTransfer {
        transaction_hash
        from
        from_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        to
        to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        flow
        transfers {
          token
          from
          from_profile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          to
          to_profile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
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
        can_send_to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
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
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        to
        to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
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
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        to
        to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
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
        id
        from
        from_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        to
        to_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        text
      }
      ... on MembershipOffer {
        createdBy
        createdBy_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
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
        member_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
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
        member_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
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
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
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
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
      }
      ... on SaleEvent {
        buyer
        buyer_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        invoice {
          id
          buyerSignature
          buyerSignedDate
          sellerSignature
          sellerSignedDate
          deliveryMethod {
            id
            name
          }
          deliveryAddress {
            name
            id
            street
            house
            zip
            city
            state
            country
            cityGeonameid
          }
          createdAt
          cancelledAt
          cancelReason
          simplePickupCode
          paymentTransactionHash
          simplePickupCode
          lines {
            amount
            metadata
            shop {
              id
              name
              description
              legalText
              smallBannerUrl
              largeBannerUrl
              openingHours
              private
              enabled
              productListingStyle
              shopListingStyle
              purchaseMetaDataKeys
              tosLink
              privacyPolicyLink
              healthInfosLink
              adultOnly
              ownerId
              owner {
                id
                name
                avatarUrl
                circlesAddress
              }
              deliveryMethods {
                id
                name
              }
            }
            offer {
              id
              title
              pictureUrl
              pricePerUnit
              minAge
              tags {
                typeId
                value
              }
            }
          }
        }
      }
      ... on Purchased {
        seller_profile {
          id
          displayName
          firstName
          lastName
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
        }
        purchase {
          id
          createdAt
          createdByAddress
          total
          deliveryMethod {
            id
            name
          }
          deliveryAddress {
            name
            id
            street
            house
            zip
            city
            state
            country
            cityGeonameid
          }
          lines {
            id
            amount
            metadata
            shop {
              id
              name
              description
              legalText
              smallBannerUrl
              largeBannerUrl
              openingHours
              private
              enabled
              productListingStyle
              shopListingStyle
              purchaseMetaDataKeys
              tosLink
              privacyPolicyLink
              healthInfosLink
              adultOnly
              ownerId
              pickupAddress {
                name
                street
                house
                zip
                city
                state
                country
              }
              owner {
                id
                name
                avatarUrl
                circlesAddress
              }
              deliveryMethods {
                id
                name
              }
            }
            offer {
              id
              pictureUrl
              title
              description
              pricePerUnit
              minAge
              tags {
                typeId
                value
              }
            }
          }
          invoices {
            id
            pickupCode
            deliveryMethod {
              id
              name
            }
            simplePickupCode
            buyerProfile {
              id
              displayName
              firstName
              lastName
              avatarUrl
              circlesAddress
              displayCurrency
              provenUniqueness
            }
            sellerProfile {
              id
              displayName
              firstName
              lastName
              avatarUrl
              circlesAddress
              displayCurrency
              provenUniqueness
            }
            paymentTransactionHash
            createdAt
            cancelledAt
            invoiceNo
            sellerSignature
            buyerSignature
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
          displayCurrency
        }
      }
      ... on NewUser {
        profile {
          id
          displayName
          firstName
          lastName
          dream
          avatarUrl
          circlesAddress
          displayCurrency
          provenUniqueness
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
      id
      displayName
      firstName
      lastName
      avatarUrl
      circlesAddress
      displayCurrency
      provenUniqueness
    }
    payload {
      ... on Offers {
        lastUpdatedAt
        offers {
          id
          version
          createdByProfile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            smallBannerUrl
            provenUniqueness
          }
          tags {
            typeId
            value
            order
          }
          createdByAddress
          createdAt
          title
          minAge
          pictureUrl
          pictureMimeType
          description
          pricePerUnit
          timeCirclesPriceShare
        }
      }
      ... on Erc721Tokens {
        lastUpdatedAt
        balances {
          token_no
          token_symbol
          token_name
          token_address
          token_owner_profile {
            id
            circlesAddress
            displayName
            avatarUrl
            firstName
            lastName
            provenUniqueness
          }
          token_no
          token_url
        }
      }
      ... on CrcBalances {
        lastUpdatedAt
        balances {
          token_address
          token_owner_address
          token_owner_profile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
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
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
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
            type
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
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
                displayCurrency
                displayName
                circlesSafeOwner
                name
                description
                avatarUrl
                cityGeonameid
                city {
                  geonameid
                  country
                  name
                  population
                }
              }
            }
            members {
              type
              id
              displayName
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
            }
            verifications {
              createdAt
              revokedAt
              verifierSafeAddress
              verifierProfile {
                id
                circlesAddress
                displayCurrency
                avatarUrl
                name
                city {
                  geonameid
                  name
                  country
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
            displayCurrency
            provenUniqueness
          }
          ... on Organisation {
            circlesAddress
            displayCurrency
          }
        }
      }
      ... on Memberships {
        lastUpdatedAt
        organisations {
          id
          circlesAddress
          displayCurrency
          displayName
          circlesSafeOwner
          name
          description
          avatarUrl
          cityGeonameid
          city {
            geonameid
            country
            name
            population
          }
        }
      }
      ... on Purchases {
        lastUpdatedAt
        purchases {
          id
          createdAt
          createdByAddress
          createdByProfile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          deliveryMethod {
            id
            name
          }
          total
          lines {
            id
            amount
            metadata
            shop {
              id
              name
              description
              legalText
              smallBannerUrl
              largeBannerUrl
              openingHours
              private
              enabled
              productListingStyle
              shopListingStyle
              purchaseMetaDataKeys
              tosLink
              privacyPolicyLink
              healthInfosLink
              adultOnly
              ownerId
              owner {
                id
                name
                avatarUrl
                circlesAddress
              }
              deliveryMethods {
                id
                name
              }
            }
            offer {
              id
              version
              title
              description
              pictureUrl
              pricePerUnit
              minAge
              timeCirclesPriceShare
              createdByProfile {
                id
                displayName
                firstName
                lastName
                avatarUrl
                circlesAddress
                displayCurrency
                provenUniqueness
              }
              tags {
                typeId
                value
              }
            }
          }
          invoices {
            id
            sellerAddress
            paymentTransactionHash
            buyerAddress
            pickupCode
            deliveryMethod {
              id
              name
            }
            simplePickupCode
            buyerSignature
            buyerSignedDate
            sellerSignature
            sellerSignedDate
            createdAt
            cancelledAt
            cancelReason
            sellerProfile {
              id
              displayName
              firstName
              lastName
              avatarUrl
              circlesAddress
              displayCurrency
              provenUniqueness
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
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            provenUniqueness
          }
          buyerProfile {
            id
            displayName
            firstName
            lastName
            avatarUrl
            circlesAddress
            displayCurrency
            verifications {
              createdAt
              revokedAt
              verifierSafeAddress
              verifierProfile {
                id
                circlesAddress
                displayCurrency
                avatarUrl
                name
                city {
                  geonameid
                  name
                  country
                }
              }
            }
          }
          total
          lines {
            id
            amount
            metadata
            shop {
              id
              name
              description
              legalText
              smallBannerUrl
              largeBannerUrl
              openingHours
              private
              enabled
              productListingStyle
              shopListingStyle
              purchaseMetaDataKeys
              tosLink
              privacyPolicyLink
              healthInfosLink
              adultOnly
              ownerId
              owner {
                id
                name
                avatarUrl
                circlesAddress
              }
              deliveryMethods {
                id
                name
              }
            }
            offer {
              id
              version
              title
              description
              pictureUrl
              pricePerUnit
              minAge
              timeCirclesPriceShare
              createdByProfile {
                id
                displayName
                firstName
                lastName
                avatarUrl
                circlesAddress
                displayCurrency
                provenUniqueness
              }
              tags {
                typeId
                value
              }
            }
          }
          invoices {
            id
            sellerAddress
            paymentTransactionHash
            buyerAddress
            pickupCode
            deliveryMethod {
              id
              name
            }
            deliveryAddress {
              name
              id
              street
              house
              zip
              city
              state
              country
              cityGeonameid
            }
            simplePickupCode
            buyerSignature
            buyerSignedDate
            sellerSignature
            sellerSignedDate
            createdAt
            cancelledAt
            cancelReason
            buyerProfile {
              id
              displayName
              firstName
              lastName
              avatarUrl
              circlesAddress
              displayCurrency
              provenUniqueness
              verifications {
                createdAt
                revokedAt
                verifierSafeAddress
                verifierProfile {
                  id
                  circlesAddress
                  displayCurrency
                  avatarUrl
                  name
                  city {
                    geonameid
                    name
                    country
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
export const GetAllStringsDocument = gql`
    query getAllStrings {
  getAllStrings {
    lang
    key
    version
    value
  }
}
    `;
export const GetAllStringsByLanguageDocument = gql`
    query getAllStringsByLanguage($lang: String) {
  getAllStringsByLanguage(lang: $lang) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetAllStringsByMaxVersionDocument = gql`
    query getAllStringsByMaxVersion {
  getAllStringsByMaxVersion {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetAllStringsByMaxVersionAndLangDocument = gql`
    query getAllStringsByMaxVersionAndLang($lang: String) {
  getAllStringsByMaxVersionAndLang(lang: $lang) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetStringByMaxVersionDocument = gql`
    query getStringByMaxVersion($lang: String, $key: String) {
  getStringByMaxVersion(lang: $lang, key: $key) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetOlderVersionsByKeyAndLangDocument = gql`
    query getOlderVersionsByKeyAndLang($key: String, $lang: String) {
  getOlderVersionsByKeyAndLang(lang: $lang, key: $key) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetStringByLanguageDocument = gql`
    query getStringByLanguage($lang: String) {
  getStringByLanguage(lang: $lang) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetAvailableLanguagesDocument = gql`
    query getAvailableLanguages {
  getAvailableLanguages {
    lang
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
      id
      circlesAddress
      displayCurrency
      avatarUrl
      name
      city {
        geonameid
        name
        country
      }
    }
    verifiedSafeAddress
    verifiedProfile {
      id
      displayName
      firstName
      lastName
      avatarUrl
      circlesAddress
      displayCurrency
      provenUniqueness
    }
  }
}
    `;
export const FindInvitationCreatorDocument = gql`
    query findInvitationCreator($code: String!) {
  findInvitationCreator(code: $code) {
    circlesAddress
    displayCurrency
    displayName
    firstName
    lastName
    avatarUrl
  }
}
    `;
export const ShopDocument = gql`
    query shop($id: Int!) {
  shop(id: $id) {
    id
    name
    description
    legalText
    smallBannerUrl
    largeBannerUrl
    openingHours
    private
    enabled
    productListingStyle
    shopListingStyle
    purchaseMetaDataKeys
    tosLink
    privacyPolicyLink
    healthInfosLink
    adultOnly
    ownerId
    owner {
      id
      name
      avatarUrl
      circlesAddress
    }
    deliveryMethods {
      id
      name
    }
    pickupAddress {
      name
      street
      house
      zip
      city
      state
      country
    }
    categories {
      id
      name
      description
      sortOrder
      shopId
      smallBannerUrl
      largeBannerUrl
      private
      enabled
      createdAt
      productListingStyle
      entries {
        id
        sortOrder
        private
        productId
        productVersion
        shopCategoryId
        enabled
        product {
          id
          version
          title
          description
          pictureUrl
          pricePerUnit
          minAge
          currentInventory
          createdByProfile {
            id
            displayName
            avatarUrl
            circlesAddress
            provenUniqueness
          }
        }
      }
    }
  }
}
    `;
export const ShopsDocument = gql`
    query shops($ownerId: Int) {
  shops(ownerId: $ownerId) {
    id
    createdAt
    name
    description
    legalText
    smallBannerUrl
    largeBannerUrl
    openingHours
    private
    enabled
    shopListingStyle
    productListingStyle
    sortOrder
    ownerId
    adultOnly
    tosLink
    privacyPolicyLink
    healthInfosLink
    deliveryMethods {
      id
      name
    }
    owner {
      id
      name
      avatarUrl
      circlesAddress
    }
    pickupAddress {
      name
      street
      house
      zip
      city
      state
      country
    }
  }
}
    `;
export const ShopsByIdDocument = gql`
    query shopsById($ids: [Int!]!) {
  shopsById(ids: $ids) {
    id
    createdAt
    name
    description
    legalText
    smallBannerUrl
    largeBannerUrl
    openingHours
    private
    enabled
    shopListingStyle
    productListingStyle
    sortOrder
    ownerId
    tosLink
    adultOnly
    privacyPolicyLink
    healthInfosLink
    deliveryMethods {
      id
      name
    }
    owner {
      id
      name
      avatarUrl
      circlesAddress
    }
    pickupAddress {
      name
      street
      house
      zip
      city
      state
      country
    }
  }
}
    `;
export const ClientAssertionJwtDocument = gql`
    query clientAssertionJwt {
  clientAssertionJwt
}
    `;
export const OffersByIdAndVersionDocument = gql`
    query offersByIdAndVersion($query: [OfferByIdAndVersionInput!]!) {
  offersByIdAndVersion(query: $query) {
    id
    title
    pictureUrl
    pricePerUnit
    currentInventory
    version
    tags {
      typeId
      value
    }
  }
}
    `;
export const EventsDocument = gql`
    subscription events {
  events {
    type
    from
    to
    itemId
    transaction_hash
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    upsertShippingAddress(variables: UpsertShippingAddressMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertShippingAddressMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertShippingAddressMutation>(UpsertShippingAddressDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertShippingAddress', 'mutation');
    },
    createPurchase(variables: CreatePurchaseMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatePurchaseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePurchaseMutation>(CreatePurchaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createPurchase', 'mutation');
    },
    requestSessionChallenge(variables: RequestSessionChallengeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RequestSessionChallengeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RequestSessionChallengeMutation>(RequestSessionChallengeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'requestSessionChallenge', 'mutation');
    },
    verifySessionChallenge(variables: VerifySessionChallengeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VerifySessionChallengeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerifySessionChallengeMutation>(VerifySessionChallengeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'verifySessionChallenge', 'mutation');
    },
    addNewLang(variables?: AddNewLangMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddNewLangMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddNewLangMutation>(AddNewLangDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addNewLang', 'mutation');
    },
    updateValue(variables?: UpdateValueMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateValueMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateValueMutation>(UpdateValueDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateValue', 'mutation');
    },
    createNewStringAndKey(variables?: CreateNewStringAndKeyMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateNewStringAndKeyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateNewStringAndKeyMutation>(CreateNewStringAndKeyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createNewStringAndKey', 'mutation');
    },
    claimInvitation(variables: ClaimInvitationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ClaimInvitationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClaimInvitationMutation>(ClaimInvitationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'claimInvitation', 'mutation');
    },
    acknowledge(variables: AcknowledgeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AcknowledgeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AcknowledgeMutation>(AcknowledgeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'acknowledge', 'mutation');
    },
    sendMessage(variables: SendMessageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SendMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendMessageMutation>(SendMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sendMessage', 'mutation');
    },
    addMember(variables: AddMemberMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddMemberMutation>(AddMemberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addMember', 'mutation');
    },
    removeMember(variables: RemoveMemberMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RemoveMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveMemberMutation>(RemoveMemberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'removeMember', 'mutation');
    },
    redeemClaimedInvitation(variables?: RedeemClaimedInvitationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RedeemClaimedInvitationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RedeemClaimedInvitationMutation>(RedeemClaimedInvitationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'redeemClaimedInvitation', 'mutation');
    },
    logout(variables?: LogoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LogoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LogoutMutation>(LogoutDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'logout', 'mutation');
    },
    tagTransaction(variables: TagTransactionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TagTransactionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<TagTransactionMutation>(TagTransactionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'tagTransaction', 'mutation');
    },
    upsertProfile(variables: UpsertProfileMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertProfileMutation>(UpsertProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertProfile', 'mutation');
    },
    upsertOrganisation(variables: UpsertOrganisationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertOrganisationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertOrganisationMutation>(UpsertOrganisationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertOrganisation', 'mutation');
    },
    upsertRegion(variables: UpsertRegionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertRegionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertRegionMutation>(UpsertRegionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertRegion', 'mutation');
    },
    importOrganisations(variables?: ImportOrganisationsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ImportOrganisationsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ImportOrganisationsMutation>(ImportOrganisationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'importOrganisations', 'mutation');
    },
    completePurchase(variables: CompletePurchaseMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CompletePurchaseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompletePurchaseMutation>(CompletePurchaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'completePurchase', 'mutation');
    },
    completeSale(variables: CompleteSaleMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CompleteSaleMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompleteSaleMutation>(CompleteSaleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'completeSale', 'mutation');
    },
    verifySafe(variables: VerifySafeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VerifySafeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerifySafeMutation>(VerifySafeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'verifySafe', 'mutation');
    },
    revokeSafeVerification(variables: RevokeSafeVerificationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RevokeSafeVerificationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RevokeSafeVerificationMutation>(RevokeSafeVerificationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'revokeSafeVerification', 'mutation');
    },
    announcePayment(variables: AnnouncePaymentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AnnouncePaymentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AnnouncePaymentMutation>(AnnouncePaymentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'announcePayment', 'mutation');
    },
    upsertShop(variables: UpsertShopMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertShopMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertShopMutation>(UpsertShopDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertShop', 'mutation');
    },
    upsertShopCategories(variables: UpsertShopCategoriesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertShopCategoriesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertShopCategoriesMutation>(UpsertShopCategoriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertShopCategories', 'mutation');
    },
    upsertShopCategoryEntries(variables: UpsertShopCategoryEntriesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertShopCategoryEntriesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertShopCategoryEntriesMutation>(UpsertShopCategoryEntriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertShopCategoryEntries', 'mutation');
    },
    confirmLegalAge(variables: ConfirmLegalAgeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ConfirmLegalAgeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConfirmLegalAgeMutation>(ConfirmLegalAgeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'confirmLegalAge', 'mutation');
    },
    upsertOffer(variables: UpsertOfferMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertOfferMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertOfferMutation>(UpsertOfferDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertOffer', 'mutation');
    },
    proofUniqueness(variables: ProofUniquenessMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProofUniquenessMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProofUniquenessMutation>(ProofUniquenessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'proofUniqueness', 'mutation');
    },
    init(variables?: InitQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InitQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InitQuery>(InitDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'init', 'query');
    },
    deliveryMethods(variables?: DeliveryMethodsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeliveryMethodsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeliveryMethodsQuery>(DeliveryMethodsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deliveryMethods', 'query');
    },
    lastAcknowledgedAt(variables: LastAcknowledgedAtQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LastAcknowledgedAtQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LastAcknowledgedAtQuery>(LastAcknowledgedAtDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'lastAcknowledgedAt', 'query');
    },
    sessionInfo(variables?: SessionInfoQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SessionInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SessionInfoQuery>(SessionInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sessionInfo', 'query');
    },
    claimedInvitation(variables?: ClaimedInvitationQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ClaimedInvitationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClaimedInvitationQuery>(ClaimedInvitationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'claimedInvitation', 'query');
    },
    invitationTransaction(variables?: InvitationTransactionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InvitationTransactionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InvitationTransactionQuery>(InvitationTransactionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'invitationTransaction', 'query');
    },
    hubSignupTransaction(variables?: HubSignupTransactionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HubSignupTransactionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HubSignupTransactionQuery>(HubSignupTransactionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'hubSignupTransaction', 'query');
    },
    safeInfo(variables?: SafeInfoQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SafeInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SafeInfoQuery>(SafeInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'safeInfo', 'query');
    },
    stats(variables?: StatsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<StatsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<StatsQuery>(StatsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stats', 'query');
    },
    findSafesByOwner(variables: FindSafesByOwnerQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindSafesByOwnerQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindSafesByOwnerQuery>(FindSafesByOwnerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findSafesByOwner', 'query');
    },
    myInvitations(variables?: MyInvitationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyInvitationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyInvitationsQuery>(MyInvitationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'myInvitations', 'query');
    },
    myProfile(variables?: MyProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyProfileQuery>(MyProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'myProfile', 'query');
    },
    profiles(variables: ProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfilesQuery>(ProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'profiles', 'query');
    },
    citiesByName(variables: CitiesByNameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CitiesByNameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CitiesByNameQuery>(CitiesByNameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'citiesByName', 'query');
    },
    citiesById(variables: CitiesByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CitiesByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CitiesByIdQuery>(CitiesByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'citiesById', 'query');
    },
    profilesByName(variables: ProfilesByNameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfilesByNameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfilesByNameQuery>(ProfilesByNameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'profilesByName', 'query');
    },
    getRecentProfiles(variables?: GetRecentProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRecentProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRecentProfilesQuery>(GetRecentProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getRecentProfiles', 'query');
    },
    profilesByCirclesAddress(variables: ProfilesByCirclesAddressQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfilesByCirclesAddressQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfilesByCirclesAddressQuery>(ProfilesByCirclesAddressDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'profilesByCirclesAddress', 'query');
    },
    profilesByIds(variables: ProfilesByIdsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfilesByIdsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfilesByIdsQuery>(ProfilesByIdsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'profilesByIds', 'query');
    },
    trustRelations(variables: TrustRelationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TrustRelationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TrustRelationsQuery>(TrustRelationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'trustRelations', 'query');
    },
    profileById(variables: ProfileByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileByIdQuery>(ProfileByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'profileById', 'query');
    },
    profileBySafeAddress(variables: ProfileBySafeAddressQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileBySafeAddressQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileBySafeAddressQuery>(ProfileBySafeAddressDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'profileBySafeAddress', 'query');
    },
    tags(variables: TagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TagsQuery>(TagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'tags', 'query');
    },
    organisations(variables?: OrganisationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrganisationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrganisationsQuery>(OrganisationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'organisations', 'query');
    },
    regions(variables?: RegionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegionsQuery>(RegionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'regions', 'query');
    },
    organisationsByAddress(variables: OrganisationsByAddressQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrganisationsByAddressQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrganisationsByAddressQuery>(OrganisationsByAddressDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'organisationsByAddress', 'query');
    },
    commonTrust(variables: CommonTrustQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CommonTrustQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CommonTrustQuery>(CommonTrustDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'commonTrust', 'query');
    },
    tagById(variables: TagByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TagByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TagByIdQuery>(TagByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'tagById', 'query');
    },
    stream(variables: StreamQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<StreamQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<StreamQuery>(StreamDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stream', 'query');
    },
    aggregates(variables: AggregatesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AggregatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AggregatesQuery>(AggregatesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aggregates', 'query');
    },
    getAllStrings(variables?: GetAllStringsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllStringsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllStringsQuery>(GetAllStringsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllStrings', 'query');
    },
    getAllStringsByLanguage(variables?: GetAllStringsByLanguageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllStringsByLanguageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllStringsByLanguageQuery>(GetAllStringsByLanguageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllStringsByLanguage', 'query');
    },
    getAllStringsByMaxVersion(variables?: GetAllStringsByMaxVersionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllStringsByMaxVersionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllStringsByMaxVersionQuery>(GetAllStringsByMaxVersionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllStringsByMaxVersion', 'query');
    },
    getAllStringsByMaxVersionAndLang(variables?: GetAllStringsByMaxVersionAndLangQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllStringsByMaxVersionAndLangQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllStringsByMaxVersionAndLangQuery>(GetAllStringsByMaxVersionAndLangDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllStringsByMaxVersionAndLang', 'query');
    },
    getStringByMaxVersion(variables?: GetStringByMaxVersionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetStringByMaxVersionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetStringByMaxVersionQuery>(GetStringByMaxVersionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getStringByMaxVersion', 'query');
    },
    getOlderVersionsByKeyAndLang(variables?: GetOlderVersionsByKeyAndLangQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetOlderVersionsByKeyAndLangQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOlderVersionsByKeyAndLangQuery>(GetOlderVersionsByKeyAndLangDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOlderVersionsByKeyAndLang', 'query');
    },
    getStringByLanguage(variables?: GetStringByLanguageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetStringByLanguageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetStringByLanguageQuery>(GetStringByLanguageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getStringByLanguage', 'query');
    },
    getAvailableLanguages(variables?: GetAvailableLanguagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAvailableLanguagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAvailableLanguagesQuery>(GetAvailableLanguagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAvailableLanguages', 'query');
    },
    directPath(variables: DirectPathQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DirectPathQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DirectPathQuery>(DirectPathDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'directPath', 'query');
    },
    invoice(variables: InvoiceQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InvoiceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InvoiceQuery>(InvoiceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'invoice', 'query');
    },
    verifications(variables?: VerificationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VerificationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VerificationsQuery>(VerificationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'verifications', 'query');
    },
    findInvitationCreator(variables: FindInvitationCreatorQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindInvitationCreatorQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindInvitationCreatorQuery>(FindInvitationCreatorDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findInvitationCreator', 'query');
    },
    shop(variables: ShopQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ShopQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ShopQuery>(ShopDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'shop', 'query');
    },
    shops(variables?: ShopsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ShopsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ShopsQuery>(ShopsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'shops', 'query');
    },
    shopsById(variables: ShopsByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ShopsByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ShopsByIdQuery>(ShopsByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'shopsById', 'query');
    },
    clientAssertionJwt(variables?: ClientAssertionJwtQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ClientAssertionJwtQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClientAssertionJwtQuery>(ClientAssertionJwtDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'clientAssertionJwt', 'query');
    },
    offersByIdAndVersion(variables: OffersByIdAndVersionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OffersByIdAndVersionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OffersByIdAndVersionQuery>(OffersByIdAndVersionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'offersByIdAndVersion', 'query');
    },
    events(variables?: EventsSubscriptionVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EventsSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<EventsSubscription>(EventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'events', 'subscription');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;