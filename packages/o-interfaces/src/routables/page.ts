import {Jumplist} from "./jumplist";
import {Routable} from "../routable";

/**
 * A regular page to which a user can navigate.
 * The page can have a jumplist associated with it.
 * If the dapp has an associated jumplist as well, then the items of both lists are merged.
 * Page jumplist-items with the same key hide the dapp jumplist items.
 */
export interface Page<TParams extends {[x:string]:any}, TDappState extends {[x:string]:any}> extends Routable {
  type: "page",
  position?: ("main"|"modal"),
  component?: any,
  jumplist?: Jumplist<TParams, TDappState>,
  isFullWidth?:boolean,
  hideFooter?:boolean
}