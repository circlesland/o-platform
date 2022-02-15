<script lang="ts">
import { createEventDispatcher } from "svelte";
import { showToast } from "../toast";
export let text: string;
const dispatch = createEventDispatcher<{ copy: string; fail: never }>();
const copy = () => {
  navigator.clipboard.writeText(text).then(
    () => {
      showToast("success", "Copied to Clipboard!");
    },
    (e) => dispatch("fail")
  );
};
</script>

<slot copy="{copy}" />
