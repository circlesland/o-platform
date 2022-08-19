/*
params targetUser
params ActionsOrder

func buildActions(targetUser)
  add action chat
  if targetUser !youTrust -> add action trust
  if targetUser youTrust -> add action untrust
  if targetUser trustYou && youTrust -> add action send money
  if $me is in Orga && targetUser is NOT in Orga -> add action invite to Orga
  if $me is in Orga && targetUser is in orga -> add action kick from Orga
*/

import { ContactDirection, EventType, Profile, ProfileType } from "./api/data/types";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { contacts as contactStore } from "./stores/contacts";
import { me } from "./stores/me";
import { push } from "svelte-spa-router";
import { transfer } from "../dapps/o-banking/processes/transfer";
import { setTrust } from "../dapps/o-banking/processes/setTrust";
import { Environment } from "./environment";
import { JumplistItemHint } from "@o-platform/o-interfaces/src/routables/jumplist";

export interface UserActionItem {
  key: string;
  icon?: string;
  title: string;
  displayHint?: JumplistItemHint;
  event?: PlatformEvent;
  colorClass?: string;
  action?: () => void;
}

export class UserActions {
  static async getSingleAction(targetUser: Profile, actionKey: string) {
    let actions = await this.getAvailableActions(targetUser);

    let action = actions.filter(function (myAction) {
      return myAction.key == actionKey;
    });

    return action;
  }

  static async getAvailableActions(targetUser: Profile) {
    // TODO: Verify if targetUser is cool.

    let $me: Profile | null = null;
    let actions: UserActionItem[] = [];

    const unsub = me.subscribe((o) => {
      $me = o;
    });
    unsub();
    if (!$me) throw new Error(window.o.i18n("shared.userActions.errors.couldNotLoadYourProfile"));

    let recipientProfile = await contactStore.findBySafeAddress(targetUser.circlesAddress ?? $me.circlesAddress);

    const trustMetadata = recipientProfile?.metadata.find((o) => o.name == EventType.CrcTrust) ?? undefined;
    let trustsYou = false;
    let youTrust = false;

    if (trustMetadata) {
      const inTrust = trustMetadata.directions.indexOf(ContactDirection.In);
      if (inTrust > -1) {
        const trustLimit = trustMetadata.values[inTrust];
        trustsYou = parseInt(trustLimit) > 0;
      }
      const outTrust = trustMetadata.directions.indexOf(ContactDirection.Out);
      if (outTrust > -1) {
        const trustLimit = trustMetadata.values[outTrust];
        youTrust = parseInt(trustLimit) > 0;
      }
      if (recipientProfile?.contactAddress) {
        actions = actions.concat([
          {
            key: "chat",
            icon: "chat",
            title: window.o.i18n("shared.userActions.chat"),
            displayHint: "discouraged",
            action: async () => {
              push("#/contacts/chat/" + recipientProfile.contactAddress);
            },
          },
        ]);
      }

      /* PERSON */
      if (
        recipientProfile.contactAddress_Profile &&
        recipientProfile.contactAddress_Profile.type == ProfileType.Person.toString()
      ) {
        actions = actions.concat(
          trustsYou
            ? [
                {
                  key: "transfer",
                  icon: "cash",
                  title: window.o.i18n("shared.userActions.sendMoney"),
                  action: async () => {
                    window.o.runProcess(transfer, {
                      safeAddress: $me.circlesAddress,
                      recipientAddress: recipientProfile.contactAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
            : [],
          youTrust
            ? [
                {
                  key: "setTrust",
                  icon: "minus-circle",
                  title: window.o.i18n("shared.userActions.untrust"),
                  colorClass: "text-alert",
                  displayHint: "discouraged",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 0,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: Environment.circlesHubAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
            : [
                {
                  key: "setTrust",
                  icon: "shield-check",
                  title: window.o.i18n("shared.userActions.trust"),
                  displayHint: "encouraged",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 100,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: Environment.circlesHubAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
        );
      }
      /* ORGA */
    } else if (recipientProfile.contactAddress_Profile.type == ProfileType.Person.toString()) {
      // Trust should be always allowed (except for orga targets)
      actions.push({
        key: "setTrust",
        icon: "shield-check",
        title: window.o.i18n("shared.userActions.trust"),
        displayHint: "discouraged",
        action: async () => {
          window.o.runProcess(setTrust, {
            trustLimit: 100,
            trustReceiver: recipientProfile.contactAddress,
            safeAddress: $me.circlesAddress,
            hubAddress: Environment.circlesHubAddress,
            privateKey: sessionStorage.getItem("circlesKey"),
          });
        },
      });
    }
    return actions;
  }
}
