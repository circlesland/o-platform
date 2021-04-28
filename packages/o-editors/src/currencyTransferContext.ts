import { EditorContext } from "./editorContext";

export type CurrencyTransferContext = EditorContext & {
  params: {
    label: string;
    currencies: {
      value: string;
      label: string;
    }[];
    [x: string]: any;
  };
};
