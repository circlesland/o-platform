<script lang="ts">
import { push } from "svelte-spa-router";
import { me } from "../../../shared/stores/me";
import { Currency } from "../../../shared/currency";
import Date from "../../../shared/atoms/Date.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import relativeTimeString from "../../../shared/functions/relativeTimeString";
import { displayableName } from "../../../shared/functions/stringHelper";

import {
  CrcHubTransfer,
  CrcMinting,
  Erc20Transfer,
  EventType,
  Profile,
  ProfileEvent,
} from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import Icons from "../../../shared/molecules/Icons.svelte";

export let event: ProfileEvent;

let path: any;
let fromProfile: Profile = <any>{};
let toProfile: Profile = <any>{};
let error: string;
let message: string | undefined = undefined;
let messageString: string = "";
let targetProfile: Profile = <any>{};
let amount: string | number = "";
let amountTime: string | number = "";

$: {
  if (event && event.payload?.__typename == "CrcMinting") {
    const minting = event.payload as CrcMinting;

    toProfile = minting.to_profile ?? {
      id: 0,
      firstName: minting.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: minting.to,
    };

    fromProfile = toProfile;

    amount = Currency.instance().displayAmount(
      event.payload && event.payload.value ? event.payload.value.toString() : "0",
      event.timestamp,
      $me.displayCurrency
    );
    amountTime = Currency.instance()
      .displayAmount(
        event.payload && event.payload.value ? event.payload.value.toString() : "0",
        event.timestamp,
        "TIME_CRC",
        null
      )
      .toString();

    message = "Universal basic income";
  }

  if (event && event.payload?.__typename == "Erc20Transfer") {
    const ercTransfer = event.payload as Erc20Transfer;
    fromProfile = ercTransfer.from_profile ?? {
      id: 0,
      firstName: "Circles Land",
      lastName: "",
      avatarUrl: "/logos/erc20.png",
      circlesAddress: ercTransfer.from,
    };

    toProfile = ercTransfer.to_profile ?? {
      id: 0,
      firstName: ercTransfer.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: ercTransfer.to,
    };
    amount = parseFloat(RpcGateway.get().utils.fromWei(ercTransfer.value, "ether")).toFixed(2);
    message = "ERC-20 Transfer";
    amountTime = amount;
    /*
    amountTime = Currency.instance()
      .displayAmount(amount ? amount : "0", event.timestamp, "TIME_CRC", null)
      .toString();
 */
  }

  if (event && event.payload?.__typename == "CrcHubTransfer") {
    const hubTransfer = event.payload as CrcHubTransfer;
    fromProfile = hubTransfer.from_profile ?? {
      id: 0,
      firstName: hubTransfer.from.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: hubTransfer.from,
    };

    toProfile = hubTransfer.to_profile ?? {
      id: 0,
      firstName: hubTransfer.to.substr(0, 24) + "...",
      lastName: "",
      circlesAddress: hubTransfer.to,
    };

    path = {
      transfers: hubTransfer.transfers,
    };

    message = hubTransfer.tags?.find((o) => o.typeId === "o-banking:transfer:message:1")?.value;

    if (event.payload?.__typename == EventType.CrcHubTransfer) {
      const ht = <CrcHubTransfer>event.payload;
      amount = Currency.instance().displayAmount(
        event.payload && ht.flow ? ht.flow.toString() : "0",
        event.timestamp,
        $me.displayCurrency ? $me.displayCurrency : "EURS"
      );

      amountTime = Currency.instance()
        .displayAmount(event.payload && ht.flow ? ht.flow.toString() : "0", event.timestamp, "TIME_CRC", null)
        .toString();
    }

    if (event.direction == "out") {
      amountTime = "-" + amountTime;
    }
  }

  if (event.timestamp) {
    messageString = relativeTimeString(event.timestamp, 7);
  }
  if (message) {
    messageString += ` - ${message}`;
  }

  targetProfile = event.direction === "in" ? fromProfile : toProfile;
}
function loadDetailPage(path) {
  push(`#/banking/transactions/${path}`);
}
</script>

<div on:click="{() => loadDetailPage(event.transaction_hash)}" class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: targetProfile,
      profileLink: `#/contacts/profile/${targetProfile.circlesAddress}`,
      imageAlt: event.direction === 'in' ? fromProfile.circlesAddress : toProfile.circlesAddress,

      title: displayableName(targetProfile.firstName, targetProfile.lastName ? targetProfile.lastName : null),
      subTitle: messageString ? messageString : '',
      truncateMain: true,
      endTextBig: amountTime,
      profileLink: true,
      mobileTextCutoff: 19,
      endTextBigClass: amountTime.startsWith('-') ? 'text-negative' : undefined,
    }}" />
</div>
