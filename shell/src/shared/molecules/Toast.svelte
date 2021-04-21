<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";

  /**
   * Specify the type of notification
   * @type {"error" | "info" | "success" | "warning"}
   */

  export let type: String = "error";

  let activeTheme = {
    theme: {
      "--toastBackground": "#F56565",
      "--toastProgressBackground": "#C53030",
    },
  };
  $: {
    if (type && type == "success") {
      activeTheme = {
        theme: {
          "--toastBackground": "#48BB78",
          "--toastProgressBackground": "#2F855A",
        },
      };
    } else if (type && type == "error") {
      activeTheme = {
        theme: {
          "--toastBackground": "#F56565",
          "--toastProgressBackground": "#C53030",
        },
      };
    }
  }

  //     theme: {
  //     '--toastBackground': '#48BB78',
  //     '--toastProgressBackground': '#2F855A'
  //   }

  const notificationOptions = {
    duration: 4000, // duration of progress bar tween
    dismissable: true, // allow dismiss with close button
    initial: 1, // initial progress bar value
    progress: 0, // current progress
    reversed: false, // insert new toast to bottom of stack
    intro: { x: 256 }, // toast intro fly animation settings
    theme: activeTheme, // css var overrides
  };
</script>

<SvelteToast {notificationOptions} />

<style>
  ._toastContainer {
    top: var(--toastContainerTop, 1.5rem);
    right: var(--toastContainerRight, 2rem);
    bottom: var(--toastContainerBottom, auto);
    left: var(--toastContainerLeft, auto);
  }

  ._toastItem {
    width: var(--toastWidth, 16rem);
    height: var(--toastHeight, auto);
    min-height: var(--toastMinHeight, 3.5rem);
    margin: var(--toastMargin, 0 0 0.5rem 0);
    background: var(--toastBackground, rgba(66, 66, 66, 0.9));
    color: var(--toastColor, #fff);
  }

  ._toastMsg {
    padding: var(--toastMsgPadding, 0.75rem 0.5rem);
  }

  ._toastProgressBar {
    background: var(--toastProgressBackground, rgba(33, 150, 243, 0.75));
  }
</style>
