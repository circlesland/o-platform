<script lang="ts">
  import { onMount } from "svelte";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";

  export let params: {
    from: string;
    to: string;
    blockNo?: string;
  };
</script>

<BankingDetailHeader amount={params.blockNo} type={"positive"} />
<div class="mx-4 -mt-6">
  <section class="justify-center mb-1 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">FROM</div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-center">
          <div class="avatar">
            <div class="rounded-full w-10 h-10 sm:w-10 sm:h-10">
              <img src="/images/common/circles.png" />
            </div>
          </div>
        </div>

        <div class="text-left">
          <div>
            <a href="/#/banking/trusts/Samuel">
              <h2 class="inline-block text-2xl sm:text-3xl font-bold">
                <!-- {params.from} -->
                Samuel
              </h2>
            </a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 inline-block -mt-3 text-circleslightblue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <div>
            <small class="text-circleslightblue"
              >0x0908379w384739487987as8790</small
            >
          </div>
        </div>
      </div>
    </div>
  </section>

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
