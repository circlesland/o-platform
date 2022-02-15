import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {IdentifyContext} from "../identify2";

export type HasSafeSpec = {
  id: string
  onYes: string
  onNo: string
};

export function hasSafe<
  TContext extends IdentifyContext,
  TEvent extends PlatformEvent
  >(spec: HasSafeSpec) {
  const hasKeyConfig: any = {
    // TODO: Fix need for 'any'
    id: spec.id,
    initial: "validate",
    states: {
      validate: {
        always:[{
          cond: (context:IdentifyContext) =>  !!context.data.profile.circlesAddress,
          target: spec.onYes
        }, {
          target: spec.onNo
        }]
      }
    }
  };

  return hasKeyConfig;
}
