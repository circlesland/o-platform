import {WebsocketProvider} from "web3-core";
import {BN} from "ethereumjs-util";
import Web3 from "web3";
import Common from "ethereumjs-common";
import {Web3providerChanged} from "./events/web3providerChanged";
import {Observable} from "rxjs";

export class RpcGateway {
    static readonly gateways = [
        "wss://rpc.circles.land/",
        //"wss://circles-xdai-rpc.lab10.io/wss"
    ];

    private static _lastProviderUrl?: string;

    private static _web3?: Web3;
    private static _provider?: WebsocketProvider;

    static get(): Web3 {
        if (!this._web3) {
            this.rotateProvider();
        }
        if (!this._web3) {
            throw new Error(`Couldn't create a web3 instance.`)
        }
        return this._web3;
    }

    /**
     * Monitors a short running process and restarts it if it gets stuck.
     */
    static async trigger(f: (web3:Web3) => Promise<any>, timeoutAndRotateAfterMs: number) {
        for (let i = 0; i < RpcGateway.gateways.length; i++) {
            try {
                const observable = (w3:Web3) => <any>new Observable<any>(subscriber => {
                    f(w3).then(() => subscriber.complete())
                        .catch(e => subscriber.error(e));
                });
                await this._execute(observable, timeoutAndRotateAfterMs);
                return;
            } catch (e) {
                // TODO: Äh? (e === "slow_provider" || e.message === "slow_provider")
                if (e === "slow_provider" || e.message === "slow_provider") {
                    console.warn("The provider took too long to answer. Retrying with a different provider ...");
                    RpcGateway.rotateProvider();
                } else {
                    throw e;
                }
            }
        }
        throw new Error(`The request could not be completed in time. Tried ${RpcGateway.gateways.length} providers.`);
    }

    /**
     * Monitors a long running process and restarts it if it gets stuck.
     */
    static async run(f: (web3:Web3) => Observable<any>, timeoutAndRotateAfterMs: number) {
        for (let i = 0; i < RpcGateway.gateways.length; i++) {
            try {
                await this._execute(f, timeoutAndRotateAfterMs);
                return;
            } catch (e) {
                // TODO: Äh? (e === "slow_provider" || e.message === "slow_provider")
                if (e === "slow_provider" || e.message === "slow_provider") {
                    RpcGateway.rotateProvider();
                    console.warn("The provider took too long to answer. Retrying with a different provider ...");
                } else {
                    throw e;
                }
            }
        }
        throw new Error(`The request could not be completed in time. Tried ${RpcGateway.gateways.length} providers.`);
    }

    private static async _execute(f: (web3: Web3) => Observable<any>, timeoutAndRotateAfterMs: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const now = new Date();

            let done: boolean = false;
            let lastProgress = now;
            let lastError: Error | undefined = undefined;

            let intervalHandle: any = setInterval(() => {
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

            const web3 = this.get();
            const subscription = f(web3).subscribe({
                next: (_: any) => {
                    lastProgress = new Date()
                },
                error: (err: Error) => {
                    subscription.unsubscribe();
                    reject(err);
                },
                complete: () => {
                    resolve();
                    subscription.unsubscribe();
                    done = true;
                }
            });
        });
    }

    static async getEthJsCommon(): Promise<Common> {
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

    static async getGasPrice() {
        const gasPrice = await this._web3?.eth.getGasPrice();
        if (!gasPrice)
            throw new Error(`Cannot determine the gasPrice (_web3 not set?)`)
        return new BN(gasPrice);
    }

    static rotateProvider() {
        if (!this._web3) {
            this._web3 = new Web3();
        }

        let availableGateways: string[] = this.gateways;
        if (this._lastProviderUrl) {
            // We had a previously connected provider and don't want it again
            // for the next session
            availableGateways = this.gateways.filter(o => this.gateways.length == 1 || o != this._lastProviderUrl);
        }

        // Choose a provider at random
        const nextProvider = availableGateways[Math.floor(Math.random() * availableGateways.length)];
        const providerInstance = new Web3.providers.WebsocketProvider(
            nextProvider,
            {
                timeout: 30000,
                reconnect: {
                    auto: true,
                    maxAttempts: 3,
                    delay: 1000
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

        if (this._provider) {
            this._provider.removeAllListeners("error");
            this._provider.removeAllListeners("close");
        }

        this._lastProviderUrl = nextProvider;
        this._provider = providerInstance;
        this._web3.setProvider(this._provider);

        console.log(`Set the RPC gateway to ${nextProvider}`)

        const o: any = (<any>window).o;
        if (o) {
            o.publishEvent(new Web3providerChanged());
        }
    }
}