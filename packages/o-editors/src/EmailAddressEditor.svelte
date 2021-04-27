<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import * as yup from "yup";

  export let context: EditorContext;

  let values = {};
  let errors = {};

  const regSchema = yup.object().shape({
    email: yup
      .string()
      .required("Please provide your email address")
      .email("That doesn't seem like a valid email address"),
  });

  const extractErrors = (err) => {
    return err.inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message };
    }, {});
  };

  const submitHandler = () => {
    if (context.validate) {
      regSchema
        .validate(values, { abortEarly: false })
        .then(() => {
          context.data[context.fieldName] = values.email;
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
      context.data[context.fieldName] = values.email;
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

<div class="form-control justify-self-center">
  <label class="label" for={context.fieldName}>
    <span class="label-text">{context.params.label}</span>
  </label>
  {#if context && context.messages && context.messages[context.fieldName]}
    <small style="color:#f00">
      {context.messages[context.fieldName]}
    </small>
  {/if}

  <input
    on:keydown={onkeydown}
    name="email"
    id={context.fieldName}
    type="email"
    placeholder={context.params.placeholder}
    class="input input-lg input-bordered"
    class:input-error={errors.email}
    bind:value={values.email}
  />
  {#if errors.email}
    <label class="label text-right" for="form-error">
      <span id="form-error" class="label-text-alt text-error "
        >{errors.email}</span
      >
    </label>
  {/if}
</div>

<ProcessNavigation on:buttonClick={submitHandler} {context} />
