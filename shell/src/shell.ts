import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Subject} from "rxjs";
import {Process} from "@o-platform/o-process/dist/interfaces/process";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {ApiConnection} from "./shared/apiConnection";

export interface IShell {
  depositedEvent?: PlatformEvent; // TODO: Hack. This field should be checked by a freshly initializing dapp. The value must be cleared whenever a dapp was loaded (success or error).
  contactUsername?: string;
  authorization?:string;
  authClient?: ApiConnection,
  apiClient?: ApiConnection,
  theGraphClient?: ApiConnection,
  lastError?: any;
  events?: Subject<PlatformEvent>,
  publishEvent?: (event: PlatformEvent) => void,
  stateMachines: {
    findById(processId:string): Process;
    run<TContext>(definition: ProcessDefinition<any,any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>) : Promise<Process>
  }
}
