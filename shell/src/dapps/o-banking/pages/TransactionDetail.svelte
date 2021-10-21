<script lang="ts">
import { onMount } from "svelte";
import { me } from "../../../shared/stores/me";
import {
  ProfileEvent,
  TransactionByHashDocument,
} from "../../../shared/api/data/types";
import TransferSummary from "../atoms/TransferSummary.svelte";
import { loadProfile } from "../../../shared/functions/loadProfile";

export let transactionHash: string;

let transfer: ProfileEvent;

onMount(async () => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const timeline = await apiClient.query({
    query: TransactionByHashDocument,
    variables: {
      safeAddress: $me.circlesAddress,
      transactionHash,
    },
  });

  if (timeline.errors) {
    throw new Error(
      `Couldn't load the transaction history for the following reasons: ${timeline.errors.join(
        "\n"
      )}`
    );
  }

  if (timeline.data.eventByTransactionHash.length > 0) {
    transfer = timeline.data.eventByTransactionHash[0];
  }

  console.log("transfer: ", transfer);
  console.log("loadProfile: ", await loadProfile(transfer.safe_address, $me));
});

// function openDetail(transfer: ProfileEvent) {
//   if (transfer.type == "crc_hub_transfer") {
//     const hubTransfer = <CrcHubTransfer>transfer.payload;
//     if (transfer.direction == "in") {
//       if (hubTransfer.from.startsWith("0x00000")) {
//         return;
//       }
//       push(`#/friends/${hubTransfer.from}`);
//     } else {
//       if (hubTransfer.to.startsWith("0x00000")) {
//         return;
//       }
//       push(`#/friends/${hubTransfer.to}`);
//     }
//   }
// }
</script>

{#if transfer}
  <!-- <TransferSummary transfer="{transfer}" /> -->
{/if}
