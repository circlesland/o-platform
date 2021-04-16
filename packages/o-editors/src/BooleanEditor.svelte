<script lang="ts">
    import {EditorContext} from "./editorContext";
    import ProcessNavigation from "./ProcessNavigation.svelte";
    import {Continue} from "@o-platform/o-process/dist/events/continue";

    export let context: EditorContext;

    function submit() {
        const answer = new Continue();
        answer.data = context.data;
        context.process.sendAnswer(answer);
    }

    function onkeydown(e:KeyboardEvent) {
        if (e.key == "Enter") {
            submit();
        }
    }
</script>

<div class="mt-4 bordered">
    <div class="form-control">
        <label class="cursor-pointer label">
      <span class="label-text">
        {context.params.label}
          {#if context.params.link}
            <a  href="{context.params.link}"
                target="_blank"
                class="underline">
              {context.params.linkLabel}
            </a>.
          {/if}
          </span>
            <div>
                <input type="checkbox" class="checkbox"
                       bind:value={context.data[context.fieldName]}/>
                <span class="checkbox-mark"/>
            </div>
        </label>
    </div>
</div>
<ProcessNavigation on:buttonClick={submit} {context} />