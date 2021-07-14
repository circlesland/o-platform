import {EditorContext} from "./editorContext";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {PlatformEvent} from "../../o-events/dist/platformEvent";

export type NotificationViewerContext = EditorContext & {
    params: {
        label: string;
        [x: string]: any
    }
}