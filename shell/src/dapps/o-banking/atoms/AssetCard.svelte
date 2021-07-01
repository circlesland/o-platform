<script lang="ts">
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "../../../shared/processes/shellProcess";
  import {showProfile, ShowProfileContextData} from "../processes/showProfile";
  import {showAssetDetail} from "../processes/showAssetDetail";
  import {Generate} from "@o-platform/o-utils/dist/generate";

  export let symbol: string;
  export let title: string;
  export let balance: string;
  export let variety: number;

  let pictureUrl: string;

  $: {
    pictureUrl = symbol;
  }

  function loadDetailPage() {
    const requestEvent = new RunProcess<ShellProcessContext>(
            shellProcess,
            true,
            async (ctx) => {
              showProfile
              ctx.childProcessDefinition = showAssetDetail;
              ctx.childContext = {
                data: <ShowProfileContextData>{
                  symbol,
                },
              };
              return ctx;
            }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }

</script>

<section
  class="flex items-center justify-center mb-2 "
  on:click={() => loadDetailPage()}
>
  <div class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow">
    <div class="flex items-center w-full space-x-2 bg-white sm:space-x-6">
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
            <img src="/logos/{symbol}.png" alt={symbol} class="w-12 h-12" />
          </div>
        </div>
      </div>

      <div class="relative flex-grow text-left truncate">
        <div class="max-w-full cursor-pointer truncateThis">
          <h2 class="text-2xl truncate sm:text-3xl ">
            {title}
            {variety > 1 ? " (" + variety + ")" : ""}
          </h2>
        </div>
      </div>

      <div class="flex flex-col flex-1 justify-items-end">
        <div class="self-end text-2xl text-primary sm:text-3xl">
          <span>
            {Number.parseFloat(balance).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
