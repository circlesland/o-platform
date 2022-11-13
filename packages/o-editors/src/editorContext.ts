import { Process } from "@o-platform/o-process/dist/interfaces/process";
import {PlatformEvent} from "../../o-events/dist/platformEvent";
import {PromptField} from "@o-platform/o-process/dist/states/prompt";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";

export interface  EditorContext extends ProcessContext<any> {
  field?: PromptField<any>;
  editorDirtyFlags: { [x: string]: any };
  params: { [x: string]: any };
  process: Process;
  isReadonly?: boolean;
  isSensitive?: boolean;
  canGoBack: boolean;
  canSkip: boolean;
  hideNav: boolean;
  dataSchema?: any;
  sendAnswer(answer:PlatformEvent) : void;
}