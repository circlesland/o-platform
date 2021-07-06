import {Jumplist} from "./jumplist";
import {Routable} from "../routable";

/**
 * A regular page to which a user can navigate.
 * The page can have a jumplist associated with it.
 * If the dapp has an associated jumplist as well, then the items of both lists are merged.
 * Page jumplist-items with the same key hide the dapp jumplist items.
 */
export interface Page<TParams extends {[x:string]:any}, TDappState extends {[x:string]:any}> extends Routable {
  type: "page";
  component?: any,
  jumplist?: Jumplist<TParams, TDappState>
  isFullWidth?:boolean,
  hideFooter?:boolean
}
/*
export interface PageManifest {
  component?: any,
  isDefault?:boolean,
  isSystem?:boolean,
  isFullWidth?:boolean,
  hideFooter?:boolean,
  icon?: IconDefinition,
  title: string,
  available?: any[],
  routeParts: string[],
  userData?: {
    [x:string]:any
  }
    actions?: (runtimeDapp: RuntimeDapp<any>) => {
    key: string;
    icon?: string;
    label: string;
    event: () => PlatformEvent;
  }[];

  onMountAction?: (params:{[x:string]:any}|undefined) => PlatformEvent;
}
*/