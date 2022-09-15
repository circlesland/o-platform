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
  Date: any;
};



export type AcceptMembershipResult = {
  __typename?: 'AcceptMembershipResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export enum AccountType {
  Person = 'Person',
  Organisation = 'Organisation'
}

export type AddMemberResult = {
  __typename?: 'AddMemberResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type AggregatePayload = CrcBalances | Erc20Balances | Contacts | Memberships | Members | Offers | Sales | Purchases | Erc721Tokens;

export enum AggregateType {
  CrcBalances = 'CrcBalances',
  Erc20Balances = 'Erc20Balances',
  Contacts = 'Contacts',
  Memberships = 'Memberships',
  Members = 'Members',
  Offers = 'Offers',
  Purchases = 'Purchases',
  Sales = 'Sales',
  Erc721Tokens = 'Erc721Tokens'
}

export type AnnouncePaymentResult = {
  __typename?: 'AnnouncePaymentResult';
  invoiceId: Scalars['Int'];
  transactionHash: Scalars['String'];
  pickupCode: Scalars['String'];
  simplePickupCode?: Maybe<Scalars['String']>;
};

export type AssetBalance = {
  __typename?: 'AssetBalance';
  token_symbol?: Maybe<Scalars['String']>;
  token_address: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
  token_balance: Scalars['String'];
};

export type Capability = {
  __typename?: 'Capability';
  type?: Maybe<CapabilityType>;
};

export enum CapabilityType {
  Verify = 'Verify',
  Invite = 'Invite',
  Translate = 'Translate',
  PreviewFeatures = 'PreviewFeatures',
  Tickets = 'Tickets',
  VerifiedByHumanode = 'VerifiedByHumanode'
}

export type ChatMessage = IEventPayload & {
  __typename?: 'ChatMessage';
  id: Scalars['Int'];
  transaction_hash?: Maybe<Scalars['String']>;
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  text: Scalars['String'];
};

export type ChatMessageEventFilter = {
  id: Scalars['Int'];
};

export type City = ICity & {
  __typename?: 'City';
  geonameid: Scalars['Int'];
  name: Scalars['String'];
  country: Scalars['String'];
  population: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  feature_code: Scalars['String'];
};

export type ClaimInvitationResult = {
  __typename?: 'ClaimInvitationResult';
  success: Scalars['Boolean'];
  claimedInvitation?: Maybe<ClaimedInvitation>;
};

export type ClaimedInvitation = {
  __typename?: 'ClaimedInvitation';
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  createdAt: Scalars['String'];
  claimedBy?: Maybe<Profile>;
  claimedByProfileId: Scalars['Int'];
  claimedAt: Scalars['String'];
};

export type CommonTrust = {
  __typename?: 'CommonTrust';
  type: Scalars['String'];
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
  profile?: Maybe<Profile>;
};

export type Contact = {
  __typename?: 'Contact';
  metadata: Array<ContactPoint>;
  lastContactAt: Scalars['String'];
  contactAddress: Scalars['String'];
  contactAddress_Profile?: Maybe<Profile>;
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
  name: Scalars['String'];
  directions: Array<ContactDirection>;
  values: Array<Scalars['String']>;
  timestamps: Array<Scalars['String']>;
};

export type Contacts = IAggregatePayload & {
  __typename?: 'Contacts';
  lastUpdatedAt: Scalars['String'];
  contacts: Array<Contact>;
};

export type CrcBalanceAggregateFilter = {
  tokenAddresses: Array<Scalars['String']>;
};

export type CrcBalances = IAggregatePayload & {
  __typename?: 'CrcBalances';
  lastUpdatedAt: Scalars['String'];
  total?: Maybe<Scalars['String']>;
  balances: Array<AssetBalance>;
};

export type CrcHubTransfer = IEventPayload & {
  __typename?: 'CrcHubTransfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  flow: Scalars['String'];
  transfers: Array<CrcTokenTransfer>;
  tags: Array<Tag>;
};

export type CrcMinting = IEventPayload & {
  __typename?: 'CrcMinting';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  value: Scalars['String'];
  token: Scalars['String'];
};

export type CrcSignup = IEventPayload & {
  __typename?: 'CrcSignup';
  transaction_hash: Scalars['String'];
  user: Scalars['String'];
  user_profile?: Maybe<Profile>;
  token: Scalars['String'];
};

export type CrcTokenTransfer = IEventPayload & {
  __typename?: 'CrcTokenTransfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  value: Scalars['String'];
};

export type CrcTrust = IEventPayload & {
  __typename?: 'CrcTrust';
  transaction_hash: Scalars['String'];
  address: Scalars['String'];
  address_profile?: Maybe<Profile>;
  can_send_to: Scalars['String'];
  can_send_to_profile?: Maybe<Profile>;
  limit: Scalars['Int'];
};

export type CreateInvitationResult = {
  __typename?: 'CreateInvitationResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  createdInviteEoas: Array<CreatedInvitation>;
};

export type CreateOrganisationResult = {
  __typename?: 'CreateOrganisationResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  organisation?: Maybe<Organisation>;
};

export type CreateTagInput = {
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type CreatedInvitation = {
  __typename?: 'CreatedInvitation';
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  createdAt: Scalars['String'];
  claimedBy?: Maybe<Profile>;
  claimedByProfileId?: Maybe<Scalars['Int']>;
  claimedAt?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  address: Scalars['String'];
  balance: Scalars['String'];
  code: Scalars['String'];
};

export type CreatedInviteEoa = {
  __typename?: 'CreatedInviteEoa';
  for: Scalars['String'];
  address: Scalars['String'];
  fee: Scalars['String'];
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
  TimeCrc = 'TIME_CRC',
  Eurs = 'EURS'
}

export type Erc20Balances = IAggregatePayload & {
  __typename?: 'Erc20Balances';
  lastUpdatedAt: Scalars['String'];
  balances: Array<AssetBalance>;
};

export type Erc20Transfer = IEventPayload & {
  __typename?: 'Erc20Transfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  token: Scalars['String'];
  value: Scalars['String'];
};

export type Erc721Token = {
  __typename?: 'Erc721Token';
  token_symbol?: Maybe<Scalars['String']>;
  token_name?: Maybe<Scalars['String']>;
  token_address: Scalars['String'];
  token_owner_address: Scalars['String'];
  token_owner_profile?: Maybe<Profile>;
  token_no: Scalars['String'];
  token_url: Scalars['String'];
};

export type Erc721Tokens = IAggregatePayload & {
  __typename?: 'Erc721Tokens';
  lastUpdatedAt: Scalars['String'];
  balances: Array<Erc721Token>;
};

export type EthTransfer = IEventPayload & {
  __typename?: 'EthTransfer';
  transaction_hash: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  value: Scalars['String'];
  tags: Array<Tag>;
};

export type EventPayload = CrcSignup | CrcTrust | CrcTokenTransfer | CrcHubTransfer | CrcMinting | EthTransfer | Erc20Transfer | GnosisSafeEthTransfer | ChatMessage | MembershipOffer | MembershipAccepted | MembershipRejected | WelcomeMessage | InvitationCreated | InvitationRedeemed | OrganisationCreated | MemberAdded | SaleEvent | Purchased | SafeVerified | NewUser;

export enum EventType {
  CrcSignup = 'CrcSignup',
  CrcTrust = 'CrcTrust',
  CrcTokenTransfer = 'CrcTokenTransfer',
  CrcHubTransfer = 'CrcHubTransfer',
  Erc20Transfer = 'Erc20Transfer',
  CrcMinting = 'CrcMinting',
  EthTransfer = 'EthTransfer',
  GnosisSafeEthTransfer = 'GnosisSafeEthTransfer',
  ChatMessage = 'ChatMessage',
  MembershipOffer = 'MembershipOffer',
  MembershipAccepted = 'MembershipAccepted',
  MembershipRejected = 'MembershipRejected',
  WelcomeMessage = 'WelcomeMessage',
  InvitationCreated = 'InvitationCreated',
  InvitationRedeemed = 'InvitationRedeemed',
  OrganisationCreated = 'OrganisationCreated',
  MemberAdded = 'MemberAdded',
  SaleEvent = 'SaleEvent',
  Purchased = 'Purchased',
  SafeVerified = 'SafeVerified',
  NewUser = 'NewUser'
}

export type ExchangeTokenResponse = {
  __typename?: 'ExchangeTokenResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type ExportProfile = {
  __typename?: 'ExportProfile';
  lastChange: Scalars['Date'];
  circlesAddress: Scalars['String'];
  displayName: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
};

export type ExportTrustRelation = {
  __typename?: 'ExportTrustRelation';
  lastChange: Scalars['Date'];
  trusterAddress: Scalars['String'];
  trusteeAddress: Scalars['String'];
  trustLimit: Scalars['Int'];
};

export type FibonacciGoals = {
  __typename?: 'FibonacciGoals';
  lastGoal: Scalars['Int'];
  currentValue: Scalars['Int'];
  nextGoal: Scalars['Int'];
};

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Divers = 'DIVERS'
}

export type GnosisSafeEthTransfer = IEventPayload & {
  __typename?: 'GnosisSafeEthTransfer';
  transaction_hash: Scalars['String'];
  initiator: Scalars['String'];
  from: Scalars['String'];
  from_profile?: Maybe<Profile>;
  to: Scalars['String'];
  to_profile?: Maybe<Profile>;
  value: Scalars['String'];
  tags: Array<Tag>;
};

export type IAggregatePayload = {
  lastUpdatedAt?: Maybe<Scalars['String']>;
};

export type ICity = {
  geonameid: Scalars['Int'];
  name: Scalars['String'];
  country: Scalars['String'];
  population: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  feature_code: Scalars['String'];
};

export type IEventPayload = {
  transaction_hash?: Maybe<Scalars['String']>;
};

export type InvitationCreated = IEventPayload & {
  __typename?: 'InvitationCreated';
  transaction_hash?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  code: Scalars['String'];
};

export type InvitationRedeemed = IEventPayload & {
  __typename?: 'InvitationRedeemed';
  transaction_hash?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  code: Scalars['String'];
  redeemedBy?: Maybe<Scalars['String']>;
  redeemedBy_profile?: Maybe<Profile>;
};

export type Invoice = {
  __typename?: 'Invoice';
  id: Scalars['Int'];
  purchaseId: Scalars['Int'];
  purchase?: Maybe<Purchase>;
  sellerAddress: Scalars['String'];
  sellerProfile?: Maybe<Profile>;
  deliveryMethod: DeliveryMethod;
  buyerAddress: Scalars['String'];
  buyerProfile?: Maybe<Profile>;
  createdAt?: Maybe<Scalars['String']>;
  lines?: Maybe<Array<InvoiceLine>>;
  invoiceNo: Scalars['String'];
  pickupCode?: Maybe<Scalars['String']>;
  simplePickupCode?: Maybe<Scalars['String']>;
  buyerSignature?: Maybe<Scalars['Boolean']>;
  buyerSignedDate?: Maybe<Scalars['String']>;
  sellerSignature?: Maybe<Scalars['Boolean']>;
  sellerSignedDate?: Maybe<Scalars['String']>;
  paymentTransactionHash?: Maybe<Scalars['String']>;
  paymentTransaction?: Maybe<ProfileEvent>;
  cancelledAt?: Maybe<Scalars['String']>;
  cancelReason?: Maybe<Scalars['String']>;
  cancelledBy?: Maybe<Profile>;
  deliveryAddress?: Maybe<PostAddress>;
};

export type InvoiceLine = {
  __typename?: 'InvoiceLine';
  id: Scalars['Int'];
  amount: Scalars['Int'];
  offer?: Maybe<Offer>;
  shop?: Maybe<Shop>;
  metadata?: Maybe<Scalars['String']>;
};

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry';
  createdByCirclesAddress: Scalars['String'];
  createdByProfile?: Maybe<Profile>;
  inviteCount: Scalars['Int'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
};

export type MemberAdded = IEventPayload & {
  __typename?: 'MemberAdded';
  transaction_hash?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type Members = IAggregatePayload & {
  __typename?: 'Members';
  lastUpdatedAt: Scalars['String'];
  members: Array<ProfileOrOrganisation>;
};

export type Membership = {
  __typename?: 'Membership';
  createdAt: Scalars['String'];
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  acceptedAt?: Maybe<Scalars['String']>;
  rejectedAt?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
  isAdmin: Scalars['Boolean'];
  organisation: Organisation;
};

export type MembershipAccepted = IEventPayload & {
  __typename?: 'MembershipAccepted';
  transaction_hash?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type MembershipOffer = IEventPayload & {
  __typename?: 'MembershipOffer';
  transaction_hash?: Maybe<Scalars['String']>;
  createdBy: Scalars['String'];
  createdBy_profile?: Maybe<Profile>;
  isAdmin: Scalars['Boolean'];
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type MembershipRejected = IEventPayload & {
  __typename?: 'MembershipRejected';
  transaction_hash?: Maybe<Scalars['String']>;
  member: Scalars['String'];
  member_profile?: Maybe<Profile>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type Memberships = IAggregatePayload & {
  __typename?: 'Memberships';
  lastUpdatedAt: Scalars['String'];
  organisations: Array<Organisation>;
};

export type Mutation = {
  __typename?: 'Mutation';
  payWithPath: TransitivePath;
  announcePayment: AnnouncePaymentResult;
  purchase: Array<Invoice>;
  completePurchase: Invoice;
  completeSale: Invoice;
  confirmLegalAge: Scalars['Boolean'];
  logout: LogoutResponse;
  upsertProfile: Profile;
  requestUpdateSafe: RequestUpdateSafeResponse;
  updateSafe: UpdateSafeResponse;
  upsertTag: Tag;
  upsertShippingAddress?: Maybe<PostAddress>;
  deleteShippingAddress?: Maybe<PostAddress>;
  upsertOrganisation: CreateOrganisationResult;
  upsertRegion: CreateOrganisationResult;
  upsertShop: Shop;
  upsertShopCategories: UpsertShopCategoriesResult;
  upsertShopCategoryEntries: UpsertShopCategoryEntriesResult;
  upsertOffer: Offer;
  addMember?: Maybe<AddMemberResult>;
  acceptMembership?: Maybe<AcceptMembershipResult>;
  removeMember?: Maybe<RemoveMemberResult>;
  rejectMembership?: Maybe<RejectMembershipResult>;
  acknowledge: Scalars['Boolean'];
  createTestInvitation: CreateInvitationResult;
  claimInvitation: ClaimInvitationResult;
  redeemClaimedInvitation: RedeemClaimedInvitationResult;
  tagTransaction: TagTransactionResult;
  sendMessage: SendMessageResult;
  requestSessionChallenge: Scalars['String'];
  verifySessionChallenge?: Maybe<ExchangeTokenResponse>;
  importOrganisationsOfAccount: Array<Organisation>;
  verifySafe: VerifySafeResult;
  revokeSafeVerification: VerifySafeResult;
  proofUniqueness: ProofUniquenessResult;
  updateValue?: Maybe<I18n>;
  addNewLang?: Maybe<Scalars['Int']>;
  createNewStringAndKey?: Maybe<I18n>;
  setStringUpdateState?: Maybe<Array<Maybe<I18n>>>;
};


export type MutationPayWithPathArgs = {
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
};


export type MutationAnnouncePaymentArgs = {
  invoiceId: Scalars['Int'];
  transactionHash: Scalars['String'];
};


export type MutationPurchaseArgs = {
  lines: Array<PurchaseLineInput>;
  deliveryMethodId: Scalars['Int'];
  deliveryAddressId?: Maybe<Scalars['Int']>;
};


export type MutationCompletePurchaseArgs = {
  invoiceId: Scalars['Int'];
  revoke?: Maybe<Scalars['Boolean']>;
};


export type MutationCompleteSaleArgs = {
  invoiceId: Scalars['Int'];
  revoke?: Maybe<Scalars['Boolean']>;
};


export type MutationConfirmLegalAgeArgs = {
  age: Scalars['Int'];
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};


export type MutationRequestUpdateSafeArgs = {
  data: RequestUpdateSafeInput;
};


export type MutationUpdateSafeArgs = {
  data: UpdateSafeInput;
};


export type MutationUpsertTagArgs = {
  data: UpsertTagInput;
};


export type MutationUpsertShippingAddressArgs = {
  data: PostAddressInput;
};


export type MutationDeleteShippingAddressArgs = {
  id: Scalars['Int'];
};


export type MutationUpsertOrganisationArgs = {
  organisation: UpsertOrganisationInput;
};


export type MutationUpsertRegionArgs = {
  organisation: UpsertOrganisationInput;
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


export type MutationUpsertOfferArgs = {
  offer: OfferInput;
};


export type MutationAddMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
};


export type MutationAcceptMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationRemoveMemberArgs = {
  groupId: Scalars['String'];
  memberAddress: Scalars['String'];
};


export type MutationRejectMembershipArgs = {
  membershipId: Scalars['Int'];
};


export type MutationAcknowledgeArgs = {
  until: Scalars['Date'];
  safeAddress?: Maybe<Scalars['String']>;
};


export type MutationClaimInvitationArgs = {
  code: Scalars['String'];
};


export type MutationTagTransactionArgs = {
  transactionHash: Scalars['String'];
  tag: CreateTagInput;
};


export type MutationSendMessageArgs = {
  fromSafeAddress?: Maybe<Scalars['String']>;
  toSafeAddress: Scalars['String'];
  content: Scalars['String'];
};


export type MutationRequestSessionChallengeArgs = {
  address: Scalars['String'];
};


export type MutationVerifySessionChallengeArgs = {
  challenge: Scalars['String'];
  signature: Scalars['String'];
};


export type MutationVerifySafeArgs = {
  safeAddress: Scalars['String'];
};


export type MutationRevokeSafeVerificationArgs = {
  safeAddress: Scalars['String'];
};


export type MutationProofUniquenessArgs = {
  humanodeToken: Scalars['String'];
};


export type MutationUpdateValueArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type MutationAddNewLangArgs = {
  langToCreate?: Maybe<Scalars['String']>;
  langToCopyFrom?: Maybe<Scalars['String']>;
};


export type MutationCreateNewStringAndKeyArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};


export type MutationSetStringUpdateStateArgs = {
  key?: Maybe<Scalars['String']>;
};

export type MyInviteRank = {
  __typename?: 'MyInviteRank';
  rank: Scalars['Int'];
  redeemedInvitationsCount: Scalars['Int'];
};

export type NewUser = IEventPayload & {
  __typename?: 'NewUser';
  transaction_hash?: Maybe<Scalars['String']>;
  profile: Profile;
};

export type NotificationEvent = {
  __typename?: 'NotificationEvent';
  type: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
  itemId?: Maybe<Scalars['Int']>;
  transaction_hash?: Maybe<Scalars['String']>;
};

export type Offer = {
  __typename?: 'Offer';
  id: Scalars['Int'];
  version: Scalars['Int'];
  createdByProfile?: Maybe<Profile>;
  createdByAddress: Scalars['String'];
  createdAt: Scalars['String'];
  minAge?: Maybe<Scalars['Int']>;
  currentInventory?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  pictureUrl: Scalars['String'];
  pictureMimeType: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  allergens?: Maybe<Scalars['String']>;
  pricePerUnit: Scalars['String'];
  timeCirclesPriceShare: Scalars['Int'];
  tags?: Maybe<Array<Tag>>;
};

export type OfferByIdAndVersionInput = {
  offerId: Scalars['Int'];
  offerVersion?: Maybe<Scalars['Int']>;
};

export type OfferInput = {
  id?: Maybe<Scalars['Int']>;
  createdByProfileId: Scalars['Int'];
  title: Scalars['String'];
  pictureUrl: Scalars['String'];
  pictureMimeType: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  allergens?: Maybe<Scalars['String']>;
  minAge?: Maybe<Scalars['Int']>;
  currentInventory?: Maybe<Scalars['Int']>;
  pricePerUnit: Scalars['String'];
  timeCirclesPriceShare: Scalars['Int'];
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
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  productListingType?: Maybe<ProductListingType>;
  avatarMimeType?: Maybe<Scalars['String']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  city?: Maybe<City>;
  offers?: Maybe<Array<Offer>>;
  members?: Maybe<Array<ProfileOrOrganisation>>;
  shopEnabled?: Maybe<Scalars['Boolean']>;
  trustsYou?: Maybe<Scalars['Int']>;
  shops?: Maybe<Array<Shop>>;
};

export type OrganisationCreated = IEventPayload & {
  __typename?: 'OrganisationCreated';
  transaction_hash?: Maybe<Scalars['String']>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
};

export type PaginationArgs = {
  continueAt?: Maybe<Scalars['String']>;
  continueAtId?: Maybe<Scalars['Int']>;
  order: SortOrder;
  limit: Scalars['Int'];
};

export type PostAddress = {
  __typename?: 'PostAddress';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  street: Scalars['String'];
  house: Scalars['String'];
  zip: Scalars['String'];
  city: Scalars['String'];
  state?: Maybe<Scalars['String']>;
  country: Scalars['String'];
  osmId?: Maybe<Scalars['String']>;
  hereLocationId?: Maybe<Scalars['String']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
};

export type PostAddressInput = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  street: Scalars['String'];
  house: Scalars['String'];
  zip: Scalars['String'];
  cityGeonameid: Scalars['Int'];
};

export enum ProductListingType {
  Tiles = 'TILES',
  List = 'LIST'
}

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['Int'];
  type?: Maybe<ProfileType>;
  origin?: Maybe<ProfileOrigin>;
  status?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  confirmedLegalAge?: Maybe<Scalars['Int']>;
  emailAddress?: Maybe<Scalars['String']>;
  askedForEmailAddress: Scalars['Boolean'];
  dream?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  productListingType?: Maybe<ProductListingType>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  city?: Maybe<City>;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  invitationTransaction?: Maybe<ProfileEvent>;
  invitationLink?: Maybe<Scalars['String']>;
  memberships?: Maybe<Array<Membership>>;
  members?: Maybe<Array<Profile>>;
  displayCurrency?: Maybe<DisplayCurrency>;
  verifications?: Maybe<Array<Verification>>;
  offers?: Maybe<Array<Offer>>;
  purchases?: Maybe<Array<Purchase>>;
  sales?: Maybe<Array<Sale>>;
  balances?: Maybe<ProfileBalances>;
  contacts?: Maybe<Array<Contact>>;
  shops?: Maybe<Array<Shop>>;
  shippingAddresses?: Maybe<Array<PostAddress>>;
  provenUniqueness?: Maybe<Scalars['Boolean']>;
  age?: Maybe<Scalars['Int']>;
  gender?: Maybe<Gender>;
};

export type ProfileAggregate = {
  __typename?: 'ProfileAggregate';
  type: Scalars['String'];
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  payload: AggregatePayload;
};

export type ProfileAggregateFilter = {
  contacts?: Maybe<ContactAggregateFilter>;
  crcBalance?: Maybe<CrcBalanceAggregateFilter>;
  offers?: Maybe<OffersAggregateFilter>;
  purchases?: Maybe<PurchasesAggregateFilter>;
  sales?: Maybe<SalesAggregateFilter>;
};

export type ProfileBalances = {
  __typename?: 'ProfileBalances';
  crcBalances?: Maybe<CrcBalances>;
  erc20Balances?: Maybe<Erc20Balances>;
};

export type ProfileEvent = {
  __typename?: 'ProfileEvent';
  timestamp: Scalars['String'];
  block_number?: Maybe<Scalars['Int']>;
  transaction_index?: Maybe<Scalars['Int']>;
  transaction_hash?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  safe_address: Scalars['String'];
  safe_address_profile?: Maybe<Profile>;
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
  direction: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  payload?: Maybe<EventPayload>;
  tags?: Maybe<Array<Tag>>;
};

export type ProfileEventFilter = {
  direction?: Maybe<Direction>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  with?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  purchased?: Maybe<PurchasedEventFilter>;
  sale?: Maybe<SaleEventFilter>;
  chatMessage?: Maybe<ChatMessageEventFilter>;
};

export type ProfileOrOrganisation = Profile | Organisation;

export enum ProfileOrigin {
  CirclesGarden = 'CirclesGarden',
  CirclesLand = 'CirclesLand',
  Unknown = 'Unknown'
}

export enum ProfileType {
  Person = 'PERSON',
  Organisation = 'ORGANISATION',
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
  timestamp: Scalars['String'];
  block_number?: Maybe<Scalars['Int']>;
  transaction_index?: Maybe<Scalars['Int']>;
  transaction_hash?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  contact_address?: Maybe<Scalars['String']>;
  contact_address_profile?: Maybe<Profile>;
  payload?: Maybe<EventPayload>;
};

export type Purchase = {
  __typename?: 'Purchase';
  id: Scalars['Int'];
  createdByProfile?: Maybe<Profile>;
  createdByAddress: Scalars['String'];
  createdAt: Scalars['String'];
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: Maybe<PostAddress>;
  total: Scalars['String'];
  lines?: Maybe<Array<PurchaseLine>>;
  invoices?: Maybe<Array<Invoice>>;
};

export type PurchaseLine = {
  __typename?: 'PurchaseLine';
  id: Scalars['Int'];
  metadata?: Maybe<Scalars['String']>;
  amount: Scalars['Int'];
  offer?: Maybe<Offer>;
  shop?: Maybe<Shop>;
};

export type PurchaseLineInput = {
  offerId: Scalars['Int'];
  shopId: Scalars['Int'];
  amount: Scalars['Int'];
  metadata?: Maybe<Scalars['String']>;
};

export type Purchased = IEventPayload & {
  __typename?: 'Purchased';
  transaction_hash?: Maybe<Scalars['String']>;
  seller: Scalars['String'];
  seller_profile?: Maybe<Profile>;
  purchase: Purchase;
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
  createdByAddresses?: Maybe<Array<Scalars['String']>>;
  purchaseIds?: Maybe<Array<Scalars['Int']>>;
  pickupCode?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  version: Version;
  sessionInfo: SessionInfo;
  init: SessionInfo;
  claimedInvitation?: Maybe<ClaimedInvitation>;
  invitationTransaction?: Maybe<ProfileEvent>;
  hubSignupTransaction?: Maybe<ProfileEvent>;
  safeInfo?: Maybe<SafeInfo>;
  lastAcknowledgedAt?: Maybe<Scalars['Date']>;
  verifications: Array<Verification>;
  events: Array<ProfileEvent>;
  aggregates: Array<ProfileAggregate>;
  shops: Array<Shop>;
  shopsById: Array<Shop>;
  shop?: Maybe<Shop>;
  organisations: Array<Organisation>;
  regions: Array<Organisation>;
  organisationsByAddress: Array<Organisation>;
  myInvitations: Array<CreatedInvitation>;
  commonTrust: Array<CommonTrust>;
  trustRelations: Array<TrustRelation>;
  myProfile?: Maybe<Profile>;
  profilesById: Array<Profile>;
  recentProfiles: Array<Profile>;
  profilesBySafeAddress: Array<Profile>;
  findSafesByOwner: Array<SafeInfo>;
  search: Array<Profile>;
  stats: Stats;
  deliveryMethods?: Maybe<Array<Maybe<DeliveryMethod>>>;
  cities: Array<City>;
  tags: Array<Tag>;
  tagById?: Maybe<Tag>;
  offerById: Offer;
  offersByIdAndVersion: Array<Offer>;
  directPath: TransitivePath;
  paymentPath: TransitivePath;
  invoice?: Maybe<Scalars['String']>;
  findInvitationCreator?: Maybe<Profile>;
  clientAssertionJwt: Scalars['String'];
  getAllStrings?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByLanguage?: Maybe<Array<Maybe<I18n>>>;
  getStringByLanguage?: Maybe<Array<I18n>>;
  getStringByMaxVersion?: Maybe<I18n>;
  getStringsByMaxVersionKeyAndValue?: Maybe<Array<Maybe<I18n>>>;
  getStringsFromLatestValuesByValue?: Maybe<Array<Maybe<I18n>>>;
  getFirst20StringsByMaxVersionKey?: Maybe<Array<Maybe<I18n>>>;
  getAvailableLanguages?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByMaxVersion?: Maybe<Array<Maybe<I18n>>>;
  getAllStringsByMaxVersionAndLang?: Maybe<Array<Maybe<I18n>>>;
  getOlderVersionsByKeyAndLang?: Maybe<Array<Maybe<I18n>>>;
  getPaginatedStrings?: Maybe<Array<Maybe<I18n>>>;
  getPaginatedStringsToUpdate?: Maybe<Array<Maybe<I18n>>>;
  allProfiles: Array<Maybe<ExportProfile>>;
  allTrusts: Array<ExportTrustRelation>;
  getRandomAccount?: Maybe<RandomAccount>;
  signMessage: Scalars['String'];
  getStringsToBeUpdatedAmount?: Maybe<Scalars['Int']>;
};


export type QuerySafeInfoArgs = {
  safeAddress?: Maybe<Scalars['String']>;
};


export type QueryLastAcknowledgedAtArgs = {
  safeAddress: Scalars['String'];
};


export type QueryVerificationsArgs = {
  pagination?: Maybe<PaginationArgs>;
  filter?: Maybe<VerifiedSafesFilter>;
};


export type QueryEventsArgs = {
  types: Array<EventType>;
  safeAddress: Scalars['String'];
  pagination: PaginationArgs;
  filter?: Maybe<ProfileEventFilter>;
};


export type QueryAggregatesArgs = {
  types: Array<AggregateType>;
  safeAddress: Scalars['String'];
  filter?: Maybe<ProfileAggregateFilter>;
};


export type QueryShopsArgs = {
  ownerId?: Maybe<Scalars['Int']>;
};


export type QueryShopsByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryShopArgs = {
  id: Scalars['Int'];
  ownerId?: Maybe<Scalars['Int']>;
};


export type QueryOrganisationsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryRegionsArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryOrganisationsByAddressArgs = {
  addresses: Array<Scalars['String']>;
};


export type QueryCommonTrustArgs = {
  safeAddress1: Scalars['String'];
  safeAddress2: Scalars['String'];
};


export type QueryTrustRelationsArgs = {
  safeAddress: Scalars['String'];
};


export type QueryProfilesByIdArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryRecentProfilesArgs = {
  pagination?: Maybe<PaginationArgs>;
};


export type QueryProfilesBySafeAddressArgs = {
  safeAddresses: Array<Scalars['String']>;
};


export type QueryFindSafesByOwnerArgs = {
  owner: Scalars['String'];
};


export type QuerySearchArgs = {
  query: SearchInput;
};


export type QueryCitiesArgs = {
  query: QueryCitiesInput;
};


export type QueryTagsArgs = {
  query: QueryTagsInput;
};


export type QueryTagByIdArgs = {
  id: Scalars['Int'];
};


export type QueryOfferByIdArgs = {
  id: Scalars['Int'];
};


export type QueryOffersByIdAndVersionArgs = {
  query: Array<OfferByIdAndVersionInput>;
};


export type QueryDirectPathArgs = {
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
};


export type QueryPaymentPathArgs = {
  from: Scalars['String'];
  to: Scalars['String'];
  amount: Scalars['String'];
};


export type QueryInvoiceArgs = {
  invoiceId: Scalars['Int'];
};


export type QueryFindInvitationCreatorArgs = {
  code: Scalars['String'];
};


export type QueryGetAllStringsByLanguageArgs = {
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetStringByLanguageArgs = {
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetStringByMaxVersionArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
};


export type QueryGetStringsByMaxVersionKeyAndValueArgs = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type QueryGetStringsFromLatestValuesByValueArgs = {
  value?: Maybe<Scalars['String']>;
};


export type QueryGetFirst20StringsByMaxVersionKeyArgs = {
  key?: Maybe<Scalars['String']>;
};


export type QueryGetAllStringsByMaxVersionAndLangArgs = {
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetOlderVersionsByKeyAndLangArgs = {
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};


export type QueryGetPaginatedStringsArgs = {
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type QueryGetPaginatedStringsToUpdateArgs = {
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type QueryAllProfilesArgs = {
  sinceLastChange?: Maybe<Scalars['Date']>;
};


export type QueryAllTrustsArgs = {
  sinceLastChange?: Maybe<Scalars['Date']>;
};


export type QuerySignMessageArgs = {
  message: Scalars['String'];
  key: Scalars['String'];
};


export type QueryGetStringsToBeUpdatedAmountArgs = {
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
};

export type QueryCitiesByGeonameIdInput = {
  geonameid: Array<Scalars['Int']>;
};

export type QueryCitiesByNameInput = {
  name_like: Scalars['String'];
  languageCode?: Maybe<Scalars['String']>;
};

export type QueryCitiesInput = {
  byName?: Maybe<QueryCitiesByNameInput>;
  byId?: Maybe<QueryCitiesByGeonameIdInput>;
};

export type QueryProfileInput = {
  id?: Maybe<Array<Scalars['Int']>>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Array<Scalars['String']>>;
};

export type QueryTagsInput = {
  typeId_in: Array<Scalars['String']>;
  value_like?: Maybe<Scalars['String']>;
};

export type QueryUniqueProfileInput = {
  id: Scalars['Int'];
};

export type RandomAccount = {
  __typename?: 'RandomAccount';
  privateKey?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type RedeemClaimedInvitationResult = {
  __typename?: 'RedeemClaimedInvitationResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type RejectMembershipResult = {
  __typename?: 'RejectMembershipResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type RemoveMemberResult = {
  __typename?: 'RemoveMemberResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type RequestUpdateSafeInput = {
  newSafeAddress: Scalars['String'];
};

export type RequestUpdateSafeResponse = {
  __typename?: 'RequestUpdateSafeResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  challenge?: Maybe<Scalars['String']>;
};

export type SafeAddressByOwnerResult = {
  __typename?: 'SafeAddressByOwnerResult';
  type: Scalars['String'];
  safeAddress: Scalars['String'];
};

export type SafeInfo = {
  __typename?: 'SafeInfo';
  type: AccountType;
  safeAddress: Scalars['String'];
  lastUbiAt?: Maybe<Scalars['String']>;
  tokenAddress?: Maybe<Scalars['String']>;
  randomValue?: Maybe<Scalars['String']>;
  safeProfile?: Maybe<Profile>;
};

export type SafeVerified = IEventPayload & {
  __typename?: 'SafeVerified';
  transaction_hash?: Maybe<Scalars['String']>;
  organisation: Scalars['String'];
  organisation_profile?: Maybe<Organisation>;
  safe_address: Scalars['String'];
};

export type Sale = {
  __typename?: 'Sale';
  id: Scalars['Int'];
  sellerAddress: Scalars['String'];
  sellerProfile?: Maybe<Profile>;
  buyerAddress: Scalars['String'];
  buyerProfile?: Maybe<Profile>;
  createdAt: Scalars['String'];
  total: Scalars['String'];
  lines?: Maybe<Array<SalesLine>>;
  paymentTransaction?: Maybe<ProfileEvent>;
  invoices?: Maybe<Array<Invoice>>;
};

export type SaleEvent = IEventPayload & {
  __typename?: 'SaleEvent';
  transaction_hash?: Maybe<Scalars['String']>;
  buyer: Scalars['String'];
  buyer_profile?: Maybe<Profile>;
  invoice?: Maybe<Invoice>;
};

export type SaleEventFilter = {
  invoiceId?: Maybe<Scalars['Int']>;
  pickupCode?: Maybe<Scalars['String']>;
};

export type Sales = IAggregatePayload & {
  __typename?: 'Sales';
  lastUpdatedAt: Scalars['String'];
  sales: Array<Sale>;
};

export type SalesAggregateFilter = {
  createdByAddresses?: Maybe<Array<Scalars['String']>>;
  salesIds?: Maybe<Array<Scalars['Int']>>;
  pickupCode?: Maybe<Scalars['String']>;
};

export type SalesLine = {
  __typename?: 'SalesLine';
  id: Scalars['Int'];
  metadata?: Maybe<Scalars['String']>;
  amount: Scalars['Int'];
  offer: Offer;
  shop?: Maybe<Shop>;
};

export type SearchInput = {
  searchString: Scalars['String'];
};

export type SendMessageResult = {
  __typename?: 'SendMessageResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  event?: Maybe<ProfileEvent>;
};

export type Server = {
  __typename?: 'Server';
  version: Scalars['String'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  isLoggedOn: Scalars['Boolean'];
  hasProfile?: Maybe<Scalars['Boolean']>;
  profileId?: Maybe<Scalars['Int']>;
  profile?: Maybe<Profile>;
  capabilities: Array<Capability>;
  useShortSignup?: Maybe<Scalars['Boolean']>;
};

export type Shop = {
  __typename?: 'Shop';
  id: Scalars['Int'];
  createdAt: Scalars['Date'];
  private?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  description: Scalars['String'];
  legalText?: Maybe<Scalars['String']>;
  largeBannerUrl: Scalars['String'];
  smallBannerUrl: Scalars['String'];
  shopListingStyle: ShopListingStyle;
  sortOrder?: Maybe<Scalars['Int']>;
  productListingStyle: ProductListingType;
  purchaseMetaDataKeys?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['Int']>;
  owner: Organisation;
  openingHours?: Maybe<Scalars['String']>;
  pickupAddress?: Maybe<PostAddress>;
  categories?: Maybe<Array<ShopCategory>>;
  deliveryMethods?: Maybe<Array<DeliveryMethod>>;
  privacyPolicyLink?: Maybe<Scalars['String']>;
  tosLink?: Maybe<Scalars['String']>;
  healthInfosLink?: Maybe<Scalars['String']>;
  adultOnly?: Maybe<Scalars['Boolean']>;
};

export type ShopCategory = {
  __typename?: 'ShopCategory';
  id: Scalars['Int'];
  createdAt?: Maybe<Scalars['Date']>;
  shop?: Maybe<Shop>;
  shopId: Scalars['Int'];
  private?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  productListingStyle?: Maybe<ProductListingType>;
  entries?: Maybe<Array<ShopCategoryEntry>>;
};

export type ShopCategoryEntry = {
  __typename?: 'ShopCategoryEntry';
  id: Scalars['Int'];
  createdAt: Scalars['Date'];
  private?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  product?: Maybe<Offer>;
  productId: Scalars['Int'];
  productVersion: Scalars['Int'];
  sortOrder?: Maybe<Scalars['Int']>;
  shopCategory?: Maybe<ShopCategory>;
  shopCategoryId: Scalars['Int'];
};

export type ShopCategoryEntryInput = {
  id?: Maybe<Scalars['Int']>;
  private?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  shopCategoryId: Scalars['Int'];
  productId: Scalars['Int'];
  productVersion: Scalars['Int'];
  sortOrder?: Maybe<Scalars['Int']>;
};

export type ShopCategoryInput = {
  id?: Maybe<Scalars['Int']>;
  shopId: Scalars['Int'];
  private?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  productListingStyle?: Maybe<ProductListingType>;
};

export type ShopInput = {
  id?: Maybe<Scalars['Int']>;
  enabled: Scalars['Boolean'];
  private?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  description: Scalars['String'];
  legalText?: Maybe<Scalars['String']>;
  largeBannerUrl: Scalars['String'];
  smallBannerUrl: Scalars['String'];
  shopListingStyle: ShopListingStyle;
  sortOrder?: Maybe<Scalars['Int']>;
  productListingStyle: ProductListingType;
  ownerId: Scalars['Int'];
  openingHours?: Maybe<Scalars['String']>;
  privacyPolicyLink?: Maybe<Scalars['String']>;
  tosLink?: Maybe<Scalars['String']>;
  healthInfosLink?: Maybe<Scalars['String']>;
  adultOnly?: Maybe<Scalars['Boolean']>;
  deliveryMethodIds?: Maybe<Array<Scalars['Int']>>;
};

export enum ShopListingStyle {
  Regular = 'REGULAR',
  Featured = 'FEATURED'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Stats = {
  __typename?: 'Stats';
  profilesCount: Scalars['Int'];
  verificationsCount: Scalars['Int'];
  leaderboard: Array<LeaderboardEntry>;
  goals: FibonacciGoals;
  myRank: MyInviteRank;
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
  order?: Maybe<Scalars['Int']>;
};

export type TagTransactionResult = {
  __typename?: 'TagTransactionResult';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  tag?: Maybe<Tag>;
};

export type TransitivePath = {
  __typename?: 'TransitivePath';
  requestedAmount: Scalars['String'];
  flow: Scalars['String'];
  success: Scalars['Boolean'];
  transfers: Array<TransitiveTransfer>;
};

export type TransitiveTransfer = {
  __typename?: 'TransitiveTransfer';
  isHubTransfer?: Maybe<Scalars['Boolean']>;
  from: Scalars['String'];
  to: Scalars['String'];
  token: Scalars['String'];
  tokenOwner: Scalars['String'];
  value: Scalars['String'];
};

export enum TrustDirection {
  In = 'IN',
  Out = 'OUT',
  Mutual = 'MUTUAL'
}

export type TrustRelation = {
  __typename?: 'TrustRelation';
  safeAddress: Scalars['String'];
  safeAddressProfile?: Maybe<Profile>;
  otherSafeAddress: Scalars['String'];
  otherSafeAddressProfile?: Maybe<Profile>;
  direction: TrustDirection;
};

export type UpdateSafeInput = {
  signature: Scalars['String'];
};

export type UpdateSafeResponse = {
  __typename?: 'UpdateSafeResponse';
  success: Scalars['Boolean'];
  errorMessage?: Maybe<Scalars['String']>;
  newSafeAddress?: Maybe<Scalars['String']>;
};

export type UpsertOrganisationInput = {
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  largeBannerUrl?: Maybe<Scalars['String']>;
  smallBannerUrl?: Maybe<Scalars['String']>;
  productListingType?: Maybe<ProductListingType>;
  avatarMimeType?: Maybe<Scalars['String']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  displayCurrency?: Maybe<DisplayCurrency>;
};

export type UpsertProfileInput = {
  id?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  dream?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  emailAddress?: Maybe<Scalars['String']>;
  askedForEmailAddress?: Maybe<Scalars['Boolean']>;
  successorOfCirclesAddress?: Maybe<Scalars['String']>;
  circlesAddress?: Maybe<Scalars['String']>;
  circlesSafeOwner?: Maybe<Scalars['String']>;
  circlesTokenAddress?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  avatarCid?: Maybe<Scalars['String']>;
  avatarMimeType?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  displayTimeCircles?: Maybe<Scalars['Boolean']>;
  cityGeonameid?: Maybe<Scalars['Int']>;
  displayCurrency?: Maybe<DisplayCurrency>;
  age?: Maybe<Scalars['Int']>;
  gender?: Maybe<Gender>;
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
  id?: Maybe<Scalars['Int']>;
  typeId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type Verification = {
  __typename?: 'Verification';
  createdAt: Scalars['String'];
  verifierSafeAddress: Scalars['String'];
  verifierProfile?: Maybe<Organisation>;
  verifiedSafeAddress: Scalars['String'];
  verifiedProfile?: Maybe<Profile>;
  revokedAt?: Maybe<Scalars['String']>;
  revokedProfile?: Maybe<Profile>;
  verificationRewardTransactionHash: Scalars['String'];
  verificationRewardTransaction?: Maybe<ProfileEvent>;
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
  transaction_hash?: Maybe<Scalars['String']>;
  invitedBy: Scalars['String'];
  invitedBy_profile?: Maybe<Profile>;
};

export type I18n = {
  __typename?: 'i18n';
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
  pagination_key?: Maybe<Scalars['String']>;
  needsUpdate?: Maybe<Scalars['Boolean']>;
};

export type UpsertShippingAddressMutationVariables = Exact<{
  data: PostAddressInput;
}>;


export type UpsertShippingAddressMutation = (
  { __typename?: 'Mutation' }
  & { upsertShippingAddress?: Maybe<(
    { __typename?: 'PostAddress' }
    & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'cityGeonameid' | 'city' | 'state' | 'country'>
  )> }
);

export type CreatePurchaseMutationVariables = Exact<{
  lines: Array<PurchaseLineInput> | PurchaseLineInput;
  deliveryMethodId: Scalars['Int'];
  deliveryAddressId?: Maybe<Scalars['Int']>;
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
    )>, lines?: Maybe<Array<(
      { __typename?: 'InvoiceLine' }
      & Pick<InvoiceLine, 'id' | 'amount'>
      & { offer?: Maybe<(
        { __typename?: 'Offer' }
        & Pick<Offer, 'id' | 'version' | 'createdByAddress' | 'pricePerUnit' | 'title' | 'description'>
        & { createdByProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl'>
        )> }
      )> }
    )>> }
  )> }
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

export type AddNewLangMutationVariables = Exact<{
  langToCreate?: Maybe<Scalars['String']>;
  langToCopyFrom?: Maybe<Scalars['String']>;
}>;


export type AddNewLangMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addNewLang'>
);

export type UpdateValueMutationVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
}>;


export type UpdateValueMutation = (
  { __typename?: 'Mutation' }
  & { updateValue?: Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'value' | 'version'>
  )> }
);

export type CreateNewStringAndKeyMutationVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
}>;


export type CreateNewStringAndKeyMutation = (
  { __typename?: 'Mutation' }
  & { createNewStringAndKey?: Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'needsUpdate'>
  )> }
);

export type SetStringUpdateStateMutationVariables = Exact<{
  key?: Maybe<Scalars['String']>;
}>;


export type SetStringUpdateStateMutation = (
  { __typename?: 'Mutation' }
  & { setStringUpdateState?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'needsUpdate'>
  )>>> }
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
  until: Scalars['Date'];
  safeAddress?: Maybe<Scalars['String']>;
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
      )>>, payload?: Maybe<{ __typename?: 'CrcSignup' } | { __typename?: 'CrcTrust' } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | { __typename?: 'EthTransfer' } | { __typename?: 'Erc20Transfer' } | { __typename?: 'GnosisSafeEthTransfer' } | (
        { __typename?: 'ChatMessage' }
        & Pick<ChatMessage, 'id' | 'from' | 'to' | 'text'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress'>
        )> }
      ) | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipRejected' } | { __typename?: 'WelcomeMessage' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'MemberAdded' } | { __typename?: 'SaleEvent' } | { __typename?: 'Purchased' } | { __typename?: 'SafeVerified' } | { __typename?: 'NewUser' }> }
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
  emailAddress?: Maybe<Scalars['String']>;
  askedForEmailAddress: Scalars['Boolean'];
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
  gender?: Maybe<Gender>;
  age?: Maybe<Scalars['Int']>;
}>;


export type UpsertProfileMutation = (
  { __typename?: 'Mutation' }
  & { upsertProfile: (
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'cityGeonameid' | 'age' | 'gender'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
        )> }
      )> }
    )>> }
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
    & { purchase?: Maybe<(
      { __typename?: 'Purchase' }
      & Pick<Purchase, 'id'>
    )>, sellerProfile?: Maybe<(
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
    & Pick<AnnouncePaymentResult, 'transactionHash' | 'invoiceId' | 'pickupCode' | 'simplePickupCode'>
  ) }
);

export type UpsertShopMutationVariables = Exact<{
  shop: ShopInput;
}>;


export type UpsertShopMutation = (
  { __typename?: 'Mutation' }
  & { upsertShop: (
    { __typename?: 'Shop' }
    & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'adultOnly' | 'private' | 'productListingStyle'>
    & { owner: (
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
    ), categories?: Maybe<Array<(
      { __typename?: 'ShopCategory' }
      & Pick<ShopCategory, 'id' | 'name' | 'description' | 'sortOrder' | 'enabled' | 'private' | 'largeBannerUrl' | 'smallBannerUrl' | 'productListingStyle' | 'createdAt'>
      & { entries?: Maybe<Array<(
        { __typename?: 'ShopCategoryEntry' }
        & Pick<ShopCategoryEntry, 'id' | 'sortOrder'>
        & { product?: Maybe<(
          { __typename?: 'Offer' }
          & Pick<Offer, 'id' | 'version' | 'title' | 'description' | 'currentInventory' | 'pictureUrl' | 'pricePerUnit'>
          & { createdByProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'id' | 'displayName' | 'avatarUrl' | 'circlesAddress'>
          )> }
        )> }
      )>> }
    )>> }
  ) }
);

export type UpsertShopCategoriesMutationVariables = Exact<{
  shopCategories: Array<ShopCategoryInput> | ShopCategoryInput;
}>;


export type UpsertShopCategoriesMutation = (
  { __typename?: 'Mutation' }
  & { upsertShopCategories: (
    { __typename?: 'UpsertShopCategoriesResult' }
    & Pick<UpsertShopCategoriesResult, 'inserted' | 'updated'>
  ) }
);

export type UpsertShopCategoryEntriesMutationVariables = Exact<{
  shopCategoryEntries: Array<ShopCategoryEntryInput> | ShopCategoryEntryInput;
}>;


export type UpsertShopCategoryEntriesMutation = (
  { __typename?: 'Mutation' }
  & { upsertShopCategoryEntries: (
    { __typename?: 'UpsertShopCategoryEntriesResult' }
    & Pick<UpsertShopCategoryEntriesResult, 'inserted' | 'updated'>
  ) }
);

export type ConfirmLegalAgeMutationVariables = Exact<{
  age: Scalars['Int'];
}>;


export type ConfirmLegalAgeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'confirmLegalAge'>
);

export type UpsertOfferMutationVariables = Exact<{
  offer: OfferInput;
}>;


export type UpsertOfferMutation = (
  { __typename?: 'Mutation' }
  & { upsertOffer: (
    { __typename?: 'Offer' }
    & Pick<Offer, 'id' | 'version' | 'createdAt' | 'createdByAddress' | 'title' | 'description' | 'pictureUrl' | 'pricePerUnit' | 'minAge' | 'currentInventory' | 'timeCirclesPriceShare'>
    & { tags?: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'typeId' | 'value'>
    )>> }
  ) }
);

export type ProofUniquenessMutationVariables = Exact<{
  humanodeToken: Scalars['String'];
}>;


export type ProofUniquenessMutation = (
  { __typename?: 'Mutation' }
  & { proofUniqueness: (
    { __typename?: 'ProofUniquenessResult' }
    & Pick<ProofUniquenessResult, 'existingSafe'>
  ) }
);

export type InitQueryVariables = Exact<{ [key: string]: never; }>;


export type InitQuery = (
  { __typename?: 'Query' }
  & { init: (
    { __typename?: 'SessionInfo' }
    & Pick<SessionInfo, 'isLoggedOn' | 'hasProfile' | 'profileId' | 'useShortSignup'>
    & { capabilities: Array<(
      { __typename?: 'Capability' }
      & Pick<Capability, 'type'>
    )>, profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'confirmedLegalAge' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'cityGeonameid' | 'provenUniqueness' | 'circlesTokenAddress'>
      & { shippingAddresses?: Maybe<Array<(
        { __typename?: 'PostAddress' }
        & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country' | 'cityGeonameid'>
      )>>, shops?: Maybe<Array<(
        { __typename?: 'Shop' }
        & Pick<Shop, 'id'>
      )>>, city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'name' | 'country'>
      )>, memberships?: Maybe<Array<(
        { __typename?: 'Membership' }
        & Pick<Membership, 'isAdmin'>
        & { organisation: (
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
          )> }
        ) }
      )>>, verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country'>
          )> }
        )> }
      )>>, claimedInvitation?: Maybe<(
        { __typename?: 'ClaimedInvitation' }
        & Pick<ClaimedInvitation, 'claimedAt'>
      )>, invitationTransaction?: Maybe<(
        { __typename?: 'ProfileEvent' }
        & Pick<ProfileEvent, 'timestamp' | 'transaction_hash'>
      )> }
    )> }
  ) }
);

export type DeliveryMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type DeliveryMethodsQuery = (
  { __typename?: 'Query' }
  & { deliveryMethods?: Maybe<Array<Maybe<(
    { __typename?: 'DeliveryMethod' }
    & Pick<DeliveryMethod, 'id' | 'name'>
  )>>> }
);

export type LastAcknowledgedAtQueryVariables = Exact<{
  safeAddress: Scalars['String'];
}>;


export type LastAcknowledgedAtQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'lastAcknowledgedAt'>
);

export type SessionInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionInfoQuery = (
  { __typename?: 'Query' }
  & { sessionInfo: (
    { __typename?: 'SessionInfo' }
    & Pick<SessionInfo, 'isLoggedOn' | 'hasProfile' | 'profileId' | 'useShortSignup'>
    & { capabilities: Array<(
      { __typename?: 'Capability' }
      & Pick<Capability, 'type'>
    )> }
  ) }
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
    & { payload?: Maybe<(
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'token'>
    ) | { __typename?: 'CrcTrust' } | { __typename?: 'CrcTokenTransfer' } | { __typename?: 'CrcHubTransfer' } | { __typename?: 'CrcMinting' } | { __typename?: 'EthTransfer' } | { __typename?: 'Erc20Transfer' } | { __typename?: 'GnosisSafeEthTransfer' } | { __typename?: 'ChatMessage' } | { __typename?: 'MembershipOffer' } | { __typename?: 'MembershipAccepted' } | { __typename?: 'MembershipRejected' } | { __typename?: 'WelcomeMessage' } | { __typename?: 'InvitationCreated' } | { __typename?: 'InvitationRedeemed' } | { __typename?: 'OrganisationCreated' } | { __typename?: 'MemberAdded' } | { __typename?: 'SaleEvent' } | { __typename?: 'Purchased' } | { __typename?: 'SafeVerified' } | { __typename?: 'NewUser' }> }
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

export type StatsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatsQuery = (
  { __typename?: 'Query' }
  & { stats: (
    { __typename?: 'Stats' }
    & Pick<Stats, 'profilesCount' | 'verificationsCount'>
    & { goals: (
      { __typename?: 'FibonacciGoals' }
      & Pick<FibonacciGoals, 'lastGoal' | 'currentValue' | 'nextGoal'>
    ), myRank: (
      { __typename?: 'MyInviteRank' }
      & Pick<MyInviteRank, 'rank' | 'redeemedInvitationsCount'>
    ), leaderboard: Array<(
      { __typename?: 'LeaderboardEntry' }
      & Pick<LeaderboardEntry, 'createdByCirclesAddress' | 'inviteCount'>
      & { createdByProfile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'cityGeonameid' | 'provenUniqueness'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
        )> }
      )> }
    )> }
  ) }
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
      & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'cityGeonameid' | 'provenUniqueness'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
      )> }
    )> }
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
      & Pick<Profile, 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl'>
    )> }
  )> }
);

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'cityGeonameid' | 'provenUniqueness'>
    & { shops?: Maybe<Array<(
      { __typename?: 'Shop' }
      & Pick<Shop, 'id'>
    )>>, city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country' | 'latitude' | 'longitude' | 'population'>
    )>, shippingAddresses?: Maybe<Array<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )>>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
        & { shops?: Maybe<Array<(
          { __typename?: 'Shop' }
          & Pick<Shop, 'id'>
        )>>, city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'provenUniqueness'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, shippingAddresses?: Maybe<Array<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )>>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
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
    & Pick<Profile, 'id' | 'origin' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'successorOfCirclesAddress' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'country' | 'provenUniqueness'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, shippingAddresses?: Maybe<Array<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'origin' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'country' | 'avatarUrl' | 'provenUniqueness'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'origin' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'provenUniqueness'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, shippingAddresses?: Maybe<Array<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )>>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
        )> }
      )> }
    )>> }
  )> }
);

export type ProfilesByIdsQueryVariables = Exact<{
  id: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ProfilesByIdsQuery = (
  { __typename?: 'Query' }
  & { profilesById: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'origin' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'provenUniqueness'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, shippingAddresses?: Maybe<Array<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
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
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'origin' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
    )>, otherSafeAddressProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      & { verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country'>
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
    & Pick<Profile, 'id' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'provenUniqueness'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name'>
    )>, shippingAddresses?: Maybe<Array<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name' | 'displayName'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
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
    & Pick<Profile, 'id' | 'circlesAddress' | 'displayCurrency' | 'circlesSafeOwner' | 'invitationLink' | 'successorOfCirclesAddress' | 'displayName' | 'firstName' | 'lastName' | 'emailAddress' | 'askedForEmailAddress' | 'dream' | 'country' | 'avatarUrl' | 'avatarCid' | 'avatarMimeType' | 'newsletter' | 'displayTimeCircles' | 'cityGeonameid' | 'provenUniqueness' | 'circlesTokenAddress'>
    & { shippingAddresses?: Maybe<Array<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country' | 'cityGeonameid'>
    )>>, shops?: Maybe<Array<(
      { __typename?: 'Shop' }
      & Pick<Shop, 'id'>
    )>>, city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, memberships?: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'isAdmin'>
      & { organisation: (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
        )> }
      ) }
    )>>, verifications?: Maybe<Array<(
      { __typename?: 'Verification' }
      & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
      & { verifierProfile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'name' | 'country'>
        )> }
      )> }
    )>>, claimedInvitation?: Maybe<(
      { __typename?: 'ClaimedInvitation' }
      & Pick<ClaimedInvitation, 'claimedAt'>
    )>, invitationTransaction?: Maybe<(
      { __typename?: 'ProfileEvent' }
      & Pick<ProfileEvent, 'timestamp' | 'transaction_hash'>
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
    & Pick<Tag, 'typeId' | 'id' | 'value' | 'order'>
  )> }
);

export type OrganisationsQueryVariables = Exact<{
  pagination?: Maybe<PaginationArgs>;
}>;


export type OrganisationsQuery = (
  { __typename?: 'Query' }
  & { organisations: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'avatarUrl'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, shops?: Maybe<Array<(
      { __typename?: 'Shop' }
      & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'largeBannerUrl' | 'smallBannerUrl'>
    )>> }
  )> }
);

export type RegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type RegionsQuery = (
  { __typename?: 'Query' }
  & { regions: Array<(
    { __typename?: 'Organisation' }
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'avatarUrl'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
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
    & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'avatarUrl' | 'displayName'>
    & { city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'name' | 'country'>
    )>, shops?: Maybe<Array<(
      { __typename?: 'Shop' }
      & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl'>
    )>>, members?: Maybe<Array<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'successorOfCirclesAddress' | 'circlesSafeOwner' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'provenUniqueness'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'country' | 'name'>
      )>, shippingAddresses?: Maybe<Array<(
        { __typename?: 'PostAddress' }
        & Pick<PostAddress, 'id' | 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
      )>>, verifications?: Maybe<Array<(
        { __typename?: 'Verification' }
        & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
        & { verifierProfile?: Maybe<(
          { __typename?: 'Organisation' }
          & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country'>
          )> }
        )> }
      )>> }
    ) | (
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'createdAt' | 'name' | 'displayName' | 'avatarUrl'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'name' | 'country'>
      )> }
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
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
    )> }
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
      & Pick<Profile, 'type' | 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'provenUniqueness'>
    )>, payload?: Maybe<(
      { __typename?: 'CrcSignup' }
      & Pick<CrcSignup, 'transaction_hash' | 'user' | 'token'>
    ) | (
      { __typename?: 'CrcTrust' }
      & Pick<CrcTrust, 'transaction_hash' | 'address' | 'can_send_to' | 'limit'>
      & { can_send_to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | { __typename?: 'CrcTokenTransfer' } | (
      { __typename?: 'CrcHubTransfer' }
      & Pick<CrcHubTransfer, 'transaction_hash' | 'from' | 'to' | 'flow'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, transfers: Array<(
        { __typename?: 'CrcTokenTransfer' }
        & Pick<CrcTokenTransfer, 'token' | 'from' | 'to' | 'value'>
        & { from_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )>, to_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
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
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'EthTransfer' }
      & Pick<EthTransfer, 'transaction_hash' | 'from' | 'to' | 'value'>
    ) | (
      { __typename?: 'Erc20Transfer' }
      & Pick<Erc20Transfer, 'transaction_hash' | 'from' | 'to' | 'value'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'GnosisSafeEthTransfer' }
      & Pick<GnosisSafeEthTransfer, 'transaction_hash' | 'initiator' | 'from' | 'to' | 'value'>
    ) | (
      { __typename?: 'ChatMessage' }
      & Pick<ChatMessage, 'id' | 'from' | 'to' | 'text'>
      & { from_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, to_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'MembershipOffer' }
      & Pick<MembershipOffer, 'createdBy' | 'organisation' | 'isAdmin'>
      & { createdBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'MembershipAccepted' }
      & Pick<MembershipAccepted, 'createdBy' | 'member' | 'organisation'>
      & { member_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'MembershipRejected' }
      & Pick<MembershipRejected, 'member' | 'organisation'>
      & { member_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'WelcomeMessage' }
      & Pick<WelcomeMessage, 'invitedBy'>
      & { invitedBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'InvitationCreated' }
      & Pick<InvitationCreated, 'name' | 'code'>
    ) | (
      { __typename?: 'InvitationRedeemed' }
      & Pick<InvitationRedeemed, 'name' | 'code' | 'redeemedBy'>
      & { redeemedBy_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )> }
    ) | (
      { __typename?: 'OrganisationCreated' }
      & Pick<OrganisationCreated, 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'MemberAdded' }
      & Pick<MemberAdded, 'createdBy' | 'isAdmin' | 'member' | 'organisation'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'SaleEvent' }
      & Pick<SaleEvent, 'buyer'>
      & { buyer_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, invoice?: Maybe<(
        { __typename?: 'Invoice' }
        & Pick<Invoice, 'id' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate' | 'createdAt' | 'cancelledAt' | 'cancelReason' | 'simplePickupCode' | 'paymentTransactionHash'>
        & { deliveryMethod: (
          { __typename?: 'DeliveryMethod' }
          & Pick<DeliveryMethod, 'id' | 'name'>
        ), deliveryAddress?: Maybe<(
          { __typename?: 'PostAddress' }
          & Pick<PostAddress, 'name' | 'id' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country' | 'cityGeonameid'>
        )>, lines?: Maybe<Array<(
          { __typename?: 'InvoiceLine' }
          & Pick<InvoiceLine, 'amount' | 'metadata'>
          & { shop?: Maybe<(
            { __typename?: 'Shop' }
            & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'private' | 'enabled' | 'productListingStyle' | 'shopListingStyle' | 'purchaseMetaDataKeys' | 'tosLink' | 'privacyPolicyLink' | 'healthInfosLink' | 'adultOnly' | 'ownerId'>
            & { owner: (
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
            ), deliveryMethods?: Maybe<Array<(
              { __typename?: 'DeliveryMethod' }
              & Pick<DeliveryMethod, 'id' | 'name'>
            )>> }
          )>, offer?: Maybe<(
            { __typename?: 'Offer' }
            & Pick<Offer, 'id' | 'title' | 'pictureUrl' | 'pricePerUnit' | 'minAge' | 'currentInventory'>
            & { tags?: Maybe<Array<(
              { __typename?: 'Tag' }
              & Pick<Tag, 'typeId' | 'value'>
            )>> }
          )> }
        )>> }
      )> }
    ) | (
      { __typename?: 'Purchased' }
      & { seller_profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      )>, purchase: (
        { __typename?: 'Purchase' }
        & Pick<Purchase, 'id' | 'createdAt' | 'createdByAddress' | 'total'>
        & { deliveryMethod: (
          { __typename?: 'DeliveryMethod' }
          & Pick<DeliveryMethod, 'id' | 'name'>
        ), deliveryAddress?: Maybe<(
          { __typename?: 'PostAddress' }
          & Pick<PostAddress, 'name' | 'id' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country' | 'cityGeonameid'>
        )>, lines?: Maybe<Array<(
          { __typename?: 'PurchaseLine' }
          & Pick<PurchaseLine, 'id' | 'amount' | 'metadata'>
          & { shop?: Maybe<(
            { __typename?: 'Shop' }
            & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'private' | 'enabled' | 'productListingStyle' | 'shopListingStyle' | 'purchaseMetaDataKeys' | 'tosLink' | 'privacyPolicyLink' | 'healthInfosLink' | 'adultOnly' | 'ownerId'>
            & { pickupAddress?: Maybe<(
              { __typename?: 'PostAddress' }
              & Pick<PostAddress, 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
            )>, owner: (
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
            ), deliveryMethods?: Maybe<Array<(
              { __typename?: 'DeliveryMethod' }
              & Pick<DeliveryMethod, 'id' | 'name'>
            )>> }
          )>, offer?: Maybe<(
            { __typename?: 'Offer' }
            & Pick<Offer, 'id' | 'pictureUrl' | 'title' | 'description' | 'pricePerUnit' | 'minAge'>
            & { tags?: Maybe<Array<(
              { __typename?: 'Tag' }
              & Pick<Tag, 'typeId' | 'value'>
            )>> }
          )> }
        )>>, invoices?: Maybe<Array<(
          { __typename?: 'Invoice' }
          & Pick<Invoice, 'id' | 'pickupCode' | 'simplePickupCode' | 'paymentTransactionHash' | 'createdAt' | 'cancelledAt' | 'invoiceNo' | 'sellerSignature' | 'buyerSignature'>
          & { deliveryMethod: (
            { __typename?: 'DeliveryMethod' }
            & Pick<DeliveryMethod, 'id' | 'name'>
          ), buyerProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
          )>, sellerProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
          )> }
        )>> }
      ) }
    ) | (
      { __typename?: 'SafeVerified' }
      & Pick<SafeVerified, 'safe_address'>
      & { organisation_profile?: Maybe<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'name' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'NewUser' }
      & { profile: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'dream' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      ) }
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
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
    )>, payload: (
      { __typename?: 'CrcBalances' }
      & Pick<CrcBalances, 'lastUpdatedAt'>
      & { balances: Array<(
        { __typename?: 'AssetBalance' }
        & Pick<AssetBalance, 'token_address' | 'token_owner_address' | 'token_balance'>
        & { token_owner_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
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
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )> }
      )> }
    ) | (
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
          & Pick<Profile, 'type' | 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
          & { city?: Maybe<(
            { __typename?: 'City' }
            & Pick<City, 'geonameid' | 'name' | 'country'>
          )>, memberships?: Maybe<Array<(
            { __typename?: 'Membership' }
            & Pick<Membership, 'isAdmin'>
            & { organisation: (
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
              & { city?: Maybe<(
                { __typename?: 'City' }
                & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
              )> }
            ) }
          )>>, members?: Maybe<Array<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'type' | 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
            & { city?: Maybe<(
              { __typename?: 'City' }
              & Pick<City, 'geonameid' | 'name' | 'country'>
            )> }
          )>>, verifications?: Maybe<Array<(
            { __typename?: 'Verification' }
            & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
            & { verifierProfile?: Maybe<(
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
              & { city?: Maybe<(
                { __typename?: 'City' }
                & Pick<City, 'geonameid' | 'name' | 'country'>
              )> }
            )> }
          )>> }
        )> }
      )> }
    ) | (
      { __typename?: 'Memberships' }
      & Pick<Memberships, 'lastUpdatedAt'>
      & { organisations: Array<(
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'displayName' | 'circlesSafeOwner' | 'name' | 'description' | 'avatarUrl' | 'cityGeonameid'>
        & { city?: Maybe<(
          { __typename?: 'City' }
          & Pick<City, 'geonameid' | 'country' | 'name' | 'population'>
        )> }
      )> }
    ) | (
      { __typename?: 'Members' }
      & Pick<Members, 'lastUpdatedAt'>
      & { members: Array<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'successorOfCirclesAddress' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
      ) | (
        { __typename?: 'Organisation' }
        & Pick<Organisation, 'circlesAddress' | 'displayCurrency'>
      )> }
    ) | (
      { __typename?: 'Offers' }
      & Pick<Offers, 'lastUpdatedAt'>
      & { offers: Array<(
        { __typename?: 'Offer' }
        & Pick<Offer, 'id' | 'version' | 'createdByAddress' | 'createdAt' | 'title' | 'minAge' | 'pictureUrl' | 'pictureMimeType' | 'description' | 'pricePerUnit' | 'timeCirclesPriceShare'>
        & { createdByProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'smallBannerUrl' | 'provenUniqueness'>
        )>, tags?: Maybe<Array<(
          { __typename?: 'Tag' }
          & Pick<Tag, 'typeId' | 'value' | 'order'>
        )>> }
      )> }
    ) | (
      { __typename?: 'Sales' }
      & Pick<Sales, 'lastUpdatedAt'>
      & { sales: Array<(
        { __typename?: 'Sale' }
        & Pick<Sale, 'id' | 'createdAt' | 'total'>
        & { sellerProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )>, buyerProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency'>
          & { verifications?: Maybe<Array<(
            { __typename?: 'Verification' }
            & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
            & { verifierProfile?: Maybe<(
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
              & { city?: Maybe<(
                { __typename?: 'City' }
                & Pick<City, 'geonameid' | 'name' | 'country'>
              )> }
            )> }
          )>> }
        )>, lines?: Maybe<Array<(
          { __typename?: 'SalesLine' }
          & Pick<SalesLine, 'id' | 'amount' | 'metadata'>
          & { shop?: Maybe<(
            { __typename?: 'Shop' }
            & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'private' | 'enabled' | 'productListingStyle' | 'shopListingStyle' | 'purchaseMetaDataKeys' | 'tosLink' | 'privacyPolicyLink' | 'healthInfosLink' | 'adultOnly' | 'ownerId'>
            & { owner: (
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
            ), deliveryMethods?: Maybe<Array<(
              { __typename?: 'DeliveryMethod' }
              & Pick<DeliveryMethod, 'id' | 'name'>
            )>> }
          )>, offer: (
            { __typename?: 'Offer' }
            & Pick<Offer, 'id' | 'version' | 'title' | 'description' | 'pictureUrl' | 'pricePerUnit' | 'minAge' | 'timeCirclesPriceShare'>
            & { createdByProfile?: Maybe<(
              { __typename?: 'Profile' }
              & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
            )>, tags?: Maybe<Array<(
              { __typename?: 'Tag' }
              & Pick<Tag, 'typeId' | 'value'>
            )>> }
          ) }
        )>>, invoices?: Maybe<Array<(
          { __typename?: 'Invoice' }
          & Pick<Invoice, 'id' | 'sellerAddress' | 'paymentTransactionHash' | 'buyerAddress' | 'pickupCode' | 'simplePickupCode' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate' | 'createdAt' | 'cancelledAt' | 'cancelReason'>
          & { deliveryMethod: (
            { __typename?: 'DeliveryMethod' }
            & Pick<DeliveryMethod, 'id' | 'name'>
          ), deliveryAddress?: Maybe<(
            { __typename?: 'PostAddress' }
            & Pick<PostAddress, 'name' | 'id' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country' | 'cityGeonameid'>
          )>, buyerProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
            & { verifications?: Maybe<Array<(
              { __typename?: 'Verification' }
              & Pick<Verification, 'createdAt' | 'revokedAt' | 'verifierSafeAddress'>
              & { verifierProfile?: Maybe<(
                { __typename?: 'Organisation' }
                & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
                & { city?: Maybe<(
                  { __typename?: 'City' }
                  & Pick<City, 'geonameid' | 'name' | 'country'>
                )> }
              )> }
            )>> }
          )> }
        )>> }
      )> }
    ) | (
      { __typename?: 'Purchases' }
      & Pick<Purchases, 'lastUpdatedAt'>
      & { purchases: Array<(
        { __typename?: 'Purchase' }
        & Pick<Purchase, 'id' | 'createdAt' | 'createdByAddress' | 'total'>
        & { createdByProfile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
        )>, deliveryMethod: (
          { __typename?: 'DeliveryMethod' }
          & Pick<DeliveryMethod, 'id' | 'name'>
        ), lines?: Maybe<Array<(
          { __typename?: 'PurchaseLine' }
          & Pick<PurchaseLine, 'id' | 'amount' | 'metadata'>
          & { shop?: Maybe<(
            { __typename?: 'Shop' }
            & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'private' | 'enabled' | 'productListingStyle' | 'shopListingStyle' | 'purchaseMetaDataKeys' | 'tosLink' | 'privacyPolicyLink' | 'healthInfosLink' | 'adultOnly' | 'ownerId'>
            & { owner: (
              { __typename?: 'Organisation' }
              & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
            ), deliveryMethods?: Maybe<Array<(
              { __typename?: 'DeliveryMethod' }
              & Pick<DeliveryMethod, 'id' | 'name'>
            )>> }
          )>, offer?: Maybe<(
            { __typename?: 'Offer' }
            & Pick<Offer, 'id' | 'version' | 'title' | 'description' | 'pictureUrl' | 'pricePerUnit' | 'minAge' | 'timeCirclesPriceShare'>
            & { createdByProfile?: Maybe<(
              { __typename?: 'Profile' }
              & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
            )>, tags?: Maybe<Array<(
              { __typename?: 'Tag' }
              & Pick<Tag, 'typeId' | 'value'>
            )>> }
          )> }
        )>>, invoices?: Maybe<Array<(
          { __typename?: 'Invoice' }
          & Pick<Invoice, 'id' | 'sellerAddress' | 'paymentTransactionHash' | 'buyerAddress' | 'pickupCode' | 'simplePickupCode' | 'buyerSignature' | 'buyerSignedDate' | 'sellerSignature' | 'sellerSignedDate' | 'createdAt' | 'cancelledAt' | 'cancelReason'>
          & { deliveryMethod: (
            { __typename?: 'DeliveryMethod' }
            & Pick<DeliveryMethod, 'id' | 'name'>
          ), sellerProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
          )> }
        )>> }
      )> }
    ) | (
      { __typename?: 'Erc721Tokens' }
      & Pick<Erc721Tokens, 'lastUpdatedAt'>
      & { balances: Array<(
        { __typename?: 'Erc721Token' }
        & Pick<Erc721Token, 'token_no' | 'token_symbol' | 'token_name' | 'token_address' | 'token_url'>
        & { token_owner_profile?: Maybe<(
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'circlesAddress' | 'displayName' | 'avatarUrl' | 'firstName' | 'lastName' | 'provenUniqueness'>
        )> }
      )> }
    ) }
  )> }
);

export type GetAllStringsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStringsQuery = (
  { __typename?: 'Query' }
  & { getAllStrings?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'version' | 'value'>
  )>>> }
);

export type GetAllStringsByLanguageQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
}>;


export type GetAllStringsByLanguageQuery = (
  { __typename?: 'Query' }
  & { getAllStringsByLanguage?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetAllStringsByMaxVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStringsByMaxVersionQuery = (
  { __typename?: 'Query' }
  & { getAllStringsByMaxVersion?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetAllStringsByMaxVersionAndLangQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
}>;


export type GetAllStringsByMaxVersionAndLangQuery = (
  { __typename?: 'Query' }
  & { getAllStringsByMaxVersionAndLang?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'needsUpdate'>
  )>>> }
);

export type GetStringsToBeUpdatedAmountQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
}>;


export type GetStringsToBeUpdatedAmountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getStringsToBeUpdatedAmount'>
);

export type GetStringByMaxVersionQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
}>;


export type GetStringByMaxVersionQuery = (
  { __typename?: 'Query' }
  & { getStringByMaxVersion?: Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )> }
);

export type GetOlderVersionsByKeyAndLangQueryVariables = Exact<{
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
}>;


export type GetOlderVersionsByKeyAndLangQuery = (
  { __typename?: 'Query' }
  & { getOlderVersionsByKeyAndLang?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetStringByLanguageQueryVariables = Exact<{
  lang?: Maybe<Scalars['String']>;
}>;


export type GetStringByLanguageQuery = (
  { __typename?: 'Query' }
  & { getStringByLanguage?: Maybe<Array<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>> }
);

export type GetStringsByMaxVersionKeyAndValueQueryVariables = Exact<{
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
}>;


export type GetStringsByMaxVersionKeyAndValueQuery = (
  { __typename?: 'Query' }
  & { getStringsByMaxVersionKeyAndValue?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetStringsFromLatestValuesByValueQueryVariables = Exact<{
  value?: Maybe<Scalars['String']>;
}>;


export type GetStringsFromLatestValuesByValueQuery = (
  { __typename?: 'Query' }
  & { getStringsFromLatestValuesByValue?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetFirst20StringsByMaxVersionKeyQueryVariables = Exact<{
  key?: Maybe<Scalars['String']>;
}>;


export type GetFirst20StringsByMaxVersionKeyQuery = (
  { __typename?: 'Query' }
  & { getFirst20StringsByMaxVersionKey?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value'>
  )>>> }
);

export type GetPaginatedStringsQueryVariables = Exact<{
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
}>;


export type GetPaginatedStringsQuery = (
  { __typename?: 'Query' }
  & { getPaginatedStrings?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'pagination_key'>
  )>>> }
);

export type GetPaginatedStringsToUpdateQueryVariables = Exact<{
  pagination_key?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
}>;


export type GetPaginatedStringsToUpdateQuery = (
  { __typename?: 'Query' }
  & { getPaginatedStringsToUpdate?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang' | 'key' | 'createdBy' | 'version' | 'value' | 'pagination_key'>
  )>>> }
);

export type GetAvailableLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableLanguagesQuery = (
  { __typename?: 'Query' }
  & { getAvailableLanguages?: Maybe<Array<Maybe<(
    { __typename?: 'i18n' }
    & Pick<I18n, 'lang'>
  )>>> }
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
      & Pick<Organisation, 'id' | 'circlesAddress' | 'displayCurrency' | 'avatarUrl' | 'name'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'geonameid' | 'name' | 'country'>
      )> }
    )>, verifiedProfile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl' | 'circlesAddress' | 'displayCurrency' | 'provenUniqueness'>
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
    & Pick<Profile, 'circlesAddress' | 'displayCurrency' | 'displayName' | 'firstName' | 'lastName' | 'avatarUrl'>
  )> }
);

export type ShopQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ShopQuery = (
  { __typename?: 'Query' }
  & { shop?: Maybe<(
    { __typename?: 'Shop' }
    & Pick<Shop, 'id' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'private' | 'enabled' | 'productListingStyle' | 'shopListingStyle' | 'purchaseMetaDataKeys' | 'tosLink' | 'privacyPolicyLink' | 'healthInfosLink' | 'adultOnly' | 'ownerId'>
    & { owner: (
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
    ), deliveryMethods?: Maybe<Array<(
      { __typename?: 'DeliveryMethod' }
      & Pick<DeliveryMethod, 'id' | 'name'>
    )>>, pickupAddress?: Maybe<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )>, categories?: Maybe<Array<(
      { __typename?: 'ShopCategory' }
      & Pick<ShopCategory, 'id' | 'name' | 'description' | 'sortOrder' | 'shopId' | 'smallBannerUrl' | 'largeBannerUrl' | 'private' | 'enabled' | 'createdAt' | 'productListingStyle'>
      & { entries?: Maybe<Array<(
        { __typename?: 'ShopCategoryEntry' }
        & Pick<ShopCategoryEntry, 'id' | 'sortOrder' | 'private' | 'productId' | 'productVersion' | 'shopCategoryId' | 'enabled'>
        & { product?: Maybe<(
          { __typename?: 'Offer' }
          & Pick<Offer, 'id' | 'version' | 'title' | 'description' | 'pictureUrl' | 'pricePerUnit' | 'minAge' | 'currentInventory'>
          & { createdByProfile?: Maybe<(
            { __typename?: 'Profile' }
            & Pick<Profile, 'id' | 'displayName' | 'avatarUrl' | 'circlesAddress' | 'provenUniqueness'>
          )> }
        )> }
      )>> }
    )>> }
  )> }
);

export type ShopsQueryVariables = Exact<{
  ownerId?: Maybe<Scalars['Int']>;
}>;


export type ShopsQuery = (
  { __typename?: 'Query' }
  & { shops: Array<(
    { __typename?: 'Shop' }
    & Pick<Shop, 'id' | 'createdAt' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'private' | 'enabled' | 'shopListingStyle' | 'productListingStyle' | 'sortOrder' | 'ownerId' | 'adultOnly' | 'tosLink' | 'privacyPolicyLink' | 'healthInfosLink'>
    & { deliveryMethods?: Maybe<Array<(
      { __typename?: 'DeliveryMethod' }
      & Pick<DeliveryMethod, 'id' | 'name'>
    )>>, owner: (
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
    ), pickupAddress?: Maybe<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )> }
  )> }
);

export type ShopsByIdQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type ShopsByIdQuery = (
  { __typename?: 'Query' }
  & { shopsById: Array<(
    { __typename?: 'Shop' }
    & Pick<Shop, 'id' | 'createdAt' | 'name' | 'description' | 'legalText' | 'smallBannerUrl' | 'largeBannerUrl' | 'openingHours' | 'private' | 'enabled' | 'shopListingStyle' | 'productListingStyle' | 'sortOrder' | 'ownerId' | 'tosLink' | 'adultOnly' | 'privacyPolicyLink' | 'healthInfosLink'>
    & { deliveryMethods?: Maybe<Array<(
      { __typename?: 'DeliveryMethod' }
      & Pick<DeliveryMethod, 'id' | 'name'>
    )>>, owner: (
      { __typename?: 'Organisation' }
      & Pick<Organisation, 'id' | 'name' | 'avatarUrl' | 'circlesAddress'>
    ), pickupAddress?: Maybe<(
      { __typename?: 'PostAddress' }
      & Pick<PostAddress, 'name' | 'street' | 'house' | 'zip' | 'city' | 'state' | 'country'>
    )> }
  )> }
);

export type ClientAssertionJwtQueryVariables = Exact<{ [key: string]: never; }>;


export type ClientAssertionJwtQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'clientAssertionJwt'>
);

export type OffersByIdAndVersionQueryVariables = Exact<{
  query: Array<OfferByIdAndVersionInput> | OfferByIdAndVersionInput;
}>;


export type OffersByIdAndVersionQuery = (
  { __typename?: 'Query' }
  & { offersByIdAndVersion: Array<(
    { __typename?: 'Offer' }
    & Pick<Offer, 'id' | 'title' | 'pictureUrl' | 'pricePerUnit' | 'currentInventory' | 'version'>
    & { tags?: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'typeId' | 'value'>
    )>> }
  )> }
);

export type EventsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EventsSubscription = (
  { __typename?: 'Subscription' }
  & { events: (
    { __typename?: 'NotificationEvent' }
    & Pick<NotificationEvent, 'type' | 'from' | 'to' | 'itemId' | 'transaction_hash'>
  ) }
);


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
    needsUpdate
  }
}
    `;
export const SetStringUpdateStateDocument = gql`
    mutation setStringUpdateState($key: String) {
  setStringUpdateState(key: $key) {
    lang
    key
    createdBy
    version
    value
    needsUpdate
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
        cityGeonameid
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
      cityGeonameid
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
              currentInventory
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
    needsUpdate
  }
}
    `;
export const GetStringsToBeUpdatedAmountDocument = gql`
    query getStringsToBeUpdatedAmount($lang: String, $key: String) {
  getStringsToBeUpdatedAmount(lang: $lang, key: $key)
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
export const GetStringsByMaxVersionKeyAndValueDocument = gql`
    query getStringsByMaxVersionKeyAndValue($key: String, $value: String) {
  getStringsByMaxVersionKeyAndValue(key: $key, value: $value) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetStringsFromLatestValuesByValueDocument = gql`
    query getStringsFromLatestValuesByValue($value: String) {
  getStringsFromLatestValuesByValue(value: $value) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetFirst20StringsByMaxVersionKeyDocument = gql`
    query getFirst20StringsByMaxVersionKey($key: String) {
  getFirst20StringsByMaxVersionKey(key: $key) {
    lang
    key
    createdBy
    version
    value
  }
}
    `;
export const GetPaginatedStringsDocument = gql`
    query getPaginatedStrings($pagination_key: String, $key: String, $lang: String, $value: String) {
  getPaginatedStrings(
    pagination_key: $pagination_key
    key: $key
    lang: $lang
    value: $value
  ) {
    lang
    key
    createdBy
    version
    value
    pagination_key
  }
}
    `;
export const GetPaginatedStringsToUpdateDocument = gql`
    query getPaginatedStringsToUpdate($pagination_key: String, $key: String, $lang: String, $value: String) {
  getPaginatedStringsToUpdate(
    pagination_key: $pagination_key
    key: $key
    lang: $lang
    value: $value
  ) {
    lang
    key
    createdBy
    version
    value
    pagination_key
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

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    upsertShippingAddress(variables: UpsertShippingAddressMutationVariables): Promise<UpsertShippingAddressMutation> {
      return withWrapper(() => client.request<UpsertShippingAddressMutation>(print(UpsertShippingAddressDocument), variables));
    },
    createPurchase(variables: CreatePurchaseMutationVariables): Promise<CreatePurchaseMutation> {
      return withWrapper(() => client.request<CreatePurchaseMutation>(print(CreatePurchaseDocument), variables));
    },
    requestSessionChallenge(variables: RequestSessionChallengeMutationVariables): Promise<RequestSessionChallengeMutation> {
      return withWrapper(() => client.request<RequestSessionChallengeMutation>(print(RequestSessionChallengeDocument), variables));
    },
    verifySessionChallenge(variables: VerifySessionChallengeMutationVariables): Promise<VerifySessionChallengeMutation> {
      return withWrapper(() => client.request<VerifySessionChallengeMutation>(print(VerifySessionChallengeDocument), variables));
    },
    addNewLang(variables?: AddNewLangMutationVariables): Promise<AddNewLangMutation> {
      return withWrapper(() => client.request<AddNewLangMutation>(print(AddNewLangDocument), variables));
    },
    updateValue(variables?: UpdateValueMutationVariables): Promise<UpdateValueMutation> {
      return withWrapper(() => client.request<UpdateValueMutation>(print(UpdateValueDocument), variables));
    },
    createNewStringAndKey(variables?: CreateNewStringAndKeyMutationVariables): Promise<CreateNewStringAndKeyMutation> {
      return withWrapper(() => client.request<CreateNewStringAndKeyMutation>(print(CreateNewStringAndKeyDocument), variables));
    },
    setStringUpdateState(variables?: SetStringUpdateStateMutationVariables): Promise<SetStringUpdateStateMutation> {
      return withWrapper(() => client.request<SetStringUpdateStateMutation>(print(SetStringUpdateStateDocument), variables));
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
    upsertShop(variables: UpsertShopMutationVariables): Promise<UpsertShopMutation> {
      return withWrapper(() => client.request<UpsertShopMutation>(print(UpsertShopDocument), variables));
    },
    upsertShopCategories(variables: UpsertShopCategoriesMutationVariables): Promise<UpsertShopCategoriesMutation> {
      return withWrapper(() => client.request<UpsertShopCategoriesMutation>(print(UpsertShopCategoriesDocument), variables));
    },
    upsertShopCategoryEntries(variables: UpsertShopCategoryEntriesMutationVariables): Promise<UpsertShopCategoryEntriesMutation> {
      return withWrapper(() => client.request<UpsertShopCategoryEntriesMutation>(print(UpsertShopCategoryEntriesDocument), variables));
    },
    confirmLegalAge(variables: ConfirmLegalAgeMutationVariables): Promise<ConfirmLegalAgeMutation> {
      return withWrapper(() => client.request<ConfirmLegalAgeMutation>(print(ConfirmLegalAgeDocument), variables));
    },
    upsertOffer(variables: UpsertOfferMutationVariables): Promise<UpsertOfferMutation> {
      return withWrapper(() => client.request<UpsertOfferMutation>(print(UpsertOfferDocument), variables));
    },
    proofUniqueness(variables: ProofUniquenessMutationVariables): Promise<ProofUniquenessMutation> {
      return withWrapper(() => client.request<ProofUniquenessMutation>(print(ProofUniquenessDocument), variables));
    },
    init(variables?: InitQueryVariables): Promise<InitQuery> {
      return withWrapper(() => client.request<InitQuery>(print(InitDocument), variables));
    },
    deliveryMethods(variables?: DeliveryMethodsQueryVariables): Promise<DeliveryMethodsQuery> {
      return withWrapper(() => client.request<DeliveryMethodsQuery>(print(DeliveryMethodsDocument), variables));
    },
    lastAcknowledgedAt(variables: LastAcknowledgedAtQueryVariables): Promise<LastAcknowledgedAtQuery> {
      return withWrapper(() => client.request<LastAcknowledgedAtQuery>(print(LastAcknowledgedAtDocument), variables));
    },
    sessionInfo(variables?: SessionInfoQueryVariables): Promise<SessionInfoQuery> {
      return withWrapper(() => client.request<SessionInfoQuery>(print(SessionInfoDocument), variables));
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
    safeInfo(variables?: SafeInfoQueryVariables): Promise<SafeInfoQuery> {
      return withWrapper(() => client.request<SafeInfoQuery>(print(SafeInfoDocument), variables));
    },
    stats(variables?: StatsQueryVariables): Promise<StatsQuery> {
      return withWrapper(() => client.request<StatsQuery>(print(StatsDocument), variables));
    },
    findSafesByOwner(variables: FindSafesByOwnerQueryVariables): Promise<FindSafesByOwnerQuery> {
      return withWrapper(() => client.request<FindSafesByOwnerQuery>(print(FindSafesByOwnerDocument), variables));
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
    tagById(variables: TagByIdQueryVariables): Promise<TagByIdQuery> {
      return withWrapper(() => client.request<TagByIdQuery>(print(TagByIdDocument), variables));
    },
    stream(variables: StreamQueryVariables): Promise<StreamQuery> {
      return withWrapper(() => client.request<StreamQuery>(print(StreamDocument), variables));
    },
    aggregates(variables: AggregatesQueryVariables): Promise<AggregatesQuery> {
      return withWrapper(() => client.request<AggregatesQuery>(print(AggregatesDocument), variables));
    },
    getAllStrings(variables?: GetAllStringsQueryVariables): Promise<GetAllStringsQuery> {
      return withWrapper(() => client.request<GetAllStringsQuery>(print(GetAllStringsDocument), variables));
    },
    getAllStringsByLanguage(variables?: GetAllStringsByLanguageQueryVariables): Promise<GetAllStringsByLanguageQuery> {
      return withWrapper(() => client.request<GetAllStringsByLanguageQuery>(print(GetAllStringsByLanguageDocument), variables));
    },
    getAllStringsByMaxVersion(variables?: GetAllStringsByMaxVersionQueryVariables): Promise<GetAllStringsByMaxVersionQuery> {
      return withWrapper(() => client.request<GetAllStringsByMaxVersionQuery>(print(GetAllStringsByMaxVersionDocument), variables));
    },
    getAllStringsByMaxVersionAndLang(variables?: GetAllStringsByMaxVersionAndLangQueryVariables): Promise<GetAllStringsByMaxVersionAndLangQuery> {
      return withWrapper(() => client.request<GetAllStringsByMaxVersionAndLangQuery>(print(GetAllStringsByMaxVersionAndLangDocument), variables));
    },
    getStringsToBeUpdatedAmount(variables?: GetStringsToBeUpdatedAmountQueryVariables): Promise<GetStringsToBeUpdatedAmountQuery> {
      return withWrapper(() => client.request<GetStringsToBeUpdatedAmountQuery>(print(GetStringsToBeUpdatedAmountDocument), variables));
    },
    getStringByMaxVersion(variables?: GetStringByMaxVersionQueryVariables): Promise<GetStringByMaxVersionQuery> {
      return withWrapper(() => client.request<GetStringByMaxVersionQuery>(print(GetStringByMaxVersionDocument), variables));
    },
    getOlderVersionsByKeyAndLang(variables?: GetOlderVersionsByKeyAndLangQueryVariables): Promise<GetOlderVersionsByKeyAndLangQuery> {
      return withWrapper(() => client.request<GetOlderVersionsByKeyAndLangQuery>(print(GetOlderVersionsByKeyAndLangDocument), variables));
    },
    getStringByLanguage(variables?: GetStringByLanguageQueryVariables): Promise<GetStringByLanguageQuery> {
      return withWrapper(() => client.request<GetStringByLanguageQuery>(print(GetStringByLanguageDocument), variables));
    },
    getStringsByMaxVersionKeyAndValue(variables?: GetStringsByMaxVersionKeyAndValueQueryVariables): Promise<GetStringsByMaxVersionKeyAndValueQuery> {
      return withWrapper(() => client.request<GetStringsByMaxVersionKeyAndValueQuery>(print(GetStringsByMaxVersionKeyAndValueDocument), variables));
    },
    getStringsFromLatestValuesByValue(variables?: GetStringsFromLatestValuesByValueQueryVariables): Promise<GetStringsFromLatestValuesByValueQuery> {
      return withWrapper(() => client.request<GetStringsFromLatestValuesByValueQuery>(print(GetStringsFromLatestValuesByValueDocument), variables));
    },
    getFirst20StringsByMaxVersionKey(variables?: GetFirst20StringsByMaxVersionKeyQueryVariables): Promise<GetFirst20StringsByMaxVersionKeyQuery> {
      return withWrapper(() => client.request<GetFirst20StringsByMaxVersionKeyQuery>(print(GetFirst20StringsByMaxVersionKeyDocument), variables));
    },
    getPaginatedStrings(variables?: GetPaginatedStringsQueryVariables): Promise<GetPaginatedStringsQuery> {
      return withWrapper(() => client.request<GetPaginatedStringsQuery>(print(GetPaginatedStringsDocument), variables));
    },
    getPaginatedStringsToUpdate(variables?: GetPaginatedStringsToUpdateQueryVariables): Promise<GetPaginatedStringsToUpdateQuery> {
      return withWrapper(() => client.request<GetPaginatedStringsToUpdateQuery>(print(GetPaginatedStringsToUpdateDocument), variables));
    },
    getAvailableLanguages(variables?: GetAvailableLanguagesQueryVariables): Promise<GetAvailableLanguagesQuery> {
      return withWrapper(() => client.request<GetAvailableLanguagesQuery>(print(GetAvailableLanguagesDocument), variables));
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
    shop(variables: ShopQueryVariables): Promise<ShopQuery> {
      return withWrapper(() => client.request<ShopQuery>(print(ShopDocument), variables));
    },
    shops(variables?: ShopsQueryVariables): Promise<ShopsQuery> {
      return withWrapper(() => client.request<ShopsQuery>(print(ShopsDocument), variables));
    },
    shopsById(variables: ShopsByIdQueryVariables): Promise<ShopsByIdQuery> {
      return withWrapper(() => client.request<ShopsByIdQuery>(print(ShopsByIdDocument), variables));
    },
    clientAssertionJwt(variables?: ClientAssertionJwtQueryVariables): Promise<ClientAssertionJwtQuery> {
      return withWrapper(() => client.request<ClientAssertionJwtQuery>(print(ClientAssertionJwtDocument), variables));
    },
    offersByIdAndVersion(variables: OffersByIdAndVersionQueryVariables): Promise<OffersByIdAndVersionQuery> {
      return withWrapper(() => client.request<OffersByIdAndVersionQuery>(print(OffersByIdAndVersionDocument), variables));
    },
    events(variables?: EventsSubscriptionVariables): Promise<EventsSubscription> {
      return withWrapper(() => client.request<EventsSubscription>(print(EventsDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;