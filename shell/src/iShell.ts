import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Process } from "@o-platform/o-process/dist/interfaces/process";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { Subject } from "rxjs";
import { ApiConnection } from "./shared/apiConnection";

export interface IShell {
  depositedEvent?: PlatformEvent; // TODO: Hack. This field should be checked by a freshly initializing dapp. The value must be cleared whenever a dapp was loaded (success or error).
  contactUsername?: string;
  authorization?: string;
  apiClient: ApiConnection;
  theGraphClient: ApiConnection;
  lastError?: any;
  events?: Subject<PlatformEvent>;
  publishEvent?: (event: PlatformEvent) => void;
  requestEvent?: <TResult extends PlatformEvent>(event: PlatformEvent) => Promise<TResult>;
  runProcess?: (
    processDefinition: ProcessDefinition<any, any>,
    contextData: { [x: string]: any },
    dirtyFlags?: { [x: string]: boolean },
    onlyThesePages?: string[]
  ) => Promise<any>;
  stateMachines: {
    findById(processId: string): Process;
    run<TContext>(
      definition: ProcessDefinition<any, any>,
      contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>
    ): Promise<Process>;
  };
  i18n: (key: string, options?: any) => string;
}