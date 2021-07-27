<script context="module" lang="ts">
  import { NavigationManifest } from "@o-platform/o-interfaces/dist/navigationManifest";
  import ListComponent from "../molecules/NextNav/Components/List.svelte";
  import ActionButtonComponent from "../molecules/NextNav/Components/ActionButton.svelte";
  import LinkComponent from "../molecules/NextNav/Components/Link.svelte";
  import { push } from "svelte-spa-router";

  import { ProcessContainerNavigation } from "../molecules/ProcessContainer.svelte";
  import Modal2, { runtimeDapp } from "../molecules/Modal2.svelte";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { Link } from "@o-platform/o-interfaces/dist/routables/link";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";

  export function getNavigationManifest(
    dappManifest: DappManifest<any>,
    processNavigation: ProcessContainerNavigation,
    modal: Modal2,
    routable: Routable
  ): NavigationManifest {
    let nm: NavigationManifest;
    if (modal) {
      const modalState = modal.getState();
      if (modalState.isOpen) {
        nm = getModalNavigation(dappManifest, processNavigation, modal);
      } else {
        nm = getRegularNavigation(dappManifest, processNavigation, modal);
      }
    } else {
      nm = getRegularNavigation(dappManifest, processNavigation, modal);
    }
    nm.leftSlot = {
      component: LinkComponent,
      props: {
        icon: "list",
        action: () => leftSidebar.showNavigation(dappManifest, routable),
      },
    };

    return nm;
  }

  function getModalNavigation(
    dappManifest: DappManifest<any>,
    processNavigation: ProcessContainerNavigation,
    modal: Modal2
  ): NavigationManifest {
    const modalState = modal.getState();
    let navigationManifest: NavigationManifest;
    switch (modalState.contentType) {
      case "jumplist":
      case "navigation":
        navigationManifest = getListNavigation(
          dappManifest,
          processNavigation,
          modal
        );
        break;
      case "process":
        navigationManifest = getProcessNavigation(
          dappManifest,
          processNavigation,
          modal
        );
        break;
      case "page":
        navigationManifest = getDetailNavigation(
          dappManifest,
          processNavigation,
          modal,
          modalState.depth > 1
        );
        break;
    }
    if (!navigationManifest) {
      throw new Error(`Unknown modal state: ${modalState.contentType}.`);
    }

    return navigationManifest;
  }

  function getNoSessionNavigation(
    dappManifest: DappManifest<any>,
    processNavigation: ProcessContainerNavigation,
    modal: Modal2
  ): NavigationManifest {
    return {
      loginPill: true,
    };
  }

  function getRegularNavigation(
    dappManifest: DappManifest<any>,
    processNavigation: ProcessContainerNavigation,
    modal: Modal2
  ): NavigationManifest {
    const manifest = {
      navPill: {
        left: {
          component: ListComponent,
          props: {
            icon: "list",
            action: () => {
              modal.showNavigation(dappManifest);
            },
          },
        },
        center: {
          component: ActionButtonComponent,
          props: {
            icon: "logo",
            action: () => modal.showJumplist({}, dappManifest),
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
    if (dappManifest.routables.filter((o) => !o.isSystem).length == 0) {
      delete manifest.navPill.left;
    }
    return manifest;
  }

  /**
   * Generates a NavigationManifest for "jumplist"s and "navigation" modals.
   */
  function getListNavigation(
    dappManifest: DappManifest<any>,
    processNavigation: ProcessContainerNavigation,
    modal: Modal2
  ): NavigationManifest {
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
    dappManifest: DappManifest<any>,
    processNavigation: ProcessContainerNavigation,
    modal: Modal2
  ): NavigationManifest {
    const manifest: NavigationManifest = {
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
    dappManifest: DappManifest<any>,
    processNavigation: ProcessContainerNavigation,
    modal: Modal2,
    showBack: boolean
  ): NavigationManifest {
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
    if (showBack) {
      manifest.navPill.left = {
        component: LinkComponent,
        props: {
          text: "Back",
          action: () => history.back(),
        },
      };
    }
    return manifest;
  }
</script>
