import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export type HasKeySpec = {
  id: string
  onYes: string
  onNo: string
};

export function hasKey<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
  >(spec: HasKeySpec) {
  const hasKeyConfig: any = {
    // TODO: Fix need for 'any'
    id: spec.id,
    initial: "validate",
    states: {
      validate: {
        always:[{
          cond: () => {
            const key = sessionStorage.getItem("circlesKey");
            if (!key)
              return false;

            try {
              const account = RpcGateway.get().eth.accounts.privateKeyToAccount(key);
              return !!account;
            } catch (e) {
              console.error(window.o.i18n("dapps.o-passport.processes.identify.checks.hasKey.error"))
              return false;
            }
          },
          target: spec.onYes
        }, {
          target: spec.onNo
        }]
      }
    }
  };

  return hasKeyConfig;
}
