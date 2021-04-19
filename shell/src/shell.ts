import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Subject} from "rxjs";
import {Process} from "@o-platform/o-process/dist/interfaces/process";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import ApolloClient from "apollo-client";
import {NormalizedCacheObject} from "apollo-cache-inmemory";
import {ApiConnection} from "./shared/apiConnection";

export interface IShell {
  contactUsername?: string;
  authorization?:string;
  authClient?: ApiConnection,
  apiClient?: ApiConnection,
  theGraphClient?: ApolloClient<NormalizedCacheObject>,
  lastError?: any;
  events?: Subject<PlatformEvent>,
  publishEvent?: (event: PlatformEvent) => void,
  stateMachines: {
    findById(processId:string): Process;
    run<TContext>(definition: ProcessDefinition<any,any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>) : Promise<Process>
  }
}
