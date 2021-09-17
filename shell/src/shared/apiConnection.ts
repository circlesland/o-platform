import ApolloClient, {DefaultOptions} from "apollo-client";
import {InMemoryCache, NormalizedCacheObject} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {AsyncBroadcast} from "@o-platform/o-utils/dist/asyncBroadcast";

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
        // console.log("apollo client is connecting to: ", this._apiEndpointUrl);

        const httpLink = new HttpLink({
            fetch: fetch,
            uri: this._apiEndpointUrl,
            credentials: this._credentialsPolicy
        });

        const client = new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache({}),
            defaultOptions: ApiConnection._defaultOptions
        });

        // console.log("apollo client is now connected to: ", this._apiEndpointUrl);

        return client;
    }
}