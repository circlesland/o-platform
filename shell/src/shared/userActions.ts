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
import {
  Contact,
  ContactDirection,
  EventType,
  Profile,
  VerifySafeDocument,
} from "./api/data/types";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { contacts as contactStore } from "./stores/contacts";
import { me } from "./stores/me";
import { push } from "svelte-spa-router";
import { transfer } from "../dapps/o-banking/processes/transfer";
import { setTrust } from "../dapps/o-banking/processes/setTrust";

export interface UserActionItem {
  key: string;
  icon?: string;
  title: string;
  event?: PlatformEvent;
  colorClass?: string;
  action?: () => void;
}

export class UserActions {
  // public static instance() {
  //   return this._instance;
  // }

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
    if (!$me) throw new Error(`Couldn't load your profile`);

    const recipientProfile: Contact = await contactStore.findBySafeAddress(
      targetUser.circlesAddress ?? $me.circlesAddress
    );

    const trustMetadata =
      recipientProfile?.metadata.find((o) => o.name == EventType.CrcTrust) ??
      undefined;
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
            title: "Chat",
            action: async () => {
              push("#/contacts/chat/" + recipientProfile.contactAddress);
            },
          },
        ]);
      }

      /* PERSON */
      if (
        recipientProfile.contactAddress_Profile &&
        recipientProfile.contactAddress_Profile.type == "PERSON"
      ) {
        actions = actions.concat(
          trustsYou
            ? [
                {
                  key: "transfer",
                  icon: "sendmoney",
                  title: "Send Money",
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
                  icon: "untrust",
                  title: "Untrust",
                  colorClass: "text-alert",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 0,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: "__CIRCLES_HUB_ADDRESS__",
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
            : [
                {
                  key: "setTrust",
                  icon: "trust",
                  title: "Trust",
                  action: async () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 100,
                      trustReceiver: recipientProfile.contactAddress,
                      safeAddress: $me.circlesAddress,
                      hubAddress: "__CIRCLES_HUB_ADDRESS__",
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
        );
      }
      /* ORGA */
    }
    return actions;
  }
}
