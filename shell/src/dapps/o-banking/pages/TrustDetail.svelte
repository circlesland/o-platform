<script lang="ts">
  import { onMount } from "svelte";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { transfer } from "../processes/transfer";
  import { setTrust } from "../processes/setTrust";
  import TrustDetailHeader from "../atoms/TrustDetailHeader.svelte";


  export let params: {
    trustPartner: string;
  };

  function execTransfer(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = transfer;
        ctx.childContext = {
          data: {
            recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }

  function execTrust(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 100,
            trustReceiver: recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }

  function execUntrust(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 0,
            trustReceiver: recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }
</script>

<TrustDetailHeader user={params.trustPartner} />
<div class="mx-4 -mt-6">
  <section class="justify-center mb-1 text-circlesdarkblue">
    <div
      class="flex flex-col bg-white shadow px-4 pb-6 w-full space-y-2 text-center"
    >
      <div class="avatar self-center -mt-16">
        <div class="w-32 h-32 rounded-full  mb-4">
          <img src="https://i.pravatar.cc/500?img=32" />
        </div>
      </div>
      <!-- <h2 class="card-title">Ernst Stavro Blofeld</h2> -->
      <small class="break-all">
        0x87asdgt9adsofz98ad6fs8as7odft9aszf98pasdzfasdg
      </small>
    </div>
  </section>

  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">TRUST</div>

      <div class="flex flex-col">
        <div class="text-left text-sm text-light mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline -mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span class="inline text-dark"> 100% mutual trust. </span>
        </div>
        <div class="text-left">
          <div>
            <div class="text-sm breadcrumbs">
              <ul>
                <li>
                  <a href="/#/banking/trusts/Name%201">Martin</a>
                </li>
                <li>
                  <a href="/#/banking/trusts/Name%201">Haral233</a>
                </li>
                <li><a href="/#/banking/trusts/Name%201">Djingis</a></li>
                <li>
                  <a href="/#/banking/trusts/Name%201">{params.trustPartner}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-4 h-4 mr-2 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            Remove trust
          </button>
        </div>
      </div>
    </div>
  </section>
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">TRANSFER</div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <button class="btn btn-block btn-primary">Send Money</button>
      </div>
    </div>
  </section>
</div>
