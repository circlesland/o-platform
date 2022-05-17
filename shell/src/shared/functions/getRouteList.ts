import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Link } from "@o-platform/o-interfaces/dist/routables/link";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {Profile, ProfileType} from "../api/data/types";
import {me} from "../stores/me";

export function getRouteList(
  dapp: DappManifest<any>,
  runtimeDapp: RuntimeDapp<any>,
  routable?: Routable
): {
  icon?: string;
  title: string;
  url: string;
  extern: boolean;
  isActive: boolean;
}[] {
  // console.log("getRouteList.routable:", routable);
  const routables = dapp.routables.filter(
    (o) => (o.type === "page" || o.type === "link") && !o.isSystem
  );
  let $me:Profile;
  me.subscribe(m => $me = m)();
  return routables.map((o) => {
    if (o.type == "page") {
      return {
        audience: (<Page<any, any>>o).audience,
        title: o.title,
        icon: o.icon,
        url:
          runtimeDapp.routeParts
            .map((o) => (o.startsWith("=") ? o.replace("=", "") : o))
            .join("/") +
          "/" +
          o.routeParts
            .map((o) => (o.startsWith("=") ? o.replace("=", "") : o))
            .join("/"),
        extern: false,
        isActive: o.routeParts === routable?.routeParts,
      };
    } else {
      return {
        title: o.title,
        icon: o.icon,
        url: (<Link<any, any>>o).url({}, runtimeDapp),
        extern: (<Link<any, any>>o).openInNewTab,
        isActive: false,
      };
    }
  }).filter(o => {
    return o.audience != ProfileType.Organisation || (<any>$me).__typename == "Organisation"
  });
}
