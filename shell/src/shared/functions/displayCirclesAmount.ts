import Web3 from "web3";
import dayjs from "dayjs";
import {crcToTc, tcToCrc} from "@jaensen/timecircles";

export function convertTimeCirclesToCircles(amount: number, date: string) {
  return parseFloat(tcToCrc(date ? dayjs(date).toDate() : new Date(), amount).toFixed(12));
}

export function displayCirclesAmount(
  amount: string,
  date: string,
  fixed: boolean,
  timeCircles: boolean = true
) {
  let value: number;
  if (timeCircles) {
    value = parseFloat(crcToTc(date ? dayjs(date).toDate() : new Date(), Number.parseFloat(Web3.utils.fromWei(amount, "ether"))).toFixed(12));
  } else {
    value = Number.parseFloat(Web3.utils.fromWei(amount, "ether"));
  }
  if (fixed) {
    return value.toFixed(2);
  } else {
    return value;
  }
}
