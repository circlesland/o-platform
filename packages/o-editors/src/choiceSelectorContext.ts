import {EditorContext} from "./editorContext";

export type ChoiceSelectorContext = EditorContext & {
    params: {
        label: string;
        choices:{
            key:string,
            label:string
        }[],
        [x: string]: any
    }
}