import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Subject} from "rxjs";
import {Process} from "@o-platform/o-process/dist/interfaces/process";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import ApolloClient from "apollo-client";
import {NormalizedCacheObject} from "apollo-cache-inmemory";

export interface GlobalState {
  isLoggedOn?: boolean,
  hasPassport?: boolean,
  isFunded?: boolean,
  hasSafe?: boolean,
  hasKey?: boolean,
  isSignedUpAtCircles?: boolean
}

export interface IShell {
  contactUsername?: string;
  authClient?: ApolloClient<NormalizedCacheObject>,
  theGraphClient?: ApolloClient<NormalizedCacheObject>,
  lastError?: any;
  events?: Subject<PlatformEvent>,
  publishEvent?: (event: PlatformEvent) => void,
  globalState?: GlobalState,
  stateMachines: {
    findById(processId:string): Process;
    run<TContext>(definition: ProcessDefinition<any,any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>) : Promise<Process>
  }
}
