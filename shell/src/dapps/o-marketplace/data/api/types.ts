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

export type City = {
  __typename?: 'City';
  country: Scalars['String'];
  feature_code: Scalars['String'];
  geonameid: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  population: Scalars['Int'];
};

export type ConsumeDepositedChallengeResponse = {
  __typename?: 'ConsumeDepositedChallengeResponse';
  challenge?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CreateOfferInput = {
  categoryTagId: Scalars['Int'];
  createdByProfileId: Scalars['Int'];
  deliveryTerms: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  geonameid: Scalars['Int'];
  maxUnits?: Maybe<Scalars['Int']>;
  pictureMimeType: Scalars['String'];
  pictureUrl: Scalars['String'];
  pricePerUnit: Scalars['String'];
  title: Scalars['String'];
  unit: Scalars['String'];
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

export type IndexTransferInput = {
  blockNo: Scalars['Int'];
  from: Scalars['String'];
  tags?: Maybe<Array<TagInput>>;
  to: Scalars['String'];
  transactionHash: Scalars['String'];
  value: Scalars['String'];
};

export type IndexTransferResponse = {
  __typename?: 'IndexTransferResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type IndexedTransfer = {
  __typename?: 'IndexedTransfer';
  blockNo: Scalars['Int'];
  from: Scalars['String'];
  tags: Array<Tag>;
  to: Scalars['String'];
  transactionHash: Scalars['String'];
  value: Scalars['String'];
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
  authenticateAt: DelegateAuthInit;
  consumeDepositedChallenge: ConsumeDepositedChallengeResponse;
  createOffer: Offer;
  depositChallenge: DepositChallengeResponse;
  exchangeToken: ExchangeTokenResponse;
  indexTransfer: IndexTransferResponse;
  lockOffer: LockOfferResult;
  logout: LogoutResponse;
  provePayment: ProvePaymentResult;
  requestUpdateSafe: RequestUpdateSafeResponse;
  unlistOffer: Scalars['Boolean'];
  updateSafe: UpdateSafeResponse;
  upsertProfile: Profile;
};


export type MutationAuthenticateAtArgs = {
  appId: Scalars['String'];
};


export type MutationConsumeDepositedChallengeArgs = {
  delegateAuthCode: Scalars['String'];
};


export type MutationCreateOfferArgs = {
  data: CreateOfferInput;
};


export type MutationDepositChallengeArgs = {
  jwt: Scalars['String'];
};


export type MutationIndexTransferArgs = {
  data: IndexTransferInput;
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


export type MutationUnlistOfferArgs = {
  offerId: Scalars['Int'];
};


export type MutationUpdateSafeArgs = {
  data: UpdateSafeInput;
};


export type MutationUpsertProfileArgs = {
  data: UpsertProfileInput;
};

export type Offer = {
  __typename?: 'Offer';
  categoryTag?: Maybe<Tag>;
  categoryTagId: Scalars['Int'];
  city?: Maybe<City>;
  createdBy?: Maybe<Profile>;
  createdByProfileId: Scalars['Int'];
  deliveryTerms: Scalars['String'];
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
  unit: Scalars['String'];
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
  offerCategories: Array<Tag>;
  offers: Array<Offer>;
  profiles: Array<Profile>;
  search: Array<Profile>;
  sessionInfo: SessionInfo;
  version: Version;
  whoami?: Maybe<Scalars['String']>;
};


export type QueryCitiesArgs = {
  query: QueryCitiesInput;
};


export type QueryOfferCategoriesArgs = {
  like?: Maybe<Scalars['String']>;
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

export type QueryIndexedTransferInput = {
  from?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<QueryIndexedTransferTagsInput>>;
  to?: Maybe<Scalars['String']>;
};

export type QueryIndexedTransferTagsInput = {
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
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

export type QueryUniqueProfileInput = {
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

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  type: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type TagInput = {
  type: Scalars['String'];
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
};

export type Version = {
  __typename?: 'Version';
  major: Scalars['Int'];
  minor: Scalars['Int'];
  revision: Scalars['Int'];
};

export type CreateOfferMutationVariables = Exact<{
  createdByProfileId: Scalars['Int'];
  title: Scalars['String'];
  pictureUrl: Scalars['String'];
  pictureMimeType: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  categoryTagId: Scalars['Int'];
  geonameid: Scalars['Int'];
  pricePerUnit: Scalars['String'];
  unit: Scalars['String'];
  maxUnits?: Maybe<Scalars['Int']>;
  deliveryTerms: Scalars['String'];
}>;


export type CreateOfferMutation = (
  { __typename?: 'Mutation' }
  & { createOffer: (
    { __typename?: 'Offer' }
    & Pick<Offer, 'id' | 'createdByProfileId' | 'publishedAt' | 'unlistedAt' | 'purchasedAt' | 'title' | 'pictureUrl' | 'pictureMimeType' | 'description' | 'categoryTagId' | 'geonameid' | 'pricePerUnit' | 'unit' | 'maxUnits' | 'deliveryTerms'>
    & { createdBy?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'firstName' | 'lastName' | 'avatarUrl' | 'avatarMimeType'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'name' | 'country'>
      )> }
    )>, categoryTag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'type' | 'value'>
    )>, city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name' | 'latitude' | 'longitude' | 'population' | 'feature_code'>
    )> }
  ) }
);

export type OffersQueryVariables = Exact<{
  createdByProfileId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  publishedAt_gt?: Maybe<Scalars['String']>;
  publishedAt_lt?: Maybe<Scalars['String']>;
  categoryTagId?: Maybe<Scalars['Int']>;
}>;


export type OffersQuery = (
  { __typename?: 'Query' }
  & { offers: Array<(
    { __typename?: 'Offer' }
    & Pick<Offer, 'id' | 'createdByProfileId' | 'publishedAt' | 'unlistedAt' | 'purchasedAt' | 'title' | 'pictureUrl' | 'pictureMimeType' | 'description' | 'categoryTagId' | 'geonameid' | 'pricePerUnit' | 'unit' | 'maxUnits' | 'deliveryTerms'>
    & { createdBy?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'circlesAddress' | 'firstName' | 'lastName' | 'avatarUrl' | 'avatarMimeType'>
      & { city?: Maybe<(
        { __typename?: 'City' }
        & Pick<City, 'name' | 'country'>
      )> }
    )>, categoryTag?: Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'type' | 'value'>
    )>, city?: Maybe<(
      { __typename?: 'City' }
      & Pick<City, 'geonameid' | 'country' | 'name' | 'latitude' | 'longitude' | 'population' | 'feature_code'>
    )> }
  )> }
);

export type OfferCategoriesQueryVariables = Exact<{
  like: Scalars['String'];
}>;


export type OfferCategoriesQuery = (
  { __typename?: 'Query' }
  & { offerCategories: Array<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'id' | 'type' | 'value'>
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


export const CreateOfferDocument = gql`
    mutation createOffer($createdByProfileId: Int!, $title: String!, $pictureUrl: String!, $pictureMimeType: String!, $description: String, $categoryTagId: Int!, $geonameid: Int!, $pricePerUnit: String!, $unit: String!, $maxUnits: Int, $deliveryTerms: String!) {
  createOffer(
    data: {geonameid: $geonameid, categoryTagId: $categoryTagId, createdByProfileId: $createdByProfileId, deliveryTerms: $deliveryTerms, description: $description, maxUnits: $maxUnits, pictureUrl: $pictureUrl, pictureMimeType: $pictureMimeType, pricePerUnit: $pricePerUnit, title: $title, unit: $unit}
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
      type
      value
    }
    geonameid
    pricePerUnit
    unit
    maxUnits
    deliveryTerms
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
    query offers($createdByProfileId: Int, $id: Int, $publishedAt_gt: String, $publishedAt_lt: String, $categoryTagId: Int) {
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
      type
      value
    }
    geonameid
    pricePerUnit
    unit
    maxUnits
    deliveryTerms
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
export const OfferCategoriesDocument = gql`
    query offerCategories($like: String!) {
  offerCategories(like: $like) {
    id
    type
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
    createOffer(variables: CreateOfferMutationVariables): Promise<CreateOfferMutation> {
      return withWrapper(() => client.request<CreateOfferMutation>(print(CreateOfferDocument), variables));
    },
    offers(variables?: OffersQueryVariables): Promise<OffersQuery> {
      return withWrapper(() => client.request<OffersQuery>(print(OffersDocument), variables));
    },
    offerCategories(variables: OfferCategoriesQueryVariables): Promise<OfferCategoriesQuery> {
      return withWrapper(() => client.request<OfferCategoriesQuery>(print(OfferCategoriesDocument), variables));
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