export class elementRefs {
  static get controls() {
    return document.getElementById("controls");
  }

  static get additionalScreen() {
    return document.getElementById("additional-screen");
  }

  static get status() {
    return document.getElementById("status");
  }

  static get mainInterface() {
    return document.getElementById("main-interface");
  }

  static get vocalIconContainer() {
    return document.getElementById("vocal-icon-container");
  }

  static get customLogoContainer() {
    return document.getElementById("custom-logo-container");
  }

  static get checkUniquenessButton() {
    return document.getElementById("check-uniqueness-button");
  }

  static get loadingSessionTokenText() {
    return document.getElementById("loading-session-token-text");
  }

  static get themeTransitionOverlayImg() {
    return document.getElementById("theme-transition-overlay-img");
  }

  static get themeTransitionOverlay() {
    return document.getElementById("theme-transition-overlay");
  }
}