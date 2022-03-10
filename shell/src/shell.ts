import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subject } from "rxjs";
import { Process } from "@o-platform/o-process/dist/interfaces/process";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { ApiConnection } from "./shared/apiConnection";

import { en } from "./i18n/lang/en";
import { _, dictionary, format, init, locale } from "svelte-i18n";
import { get } from "svelte/store";

const i18n = (id: string, options?: any) => {
  dictionary.set(en);
  locale.set("en");

  init({
    fallbackLocale: "en",
    initialLocale: "en",
  });

  return get(format)(id, options);
};
(<any>window).i18n = i18n;

export interface IShell {
  depositedEvent?: PlatformEvent; // TODO: Hack. This field should be checked by a freshly initializing dapp. The value must be cleared whenever a dapp was loaded (success or error).
  contactUsername?: string;
  authorization?: string;
  authClient?: ApiConnection;
  apiClient?: ApiConnection;
  theGraphClient?: ApiConnection;
  lastError?: any;
  events?: Subject<PlatformEvent>;
  publishEvent?: (event: PlatformEvent) => void;
  requestEvent?: <TResult extends PlatformEvent>(
    event: PlatformEvent
  ) => Promise<TResult>;
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
      contextModifier?: (
        processContext: ProcessContext<any>
      ) => Promise<TContext>
    ): Promise<Process>;
  };
}
