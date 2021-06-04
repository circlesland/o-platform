import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {CitiesByIdDocument, CitiesByNameDocument, City, UpsertProfileDocument} from "../data/api/types";
import * as yup from "yup";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { promptChoice } from "./identify/prompts/promptChoice";
import {Choice} from "@o-platform/o-editors/src/choiceSelectorContext";
import {promptFile} from "../../../shared/api/promptFile";

export type UpsertIdentityContextData = {
  id?: number;
  newsletter?: boolean;
  circlesAddress?: string;
  circlesSafeOwner?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  dream?: string;
  cityGeonameid?: number;
  city?: City;
  avatar?: {
    bytes: Buffer;
    mimeType: string;
  };
  avatarUrl?: string;
  avatarCid?: string;
  avatarMimeType?: string;
  errorUploadingAvatar?: string;
};

export type UpsertIdentityContext = ProcessContext<UpsertIdentityContextData>;

const strings = {
  labelFirstName:
    "<span>Awesome!<br/>You are finally a citizen of CirclesLand.<br/>Glad to have you here.</span><strong class='text-primary block mt-3'>What is your first name?</strong>",
  labelLastName:
    "<strong class='text-primary  block mt-3'>What is your last name?</strong>",
  labelAvatar:
    "<span>Add a profile image to become<br/> more recognizable</span>",
  labelCountry:
    "<span>Vote for your country in the global universal basic income economy ranking leaderboard.</span><strong class='text-primary block mt-3'>Select country</strong>",
  labeldream:
    "<span class='block'>What will you do, create, build or offer to grow the basic income economy and accept Circles as payment for it?</span><strong class='text-primary  block mt-3'>Share your passion</strong>",
  placeholderFirstName: "First name",
  placeholderLastName: "Last name",
  placeholderCountry: "Select a country",
  placeholderDream: "Your passion.",
  labelNewsletter:
    "Do you want to subscribe to our monthly newsletter to stay up to date with the developments around the basic income economy?",
};

const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
  createMachine<UpsertIdentityContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "firstName",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertIdentityContext, any>("error"),

      firstName: prompt<UpsertIdentityContext, any>({
        field: "firstName",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          label: strings.labelFirstName,
          placeholder: strings.placeholderFirstName,
          submitButtonText: "Save first name",
        },
        dataSchema: yup.string().required("Please enter your first name."),
        navigation: {
          next: "#lastName",
        },
      }),
      lastName: prompt<UpsertIdentityContext, any>({
        field: "lastName",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          label: strings.labelLastName,
          placeholder: strings.placeholderLastName,
          submitButtonText: "Save last name",
        },
        navigation: {
          next: "#country",
          previous: "#firstName",
          canSkip: () => true,
        },
      }),
      country: prompt<UpsertIdentityContext, any>({
        id: "country",
        field: "cityGeonameid",
        onlyWhenDirty: skipIfNotDirty,
        component: DropdownSelectEditor,
        params: {
          label: strings.labelCountry,
          placeholder: strings.placeholderCountry,
          submitButtonText: "Submit vote",

          asyncChoices: async (searchText?: string) => {
            const n = <any>navigator;
            const lang = n.language || n.userLanguage;
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.query({
              query: CitiesByNameDocument,
              variables: {
                name: (searchText ?? "" ) + "%",
                languageCode: lang.substr(0, 2)
              },
            });

            const items =
                result.data.cities && result.data.cities.length > 0
                    ? result.data.cities
                        .map((o) => {
                          return <Choice>{
                            label: `${o.name} (${o.country})`,
                            value: o.geonameid
                          };
                        })
                    : [];

            return items;
          },
          optionIdentifier: "value",
          getOptionLabel: (option) => option.label,
          getSelectionLabel: (option) => option.label,
        },
        navigation: {
          next: "#setCity",
          previous: "#lastName",
          canSkip: () => true,
          skip: "#dream"
        },
      }),
      setCity: {
        id: "setCity",
        invoke: {
          src: async (context) => {
            if (!context.data.cityGeonameid) {
              context.data.city = undefined;
              return;
            }
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.query({
              query: CitiesByIdDocument,
              variables: {
                ids: [context.data.cityGeonameid]
              },
            });
            if (result.errors && result.errors.length) {
              throw new Error(`An error occurred while fetching a city: ${JSON.stringify(result.errors)}`)
            }
            context.data.city =  result.data.city?.length ? result.data.city[0] : undefined;
          },
          onDone: "#dream",
          onError: "#error"
        }
      },
      dream: prompt<UpsertIdentityContext, any>({
        field: "dream",
        onlyWhenDirty: skipIfNotDirty,
        component: TextareaEditor,
        params: {
          label: strings.labeldream,
          placeholder: strings.placeholderDream,
          submitButtonText: "Start growing",
          maxLength: "150",
        },
        dataSchema: yup
            .string()
            .nullable()
            .notRequired()
            .max(150, "The maximum amount of characters allowed is 150."),
        navigation: {
          next: "#avatarUrl",
          canSkip: () => true,
          previous: "#country",
        },
      }),
      x: {
        entry:() => console.log("#avatarUrl entry"),
        id: "avatarUrl",
        always: "avatarUrl"
      },
      avatarUrl: promptFile({
        id: "avatarUrl",
        next: "#newsletter",
        previous: "#dream",
        field: "avatarUrl",
        isOptional: true,
        skipIfNotDirty: skipIfNotDirty
      }),
      newsletter: promptChoice({
        id: "newsletter",
        entry: (context, event: any) => {
          if (event.data?.url) {
            context.data.avatarUrl = event.data?.url;
            context.data.avatarMimeType = event.data?.mimeType;
          }
        },
        promptLabel: strings.labelNewsletter,
        onlyWhenDirty: skipIfNotDirty,
        options: [{
          key: "create",
          label: "No thanks",
          target: "#dontSubscribeToNewsletter"
        }, {
          key: "connect",
          label: "Yes please",
          target: "#subscribeToNewsletter"
        }],
        navigation: {
          canGoBack: () => true,
          canSkip: () => false,
          previous: "#avatarUrl",
          skip: "#upsertIdentity"
        }
      }),
      subscribeToNewsletter: {
        id: "subscribeToNewsletter",
        entry: (context, event) => {
          context.data.newsletter = true;
        },
        always: "#upsertIdentity"
      },
      dontSubscribeToNewsletter: {
        id: "dontSubscribeToNewsletter",
        entry: (context, event) => {
          context.data.newsletter = false;
        },
        always: "#upsertIdentity"
      },
      upsertIdentity: {
        id: "upsertIdentity",
        invoke: {
          src: async (context, event) => {
            delete context.data.avatar;
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: context.data.id,
                circlesAddress: context.data.circlesAddress,
                circlesSafeOwner:
                  context.data.circlesSafeOwner ??
                  (localStorage.getItem("circlesKey")
                    ? RpcGateway.get().eth.accounts.privateKeyToAccount(
                        localStorage.getItem("circlesKey")
                      ).address
                    : undefined),
                firstName: context.data.firstName,
                lastName: context.data.lastName,
                dream: context.data.dream,
                newsletter: context.data.newsletter ?? false,
                country: context.data.country,
                avatarUrl: context.data.avatarUrl,
                avatarCid: context.data.avatarCid,
                avatarMimeType: context.data.avatarMimeType,
                cityGeonameid: context.data.cityGeonameid
              }
            });
            context.data.city = result.data.upsertProfile.city;
            return result.data.upsertProfile;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: any) => {
          console.log(`enter: upsertIdentity.success`, context.data);
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: context.data,
          });
          return event.data;
        },
      },
    },
  });

// A ProcessDefinition always has a input and an output value (the generic parameters).
// Depending on how 'void' is placed, it can mimic either a function or procedure.
// Here it simply returns all the data that was collected in the process (AuthenticateContextData)
// if no error occurs in the promise.
export const upsertIdentity: ProcessDefinition<
  void,
  UpsertIdentityContextData
> = {
  name: "upsertIdentity",
  stateMachine: <any>processDefinition,
};
