import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import PictureEditor from "@o-platform/o-editors/src/PictureEditor.svelte";
import { AuthenticateContext } from "../../o-auth/processes/authenticate";
import { countries } from "../../../shared/countries";
import gql from "graphql-tag";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { uploadFile } from "../../../shared/api/uploadFile";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";

export type UpsertIdentityContextData = {
  id?: number;
  loginEmail: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  dream?: string;
  avatar?: {
    bytes: Buffer;
    mimeType: string;
  };
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
      editFirstName: prompt<AuthenticateContext, any>({
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
      editLastName: prompt<AuthenticateContext, any>({
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
      country: prompt<AuthenticateContext, any>({
        fieldName: "country",
        component: DropdownSelectEditor,
        params: {
          label: strings.labelCountry,
          placeholder: strings.placeholderCountry,
          submitButtonText: "Submit vote",
          choices: countries,
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
            target: "#checkAvatar",
          },
          {
            target: "#dream",
          },
        ],
      },
      dream: prompt<AuthenticateContext, any>({
        fieldName: "dream",
        component: TextEditor,
        params: {
          label: strings.labeldream,
          placeholder: strings.placeholderDream,
          submitButtonText: "Start dreaming",
        },
        navigation: {
          next: "#checkAvatar",
          previous: "#checkCountry",
        },
      }),
      checkAvatar: {
        id: "checkAvatar",
        always: [
          {
            cond: (context) => false,
            target: "#upsertIdentity",
          },
          {
            target: "#avatar",
          },
        ],
      },
      editAvatar: prompt<AuthenticateContext, any>({
        fieldName: "avatar",
        component: PictureEditor,
        params: {
          label: strings.labelAvatar,
          submitButtonText: "Save Image",
        },
        navigation: {
          next: "#checkUploadAvatar",
          previous: "#checkLastName",
          canSkip: () => true,
        },
      }),
      checkUploadAvatar: {
        id: "checkUploadAvatar",
        always: [
          {
            cond: (context) => context.dirtyFlags["avatar"],
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
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: gql`
                mutation upsertProfile(
                  $id: Int
                  $firstName: String!
                  $lastName: String
                  $dream: String!
                  $country: String
                  $avatarCid: String
                  $avatarMimeType: String
                ) {
                  upsertProfile(
                    data: {
                      id: $id
                      firstName: $firstName
                      lastName: $lastName
                      dream: $dream
                      country: $country
                      avatarCid: $avatarCid
                      avatarMimeType: $avatarMimeType
                    }
                  ) {
                    id
                    firstName
                    lastName
                    dream
                    country
                    avatarCid
                    avatarMimeType
                  }
                }
              `,
              variables: {
                id: context.data.id,
                firstName: context.data.firstName,
                lastName: context.data.lastName,
                dream: context.data.dream,
                country: context.data.country,
                avatarCid: event.data.hash,
                avatarMimeType: event.data.mimeType,
              },
            });

            context.data.avatarCid = event?.data?.hash;
            context.data.avatarMimeType = event?.data?.mimeType;

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
