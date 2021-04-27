<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { transfer } from "../processes/transfer";
  import { setTrust } from "../processes/setTrust";
  import TrustDetailHeader from "../atoms/TrustDetailHeader.svelte";
  import { TrustObject } from "../data/circles/types";
  import { mySafe } from "../stores/safe";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {tryGetCurrentSafe} from "../init";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";
  import {ContextAction} from "@o-platform/o-events/dist/shell/contextAction";

  let trust: TrustObject;

  export let params: {
    trustPartner: String;
  };

  const contextActions = [{
    key: "setTrust",
    label: "Set Trust 123",
    event: (runtimeDapp: RuntimeDapp<any>) => {
      return new RunProcess<ShellProcessContext>(
        shellProcess,
        true,
        async (ctx) => {
          ctx.childProcessDefinition = setTrust;
          ctx.childContext = {
            data: {
              safeAddress: tryGetCurrentSafe().safeAddress,
              privateKey: localStorage.getItem("circlesKey"),
              trustReceiver: params.trustPartner
            }
          };
          return ctx;
        });
    }
  }];
  contextActions.forEach(o => window.o.publishEvent(new ContextAction(o)));

  $: {
    if ($mySafe.trustRelations && params.trustPartner) {
      trust = Object.values($mySafe.trustRelations.trusting).find(
        (o) => o.safeAddress == params.trustPartner
      );
      if (!trust) {
        trust = Object.values($mySafe.trustRelations.trustedBy).find(
          (o) => o.safeAddress == params.trustPartner
        );
      }
      if (!trust) {
        trust = <TrustObject>{
          limit: 0,
          safeAddress: params.trustPartner,
          profile: {
            displayName: "",
            avatarUrl: "",
          },
          lastBlock: 0,
          hide: true,
          firstBlock: 0,
        };
      }
    }
  }

  function execTransfer(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = transfer;
        ctx.childContext = {
          data: {
            recipientAddress,
          }
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
          }
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
          }
        };
        return ctx;
      })
    );
  }
</script>

<TrustDetailHeader
  user={trust.profile ? trust.profile : { displayName: trust.safeAddress }}
  safeAddress={trust.safeAddress}
/>
<div class="mx-4 -mt-6">
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
          <span class="inline text-dark"> {trust.limit} % mutual trust. </span>
        </div>
        <div class="text-left">
          <div>
            <div class="text-sm breadcrumbs">
              <ul>
                <li>
                  <a href="/#/banking/trusts/Name%201"
                    >{trust.profile
                      ? trust.profile.displayName
                      : trust.safeAddress}</a
                  >
                </li>
                <!--
                <li>
                  <a href="/#/banking/trusts/Name%201">Haral233</a>
                </li>
                <li><a href="/#/banking/trusts/Name%201">Djingis</a></li>
                <li>
                  <a href="/#/banking/trusts/Name%201">{params.trustPartner}</a>
                </li>-->
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
