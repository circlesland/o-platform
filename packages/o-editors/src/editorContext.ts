import { Process } from "@o-platform/o-process/dist/interfaces/process";

export type EditorContext = {
  fieldName?: string;
  data: { [x: string]: any };
  dirtyFlags: { [x: string]: any };
  messages: { [x: string]: string };
  params: { [x: string]: any };
  process: Process;
  canGoBack: boolean;
  canSkip: boolean;
  required?: boolean;
};
