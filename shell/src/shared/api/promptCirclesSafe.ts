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
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { AvataarGenerator } from "../avataarGenerator";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import {
  Profile,
  ProfileBySafeAddressDocument,
  ProfilesByNameDocument,
} from "./data/types";

export function promptCirclesSafe<
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
    params: <DropdownSelectorParams<TContext, Profile, string>>{
      allowAlternativeInput: true,
      view: spec.params.view,
      getKey: (profile) => {
        return profile.circlesAddress;
      },
      keyProperty: "circlesAddress",
      itemTemplate: DropDownProfile,
      getLabel: (profile) =>
        `${profile.firstName} ${profile.lastName ? profile.lastName : ""}`,
      choices: {
        byKey: async (key: string) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: ProfileBySafeAddressDocument,
            variables: {
              safeAddress: key,
            },
          });
          return result.data?.profiles?.length
            ? result.data.profiles[0]
            : undefined;
        },
        find: async (filter?: string) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: ProfilesByNameDocument,
            variables: {
              searchString: (filter ?? "") + "%",
            },
          });
          return result.data.search && result.data.search.length > 0
            ? result.data.search
                .filter((o) => o.circlesAddress)
                .map((o) => {
                  return {
                    ...o,
                    circlesAddress: RpcGateway.get().utils.toChecksumAddress(
                      o.circlesAddress
                    ),
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
