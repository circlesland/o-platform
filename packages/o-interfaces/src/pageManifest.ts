import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {RuntimeDapp} from "./runtimeDapp";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

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
