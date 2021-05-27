import {EditorContext} from "@o-platform/o-editors/src/editorContext";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type PaymentPathContext = EditorContext & {
    params: {
        label: string;
        transfers:(context:ProcessContext<any>, event:PlatformEvent) => any[],
        [x: string]: any
    }
}