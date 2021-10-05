import ApolloClient, {DefaultOptions} from "apollo-client";
import {InMemoryCache, NormalizedCacheObject} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {AsyncBroadcast} from "@o-platform/o-utils/dist/asyncBroadcast";
import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {OperationDefinitionNode} from "graphql/language/ast";

export class ApiConnection
{
    private readonly _apiEndpointUrl: string;
    private readonly _credentialsPolicy: string|undefined;
    private _client:ApolloClient<NormalizedCacheObject>|undefined;

    readonly client = new AsyncBroadcast<void, ApolloClient<NormalizedCacheObject>>(async () =>
    {
        if (!this._client)
        {
            if (this._client)
            {
                this._client.stop();
            }

            this._client = await this.connect();
        }

        return this._client;
    });

    constructor(apiEndpointUrl: string, credentialsPolicy?:string)
    {
        this._apiEndpointUrl = apiEndpointUrl;
        this._credentialsPolicy = credentialsPolicy;
    }

    destroy()
    {
        if (this._client)
        {
            this._client.stop();
            this._client = undefined;
        }
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