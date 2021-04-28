import { Process } from "@o-platform/o-process/dist/interfaces/process";
import {PlatformEvent} from "../../o-events/dist/platformEvent";

export type EditorContext = {
  fieldName?: string;
  data: { [x: string]: any };
  dirtyFlags: { [x: string]: any };
  messages: { [x: string]: string };
  params: { [x: string]: any };
  process: Process;
  isSensitive?: boolean;
  canGoBack: boolean;
  canSkip: boolean;
  dataSchema?: any;
  sendAnswer(answer:PlatformEvent) : void;
};
