import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {normalizePromptField, prompt, PromptField,} from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import DropDownTag from "@o-platform/o-editors/src/dropdownItems/DropDownTag.svelte";
import {DropdownSelectorParams} from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import {EditorViewContext} from "@o-platform/o-editors/src/shared/editorViewContext";
import {QueryTagByIdArgs, Tag, TagByIdDocument, TagsDocument, TagsQueryVariables} from "./data/types";
import {ApiClient} from "../apiConnection";

export function promptTag<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: {
  field: PromptField<TContext>;
  onlyWhenDirty?: boolean;
  typeId: string;
  id?: string;
  params: {
    view: EditorViewContext;
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
    component: DropdownSelectEditor,
    params: <DropdownSelectorParams<TContext, Tag, number>>{
      view: spec.params.view,
      placeholder: spec.params.view.placeholder,
      submitButtonText: spec.params.view.submitButtonText,
      showResultsOnLoad: spec.params.showResultsOnLoad,
      getKey: (tag) => tag.id,
      itemTemplate: DropDownTag,
      keyProperty: "id",
      getLabel: (tag) => tag.value,
      choices: {
        byKey: async (key: number) => {
          return await ApiClient.query<Tag, QueryTagByIdArgs>(TagByIdDocument, {
            id: key
          });
        },
        find: async (filter?: string) => {
          return await ApiClient.query<Tag[], TagsQueryVariables>(TagsDocument, {
            typeId_in: [spec.typeId],
            value_like: filter ?? "",
          });
        },
        all: async () => {
          return await ApiClient.query<Tag[], TagsQueryVariables>(TagsDocument, {
            typeId_in: [spec.typeId]
          });
        },
      },
    },
    navigation: spec.navigation,
  });
}
