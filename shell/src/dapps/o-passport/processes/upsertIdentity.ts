import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { assign, createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import PictureEditor from "@o-platform/o-editors/src/PictureEditor.svelte";
import PicturePreview from "@o-platform/o-editors/src/PicturePreview.svelte";
import { countries } from "../../../shared/countries";
import gql from "graphql-tag";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { uploadFile } from "../../../shared/api/uploadFile";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";

export type UpsertIdentityContextData = {
  id?: number;
  circlesAddress?: string;
  loginEmail: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  dream?: string;
  avatar?: {
    bytes: Buffer;
    mimeType: string;
  };
  avatarUrl?: string;
  avatarCid?: string;
  avatarMimeType?: string;
};

export type UpsertIdentityContext = ProcessContext<UpsertIdentityContextData>;

const strings = {
  labelFirstName:
    "Awesome, you are finally a citizen of CirclesLAND, glad to have you here. What is your name?",
  labelLastName:
    "Do you want to let the world know your last name, so they know in the search who’s dream they are connecting with?",
  labelAvatar: "Add a profile image to become more recognizable ",
  labelCountry:
    "Vote for your country in the global universal basic income economy ranking leaderboard.",
  labeldream:
    "What is your life dream? Fill in the blanks. When I receive a universal basic income, I will follow my passion of _______________ and will accept Circles as payment. ",
  placeholderFirstName: "First Name",
  placeholderLastName: "Last Name",
  placeholderCountry: "Select a Country",
  placeholderDream: "Enter your dream.",
};

const processDefinition = (processId: string) =>
  createMachine<UpsertIdentityContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "checkFirstName",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertIdentityContext, any>("error"),

      checkFirstName: {
        id: "checkFirstName",
        always: [
          {
            cond: (context) => false,
            target: "#checkLastName",
          },
          {
            target: "#firstName",
          },
        ],
      },
      editFirstName: prompt<UpsertIdentityContext, any>({
        fieldName: "firstName",
        component: TextEditor,
        params: {
          label: strings.labelFirstName,
          placeholder: strings.placeholderFirstName,
          submitButtonText: "Save first name",
        },
        navigation: {
          next: "#checkLastName",
        },
      }),
      checkLastName: {
        id: "checkLastName",
        always: [
          {
            cond: (context) => false,
            target: "#checkCountry",
          },
          {
            target: "#lastName",
          },
        ],
      },
      editLastName: prompt<UpsertIdentityContext, any>({
        fieldName: "lastName",
        component: TextEditor,
        params: {
          label: strings.labelLastName,
          placeholder: strings.placeholderLastName,
          submitButtonText: "Save last name",
        },
        navigation: {
          next: "#checkCountry",
          previous: "#checkFirstName",
          canSkip: () => true,
        },
      }),
      checkCountry: {
        id: "checkCountry",
        always: [
          {
            cond: (context) => false,
            target: "#checkDream",
          },
          {
            target: "#country",
          },
        ],
      },
      country: prompt<UpsertIdentityContext, any>({
        fieldName: "country",
        component: DropdownSelectEditor,
        params: {
          label: strings.labelCountry,
          placeholder: strings.placeholderCountry,
          submitButtonText: "Submit vote",
          choices: countries,
          optionIdentifier: "value",
          getOptionLabel: (option) => option.label,
          getSelectionLabel: (option) => option.label,
        },
        navigation: {
          next: "#checkDream",
          previous: "#checkLastName",
          canSkip: () => true,
        },
      }),
      checkDream: {
        id: "checkDream",
        always: [
          {
            cond: (context) => false,
            target: "#checkPreviewAvatar",
          },
          {
            target: "#dream",
          },
        ],
      },
      dream: prompt<UpsertIdentityContext, any>({
        fieldName: "dream",
        component: TextEditor,
        params: {
          label: strings.labeldream,
          placeholder: strings.placeholderDream,
          submitButtonText: "Start dreaming",
        },
        navigation: {
          next: "#checkPreviewAvatar",
          previous: "#checkCountry",
        },
      }),
      checkPreviewAvatar: {
        id: "checkPreviewAvatar",
        always: [
          {
            cond: (context) => !!context.data.avatarUrl,
            target: "#avatarUrl",
          },
          {
            target: "#checkEditAvatar",
          },
        ],
      },
      avatarUrl: prompt<UpsertIdentityContext, any>({
        fieldName: "avatarUrl",
        component: PicturePreview,
        params: {
          label: strings.labelAvatar,
          submitButtonText: "Save Image",
        },
        navigation: {
          next: "#checkEditAvatar",
          previous: "#checkDream",
          canSkip: () => true,
        },
      }),
      checkEditAvatar: {
        id: "checkEditAvatar",
        always: [
          {
            cond: (context) =>
              context.dirtyFlags["avatarUrl"] || !context.data.avatarUrl,
            actions: (context) => delete context.dirtyFlags["avatarUrl"],
            target: "#avatar",
          },
          {
            target: "#upsertIdentity",
          },
        ],
      },
      avatar: prompt<UpsertIdentityContext, any>({
        fieldName: "avatar",
        component: PictureEditor,
        params: {
          label: strings.labelAvatar,
          submitButtonText: "Save Image",
        },
        navigation: {
          next: "#checkUploadAvatar",
          previous: "#checkDream",
          canSkip: () => true,
        },
      }),
      checkUploadAvatar: {
        id: "checkUploadAvatar",
        always: [
          {
            cond: (context) =>
              context.dirtyFlags["avatar"] &&
              !!context.data.avatar &&
              !!context.data.avatar.bytes,
            target: "#uploadAvatar",
          },
          {
            target: "#upsertIdentity",
          },
        ],
      },
      uploadAvatar: {
        id: "uploadAvatar",
        on: {
          ...(<any>ipc(`uploadAvatar`)),
        },
        invoke: {
          src: uploadFile.stateMachine("uploadAvatar"),
          data: {
            data: (context, event) => {
              return {
                appId: "__FILES_APP_ID__",
                fileName: "avatar",
                mimeType: context.data.avatar.mimeType,
                bytes: context.data.avatar.bytes,
              };
            },
            dirtyFlags: {},
          },
          onDone: "#upsertIdentity",
          onError: "#error",
        },
      },
      upsertIdentity: {
        id: "upsertIdentity",
        invoke: {
          src: async (context, event) => {
            delete context.data.avatar;
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: gql`
                mutation upsertProfile(
                  $id: Int
                  $firstName: String!
                  $lastName: String
                  $dream: String!
                  $country: String
                  $avatarUrl: String
                  $avatarCid: String
                  $avatarMimeType: String
                  $circlesAddress: String
                ) {
                  upsertProfile(
                    data: {
                      id: $id
                      firstName: $firstName
                      lastName: $lastName
                      dream: $dream
                      country: $country
                      avatarUrl: $avatarUrl
                      avatarCid: $avatarCid
                      avatarMimeType: $avatarMimeType
                      circlesAddress: $circlesAddress
                    }
                  ) {
                    id
                    firstName
                    lastName
                    dream
                    country
                    avatarUrl
                    avatarCid
                    avatarMimeType
                    circlesAddress
                  }
                }
              `,
              variables: {
                id: context.data.id,
                circlesAddress: context.data.circlesAddress,
                firstName: context.data.firstName,
                lastName: context.data.lastName,
                dream: context.data.dream,
                country: context.data.country,
                avatarUrl: event.data.url ?? context.data.avatarUrl,
                avatarCid: event.data.hash ?? context.data.avatarCid,
                avatarMimeType:
                  event.data.mimeType ?? context.data.avatarMimeType,
              },
            });

            if (event?.data?.url) {
              context.data.avatarCid = event?.data?.hash;
              context.data.avatarUrl = event?.data?.url;
              context.data.avatarMimeType = event?.data?.mimeType;
            }

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
