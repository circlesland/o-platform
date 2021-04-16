import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";
import { ProcessDefinition } from "../interfaces/processManifest";
import { ProcessContext } from "../interfaces/processContext";

export class RunProcess<TContext extends ProcessContext<any>> implements PlatformEvent {
  type: PlatformEventTypes = "shell.runProcess";

  readonly inWindow: boolean;
  readonly definition: ProcessDefinition<any,any>;
  readonly contextModifier?: (processContext: TContext) => Promise<TContext>;

  constructor(
      definition: ProcessDefinition<any,any>,
      inWindow: boolean = true,
      contextModifier?: (processContext: TContext) => Promise<TContext>) {
    this.definition = definition;
    this.inWindow = inWindow;
    this.contextModifier = contextModifier;
  }
}