import {BN} from "ethereumjs-util";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export interface CirclesTransaction extends PlatformEvent
{
  cached?: boolean,
  id: string,
  token: string,
  tokenOwner?: string,
  blockNo: number,
  timestamp?: number,
  direction: "in" | "out",
  subject: string,
  from: string,
  to: string,
  amount: BN,
}
