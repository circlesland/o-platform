<script lang="ts">
  import Web3 from "web3";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import {
    showProfile,
    ShowProfileContextData,
  } from "../processes/showProfile";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { Token } from "../data/circles/types";

  export let token: Token;
  export let label: String;
  export let colorClass: String;

  let pictureUrl: string;
  let displayName: string;
  let classes: String;

  $: {
    displayName = token.ownerProfile
      ? token.ownerProfile.displayName
      : token.tokenOwner;

    pictureUrl = token.ownerProfile ? token.ownerProfile.avatarUrl : undefined;
    if (!pictureUrl) {
      pictureUrl = AvataarGenerator.generate(token.tokenOwner);
    }

    console.log("TOKEN: ", token);
  }

  function loadDetailPage(path) {
    console.log(path);

    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = showProfile;
        ctx.childContext = {
          data: <ShowProfileContextData>{
            id: path,
          },
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
    //push("#/banking/trusts/" + path);
  }

</script>

<section class="flex items-center justify-center mb-2  ">
  <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
    <div
      class="{colorClass
        ? colorClass
        : 'text-light'} text-xs  font-bold text-left"
    >
      {label ? label : ""}
    </div>
    <div class="flex items-center bg-white w-full space-x-2 sm:space-x-6">
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src={pictureUrl} alt={displayName} />
          </div>
        </div>
      </div>

      <div class="text-left flex-grow truncate relative">
        <div
          class="max-w-full truncateThis "
          class:cursor-pointer={displayName != "You"}
          on:click={() =>
            displayName == "You" ? false : loadDetailPage(token.tokenOwner)}
        >
          <h2 class="text-2xl sm:text-3xl truncate ">
            {displayName}
          </h2>
        </div>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionpositive text-2xl sm:text-3xl">
          <span>
            {Number.parseFloat(
              Web3.utils.fromWei(token.balance ? token.balance : "0", "ether")
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media (max-width: 496px) {
    .transactionCardName {
      max-width: 200px;
    }
  }

</style>
