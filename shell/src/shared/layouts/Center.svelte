<script context="module" lang="ts">
// import { Animate } from "svelte-swipeable";
// import { swipe } from "svelte-gestures";
let scrollContent;
export function scrollToBottom() {
  scrollToPosition(1000000000);
  poppedScrollPosition = false;
}
export function scrollToTop() {
  scrollToPosition(0);
  poppedScrollPosition = false;
}
export function scrollToPosition(position: number) {
  if (!scrollContent) {
    return;
  }
  const scrollElement = scrollContent.getScrollElement();
  scrollElement.scrollTo(0, position);
}

let scrollPositionStack: number[] = [];
export let poppedScrollPosition = false;

export function scrollPositionStackPopulated(): boolean {
  return scrollPositionStack.length > 0;
}

export function pushScrollPosition() {
  poppedScrollPosition = false;

  if (scrollContent) {
    const pos = scrollContent.getScrollElement().scrollTop;
    scrollPositionStack.push(pos);
  }
}
export function popScrollPosition() {
  poppedScrollPosition = true;

  if (scrollContent) {
    const pos = scrollPositionStack.pop();
    scrollToPosition(pos);
  }
}
export function clearScrollPosition() {
  scrollPositionStack = [];
  poppedScrollPosition = false;
}
</script>

<script lang="ts">
import { createEventDispatcher, getContext } from "svelte";
import { clickOutside } from "./../functions/clickOutside";
import SvelteSimplebar from "./../molecules/SimpleBar/SvelteSimpleBar.svelte";

export let blur: boolean = false;
const eventDispatcher = createEventDispatcher();

const sub = window.o.events.subscribe((event) => {
  if (event.type == "shell.scrollToBottom") {
    scrollToBottom();
  }
});

const initBar = (bar) => {
  scrollContent = bar;
};

let options = {
  // threshY: 60, // threshold in y before event is triggered (px)
};
function handleSwipe(event) {
  console.log(event.detail.initial.y); //0
  console.log(event.detail.y); //200
  console.log(event.detail.direction.y); //up

  // onClose();
}

const onClose = () => window.o.publishEvent({ type: "shell.closeModal" });
</script>

<aside
  id="modalAside"
  aria-labelledby="modal-heading"
  aria-modal="true"
  tabIndex="{-1}"
  role="dialog"
  class="z-40 pt-2 text-base overlay"
  class:blur_aside="{blur}">
  <div id="modalAsideContentContainer" class="w-full p-2 pb-0 mt-1 modalAsideContentContainer">
    <div
      class="w-full mt-2 bg-white rounded-xl modalAsideContent md:w-2/3 xl:w-1/2"
      use:clickOutside
      on:click_outside="{() =>
        eventDispatcher('clickedOutside', {
          position: 'left',
        })}">
      <div id="modalScrollable" class="modalAsideScrollableContent rounded-xl">
        <SvelteSimplebar init="{initBar}">
          <div class="w-full m-auto">
            <slot />
          </div>
        </SvelteSimplebar>
      </div>
    </div>
  </div>
</aside>

<style>
* {
  box-sizing: border-box;
}

aside {
  /* z-index: 1000; */
  background-color: rgba(177, 192, 200, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow-y: hidden;

  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.modalAsideContentContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;
}

.modalAsideContent {
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.modalAsideScrollableContent {
  flex-grow: 1;
  /* overflow: hidden; */
  min-height: 0;
}

/* Background Blurring for firefox and other non supportive browsers lies in App.svelte through the .blur class */
@supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px)) {
  .blur_aside {
    opacity: 1;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
}
</style>
