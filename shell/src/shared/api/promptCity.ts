import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { normalizePromptField, prompt, PromptField } from "@o-platform/o-process/dist/states/prompt";
import LocationSearchEditor from "@o-platform/o-editors/src/LocationSearchEditor.svelte";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownCity from "@o-platform/o-editors/src/dropdownItems/DropDownCity.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import {
  CitiesByIdDocument,
  CitiesByIdQueryVariables,
  CitiesByNameDocument,
  CitiesByNameQueryVariables,
  City,
} from "./data/types";
import { ApiClient } from "../apiConnection";

export function promptCity<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>(spec: {
  id?: string;
  field: PromptField<TContext>;
  params: {
    view: EditorViewContext;
    [x: string]: any;
  };
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (context: ProcessContext<TContext>, event: { type: string; [x: string]: any }) => boolean;
    next?: string;
    skip?: string;
    canSkip?: (context: ProcessContext<TContext>, event: { type: string; [x: string]: any }) => boolean;
  };
}) {
  const field = normalizePromptField(spec.field);

  return prompt<TContext, any>({
    id: spec.id ?? field.name,
    field: spec.field,
    component: DropdownSelectEditor,
    params: <DropdownSelectorParams<TContext, City, number>>{
      view: spec.params.view,
      placeholder: spec.params.view.placeholder,
      submitButtonText: spec.params.view.submitButtonText,
      itemTemplate: DropDownCity,
      getKey: (o) => o.geonameid,
      getLabel: (o) => `${o.name} (${o.country})`,
      keyProperty: "geonameid",
      choices: {
        byKey: async (key: number) => {
          const result = await ApiClient.query<City[], CitiesByIdQueryVariables>(CitiesByIdDocument, {
            ids: [key],
          });
          return result.length > 0 ? result[0] : undefined;
        },
        find: async (filter: string) => {
          const url =
            "https://autocomplete.search.hereapi.com/v1/autocomplete?q=" +
            encodeURIComponent(filter) +
            "&resultType='city'&apiKey=fhiIkoASi1B-z8R7ytKBnfJltOpaUlYBV1kydXyK1sE";

          const response = await fetch(url);
          const json = await response.json();

          // Unfortunately we have to monger this data a bit in order to work for our Dropdown Component
          // As this Data structure differs from all other ones, which we control ourselves.
          const arr = json.items;
          arr.forEach((obj) => {
            obj.name = obj.title;
          });

          return json.items.length ? json.items : [];
        },
      },
    },
    navigation: spec.navigation,
  });
}
