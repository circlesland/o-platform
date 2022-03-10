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
  Contact,
  Profile,
  ProfileBySafeAddressDocument, ProfileBySafeAddressQueryVariables,
  ProfilesByNameDocument, ProfilesByNameQueryVariables,
} from "./data/types";
import {ApiClient} from "../apiConnection";
import {Observable, TeardownLogic} from "rxjs";
import {contacts} from "../stores/contacts";

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
  function resultComparer(a:Profile,b:Profile) {
    let firstNameOrder = 0;
    if (a.firstName > b.firstName)
      firstNameOrder = 1;
    else if (a.firstName < b.firstName)
      firstNameOrder = -1;
    else
      firstNameOrder = 0;

    let lastNameOrder = 0;
    if (a.lastName > b.lastName)
      lastNameOrder = 1;
    else if (a.lastName < b.lastName)
      lastNameOrder = -1;
    else
      lastNameOrder = 0;

    if (firstNameOrder != 0) {
      return firstNameOrder;
    } else {
      return lastNameOrder;
    }
  }
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
      getLabel: (profile) => profile.displayName,
      choices: {
        byKey: async (key: string) => {
          const profiles = await ApiClient.query<Profile[], ProfileBySafeAddressQueryVariables>(ProfileBySafeAddressDocument, {
            safeAddress: key
          });
          return profiles?.length
            ? profiles[0]
            : undefined;
        },
        find: (filter?: string) => {
          const resultsObservable = new Observable<Profile[]>((observer) => {
            contacts.subscribe(c => {
              const filteredCachedContacts = c.filter(contact =>
                ((contact.contactAddress_Profile?.firstName ?? "")
                + (contact.contactAddress_Profile?.firstName ?? "")
                + (contact.contactAddress_Profile?.circlesAddress ?? ""))
                  .toLowerCase()
                  .indexOf(filter.toLowerCase()) > -1
              ).sort((a,b) => resultComparer(a.contactAddress_Profile, b.contactAddress_Profile));
              observer.next(filteredCachedContacts.map(o => o.contactAddress_Profile));
            })();

            ApiClient.query<Profile[], ProfilesByNameQueryVariables>(ProfilesByNameDocument, {
              searchString: (filter ?? "") + "%",
            }).then(profiles => {
              const searchResult = (profiles && profiles.length > 0
                ? profiles
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
                : []).sort(resultComparer);

              observer.next(searchResult);
              observer.complete();
            });
          });

          return resultsObservable;
        }
      },
    },
    navigation: spec.navigation,
  });
}
