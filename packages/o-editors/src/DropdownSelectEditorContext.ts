import {EditorContext} from "./editorContext";

export type DropdownSelectorParams<TOption, TKey> = {
    label: string;
    placeholder: string;
    keyProperty: string;
    getLabel:(option:TOption)=>string;
    getKey:(option:TOption)=>TKey;
    itemTemplate?: any,
    choices: {
        byKey:(key:TKey) => Promise<TOption|undefined>,
        find:(filter?:string) => Promise<TOption[]>
    },
    [x: string]: any
}

export type DropdownSelectorContext<TOption, TKey> = EditorContext & {
    params: DropdownSelectorParams<TOption, TKey>
}