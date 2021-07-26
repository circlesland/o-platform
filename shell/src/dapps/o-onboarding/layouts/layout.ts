import {SvelteComponent} from "svelte";

export interface Content {
    component: SvelteComponent,
    params: {
        [x:string]:any
    }
}

export interface Dialog extends Content {
    isOpen: boolean
}

export interface Layout {
    main: Content,
    dialogs: {
        left: Dialog,
        center: Dialog,
        right: Dialog
    }
}