import {SvelteComponent} from "svelte";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {Routable} from "@o-platform/o-interfaces/dist/routable";

export interface Content {
    component: SvelteComponent,
    params: {
        [x:string]:any
    }
}

export interface RuntimeContent extends Content {
    runtimeDapp?: RuntimeDapp<any>,
    routable?: Routable
}

export interface Dialog extends Content {
    isOpen: boolean
}

export interface RuntimeDialog extends Dialog {
    runtimeDapp: RuntimeDapp<any>,
    routable: Routable
}

export interface Layout {
    type: "description"|"runtime"
    main?: Content|RuntimeContent,
    dialogs: {
        left?: Dialog|RuntimeDialog,
        center?: Dialog|RuntimeDialog,
        right?: Dialog|RuntimeDialog
    }
}

export interface LayoutDescription extends Layout {
    type: "description",
    main?: Content,
    dialogs: {
        left?: Dialog,
        center?: Dialog,
        right?: Dialog
    }
}
export interface RuntimeLayout extends Layout {
    type: "runtime",
    main?: RuntimeContent,
    dialogs: {
        left?: RuntimeDialog,
        center?: RuntimeDialog,
        right?: RuntimeDialog
    }
}