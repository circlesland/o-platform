<script lang="ts">
  import Select from "svelte-select";
  import { ChoiceSelectorContext } from "./choiceSelectorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { onMount } from "svelte";
  export let context: ChoiceSelectorContext;

  let selected = undefined;

  let graphql = false;
  let optionIdentifier = "value";
  let getOptionLabel = (option) => option.label;
  let getSelectionLabel = (option) => option.label;

  onMount(() => {
    graphql = context.params.graphql;
    getOptionLabel = context.params.getOptionLabel
      ? context.params.getOptionLabel
      : getOptionLabel;
    getSelectionLabel = context.params.getSelectionLabel
      ? context.params.getSelectionLabel
      : getSelectionLabel;
  });

  function handleSelect(event) {
    selected = event.detail;
  }

  function submit() {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = selected;
    context.data[context.fieldName] = selected;
    context.process.sendAnswer(event);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submit();
    }
  }

  async function getGraphQlData() {
    const result = await window.o.theGraphClient.query(
      context.params.graphqlQuery
    );
    return result.data.safe.incoming;
  }
</script>

<div class="form-control justify-self-center">
  <div class="dropdown-select-editor flex flex-wrap content-end w-full h-60">
    <div class="w-full">
      <label class="label" for={context.fieldName}>
        <span class="label-text">{context.params.label}</span>
      </label>
    </div>

    {#if graphql}
      <Select
        loadOptions={getGraphQlData}
        placeholder="Search..."
        listAutoWidth={false}
        listPlacement="top"
        containerClasses="w-80 min-w-full"
        {optionIdentifier}
        {getSelectionLabel}
        {getOptionLabel}
      />
    {:else}
      <Select
        items={context.params.choices}
        showChevron={true}
        listAutoWidth={false}
        listPlacement="top"
        containerClasses="w-80 min-w-full"
      />
    {/if}
  </div>
</div>
<ProcessNavigation on:buttonClick={submit} {context} />

<style>
  .dropdown-select-editor {
    --listMaxHeight: 200px;
    --listMaxWidth: 10rem;
  }
</style>
