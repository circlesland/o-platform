import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {
  normalizePromptField,
  prompt,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import {
  CitiesByIdDocument,
  CitiesByNameDocument,
  City,
} from "../../dapps/o-passport/data/api/types";
import DropDownCity from "@o-platform/o-editors/src/dropdownItems/DropDownCity.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/EditorViewContext";

export function promptCity<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: {
  id?: string;
  field: PromptField<TContext>;
  onlyWhenDirty?: boolean;
  params: {
    view: EditorViewContext;
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
  const viewParams = {
    title: "Vote for your City?",
    description:
      "Advance your city in the basic income ranking and push the political discorse in your area.",
    placeholder: "Last name",

    submitButtonText: "Submit vote",
  };
  return prompt<TContext, any>({
    id: spec.id ?? field.name,
    field: spec.field,
    onlyWhenDirty: spec.onlyWhenDirty,
    component: DropdownSelectEditor,
    params: <DropdownSelectorParams<TContext, City, number>>{
      view: spec.params.view,
      placeholder: spec.params.placeholder,
      submitButtonText: spec.params.submitButtonText,
      itemTemplate: DropDownCity,
      getKey: (o) => o.geonameid,
      getLabel: (o) => `${o.name} (${o.country})`,
      keyProperty: "geonameid",
      choices: {
        byKey: async (key: number) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: CitiesByIdDocument,
            variables: {
              ids: [key],
            },
          });
          return result.data?.cities?.length
            ? result.data.cities[0]
            : undefined;
        },
        find: async (filter: string) => {
          const n = <any>navigator;
          const lang = n.language || n.userLanguage;
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: CitiesByNameDocument,
            variables: {
              name: (filter ?? "") + "%",
              languageCode: lang.substr(0, 2),
            },
          });
          return result.data?.cities?.length
            ? result.data.cities.reverse()
            : [];
        },
      },
    },
    navigation: spec.navigation,
  });
}
