import { EditorContext } from "./editorContext";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { EditorViewContext } from "./shared/editorViewContext";
import {Observable} from "rxjs";

export type DropdownSelectorParams<
  TContext extends ProcessContext<any>,
  TOption,
  TKey
> = {
  view?: EditorViewContext;
  keyProperty?: string;
  getLabel: (option: TOption) => string;
  getKey: (option: TOption) => TKey;
  itemTemplate?: any;
  showResultsOnLoad?: boolean;
  choices: {
    byKey: (key: TKey, context: TContext) => Promise<TOption | undefined>;
    find: (filter: string | undefined, context: TContext) => Observable<TOption[]>|Promise<TOption[]>;
  };
  [x: string]: any;
};

export type DropdownSelectorContext<
  TContext extends ProcessContext<any>,
  TOption,
  TKey
> = EditorContext & {
  params: DropdownSelectorParams<TContext, TOption, TKey>;
};
