<script>
import Quill from "quill";
import { onMount } from "svelte";
import { createEventDispatcher } from "svelte";

let quill = null;
let loaded = false;

export let editorValue;
export let editorId = "1";
const dispatch = createEventDispatcher();

onMount(() => {
  let container = document.getElementById(editorId);
  quill = new Quill(container, {
    modules: {
      toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], ["link", "code-block"]],
    },
    placeholder: "Type something...",
    theme: "snow", // or 'bubble',
    data: editorValue,
  });
  quill.root.innerHTML = editorValue;

  quill.on("text-change", function (delta, oldDelta, source) {
    dispatch("valueChange", quill.root.innerHTML);
  });
  // loaded = true;
});
</script>

<div id="{editorId}" class="w-full bg-white"></div>
