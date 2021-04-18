<script lang="ts">
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import gql from "graphql-tag";

  let devHome = true;
  let devDash = false;
  let runningProcess: Process;

  export let params:{
    jwt?:string
  } = {};

  onMount(async () => {
    // <!-- TODO: Check if the passport creation was successful -->

    console.log("Hello from ExchangeToken")
    if (params.jwt)
    {
      const client = await window.o.apiClient.client.subscribeToResult();
      const hasSessionResult = await client.query({
        query: gql`
                query hasValidSession {
                  hasValidSession {success}
                }
              `,
        variables: {
        }
      });

      if (hasSessionResult.data && hasSessionResult.data.success) {
        push("/dashboard");
        return;
      }

      // TODO: Find a better way to pass the url parameter as Authorization header
      window.o.authorization = params.jwt;

      await client.mutate({
        mutation: gql`
                mutation exchangeToken {
                  exchangeToken {
                    success
                    errorMessage
                  }
                }
              `,
        variables: {
        }
      });

      push("/passport/new-passport");
      return;
    }

    push("/");
  });

</script>
<div class="grid grid-cols-1 p-2">
  <div class="flex h-screen flex-wrap content-end">
    <div class="m-auto h-auto grid">
      <img
        class="inline m-auto w-12 h-12 -mb-6 z-30"
        src="/images/common/circles.png"
        alt="circles.land"
      />
      <div class="card shadow bg-white z-0">
        Please wait. We're logging you in.
      </div>
    </div>
  </div>
</div>

<div class="font-primary" />
