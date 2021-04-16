import {EditorContext} from "./editorContext";

export type CurrencyTransferContext = EditorContext & {
    params: {
        label: string;
        currencies:{
            key:string,
            label:string
        }[],
        [x: string]: any
    }
}