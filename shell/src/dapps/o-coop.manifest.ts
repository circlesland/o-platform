import Organisations from "./o-coop/pages/Organisations.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import {createOrganisation} from "./o-coop/processes/createOrganisation";
import {ContactsDappState} from "./o-contacts.manifest";
import OrganisationDetail from "./o-coop/pages/OrganisationDetail.svelte";
import {addMember} from "./o-coop/processes/addMember";

const index: Page<any, DappState> = {
  routeParts: [],
  component: Organisations,
  title: "List",
  type: "page",
};

export const profile: Page<any, ContactsDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: [":id"],
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
  tag: Promise.resolve("alpha"),
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["=actions"],
    items: async (params, runtimeDapp) => {
      return [
        {
          key: "createOrganisation",
          icon: "createOrganisation",
          title: "Create new organisation",
          action: async () => {
            //alert("Do it!");//
            window.o.runProcess(createOrganisation, {}, {});
          },
        },
        {
          key: "addMember",
          icon: "addMember",
          title: "Add a member",
          action: async () => {
            //alert("Do it!");//
            window.o.runProcess(addMember, {
              groupId: params.id
            }, {});
          },
        },
      ];
    },
  },
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, profile],
};