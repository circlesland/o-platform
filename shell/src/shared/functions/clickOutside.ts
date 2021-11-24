/** Dispatch event on click outside of node */
export function clickOutside(node) {
  const handleClick = (event) => {
    if (
      (event.target.tagName == "ASIDE" ||
        event.target.tagName == "BODY" ||
        event.target.tagName == "DIV" ||
        event.target.tagName == "FOOTER") &&
      node &&
      !node.contains(event.target) &&
      !event.defaultPrevented
    ) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
