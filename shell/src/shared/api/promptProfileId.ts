import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {
  normalizePromptField,
  prompt,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import DropDownProfile from "@o-platform/o-editors/src/dropdownItems/DropDownProfile.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import { AvataarGenerator } from "../avataarGenerator";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import {
  Profile, ProfileByIdDocument, ProfileByIdQueryVariables,
  ProfilesByNameDocument, ProfilesByNameQueryVariables,
} from "./data/types";
import {ApiClient} from "../apiConnection";

export function promptProfileId<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: {
  field: PromptField<TContext>;
  onlyWhenDirty?: boolean;
  id?: string;
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

  return prompt<TContext, any>({
    id: spec.id ?? field.name,
    field: spec.field,
    component: DropdownSelectEditor,
    params: <DropdownSelectorParams<TContext, Profile, number>>{
      allowAlternativeInput: true,
      view: spec.params.view,
      getKey: (profile) => {
        return profile.id;
      },
      keyProperty: "id",
      itemTemplate: DropDownProfile,
      getLabel: (profile) => profile.displayName,
      choices: {
        byKey: async (key: number) => {
          const result = await ApiClient.query<Profile[], ProfileByIdQueryVariables>(ProfileByIdDocument, {
            id: key
          });
          return result?.length
            ? result[0]
            : undefined;
        },
        find: async (filter?: string) => {
          const result = await ApiClient.query<Profile[], ProfilesByNameQueryVariables>(ProfilesByNameDocument, {
            searchString: (filter ?? "") + "%",
          });
          return result && result.length > 0
            ? result
                .filter((o) => o.circlesAddress)
                .map((o) => {
                  return {
                    ...o,
                    circlesAddress: o.circlesAddress,
                    avatarUrl: o.avatarUrl
                      ? o.avatarUrl
                      : AvataarGenerator.generate(o.circlesAddress),
                  };
                })
                .reverse()
            : [];
        },
      },
    },
    navigation: spec.navigation,
  });
}
