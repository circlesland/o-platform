import LinkComponent from "../molecules/NextNav/Components/Link.svelte";
import ListComponent from "../molecules/NextNav/Components/List.svelte";
import ActionButtonComponent from "../molecules/NextNav/Components/ActionButton.svelte";

export type generateNavManifestArgs = {
    leftIsOpen: boolean;
    centerIsOpen: boolean;
    centerIsProcess: boolean;
    rightIsOpen: boolean;
    notificationCount: number;
};

const defaultNavManifest = {
    leftSlot: {
        component: LinkComponent,
        props: {
            icon: "list",
            action: () => { },
        },
    },
    navPill: {
        left: {
            component: ListComponent,
            props: {
                icon: "list",
                action: () => {},
            },
        },
        center: {
            component: ActionButtonComponent,
            props: {
                icon: "logo",
                action: () => { },
            },
        },
        right: {
            component: LinkComponent,
            props: {
                icon: "home",
                action: () => { },
            },
        },
    },
};

export function generateNavManifest(args:generateNavManifestArgs) {
    return defaultNavManifest;
}