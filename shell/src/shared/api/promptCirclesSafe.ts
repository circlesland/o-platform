import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {
  normalizePromptField,
  prompt,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import DropDownProfile from "@o-platform/o-editors/src/dropdownItems/DropDownProfile.svelte";
import {DropdownSelectorParams} from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import {AvataarGenerator} from "../avataarGenerator";
import {EditorViewContext} from "@o-platform/o-editors/src/shared/editorViewContext";
import {
  Contact,
  Profile,
  ProfileBySafeAddressDocument, ProfileBySafeAddressQueryVariables,
  ProfilesByNameDocument, ProfilesByNameQueryVariables,
} from "./data/types";
import {ApiClient} from "../apiConnection";
import {Observable} from "rxjs";
import {contacts} from "../stores/contacts";
import {trustFromContactMetadata} from "../functions/trustFromContactMetadata";

export function promptCirclesSafe<TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent>(spec: {
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

  function sortByNameComparer(a: Profile, b: Profile) {
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

  function sortByDistanceComparer(contacts: Contact[]) {
    const contactsBySafeAddress = contacts.toLookup(o => o.contactAddress, o => o);
    return (a: Profile, b: Profile) => {
      // A profile is considered near when it is a contact of mine
      const aContact = contactsBySafeAddress[a.circlesAddress];
      const bContact = contactsBySafeAddress[b.circlesAddress];
      if (aContact && !bContact) {
        return 1;
      } else if (bContact && !aContact) {
        return -1;
      } else if (!aContact && !bContact) {
        return 0;
      }

      const aTrust = trustFromContactMetadata(aContact);
      const bTrust = trustFromContactMetadata(bContact)

      if (aTrust.trustIn && !bTrust.trustIn) {
        return 1;
      } else if (!aTrust.trustIn && bTrust.trustIn) {
        return -1;
      }

      if (aTrust.trustOut && !bTrust.trustOut) {
        return 1;
      } else if (!aTrust.trustOut && bTrust.trustOut) {
        return -1;
      }

      return aContact.metadata.length > bContact.metadata.length
        ? 1
        : aContact.metadata.length < bContact.metadata.length
          ? -1
          : 0;
    };
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
          let _contacts: Contact[] = [];
          const resultsObservable = new Observable<Profile[]>((observer) => {
            contacts.subscribe(c => {
              _contacts = c;
              const filteredCachedContacts = c.filter(contact =>
                ((contact.contactAddress_Profile?.firstName ?? "")
                  + (contact.contactAddress_Profile?.firstName ?? "")
                  + (contact.contactAddress_Profile?.circlesAddress ?? ""))
                  .toLowerCase()
                  .indexOf(filter.toLowerCase()) > -1
              ).sort((a, b) => sortByNameComparer(a.contactAddress_Profile, b.contactAddress_Profile));
              const sortByDistanceCmp = sortByDistanceComparer(_contacts);
              observer.next(filteredCachedContacts.map(o => o.contactAddress_Profile).sort(sortByDistanceCmp));
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
                : []).sort(sortByNameComparer);

              const sortByDistanceCmp = sortByDistanceComparer(_contacts);
              observer.next(searchResult.sort(sortByDistanceCmp));
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
