import {BN} from "ethereumjs-util";
import {SafeOps} from "./safeOps";

export interface SafeTransaction {
    to: string;
    value: BN;
    data: string;
    operation: SafeOps;
    safeTxGas?: BN;
    baseGas?: BN;
    gasToken: string;
    refundReceiver: string;
    nonce?: number;
}
