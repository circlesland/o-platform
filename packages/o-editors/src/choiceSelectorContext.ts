import {EditorContext} from "./editorContext";

export type Choice = {
    value:any,
    label:string
};
export type ChoiceSelectorContext = EditorContext & {
    params: {
        label: string;
        choices?:Choice[],
        asyncChoices?: (filter?:string) => Promise<Choice[]>,
        [x: string]: any
    }
}