import Organisations from "./o-coop/pages/Organisations.svelte";
import Regions from "./o-coop/pages/Regions.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { createOrganisation } from "./o-coop/processes/createOrganisation";
import { ContactsDappState } from "./o-contacts.manifest";
import OrganisationDetail from "./o-coop/pages/OrganisationDetail.svelte";
import { addMember } from "./o-coop/processes/addMember";
import { createRegion } from "./o-coop/processes/createRegion";
import {JumplistItem} from "@o-platform/o-interfaces/dist/routables/jumplist";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {loadProfile} from "../shared/functions/loadProfile";
import {Profile} from "../shared/api/data/types";
import {me} from "../shared/stores/me";

const index: Page<any, ContactsDappState> = {
  routeParts: ["=organisations"],
  component: Organisations,
  title: "Coops",
  type: "page",
};
const regions: Page<any, ContactsDappState> = {
  routeParts: ["=regions"],
  component: Regions,
  title: "Regions",
  type: "page",
};
export const profile: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=organisations", ":id"],
  title: "Profile",
  component: OrganisationDetail,
};

export interface DappState {
  // put state here
}

export const coop: DappManifest<DappState> = {
  type: "dapp",
  dappId: "coops:1",
  isSingleton: true,
  isHidden: false,
  icon: "passport",
  title: "Coops",
  routeParts: ["=coops"],
  defaultRoute: ["organisations"],
  tag: Promise.resolve("alpha"),
  jumplist: {
    type: "jumplist",
    title: "Coops",
    icon: "organization",
    isSystem: true,
    routeParts: [],
    items: async (params, runtimeDapp) => {
      return [
        <JumplistItem>{
          key: "createOrganisation",
          type: "profile",
          icon: "add",
          title: "Create organization",
          action: async () => {
            window.o.runProcess(createOrganisation, {
              successAction:async (data) => {
                let $me:Profile = null;
                me.subscribe(me => $me = me)();
                const createdOrga = await loadProfile(data.circlesAddress, $me);
                window.o.publishEvent(<PlatformEvent>{
                  type: "shell.loggedOut"
                });
                window.o.publishEvent(<PlatformEvent>{
                  type: "shell.authenticated",
                  profile: createdOrga.profile,
                });
                location.reload();
              }
            }, {});
          }
        }
      ]
    }
  },
  // jumplist: {
  // jumplist: {
  //   type: "jumplist",
  //   title: "Actions",
  //   isSystem: false,
  //   routeParts: ["=actions"],
  //   items: async (params, runtimeDapp) => {
  //     return [
  //       {
  //         key: "createOrganisation",
  //         icon: "add",
  //         title: "Create new organisation",
  //         action: async () => {
  //           //alert("Do it!");//
  //           window.o.runProcess(createOrganisation, {}, {});
  //         },
  //       },
  //       {
  //         key: "createRegion",
  //         icon: "add",
  //         title: "Create new region",
  //         action: async () => {
  //           //alert("Do it!");//
  //           window.o.runProcess(createRegion, {}, {});
  //         },
  //       },
  //       {
  //         key: "addMember",
  //         icon: "add",
  //         title: "Add a member",
  //         action: async () => {
  //           //alert("Do it!");//
  //           window.o.runProcess(
  //             addMember,
  //             {
  //               groupId: params.id,
  //             },
  //             {}
  //           );
  //         },
  //       },
  //     ];
  //   },
  // },
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, profile, regions],
};
