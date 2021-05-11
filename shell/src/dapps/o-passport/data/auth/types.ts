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
  Json: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type ActionResponse = {
  errorMessage?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

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
  acceptTosVersion?: Maybe<Scalars['String']>;
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
  tos: ToS;
  version?: Maybe<Version>;
};


export type QueryKeysArgs = {
  kid: Scalars['String'];
};


export type QueryTosArgs = {
  appId: Scalars['String'];
};

export type ToS = {
  __typename?: 'ToS';
  found: Scalars['Boolean'];
  url?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
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

export type LoginWithEmailMutationVariables = Exact<{
  appId: Scalars['String'];
  emailAddress: Scalars['String'];
  acceptTosVersion: Scalars['String'];
}>;


export type LoginWithEmailMutation = (
  { __typename?: 'Mutation' }
  & { loginWithEmail: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'success' | 'errorMessage'>
  ) }
);

export type VerifyMutationVariables = Exact<{
  oneTimeToken: Scalars['String'];
}>;


export type VerifyMutation = (
  { __typename?: 'Mutation' }
  & { verify: (
    { __typename?: 'VerifyResponse' }
    & Pick<VerifyResponse, 'success' | 'errorMessage' | 'jwt' | 'exchangeTokenUrl'>
  ) }
);

export type ChallengeMutationVariables = Exact<{
  byAppId: Scalars['String'];
  forAppId: Scalars['String'];
  subject: Scalars['String'];
}>;


export type ChallengeMutation = (
  { __typename?: 'Mutation' }
  & { challenge: (
    { __typename?: 'ChallengeResponse' }
    & Pick<ChallengeResponse, 'success' | 'errorMessage'>
  ) }
);

export type TosQueryVariables = Exact<{
  appId: Scalars['String'];
}>;


export type TosQuery = (
  { __typename?: 'Query' }
  & { tos: (
    { __typename?: 'ToS' }
    & Pick<ToS, 'found' | 'version' | 'url'>
  ) }
);


export const LoginWithEmailDocument = gql`
    mutation loginWithEmail($appId: String!, $emailAddress: String!, $acceptTosVersion: String!) {
  loginWithEmail(
    appId: $appId
    emailAddress: $emailAddress
    acceptTosVersion: $acceptTosVersion
  ) {
    success
    errorMessage
  }
}
    `;
export const VerifyDocument = gql`
    mutation verify($oneTimeToken: String!) {
  verify(oneTimeToken: $oneTimeToken) {
    success
    errorMessage
    jwt
    exchangeTokenUrl
  }
}
    `;
export const ChallengeDocument = gql`
    mutation challenge($byAppId: String!, $forAppId: String!, $subject: String!) {
  challenge(
    byAppId: $byAppId
    forAppId: $forAppId
    challengeType: "delegated"
    subject: $subject
  ) {
    success
    errorMessage
  }
}
    `;
export const TosDocument = gql`
    query tos($appId: String!) {
  tos(appId: $appId) {
    found
    version
    url
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    loginWithEmail(variables: LoginWithEmailMutationVariables): Promise<LoginWithEmailMutation> {
      return withWrapper(() => client.request<LoginWithEmailMutation>(print(LoginWithEmailDocument), variables));
    },
    verify(variables: VerifyMutationVariables): Promise<VerifyMutation> {
      return withWrapper(() => client.request<VerifyMutation>(print(VerifyDocument), variables));
    },
    challenge(variables: ChallengeMutationVariables): Promise<ChallengeMutation> {
      return withWrapper(() => client.request<ChallengeMutation>(print(ChallengeDocument), variables));
    },
    tos(variables: TosQueryVariables): Promise<TosQuery> {
      return withWrapper(() => client.request<TosQuery>(print(TosDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;