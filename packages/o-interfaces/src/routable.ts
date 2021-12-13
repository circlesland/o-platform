import { NavigationManifest } from "./navigationManifest";

/**
 * An element of the dapp(manifest) for which the loader will create a route.
 */
export interface Routable {
  type: "dapp" | "trigger" | "jumplist" | "page" | "link";
  routeParts: string[];
  isSystem?: boolean;
  title: string;
  icon?: string;
  anonymous?: boolean;
  navigation?: NavigationManifest;
}
