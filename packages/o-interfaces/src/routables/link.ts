import {Routable} from "../routable";
import {RuntimeDapp} from "../runtimeDapp";

export interface Link<TParams extends {[x:string]:any}, TDappState extends {[x:string]:any}> extends Routable {
  type: "link";
  openInNewTab?: boolean,
  url: (params:TParams, runtimeDapp:RuntimeDapp<TDappState>) => string
}