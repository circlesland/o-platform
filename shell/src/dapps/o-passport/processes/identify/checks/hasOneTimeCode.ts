import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";

export type HasOneTimeCodeSpec = {
  id: string
  onYes: string
  onNo: string
};

export function hasOneTimeCode<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
  >(spec: HasOneTimeCodeSpec) {
  const hasProfileConfig: any = {
    // TODO: Fix need for 'any'
    id: spec.id,
    initial: "validate",
    states: {
      validate: {
        always:[{
          cond: (context) => !!context.data.oneTimeCode,
          target: spec.onYes
        }, {
          target: spec.onNo
        }]
      }
    }
  };

  return hasProfileConfig;
}
