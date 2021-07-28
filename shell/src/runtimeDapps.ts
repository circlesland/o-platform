import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";

export class RuntimeDapps {

    public static instance() {
        return this._instance;
    }
    private static _instance:RuntimeDapps = new RuntimeDapps();

    private _runtimeDapps:{
        [id:string]: RuntimeDapp<any>
    } = {};

    private constructor() {
    }

    async getRuntimeDapp(dappManifest:DappManifest<any>): Promise<RuntimeDapp<any>> {
        if (!this._runtimeDapps[dappManifest.dappId]) {
            let runtimeDapp = <RuntimeDapp<any>>{
                ...dappManifest,
                runtimeId: dappManifest.dappId,
                route: null,
                state: {},
            };
            if (runtimeDapp.initialize) {
                await runtimeDapp.initialize([], runtimeDapp);
            }
            this._runtimeDapps[dappManifest.dappId] = runtimeDapp;
        }

        return this._runtimeDapps[dappManifest.dappId];
    }
}