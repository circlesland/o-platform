<script context="module" lang="ts">
import {NavigationManifest} from "@o-platform/o-interfaces/dist/navigationManifest";
import {getLastLoadedDapp} from "../../loader";
import ListComponent from "../molecules/NextNav/Components/List.svelte";
import ActionButtonComponent from "../molecules/NextNav/Components/ActionButton.svelte";
import LinkComponent from "../molecules/NextNav/Components/Link.svelte";
import {push} from "svelte-spa-router";

import { ProcessContainerNavigation } from "../molecules/ProcessContainer.svelte";
import Modal2 from "../molecules/Modal2.svelte";

export function getNavigationManifest(
    processNavigation: ProcessContainerNavigation,
    modal: Modal2
): NavigationManifest {
    if (modal) {
        const modalState = modal.getState();
        if (modalState.isOpen) {
            return getModalNavigation(processNavigation, modal);
        }
    }
    return getRegularNavigation(processNavigation, modal);
}

function getModalNavigation(
    processNavigation: ProcessContainerNavigation,
    modal: Modal2): NavigationManifest {
    const modalState = modal.getState();
    switch (modalState.contentType) {
        case "jumplist":
        case "navigation":
            return getListNavigation(processNavigation, modal);
        case "process":
            return getProcessNavigation(processNavigation, modal);
        case "page":
            return getDetailNavigation(processNavigation, modal);
    }
    throw new Error(`Unknown modal state: ${modalState.contentType}.`);
}

function getNoSessionNavigation(
    processNavigation: ProcessContainerNavigation,
    modal: Modal2): NavigationManifest {
    return {
        loginPill: true,
    };
}

function getRegularNavigation(
    processNavigation: ProcessContainerNavigation,
    modal: Modal2): NavigationManifest {
    const lastLoadedDapp = getLastLoadedDapp();
    const manifest = {
        navPill: {
            left: {
                component: ListComponent,
                props: {
                    icon: "list",
                    action: () => {
                        modal.showNavigation(lastLoadedDapp);
                    },
                },
            },
            center: {
                component: ActionButtonComponent,
                props: {
                    icon: "logo",
                    action: () => modal.showJumplist(lastLoadedDapp),
                },
            },
            right: {
                component: LinkComponent,
                props: {
                    icon: "home",
                    action: () => {
                        push("#/dashboard");
                    },
                },
            },
        },
    };

    // If the current dapp has no navigation items then hide the button
    if (lastLoadedDapp.routables.filter((o) => !o.isSystem).length == 0) {
        delete manifest.navPill.left;
    }
    return manifest;
}

/**
 * Generates a NavigationManifest for "jumplist"s and "navigation" modals.
 */
function getListNavigation(
    processNavigation: ProcessContainerNavigation,
    modal: Modal2): NavigationManifest {
    const manifest = {
        navPill: {
            center: {
                component: ActionButtonComponent,
                props: {
                    icon: "close",
                    action: () => modal.closeModal(),
                },
            },
        },
    };
    return manifest;
}

function getProcessNavigation(
    processNavigation: ProcessContainerNavigation,
    modal: Modal2): NavigationManifest {
    const manifest: NavigationManifest = {
        navPill: {
            center: {
                component: ActionButtonComponent,
                props: {
                    icon: "/logos/close.svg",
                    action: () => modal.closeModal(),
                },
            },
        },
    };

    if (processNavigation && processNavigation.canGoBack) {
        manifest.navPill.left = {
            component: LinkComponent,
            props: {
                text: "Back",
                action: () => processNavigation.back(),
            },
        };
    }

    if (processNavigation && processNavigation.canSkip) {
        manifest.navPill.right = {
            component: LinkComponent,
            props: {
                text: "Skip",
                action: () => processNavigation.skip(),
            },
        };
    }

    return manifest;
}

function getDetailNavigation(
    processNavigation: ProcessContainerNavigation,
    modal: Modal2): NavigationManifest {
    const manifest = {
        navPill: {
            center: {
                component: ActionButtonComponent,
                props: {
                    icon: "close",
                    action: () => modal.closeModal(),
                },
            },
        },
    };
    return manifest;
}
</script>