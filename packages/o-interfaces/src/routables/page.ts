import { Jumplist } from "./jumplist";
import { Routable } from "../routable";
import {ProfileType} from "@o-platform/shell/src/shared/api/data/types";

/**
 * A regular page to which a user can navigate.
 * The page can have a jumplist associated with it.
 * If the dapp has an associated jumplist as well, then the items of both lists are merged.
 * Page jumplist-items with the same key hide the dapp jumplist items.
 */
export interface Page<
  TParams extends { [x: string]: any },
  TDappState extends { [x: string]: any }
> extends Routable {
  type: "page";
  audience?: ProfileType;
  position?: "main" | "modal";
  /**
   * The route parts to the base page if the "position" of this page is "modal"
   */
  basePage?: string[];
  component?: any;
  anonymous?: boolean;
  jumplist?: Jumplist<TParams, TDappState>;
  isFullWidth?: boolean;
  hideFooter?: boolean;

}
