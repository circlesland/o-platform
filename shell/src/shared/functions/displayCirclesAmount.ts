import Web3 from "web3";
import dayjs from "dayjs";
import { BN } from "ethereumjs-util";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isLeapYear);

const now = dayjs().unix();
const oneYearInSeconds = 31557600; // This is 365,25 Days in seconds.
const oneDayInSeconds = 86400;
const day0Unix = dayjs("2020-10-15T00:00:00.000Z").unix();
const transactionDateUnix = dayjs("2024-10-16T00:00:00.000Z").unix();
const transactionDate = dayjs("2024-10-16T00:00:00.000Z");

const baseCirclesPerDayValue = 8;

const transactionDateCirclesAmount = 104.864;

// Functions
const circlesValue = (x: number) => x * 1.07;
const lerp = (x: BN, y: BN, a: BN) => x.mul(new BN("1").sub(a).add(y.mul(a)));

const yearsSinceDay0Unix = Math.floor(
  (transactionDateUnix - day0Unix) / oneYearInSeconds
);
const daysSinceDay0Unix = (transactionDateUnix - day0Unix) / oneDayInSeconds;
const dayInCurrentCycle = daysSinceDay0Unix / (yearsSinceDay0Unix * 365.25);

console.log(
  "OH WEI",
  Web3.utils.fromWei(dayInCurrentCycle.toString(), "ether")
);

function getBaseCirclesPerDayValue(yearsSince: number) {
  let circlesPerDayValue = baseCirclesPerDayValue;
  for (let index = 0; index < yearsSince; index++) {
    circlesPerDayValue = circlesValue(circlesPerDayValue);
    // console.log(`Per day year: ${index}`, circlesPerDayValue);
  }
  //   console.log("PERDAY: ", circlesPerDayValue);
  return circlesPerDayValue;
}

export function convertTimeCirclesToCircles(amount: BN, date: number = now) {
  const yearsSince = Math.floor((date - day0Unix) / oneYearInSeconds);
  const perDayValue = getBaseCirclesPerDayValue(yearsSince);

  return amount
    .div(new BN("24"))
    .mul(
      lerp(
        new BN(baseCirclesPerDayValue.toString()),
        new BN(perDayValue.toString()),
        new BN(dayInCurrentCycle.toString())
      )
    );
}

function convertCirclesToTimeCircles(amount: BN, date: number = now) {
  const yearsSince = Math.floor((date - day0Unix) / oneYearInSeconds);
  const perDayValue = getBaseCirclesPerDayValue(yearsSince);
  return amount
    .div(
      lerp(
        new BN(baseCirclesPerDayValue.toString()),
        new BN(perDayValue.toString()),
        new BN(dayInCurrentCycle.toString())
      )
    )
    .mul(new BN("24"));
}

export function displayCirclesAmount(
  amount: string,
  date: number = now,
  fixed: boolean
) {
  const dateTime = date ? dayjs(date).unix() : now;
  const amountInWei = new BN(amount);
  // return Number.parseFloat(Web3.utils.fromWei(amount, "ether")).toFixed(2);
  const value = convertCirclesToTimeCircles(amountInWei, dateTime);
  if (fixed) {
    return Number.parseFloat(Web3.utils.fromWei(value, "ether")).toFixed(2);
  } else {
    return Web3.utils.fromWei(value, "ether");
  }
}
