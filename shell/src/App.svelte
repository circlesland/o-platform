<script lang="ts">
import "./shared/css/tailwind.css";

import Router from "svelte-spa-router";
import { SvelteToast } from "./shared/molecules/Toast";
import DappFrame from "src/shared/molecules/DappFrame.svelte";
import NotFound from "src/shared/pages/NotFound.svelte";
import { interpret } from "xstate";
import { initMachine } from "./dapps/o-onboarding/processes/init";
import { ubiMachine } from "./shared/ubiTimer2";
import { InitContext } from "./dapps/o-onboarding/processes/initContext";
import { LogoutDocument } from "./shared/api/data/types";
import { me } from "./shared/stores/me";

let ubiMachineInterpreter: any;
const v = 1;
const currentLocalStorageSchemaVersion = localStorage.getItem("localStorageSchemaVersion");
if (!currentLocalStorageSchemaVersion || parseInt(currentLocalStorageSchemaVersion) < v) {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("localStorageSchemaVersion", v.toString());

  window.o.apiClient.client.subscribeToResult().then((apiClient) => {
    apiClient.mutate({
      mutation: LogoutDocument,
    });
  });
}

window.runInitMachine = (context?: InitContext) => {
  if (context) {
    interpret(initMachine.withContext(context)).start();
  } else {
    interpret(initMachine).start();
  }
};
let _routes = {
  "/:dappId?/:1?/:2?/:3?/:4?/:5?/:6?": DappFrame,
  "*": NotFound,
};
</script>

<SvelteToast />

<Router
  routes="{_routes}"
  on:routeLoaded="{() => {
    if (!ubiMachineInterpreter && $me && $me.circlesAddress) {
      ubiMachineInterpreter = interpret(ubiMachine)
        .onEvent((event) => {
          console.log('UBI machine event:', event);
        })
        .onTransition((state) => {
          console.log('UBI machine transition:', state.value);
        })
        .start();
    }
  }}" />
