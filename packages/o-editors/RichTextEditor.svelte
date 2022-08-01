<script>
import Quill from "quill";
import { onMount } from "svelte";
import { createEventDispatcher } from "svelte";

let quill = null;

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
});
</script>

<div id="{editorId}" class="w-full bg-white"></div>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>
