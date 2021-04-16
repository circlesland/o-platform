import {EditorContext} from "./editorContext";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {PlatformEvent} from "../../o-events/dist/platformEvent";

export type HtmlViewerContext = EditorContext & {
    params: {
        label: string;
        html:(context:ProcessContext<any>, event:PlatformEvent) => string,
        [x: string]: any
    }
}