import { EditorContext } from "./editorContext";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";

export type DropdownSelectorParams<
  TContext extends ProcessContext<any>,
  TOption,
  TKey
> = {
  placeholder: string;
  keyProperty?: string;
  getLabel: (option: TOption) => string;
  getKey: (option: TOption) => TKey;
  itemTemplate?: any;
  showResultsOnLoad?: boolean;
  choices: {
    byKey: (key: TKey, context: TContext) => Promise<TOption | undefined>;
    find: (filter: string | undefined, context: TContext) => Promise<TOption[]>;
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
