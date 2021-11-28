import {EditorContext} from "./editorContext";

export type NotificationViewerContext = EditorContext & {
    params: {
        label: string;
        [x: string]: any
    }
}