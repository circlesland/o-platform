import { IconDefinition } from "@fortawesome/fontawesome-common-types";

import { RuntimeDapp } from "./runtimeDapp";
import { Routable } from "./routable";
import { Jumplist } from "./routables/jumplist";
import {NavigationManifest} from "./navigationManifest";

export interface DappManifest<TState extends { [x: string]: any }>
  extends Routable {
  type: "dapp";
  /**
   * A unique identifier for this auth manifest.
   * This identifier is used as a namespace for all incoming and outgoing events of the auth.
   */
  dappId: string;

  /**
   * If 'true' then the 'id' will be used as the 'runtimeId' of a RuntimeDapp
   */
  isSingleton: boolean;

  hideFooter?: boolean;

  isFullWidth?: boolean;

  /**
   * If the auth should be hidden in menus.
   */
  isHidden?: boolean;
  /**
   * This icon will be displayed in the auth overview.
   */
  icon?: IconDefinition;
  /**
   * This title will be displayed as the auth name.
   */
  title: string;

  /**
   * Dapps can depend on other dapps.
   * When a auth depends on another auth, then the dependent auth cannot be initialized
   * before the dependency was initialized.
   */
  // dependencies?: string[];

  /**
   * The route of the entry page of this auth.
   */
  routeParts: string[];

  defaultRoute?: string[];

  /**
   * Can be used to indicate a status in the auth overview next to the icon.
   */
  tag: Promise<string | null | undefined>;
  /**
   * Can be used to indicate if this auth is currently available in the auth overview (greyed out or not)
   */
  isEnabled: boolean;

  /**
   * Contains all pages of the auth.
   */
  //pages: PageManifest[];

  routables: Routable[];
  jumplist?: Jumplist<any, TState>;
  navigation?: NavigationManifest;

  /**
   * If the auth needs to initialize things before it can be used,
   * then these steps must be performed in this factory.
   * @param runtimeDapp
   */
  initialize?: (
    stack: RuntimeDapp<TState>[],
    runtimeDapp: RuntimeDapp<TState>
  ) => Promise<{
    initialRoutable: Routable;
    cancelDependencyLoading: boolean;
  }>;
}
