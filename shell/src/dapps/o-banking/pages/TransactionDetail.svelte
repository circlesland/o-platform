<script lang="ts">
  import TokensHeader from "../atoms/TokensHeader.svelte";
  import { Transfer } from "../data/circles/queries";
  import { mySafe } from "../stores/safe";
  import TransactionCard from "../atoms/TransactionCard.svelte";

  export let params: {
    _id: string;
  };

  let transfer: Transfer;
  let pictureUrl: string;
  let displayName: String;
  let classes: String;

  $: {
    transfer = $mySafe.transfers.rows.find((o) => o._id == params._id);
  }

  $: {
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
  }
</script>

<TokensHeader amount={params._id} type={"positive"} />
{#if transfer}
  <pre>{JSON.stringify(transfer, null, 2)}</pre>
  <div class="mx-4 -mt-6">
    {#if transfer.direction === "in"}
      <TransactionCard {transfer} message="WURST" />
    {:else}
      <TransactionCard {transfer} message="Käse" />
    {/if}

    <section class="justify-center mb-2 text-circlesdarkblue">
      <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
        <div class="text-circleslightblue text-sm font-bold">TRUST</div>

        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <div class="text-left">
            <div>
              <div class="text-sm breadcrumbs">
                <ul>
                  <li>
                    <a href="/#/banking/trusts/Martin">Martin</a>
                  </li>
                  <li>
                    <a href="/#/banking/trusts/Harald233">Harald233</a>
                  </li>
                  <li><a href="/#/banking/trusts/Djingis">Djingis</a></li>
                  <li><a href="/#/banking/trusts/Samuel">Samuel</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
{/if}
