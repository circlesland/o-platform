import { SampleAppUIFunctions } from "./SampleAppUIFunctions";
import { FaceTecIDScanResult, FaceTecSessionResult } from "../facetec-sdk/core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import {elementRefs} from "../elementRefs";

export var SampleAppUtilities = (function() {
  function displayStatus(message: string) {
    (elementRefs.status as HTMLElement).innerHTML = message;
  }

  function fadeInMainUIContainer(){
    SampleAppUIFunctions(".loading-session-token-container").fadeOut(1);
    SampleAppUIFunctions("#theme-transition-overlay").fadeOut(800);
    SampleAppUIFunctions(".wrapping-box-container").fadeIn(800);
  }

  function fadeInMainUIControls(callback?: ()=>void) {
    if(isLikelyMobileDevice()) {
      SampleAppUIFunctions("footer").fadeIn(800);
      SampleAppUIFunctions("#custom-logo-container").fadeIn(800);
      SampleAppUIFunctions("#vocal-icon-container").fadeIn(800);
    }
    SampleAppUIFunctions("#controls").fadeIn(800, () => {
      enableControlButtons();
      enableVocalGuidanceButtons();
      if(callback) {
        callback();
      }
    });
  }

  // Disable buttons to prevent hammering, fade out main interface elements, and reset the Session Review Screen data.
  function fadeOutMainUIAndPrepareForSession() {
    disableControlButtons();
    if(isLikelyMobileDevice()) {
      SampleAppUIFunctions("footer").fadeOut(800);
      SampleAppUIFunctions("#custom-logo-container").fadeOut(800);
      SampleAppUIFunctions("#vocal-icon-container").fadeOut(800);

      disableVocalGuidanceButtons();
    }
    SampleAppUIFunctions("#controls").fadeOut(800);
    SampleAppUIFunctions(".wrapping-box-container").fadeOut(800);
    SampleAppUIFunctions("#theme-transition-overlay").fadeIn(800);
  }

  function showLoadingSessionToken() {
    SampleAppUIFunctions(".loading-session-token-container").fadeIn(300);
  }

  function hideLoadingSessionToken() {
    SampleAppUIFunctions(".loading-session-token-container").fadeOut(800);
  }

  function disableControlButtons() {
    document.querySelectorAll("#controls > button").forEach(function(button) {
      button.setAttribute("disabled", "true");
    });
  }

  function enableControlButtons() {
    document.querySelectorAll("#controls > button").forEach(function(button) {
      button.removeAttribute("disabled");
    });

    document.querySelectorAll(".vocal-icon").forEach(function(icon) {
      icon.removeAttribute("disabled");
    });
  }

  function showMainUI(){
    fadeInMainUIContainer();
    fadeInMainUIControls();
  }

  function handleErrorGettingServerSessionToken() {
    showMainUI();
    displayStatus("Session could not be started due to an unexpected issue during the network request.");
  }

  function generateUUId() {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    {return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);}
    );
  }

  function displayElementsAfterStyling() {
    document.querySelectorAll("button").forEach(function(element) {
      element.classList.add("button-transitions");
    });
    SampleAppUIFunctions("footer").fadeIn(800);
    SampleAppUIFunctions("body").fadeIn(800);
  }

  function disableVocalGuidanceButtons() {
    document.querySelectorAll(".vocal-icon").forEach( (button) => {
      (<HTMLButtonElement>button).setAttribute("disabled", "true");
    });
  }

  function enableVocalGuidanceButtons() {
    document.querySelectorAll(".vocal-icon").forEach( (button) => {
      (<HTMLButtonElement>button).removeAttribute("disabled");
    });
  }

  function isLikelyMobileDevice() {
    var isMobileDeviceUA = !!(/Android|iPhone|iPad|iPod|IEMobile|Mobile|mobile/i.test(navigator.userAgent || ""));
    // ChromeOS/Chromebook detection.
    if(isMobileDeviceUA && ((navigator.userAgent.indexOf("CrOS") != -1 ) || (navigator.userAgent.indexOf("Chromebook") != -1 ) )) {
      isMobileDeviceUA = false;
    }
    // Mobile device determination based on portrait / landscape and user agent.
    if(screen.width < screen.height || isMobileDeviceUA) {
      // Assume mobile device when in portrait mode or when determined by the user agent.
      return true;
    }
    else {
      return false;
    }
  }

  function disableAllButtons() {
    (elementRefs.checkUniquenessButton as HTMLElement).setAttribute("disabled", "true");
  }

  function enableAllButtons() {
    (elementRefs.checkUniquenessButton as HTMLElement).removeAttribute("disabled");
  }

  function fadeInBlurOverlay() {
    (elementRefs.controls as HTMLElement).classList.add("blur-content");
  }

  function fadeOutBlurOverlay() {
    if((elementRefs.controls as HTMLElement).classList.contains("blur-content")) {
      (elementRefs.controls as HTMLElement).classList.remove("blur-content");
    }
  }

  function showAuditTrailImages(sessionResult: FaceTecSessionResult | null, idScanResult: FaceTecIDScanResult | null){
    var auditTrailImages: string[] = [];
    if(sessionResult != null && sessionResult.auditTrail != null && sessionResult.auditTrail.length > 0) {
      disableAllButtons();
      fadeInBlurOverlay();
      // Add the regular audit trail images
      sessionResult.auditTrail.forEach(function(image: String) {
        auditTrailImages.push("data:image/jpeg;base64," + image);
      });
      if(idScanResult != null && idScanResult.frontImages != null && idScanResult.frontImages.length > 0){
        // Add ID Scan front images
        auditTrailImages.unshift("data:image/jpeg;base64," + idScanResult.frontImages[0]);
      }
      auditTrailImages.forEach(function(img){
        addDismissibleImagePopUp(img);
      });
    }
    else {
      displayStatus("No Audit Trail Images");
    }
  }

  function addDismissibleImagePopUp(img: string){
    var auditTrailOverlay = document.createElement("div");
    var auditTrailImage = new Image();
    auditTrailImage.src = img;
    auditTrailImage.classList.add("audit-trail-image");
    auditTrailOverlay.classList.add("audit-trail-overlay");
    auditTrailOverlay.onclick = function() {
      if(document.querySelectorAll(".audit-trail-overlay").length === 1) {
        fadeOutBlurOverlay();
        auditTrailOverlay.style.transition = "0.3s";
        auditTrailOverlay.style.opacity = "0";
        var _this = this;

        setTimeout(function() {
          enableAllButtons();
          (_this as HTMLElement).remove();
        }, 500);
      }
      else {
        (this as HTMLElement).remove();
      }
    };
    auditTrailOverlay.append(auditTrailImage);
    (elementRefs.controls as HTMLElement).append(auditTrailOverlay);
  }

  return {
    displayStatus,
    fadeInMainUIContainer,
    fadeInMainUIControls,
    fadeOutMainUIAndPrepareForSession,
    disableControlButtons,
    enableControlButtons,
    generateUUId,
    showMainUI,
    hideLoadingSessionToken,
    showLoadingSessionToken,
    isLikelyMobileDevice,
    UI: SampleAppUIFunctions,
    showAuditTrailImages,
    handleErrorGettingServerSessionToken,
    displayElementsAfterStyling
  };
})();
