import Organisations from "./o-coop/pages/Organisations.svelte";
import Regions from "./o-coop/pages/Regions.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { createOrganisation } from "./o-coop/processes/createOrganisation";
import { ContactsDappState } from "./o-contacts.manifest";
import OrganisationDetail from "./o-coop/pages/OrganisationDetail.svelte";
import { addMember } from "./o-coop/processes/addMember";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { loadProfile } from "../shared/functions/loadProfile";
import { CapabilityType, InitDocument, InitQueryVariables, Profile, SessionInfo } from "../shared/api/data/types";
import { me } from "../shared/stores/me";
import { getSessionInfo } from "./o-passport/processes/identify/services/getSessionInfo";
import { addOwner } from "./o-coop/processes/addOwner";
import { ApiClient } from "../shared/apiConnection";

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
  isHidden: true,
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
      let $me: Profile = null;
      me.subscribe((me) => ($me = me))();

      const list = [];
      const sessionInfo = await getSessionInfo();

      if (sessionInfo.capabilities.find((o) => o.type == CapabilityType.PreviewFeatures)) {
        list.push(<JumplistItem>{
          key: "createOrganisation",
          type: "profile",
          icon: "plus",
          category: "Coops",
          title: window.o.i18n("dapps.common.quickactions.createOrganization"),
          action: async () => {
            window.o.runProcess(
              createOrganisation,
              {
                successAction: async (data) => {
                  const createdOrga = await loadProfile(data.circlesAddress, $me);
                  window.o.publishEvent(<PlatformEvent>{
                    type: "shell.loggedOut",
                  });
                  window.o.publishEvent(<PlatformEvent>{
                    type: "shell.authenticated",
                    profile: createdOrga.profile,
                  });
                  location.reload();
                },
              },
              {}
            );
          },
        });

        if (<string>$me.__typename === "Organisation") {
          list.push(<JumplistItem>{
            category: $me.displayName,
            key: "addMember",
            type: "action",
            icon: "plus",
            title: window.o.i18n("dapps.common.quickactions.addMember"),
            action: async () => {
              window.o.runProcess(
                addMember,
                {
                  groupId: $me.circlesAddress,
                  successAction: (data: any) => {},
                },
                {}
              );
            },
          });
          list.push(<JumplistItem>{
            category: $me.displayName,
            key: "addOwner",
            type: "action",
            icon: "plus",
            title: window.o.i18n("dapps.common.quickactions.addOwner"),
            action: async () => {
              window.o.runProcess(
                addOwner,
                {
                  groupId: $me.circlesAddress,
                  successAction: (data: any) => {},
                },
                {}
              );
            },
          });
        }
      }

      return list;
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
  routables: [index, profile, regions],
};
