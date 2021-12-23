import { SampleAppUIFunctions } from "./SampleAppUIFunctions";
import {elementRefs} from "../elementRefs";

// Helper class to handle setup and display of FaceTec Server Upgrade View
export class AdditionalScreens {

  private static elementToCopyStylesFrom: string = ""

  // Set the styling to match the control element which has already been styled for desktop or mobile.
  // Set the button in the view the call the passed in exit function
  public static setServerUpgradeStyling = (elementToCopyStylesFrom: HTMLElement, functionToCallOnExitFromAdditionalScreen: ()=>void) => {

    // If the width is not set this is the initial styling, otherwise return, we only need to do this once
    if(elementRefs.additionalScreen!.style.width !== "") {
      return;
    }
    AdditionalScreens.elementToCopyStylesFrom = elementToCopyStylesFrom.id;
    if(AdditionalScreens.elementToCopyStylesFrom === "") {
      console.error("elementToCopyStylesFrom must have an id");
    }
    var computedStyles = getComputedStyle(elementToCopyStylesFrom);
    var serverUpgradeElement = elementRefs.additionalScreen!;
    serverUpgradeElement.style.width = computedStyles.width;
    serverUpgradeElement.style.height = computedStyles.height;
    serverUpgradeElement.style.border = computedStyles.border;
    serverUpgradeElement.style.borderRadius = computedStyles.borderRadius;
    serverUpgradeElement.style.margin = computedStyles.margin;
    (document.getElementById("additional-screen-button") as HTMLButtonElement)!.onclick = functionToCallOnExitFromAdditionalScreen;
  }

  // Fade out the main UI and show the Server Upgrade view
  public static showServerUpGradeView = () => {
    // (document.getElementById("additional-screen-logo") as HTMLImageElement)!.src = ServerUpgradeLogo;
    document.querySelector("#additional-screen h2")!.innerHTML = "Server Upgrade In Progress";
    document.getElementById("additional-screen-text")!.innerHTML = "Please Try Again in 10-15 minutes.";
    AdditionalScreens.showAdditionalScreen();
  }

  // Display the additional screen
  private static showAdditionalScreen = () => {
    (document.getElementsByClassName("loading-session-token-container")[0] as HTMLElement)!.style.visibility = "hidden";
    elementRefs.additionalScreen!.style.opacity = "0";
    elementRefs.additionalScreen!.style.display = "flex";
    SampleAppUIFunctions(".wrapping-box-container").fadeOut(1);
    SampleAppUIFunctions("#theme-transition-overlay").fadeOut(200);
    SampleAppUIFunctions("#additional-screen").fadeOut(200, () => {
      SampleAppUIFunctions("#" + AdditionalScreens.elementToCopyStylesFrom).fadeOut(1);
      SampleAppUIFunctions("#additional-screen").fadeIn(700, () => {
        SampleAppUIFunctions(".wrapping-box-container").show();
      });
    });
  }

  // Exit the Server Upgrade View and return to the normal UI view
  public static exitAdditionalScreen = (fadeInMainUIFunction: () => void) => {
    SampleAppUIFunctions("#additional-screen").fadeOut(100, () => {
      SampleAppUIFunctions(".loading-session-token-container").fadeOut(1);
      SampleAppUIFunctions("#controls").fadeIn(400, () => {
        fadeInMainUIFunction();
        (document.getElementsByClassName("loading-session-token-container")[0] as HTMLElement)!.style.visibility = "visible";
      });
    });
  }
}
