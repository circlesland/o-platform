<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import * as yup from "yup";

  export let context: EditorContext;

  let values = { checkbox: false };
  let errors = {};

  const regSchema = yup.object().shape({
    checkbox: yup.boolean().oneOf([true], "Please check this box"),
  });

  const extractErrors = (err) => {
    return err.inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message };
    }, {});
  };

  const submitHandler = () => {
    if (context.dataSchema) {
      regSchema
        .validate(values, { abortEarly: false })
        .then(() => {
          context.data[context.fieldName] = values.checkbox;
          const answer = new Continue();
          answer.data = context.data;
          context.process.sendAnswer(answer);
          errors = {};
        })
        .catch(
          (err) => (
            (errors = extractErrors(err)), console.log(extractErrors(err))
          )
        );
    } else {
      context.data[context.fieldName] = values.checkbox;
      const answer = new Continue();
      answer.data = context.data;
      context.process.sendAnswer(answer);
      errors = {};
    }
  };

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submitHandler();
    }
  }
</script>

<div class="mt-4 bordered">
  <div class="form-control">
    <label class="cursor-pointer label" for={context.fieldName}>
      <span class="label-text">
        {context.params.label}
        {#if context.params.link}
          <a
            href={context.params.link}
            id={context.params.linkLabel}
            target="_blank"
            class="underline"
          >
            {context.params.linkLabel}
          </a>.
        {/if}
      </span>
      <div>
        <input
          name="checkbox"
          id={context.fieldName}
          type="checkbox"
          class="checkbox checkbox-primary"
          bind:checked={values.checkbox}
        />
        <span
          class="checkbox-mark bg-white"
          class:input-error={errors.checkbox}
        />
      </div>
    </label>
    {#if errors.checkbox}
      <label class="label text-right" for="form-error">
        <span id="form-error" class="label-text-alt text-error"
          >{errors.checkbox}</span
        >
      </label>
    {/if}
  </div>
</div>
<ProcessNavigation on:buttonClick={submitHandler} {context} />
