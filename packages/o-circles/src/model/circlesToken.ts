import {BN} from "ethereumjs-util";

export interface CirclesToken
{
    balance?: BN;
    noTransactionsUntilBlockNo: number;
    readonly createdInBlockNo: number;
    readonly tokenAddress: string;
    readonly tokenOwner: string;
}
