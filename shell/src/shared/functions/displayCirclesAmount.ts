import Web3 from "web3";
import dayjs from "dayjs";
import { BN } from "ethereumjs-util";

const now = dayjs().unix();
const oneYearInSeconds = 31557600; // This is 365,25 Days in seconds.
const oneDayInSeconds = 86400;
const day0Unix = dayjs("2020-10-15T00:00:00.000Z").unix();
const transactionDateUnix = dayjs("2021-10-16T00:00:00.000Z").unix();

const yearsSinceDay0Unix = (transactionDateUnix - day0Unix) / oneYearInSeconds;
const daysSinceDay0Unix = (transactionDateUnix - day0Unix) / oneDayInSeconds;
const dayInCurrentCycle = Math.ceil(daysSinceDay0Unix % 365.25);

// const scale = (x: number) => new BN((x * 1000000000000000).toString());
// const unscale = (x: BN) => x.div(new BN("1000000000000000"));
// const scaleAmt = new BN(1000000000000000);

const baseCirclesPerDayValue = 8;
let previousCirclesPerDayValue = 8;

const circlesValue = (x: number) => x * 1.07;
const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

function getBaseCirclesPerDayValue(yearsSince: number) {
  let circlesPerDayValue = baseCirclesPerDayValue;
  for (let index = 0; index < yearsSince; index++) {
    previousCirclesPerDayValue = circlesPerDayValue;
    circlesPerDayValue = circlesValue(circlesPerDayValue);
  }
  return circlesPerDayValue;
}

export function convertTimeCirclesToCircles(amount: number, date: string) {
  const transactionDateUnix = date ? dayjs(date).unix() : now;
  const daysSinceDay0Unix = (transactionDateUnix - day0Unix) / oneDayInSeconds;
  const dayInCurrentCycle = Math.ceil(daysSinceDay0Unix % 365.25);
  const yearsSince = (transactionDateUnix - day0Unix) / oneYearInSeconds;
  const perDayValue = getBaseCirclesPerDayValue(yearsSince);
  // console.log("YEARS: ", yearsSinceDay0Unix);
  // console.log("\nAmount: ", amount);
  // console.log("\nDay in Current Cycle: ", dayInCurrentCycle);
  // console.log("\nActual Day Value: ", perDayValue);
  // console.log("\nPrevious Day Value: ", previousCirclesPerDayValue);

  return (
    (amount / 24) *
    lerp(previousCirclesPerDayValue, perDayValue, dayInCurrentCycle / 365.25)
  );
}

export function convertCirclesToTimeCircles(amount: number, date: string) {
  const transactionDateUnix = date ? dayjs(date).unix() : now;
  const daysSinceDay0Unix = (transactionDateUnix - day0Unix) / oneDayInSeconds;
  const dayInCurrentCycle = Math.ceil(daysSinceDay0Unix % 365.25);
  const yearsSince = (transactionDateUnix - day0Unix) / oneYearInSeconds;
  const perDayValue = getBaseCirclesPerDayValue(yearsSince);
  // console.log("YEARS: ", yearsSinceDay0Unix);
  // console.log("yearsSince: ", yearsSince);
  // console.log("\nAmount: ", amount);

  // console.log("\nDay in Current Cycle: ", dayInCurrentCycle);
  // console.log("\nActual Day Value: ", perDayValue);
  // console.log("\nPrevious Day Value: ", previousCirclesPerDayValue);
  // const transactionDateUnix = dayjs("2021-10-16T00:00:00.000Z").unix();
  return (
    (amount /
      lerp(
        previousCirclesPerDayValue,
        perDayValue,
        dayInCurrentCycle / 365.25
      )) *
    24
  );
}

export function displayCirclesAmount(
  amount: string,
  date: string,
  fixed: boolean
) {
  const dateTime = date ? dayjs(date).unix() : now;
  const amountInWei = new BN(amount);
  // return Number.parseFloat(Web3.utils.fromWei(amount, "ether")).toFixed(2);
  const value = convertCirclesToTimeCircles(
    Number.parseFloat(amount),
    dateTime.toString()
  );
  if (fixed) {
    return value.toFixed(2);
  } else {
    return value;
  }
}
