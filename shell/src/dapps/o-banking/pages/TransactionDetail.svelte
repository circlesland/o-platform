<script lang="ts">
  import Time from "svelte-time";
  import { mySafe } from "../stores/safe";

  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { Transfer } from "../data/circles/types";

  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import PaymentPath from "../../../shared/molecules/PaymentPath.svelte";
  import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";

  export let _id: string;

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let transfer: Transfer;
  let pictureUrl: string;
  let displayName: string;
  let displayableFromName: string;
  let classes: string;
  let message: String;
  let amountInWei: string;
  let otherSafeAddress: string;
  let path: any;
  let transactionId: string;

  $: {
    transactionId = _id;

    transfer = $mySafe.transfers.rows.find(o => o._id == transactionId);

    if (transfer) {
      displayableFromName = transfer.fromProfile
        ? transfer.fromProfile.displayName
        : transfer.from;

      displayName =
        transfer.direction === "in"
          ? transfer.fromProfile
            ? transfer.fromProfile.displayName
            : transfer.from
          : transfer.toProfile
          ? transfer.toProfile.displayName
          : transfer.to;

      pictureUrl =
        transfer.direction === "in"
          ? transfer.fromProfile
            ? transfer.fromProfile.avatarUrl
            : undefined
          : transfer.toProfile
          ? transfer.toProfile.avatarUrl
          : undefined;

      classes =
        transfer.direction === "in"
          ? "transactionpositive"
          : "transactionnegative";

      displayableFromName =
        displayableFromName === "0x0000000000000000000000000000000000000000"
          ? "CirclesLand"
          : displayableFromName;

      const m = transfer.tags
        ? transfer.tags.find(o => o.typeId === "o-banking:transfer:message:1")
        : undefined;
      const m2 = m ? m.value : "";
      message =
        displayableFromName === "CirclesLand" ? "Universal basic income" : m2;

      const p = transfer.tags
        ? transfer.tags.find(
            o => o.typeId === "o-banking:transfer:transitivePath:1"
          )
        : undefined;
      const p2 = p ? JSON.parse(p.value) : undefined;
      path = p2;

      amountInWei = RpcGateway.get().utils.fromWei(transfer.amount, "ether");

      otherSafeAddress =
        transfer.direction === "in" ? transfer.from : transfer.to;

      if (!pictureUrl) {
        pictureUrl = AvataarGenerator.generate(otherSafeAddress);
      }
    }
  }

  function openDetail(id: string) {
    if (id.startsWith("0x000")) {
      return;
    }

    push(`#/friends/${id}`);
  }
</script>

<BankingDetailHeader
  {runtimeDapp}
  {routable}
  amount="{transfer ? transfer.amount : 0}"
  {classes} />
<div class="px-6 pb-6">
  {#if transfer}
    <section class="flex items-center justify-center pt-10 pb-2 text-dark">
      <div class="flex flex-col w-full space-y-2 ">
        <div class="flex flex-row justify-center w-full space-x-2 sm:space-x-6">
          <div
            class="flex flex-col cursor-pointer"
            on:click="{() => openDetail(transfer.from)}">
            <div class="avatar">
              <div class="w-24 h-24 m-auto rounded-full">
                <img
                  alt="{displayableFromName}"
                  src="{transfer.fromProfile && transfer.fromProfile.avatarUrl ? transfer.fromProfile.avatarUrl : transfer.from.startsWith('0x000') ? '/images/common/circles.png' : pictureUrl}" />
              </div>
            </div>
            <div class="block mt-2 text-center">{displayableFromName}</div>
          </div>

          <div class="self-center text-xl text-dark-lightest">
            <Icons icon="rightarrow" />
          </div>
          <div
            class="flex flex-col cursor-pointer"
            on:click="{() => openDetail(transfer.to)}">
            <div class="avatar">
              <div class="w-24 h-24 m-auto rounded-full">
                <img
                  alt="{transfer.toProfile ? transfer.toProfile.displayName : transfer.to}"
                  src="{transfer.toProfile && transfer.toProfile.avatarUrl ? transfer.toProfile.avatarUrl : pictureUrl}" />
              </div>
            </div>
            <div class="block mt-2 text-center">
              {transfer.toProfile ? transfer.toProfile.displayName : transfer.to}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="justify-center mt-4 mb-2">
      <div class="flex flex-col w-full space-y-1">
        <div class="text-left text-2xs text-dark-lightest">Message</div>

        <div class="flex items-center w-full ">
          <div class="text-2xl leading-tight text-left font-heading">
            {message ? message : 'No Message'}
          </div>
        </div>
      </div>
    </section>

    <section class="justify-center mt-4 mb-2">
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Amount</div>

        <div class="flex items-center w-full">
          <div class="text-left ">
            {amountInWei} {amountInWei > 1 ? ' Cirlces' : ' Circle'}
          </div>
        </div>
      </div>
    </section>

    <section class="justify-center mt-4 mb-2">
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Date</div>

        <div class="flex items-center w-full">
          <div class="text-left ">
            <Time
              timestamp="{new Date(transfer.time * 1000)}"
              format="D. MMMM YYYY HH:mm" />
          </div>
        </div>
      </div>
    </section>

    <section class="justify-center mt-4 mb-2">
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">From</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">
            {transfer.fromProfile ? `${transfer.from}` : ''}
          </div>
        </div>
      </div>
    </section>

    <section class="justify-center mt-4 mb-2">
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">To</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">
            {transfer.toProfile ? `${transfer.to}` : ''}
          </div>
        </div>
      </div>
    </section>

    <section class="justify-center mt-4 mb-2">
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Block</div>

        <div class="flex items-center w-full">
          <div class="text-left break-all">{transfer.firstBlock}</div>
        </div>
      </div>
    </section>

    {#if transfer.transactionHash}
      <section class="justify-center mt-4 mb-2">
        <div class="flex flex-col w-full space-y-1">
          <div class="mb-1 text-left text-2xs text-dark-lightest">
            Transaction Hash
          </div>

          <div class="flex items-center w-full text-primarydark">
            <div class="text-left break-all">
              {transfer.transactionHash ? transfer.transactionHash : ''}
            </div>
          </div>
        </div>
      </section>
    {/if}

    {#if false}
      <section class="justify-center mt-4 mb-2">
        <div class="flex flex-col w-full space-y-1">
          <div class="mb-1 text-left text-2xs text-dark-lightest">
            Payment path
          </div>
          <CirclesTransferGraph transfers="{path.transfers}" />
        </div>
      </section>
    {/if}
  {/if}
</div>
