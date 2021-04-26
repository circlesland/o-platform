import {WebsocketProvider} from "web3-core";
import {BN} from "ethereumjs-util";
import Web3 from "web3";
import Common from "ethereumjs-common";
import {Web3providerChanged} from "./events/web3providerChanged";
import {Observable, Subscription} from "rxjs";

export class RpcGateway {
    static readonly gateways = [
        "wss://xdai.poanetwork.dev/wss",
        "wss://rpc.xdaichain.com/wss"
    ];

    private static _lastProviderUrl?:string;

    private static _web3?:Web3;
    private static _provider?:WebsocketProvider;

    static get() : Web3 {
        if (!this._web3) {
            this.rotateProvider();
        }
        if (!this._web3) {
            throw new Error(`Couldn't create a web3 instance.`)
        }
        return this._web3;
    }

    static async execute(f:(web3:Web3) => Observable<any>, timeoutAndRotateAfterMs:number) : Promise<void> {
        try {
            for (let i = 0; i < RpcGateway.gateways.length; i++) {
                await this._execute(f, timeoutAndRotateAfterMs);
            }
        } catch (e) {
            if (e.message === "slow_provider") {
                RpcGateway.rotateProvider();
                console.warn("The provider took too long to answer. Retrying with a different provider ...");
            } else {
                throw e;
            }
        }
    }

    private static async _execute(f:(web3:Web3) => Observable<any>, timeoutAndRotateAfterMs:number) : Promise<void> {
        return new Promise((resolve, reject) => {
            const now = new Date();

            let done:boolean = false;
            let lastProgress = now;
            let lastError:Error|undefined = undefined;

            let intervalHandle:any = setInterval(() => {
                if (done) {
                    clearInterval(intervalHandle);
                    intervalHandle = undefined;
                    return;
                }

                const timeSinceLastProgress = Date.now() - lastProgress.getTime();
                if (timeSinceLastProgress >= timeoutAndRotateAfterMs) {
                    reject("slow_provider");
                    clearInterval(intervalHandle);
                    intervalHandle = undefined;
                    return;
                }
            }, timeoutAndRotateAfterMs);

            let subscription:Subscription|undefined = undefined;
            try {
                const web3 = this.get();
                subscription = f(web3).subscribe({
                    next:(_:any) => lastProgress = new Date(),
                    error:(err:Error) => reject(err),
                    complete:() => {
                        resolve();
                        done = true;
                    }
                });
                if (lastError) {
                    throw lastError;
                }
            } catch (e) {
                reject(e);
            } finally {
                if (subscription) {
                    subscription.unsubscribe();
                }
                if (intervalHandle) {
                    clearInterval(intervalHandle);
                }
            }
        });
    }

    static async getEthJsCommon() : Promise<Common> {
        return Common.forCustomChain(
            'mainnet',
            {
                name: "xDai",
                networkId: await this.get().eth.net.getId(),
                chainId: await this.get().eth.getChainId(),
            },
            'istanbul',
        );
    }

    static getGasPrice() {
        return new BN(this.get().utils.toWei("1", "gwei"))
    }

    static rotateProvider() {
        if (!this._web3) {
            this._web3 = new Web3();
        }

        let availableGateways:string[] = this.gateways;
        if (this._lastProviderUrl) {
            // We had a previously connected provider and don't want it again
            // for the next session
            availableGateways = this.gateways.filter(o => o != this._lastProviderUrl);
        }

        // Choose a provider at random
        const nextProvider = availableGateways[Math.floor(Math.random() * availableGateways.length)];
        const providerInstance = new Web3.providers.WebsocketProvider(
            nextProvider,
            {
                timeout: 30000,
                reconnect: {
                    auto: false
                },
                clientConfig: {
                    keepalive: true,
                    keepaliveInterval: 60000
                }
            }
        );
        providerInstance.on("close", <any>((e: any) => {
            console.error(`The RPC gateway (${nextProvider}) closed the connection:`, e);
            this.rotateProvider();
        }));
        providerInstance.on("error", <any>((e: any) => {
            console.error(`Web3 provider error (${nextProvider}):`, e);
            this.rotateProvider();
        }));

        if(this._provider) {
            this._provider.removeAllListeners("error");
            this._provider.removeAllListeners("close");
        }

        this._lastProviderUrl = nextProvider;
        this._provider = providerInstance;
        this._web3.setProvider(this._provider);

        console.log(`Set the RPC gateway to ${nextProvider}`)

        const o:any = (<any>window).o;
        if (o) {
            o.publishEvent(new Web3providerChanged());
        }
    }
}