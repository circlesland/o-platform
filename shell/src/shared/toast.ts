import { SvelteToast, toast } from "./molecules/Toast";
import { onMount } from "svelte";

/**
 * Specify the type of notification
 * @type {"error" | "info" | "success" | "warning"}
 */

/**
 * Specify the Message of notification
 * @message String
 */

/**
 * Specify if notification should be dismissable
 * @dismissable Boolean <OPTIONAL>
 */

/**
 * @options {
 *   duration: 4000, // duration of progress bar tween
 *   dismissable: true, // allow dismiss with close button
 *   initial: 1, // initial progress bar value
 *   progress: 0, // current progress
 *   reversed: false, // insert new toast to bottom of stack
 *   intro: { x: 256 }, // toast intro fly animation settings
 *   theme: {}, // css var overrides
 * }
 */

export function showToast(
  type: String,
  message: String,
  dismissable: Boolean = true
) {
    // console.log(type);
  if (type && type == "success") {
    toast.push(
      `<div class="flex flex-row"><div class="justify-center text-success"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mx-2 stroke-current self-center " fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
</svg> </div><div class='pr-1'>` +
        message +
        `</div></div>`,
      {
        dismissable: dismissable,
        initial: dismissable ? 1 : 0,
        theme: {
          "--toastBackground": "#E5F4F3",
          "--toastProgressBackground": "#48BB78",
          "--toastColor": "#48BB78",
        },
      }
    );
  } else if (type && type == "error") {
    toast.push(
      `<div class="flex flex-row"><div class="justify-center text-error"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current self-center "> 
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
    </svg>   </div><div class='pr-1'>` +
        message +
        `</div></div>`,
      {
        dismissable: dismissable,
        initial: dismissable ? 1 : 0,
        theme: {
          "--toastBackground": "#FFEEE9",
          "--toastProgressBackground": "#F56565",
          "--toastColor": "#F56565",
        },
      }
    );
  } else if (type && type == "warning") {
    toast.push(
      `<div class="flex flex-row"><div class="justify-center text-warning"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current self-center ">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> 
    </svg>  </div><div class='pr-1'>` +
        message +
        `</div></div>`,
      {
        dismissable: dismissable,
        initial: dismissable ? 1 : 0,
        theme: {
          "--toastBackground": "#FFF5E5",
          "--toastProgressBackground": "#FF9900",
          "--toastColor": "#FF9900",
        },
      }
    );
  } else if (type && type == "info") {
    toast.push(
      `<div class="flex flex-row"><div class="justify-center text-info"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current self-center ">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> 
    </svg> </div><div class='inline-block'>` +
        message +
        `</div></div>`,
      {
        dismissable: dismissable,
        initial: dismissable ? 1 : 0,
        theme: {
          "--toastBackground": "#E8F4FE",
          "--toastProgressBackground": "#2094F3",
          "--toastColor": "#2094F3",
        },
      }
    );
  }

  return true;
}
