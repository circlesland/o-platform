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
  Json: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type ActionResponse = {
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ChallengeResponse = ActionResponse & {
  __typename?: 'ChallengeResponse';
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type LoginResponse = ActionResponse & {
  __typename?: 'LoginResponse';
  challenge?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  challenge: ChallengeResponse;
  loginWithEmail: LoginResponse;
  loginWithPublicKey: LoginResponse;
  verify: VerifyResponse;
};


export type MutationChallengeArgs = {
  byAppId?: Maybe<Scalars['String']>;
  challengeType: Scalars['String'];
  forAppId: Scalars['String'];
  subject: Scalars['String'];
};


export type MutationLoginWithEmailArgs = {
  appId: Scalars['String'];
  emailAddress: Scalars['String'];
};


export type MutationLoginWithPublicKeyArgs = {
  appId: Scalars['String'];
  publicKey: Scalars['String'];
};


export type MutationVerifyArgs = {
  oneTimeToken: Scalars['String'];
};

export type PublicKey = {
  __typename?: 'PublicKey';
  id: Scalars['Int'];
  publicKey: Scalars['String'];
  validFrom: Scalars['String'];
  validTo: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  keys?: Maybe<PublicKey>;
  version?: Maybe<Version>;
};


export type QueryKeysArgs = {
  kid: Scalars['String'];
};

export type VerifyResponse = ActionResponse & {
  __typename?: 'VerifyResponse';
  errorMessage?: Maybe<Scalars['String']>;
  exchangeTokenUrl: Scalars['String'];
  jwt: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  type?: Maybe<Scalars['String']>;
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


