<script lang="ts">
import { onMount } from "svelte";


let maxlength: number = 1000;

var autoExpand = function () {
  var el = this;
  setTimeout(function () {
    el.style.cssText = "height:auto; padding:0 padding-top: 2px;";
    el.style.cssText = "height:" + el.scrollHeight + "px";
  }, 0);
};


onMount(() => {
  let textarea = document.querySelector("textarea");
  textarea.addEventListener("input", autoExpand);
  if (length > 17) {
    textarea.dispatchEvent(new Event("input"));
  }
});
</script>

<textarea
  maxlength="{maxlength}"
  name="input"
  type="text"
  rows="1"
  class="overflow-hidden textarea textarea-bordered w-full"
  ></textarea>
