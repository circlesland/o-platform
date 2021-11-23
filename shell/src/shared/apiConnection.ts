import ApolloClient, {DefaultOptions} from "apollo-client";
import {InMemoryCache, NormalizedCacheObject} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {AsyncBroadcast} from "@o-platform/o-utils/dist/asyncBroadcast";
import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {DocumentNode, OperationDefinitionNode} from "graphql/language/ast";

export class ApiClient {
    /**
     * Executes a graphQL query against the api.
     * @param query
     * @param args
     */
    static async query<TResult, TArgs>(query: DocumentNode, args: TArgs) : Promise<TResult> {
        const queryDef:any = query.definitions.length == 1 ? query.definitions[0] : null;
        if (!queryDef) {
            throw new Error(`The query contains none or more than one definition. Only 1 definition per query is supported.`)
        }
        if (!queryDef.selectionSet){
            throw new Error(`The query definition doesn't contain a 'selectionSet'.`)
        }
        if (queryDef.selectionSet.selections?.length != 1) {
            throw new Error(`The query definition contains none or more than one selection. Only 1 selection is supported.`)
        }

        const selection = queryDef.selectionSet.selections[0];
        const dataProp:string = selection.name.value;
        if (!dataProp) {
            throw new Error(`The selection doesn't have a name. Cannot find the data-holding property of the graphql response.`)
        }

        const apiClient = await window.o.apiClient.client.subscribeToResult();
        const result = await apiClient.query({
            query: query,
            variables: args
        });

        if (result.errors?.length > 0) {
            throw new Error(`Something went wrong while querying the api: ${result.errors.map((o) => o.message).join("\n")}`);
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

    public connect() : ApolloClient<NormalizedCacheObject> {
        const httpLink = new HttpLink({
            fetch: fetch,
            uri: this._apiEndpointUrl,
            credentials: this._credentialsPolicy
        });

        const wsAddr = this._apiEndpointUrl.replace("http://", "ws://").replace("https://", "wss://");
        const wsLink = new WebSocketLink({
            uri: wsAddr,
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
                throw new Error(`A FragmentDefinitionNode was returned when a OperationDefinitionNode was expected.`)
            }
          },
          wsLink,
          httpLink,
        );

        return new ApolloClient({
            link: link,
            cache: new InMemoryCache({}),
            defaultOptions: ApiConnection._defaultOptions
        });
    }
}