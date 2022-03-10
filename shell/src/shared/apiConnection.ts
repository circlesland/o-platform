import ApolloClient, {DefaultOptions} from "apollo-client";
import {InMemoryCache, IntrospectionFragmentMatcher, NormalizedCacheObject} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {AsyncBroadcast} from "@o-platform/o-utils/dist/asyncBroadcast";
import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {DocumentNode, OperationDefinitionNode} from "graphql/language/ast";
import {
    AggregatesDocument,
    AggregateType, ProfileAggregate,
    ProfileAggregateFilter,
    QueryAggregatesArgs
} from "./api/data/types";

export class ApiClient {
    static async queryAggregate<TPayloadType>(type: AggregateType, safeAddress: string, filter?: ProfileAggregateFilter) {
        const aggregates = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
            types: [type],
            safeAddress: safeAddress,
            filter: filter
        });
        const foundAggregate = aggregates.find(o => o.type == type)?.payload;
        if (!foundAggregate) {
            throw new Error(window.i18n("shared.apiConnection.errors.couldNotFindType", { values: { type: type}}));
        }
        return <TPayloadType><any>foundAggregate;
    }

    /**
     * Executes a graphQL query against the api.
     * @param query
     * @param args
     */
    static async query<TResult, TArgs>(query: DocumentNode, args: TArgs) : Promise<TResult> {
        const queryDef:any = query.definitions.length == 1 ? query.definitions[0] : null;
        if (!queryDef) {
            throw new Error(window.i18n("shared.apiConnection.errors.noOrMoreThanOneDefinitions"))
        }
        if (!queryDef.selectionSet){
            throw new Error(window.i18n("shared.apiConnection.errors.noSelectionSet"))
        }
        if (queryDef.selectionSet.selections?.length != 1) {
            throw new Error(window.i18n("shared.apiConnection.errors.noOrMoreThanOneSelection"))
        }

        const selection = queryDef.selectionSet.selections[0];
        const dataProp:string = selection.name.value;
        if (!dataProp) {
            throw new Error(window.i18n("shared.apiConnection.errors.selectionHasNoName"))
        }

        const apiClient = await window.o.apiClient.client.subscribeToResult();
        const result = await apiClient.query({
            query: query,
            variables: args
        });

        if (result.errors?.length > 0) {
            throw new Error(window.i18n("shared.apiConnection.errors.someThingWentWrong", { values: { error: result.errors.map((o) => o.message).join("\n")}}));
        }

        return <TResult>result.data[dataProp];
    }
}

export class ApiConnection
{
    private readonly _apiEndpointUrl: string;
    private readonly _credentialsPolicy: string|undefined;
    private _client:ApolloClient<NormalizedCacheObject>|undefined;

    reset() {
        if (this._client)
        {
            this._client.stop();
        }
        this._client = null;
    }

    readonly client = new AsyncBroadcast<void, ApolloClient<NormalizedCacheObject>>(async () =>
    {
        if (!this._client)
        {
            this._client = await this.connect();
        }

        return this._client;
    });

    constructor(apiEndpointUrl: string, credentialsPolicy?:string)
    {
        this._apiEndpointUrl = apiEndpointUrl;
        this._credentialsPolicy = credentialsPolicy;
    }

    private static readonly _defaultOptions:DefaultOptions = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    };

    public async connect() : Promise<ApolloClient<NormalizedCacheObject>> {
        const httpLink = new HttpLink({
            fetch: fetch,
            uri: this._apiEndpointUrl,
            credentials: this._credentialsPolicy
        });
        const result = await (await fetch(this._apiEndpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                variables: {},
                query: `{
                            __schema {
                              types {
                                kind
                                name
                                possibleTypes {
                                  name
                                }
                              }
                            }
                          }`,
            }),
        })).json();

        // here we're filtering out any type information unrelated to unions or interfaces
        result.data.__schema.types = result.data.__schema.types.filter(
          type => type.possibleTypes !== null,
        );

        const fragmentMatcher = new IntrospectionFragmentMatcher({
            introspectionQueryResultData: result.data
        });

        const wsAddr = this._apiEndpointUrl.replace("http://", "ws://").replace("https://", "wss://");
        const wsLink = new WebSocketLink({
            uri: wsAddr + "/graphql",
            options: {
                reconnect: true,
                connectionParams: {
                }
            },
        });

        const link = split(({ query }) => {
            const mainDefinition:any = getMainDefinition(query);
            if (mainDefinition.operation) {
                const { kind, operation } = <OperationDefinitionNode>getMainDefinition(query);
                return kind === 'OperationDefinition' && operation === 'subscription';
            } else {
                throw new Error(window.i18n("shared.apiConnection.errors.returnedFragmentDefinitionNode"))
            }
          },
          wsLink,
          httpLink,
        );

        return new ApolloClient({
            link: link,
            cache: new InMemoryCache({
                fragmentMatcher
            }),
            defaultOptions: ApiConnection._defaultOptions
        });
    }
}