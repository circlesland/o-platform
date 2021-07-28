import {interpret} from "xstate";
import {dialogMachine, DialogStateEvent, SHOW_PAGE} from "../../dapps/o-onboarding/components/dialog";
import {RuntimeLayout} from "../../dapps/o-onboarding/layouts/layout";
import {BehaviorSubject, Observable} from "rxjs";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {leftNav} from "../../dapps/o-onboarding/components/navigation";
import LinkComponent from "./NextNav/Components/Link.svelte";
import ListComponent from "./NextNav/Components/List.svelte";
import ActionButtonComponent from "./NextNav/Components/ActionButton.svelte";
import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";

export class DappFrameState {

    private _layout: RuntimeLayout = {
        type: "runtime",
        dialogs: {}
    };

    private _navigationManifest: NavigationManifest = {
        leftSlot: {
            component: LinkComponent,
            props: {
                icon: "list",
            },
        },
        navPill: {
            left: {
                component: ListComponent,
                props: {
                    icon: "list",
                    action: () => {
                    },
                },
            },
            center: {
                component: ActionButtonComponent,
                props: {
                    icon: "logo",
                    action: () => {
                    }
                },
            },
            right: {
                component: LinkComponent,
                props: {
                    icon: "home",
                    action: () => {
                    },
                },
            },
        }
    };

    private _leftNavButtonMachine = interpret(leftNav)
        .onEvent(event => {
            console.log("_leftNavButtonMachine.onEvent: ", event);

            if (event.type === "NAVIGATION_CHANGED") {
                this._navigationManifest.leftSlot = (<any>event).element;
                this.onNavigationChanged();

                if (this._leftNavButtonMachine.state.value === "open") {

                } else {

                }
            }
        })
        .onTransition((state) => {
            console.log("_leftNavButtonMachine.onTransition: ", state.value);
        });

    private _mainDialogMachine = interpret(dialogMachine)
        .onEvent(event => {
            console.log("_mainDialogMachine.onEvent: ", event);

            if (event.type === "CONTENT_CHANGED") {
                this._layout.main = (<any>event).content;
                this.onContentChanged();
            }
        })
        .onTransition((state) => {
            console.log("_mainDialogMachine.onTransition: ", state.value);
        });

    private _leftDialogMachine = interpret(dialogMachine)
        .onEvent(event => {
            console.log("_leftDialogMachine.onEvent: ", event);
            if (event.type === "CONTENT_CHANGED") {
                this._layout.dialogs.left = (<any>event).content;
                this.onContentChanged();
            }
            if (event.type === "OPENED") {
            }
            if (event.type === "CLOSED") {
            }
        })
        .onTransition((state) => {
            console.log("_leftDialogMachine.onTransition: ", state.value);
        });

    private _centerDialogMachine = interpret(dialogMachine)
        .onEvent(event => {
            console.log("_centerDialogMachine.onEvent: ", event);
            if (event.type === "CONTENT_CHANGED") {
                this._layout.dialogs.center = (<any>event).content;
                this._layout.dialogs.center.isOpen = this._centerDialogMachine.state.value !== "closed";
                this.onContentChanged();
            }
            if (event.type === "OPENED") {
            }
            if (event.type === "CLOSED") {
            }
        })
        .onTransition((state) => {
            console.log("_centerDialogMachine.onTransition: ", state.value);
            if (this._layout.dialogs.center) {
                this._layout.dialogs.center.isOpen = this._centerDialogMachine.state.value !== "closed";
                this.onContentChanged();
            }
        });

    private _rightDialogMachine = interpret(dialogMachine)
        .onEvent(event => {
            console.log("_rightDialogMachine.onEvent: ", event);
            if (event.type === "CONTENT_CHANGED") {
                this._layout.dialogs.right = (<any>event).content;
                this.onContentChanged();
            }
            if (event.type === "OPENED") {
            }
            if (event.type === "CLOSED") {
            }
        })
        .onTransition((state) => {
            console.log("_rightDialogMachine.onTransition: ", state.value);
        });


    public get layout() : Observable<RuntimeLayout> {
        return this._layoutSubject;
    }
    private _layoutSubject: BehaviorSubject<RuntimeLayout>;

    public get navigation() : Observable<NavigationManifest> {
        return this._navigationSubject;
    }
    private _navigationSubject: BehaviorSubject<NavigationManifest>;

    constructor() {
        this._layoutSubject = new BehaviorSubject<RuntimeLayout>(this._layout);
        this._navigationSubject = new BehaviorSubject<NavigationManifest>(this._navigationManifest);

        this._mainDialogMachine.start();
        this._leftDialogMachine.start();
        this._centerDialogMachine.start();
        this._rightDialogMachine.start();
        this._leftNavButtonMachine.start();

        window.o.events.subscribe(event => {
            if (event.type.startsWith("shell.navigation")) {
                this._leftNavButtonMachine.send(<any>event);
            }
        });
    }

    private onContentChanged() {
        this._layoutSubject.next(this._layout);
    }

    private onNavigationChanged() {
        this._navigationSubject.next(this._navigationManifest);
    }

    public showProcess(processId: string) {
        this._centerDialogMachine.send(<any><DialogStateEvent>{
            type: "SHOW_PROCESS",
            processId: processId
        });
    }

    public hideProcess() {
        this._centerDialogMachine.send(<any><DialogStateEvent>{
            type: "CLOSE"
        });
    }

    public showPage(runtimeDapp: RuntimeDapp<any>, page:Page<any, any>, params:{[x:string]:any}) {
        const showPage = <SHOW_PAGE>{
            type: "SHOW_PAGE",
            page: page,
            pageParams: params,
            routable: page,
            runtimeDapp:runtimeDapp
        };
        if (page.position === "modal") {
            this._centerDialogMachine.send(showPage);
        } else {
            this._mainDialogMachine.send(showPage);
        }
    }
}
