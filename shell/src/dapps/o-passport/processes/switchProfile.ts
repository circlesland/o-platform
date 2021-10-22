import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {loadProfile} from "./identify/services/loadProfile";
import {Organisation, Profile} from "../../../shared/api/data/types";
import DynamicChoiceSelector from "../../../../../packages/o-editors/src/DynamicChoiceSelector.svelte";
import {prompt} from "@o-platform/o-process/dist/states/prompt";

export type ProfileOrOrganisation = Profile | Organisation;

export type SwitchProfileContextData = {
  chooseProfile_options: {label:string, value:string}[]
  chooseProfile: ProfileOrOrganisation
};

export type SwitchProfileContext = ProcessContext<SwitchProfileContextData>;

const editorContent = {
  logout: {
    title: "Log out",
    description:
      "Please enter your Secret Recovery Code to logout. If you haven't stored your Secret Recovery Code at a safe place yet, do it now and come back again later to log-out.",
    submitButtonText: "Log out",
  },
};
const processDefinition = (processId: string) =>
  createMachine<SwitchProfileContext, any>({
    id: `${processId}:switchProfile`,
    initial: "loadProfiles",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<SwitchProfileContext, any>("error"),
      loadProfiles: {
        id: "loadProfiles",
        invoke: {
          src: async (context) => {
            const myProfile = await loadProfile();
            if (myProfile.memberships && myProfile.memberships.length > 0) {
               const myMemberships = myProfile.memberships.filter(o => o.isAdmin).map(o => o.organisation);
               context.data.chooseProfile_options = <any>[myProfile, ...myMemberships].map(o => {
                 const displayName = (<any>o).firstName ? (<any>o).firstName + " " + (<any>o).lastName : (<any>o).name;
                 return {
                   value: o,
                   label: displayName
                 }
               });
            }
            console.log(context.data.chooseProfile_options);
          },
          onDone: "#choose",
          onError: "#error",
        },
      },
      choose: prompt({
        id: "choose",
        field: "chooseProfile",
        component: DynamicChoiceSelector,
        params: {
          view: {
            title: "Who am I?",
            description: "Who do you want to be?"
          },
          hideNav: false,
        },
        navigation: {
          next: "#switch"
        },
      }),
      switch: {
        id: "switch",
        invoke: {
          src: async (context) => {
            window.o.publishEvent(<PlatformEvent>{
              type: "shell.loggedOut",
            });
            window.o.publishEvent(<PlatformEvent>{
              type: "shell.authenticated",
              profile: (<any>context.data.chooseProfile).value
            });
            location.reload();
          }
        }
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: any) => {
          return event.data;
        },
      },
    },
  });

export const switchProfile: ProcessDefinition<void, SwitchProfileContext> = {
  name: "switchProfile",
  stateMachine: <any>processDefinition,
};
