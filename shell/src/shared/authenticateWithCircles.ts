import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
import {shellProcess, ShellProcessContext} from "./processes/shellProcess";
import {authenticate} from "../dapps/o-auth/processes/authenticate";
import Error from "./atoms/Error.svelte";
import LoadingIndicator from "./atoms/LoadingIndicator.svelte";
import Success from "./atoms/Success.svelte";
import {Generate} from "@o-platform/o-utils/dist/generate";
import gql from "graphql-tag";
import {push} from "svelte-spa-router";

export async function authenticateWithCircles(appId: string, code?: string) {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query : gql`
      query hasValidSession {
        hasValidSession {
          success
        }
      }`,
      variables: {
      },
  });

  if (result.data.hasValidSession.success) {
    push("/dashboard");
    return;
  }

  const requestEvent = new RunProcess<ShellProcessContext>(
    shellProcess,
    true,
    async (ctx) => {
      ctx.childProcessDefinition = authenticate;
      ctx.childContext = {
        data: {
          appId: appId,
          code: code,
        },
        dirtyFlags: {},
        environment: {
          errorView: Error,
          progressView: LoadingIndicator,
          successView: Success,
        },
      };
      return ctx;
    }
  );

  (<any>requestEvent).id = Generate.randomHexString(8); // TODO: fix any
  return requestEvent;
  //window.o.publishEvent(requestEvent);
}