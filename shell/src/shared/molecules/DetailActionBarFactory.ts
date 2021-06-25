import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
import { shellProcess, ShellProcessContext } from "../processes/shellProcess";

function execTransfer(profile, safeAddress, isMe, transfer) {
  if (!profile || !safeAddress || isMe || !transfer) return;

  window.o.publishEvent(
    new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
      ctx.childProcessDefinition = transfer;
      ctx.childContext = {
        data: {
          safeAddress: safeAddress,
          recipientAddress: profile.safeAddress,
          recipientProfileId: profile.id,
        },
      };
      return ctx;
    })
  );
}

function executeFunctionByName(functionName, context, argumentsa) {
  var args = Array.prototype.slice.call(argumentsa, 2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}

export const DetailActionFactory = (
  action: any,
  props: [],
  icon: string,
  title: string
) => {
  const sayHello = () => {
    console.log("hello Action! ", title);
  };
  const getProps = () => {
    console.log("hello Props! ", props);
  };
  const executeAction = () => {
    console.log("I am executing this now", action);
    executeFunctionByName(action, window, props);
  };
  return { action, props, icon, title, sayHello, getProps, executeAction };
};
