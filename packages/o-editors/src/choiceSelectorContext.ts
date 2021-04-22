import {EditorContext} from "./editorContext";

export type Choice = {
    value:string,
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