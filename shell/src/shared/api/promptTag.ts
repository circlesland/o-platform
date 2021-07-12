import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {
  normalizePromptField,
  prompt,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import DropDownTag from "@o-platform/o-editors/src/dropdownItems/DropDownTag.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import {
  Tag,
  TagByIdDocument,
  TagsDocument,
} from "../../dapps/o-marketplace/data/api/types";

export function promptTag<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: {
  field: PromptField<TContext>;
  onlyWhenDirty?: boolean;
  typeId: string;
  id?: string;
  params: {
    label: string;
    placeholder: string;
    submitButtonText: string;
    [x: string]: any;
  };
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
    next?: string;
    skip?: string;
    canSkip?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
  };
}) {
  const field = normalizePromptField(spec.field);
  return prompt<TContext, any>({
    id: spec.id ?? field.name,
    field: spec.field,
    onlyWhenDirty: spec.onlyWhenDirty,
    component: DropdownSelectEditor,
    params: <DropdownSelectorParams<TContext, Tag, number>>{
      label: spec.params.label,
      placeholder: spec.params.placeholder,
      submitButtonText: spec.params.submitButtonText,
      showResultsOnLoad: spec.params.showResultsOnLoad,
      getKey: (tag) => tag.id,
      itemTemplate: DropDownTag,
      keyProperty: "id",
      getLabel: (tag) => tag.value,
      choices: {
        byKey: async (key: number) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: TagByIdDocument,
            variables: {
              id: key,
            },
          });
          return result.data.tagById;
        },
        find: async (filter?: string) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: TagsDocument,
            variables: {
              typeId_in: [spec.typeId],
              value_like: filter ?? "",
            },
          });
          if (result.errors && result.errors.length) {
            throw new Error(
              `An error occurred while querying tags: ${JSON.stringify(
                result.errors
              )}`
            );
          }
          return result.data.tags;
        },
      },
    },
    navigation: spec.navigation,
  });
}
