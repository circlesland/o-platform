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

/*
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
  console.log("YEARS: ", yearsSinceDay0Unix);
  console.log("\nAmount: ", amount);
  console.log("\nDay in Current Cycle: ", dayInCurrentCycle);
  console.log("\nActual Day Value: ", perDayValue);
  console.log("\nPrevious Day Value: ", previousCirclesPerDayValue);
  const result =
    (amount / 24) *
    lerp(previousCirclesPerDayValue, perDayValue, dayInCurrentCycle / 365.25);
  console.log("LERPed Amount: ", result);
  console.log("AND BACK: ", convertCirclesToTimeCircles(result, date));
  console.log(
    "AND BACK Converted: ",
    convertCirclesToTimeCircles(result, date)
  );
  return (
    (amount / 24) *
    lerp(previousCirclesPerDayValue, perDayValue, dayInCurrentCycle / 365.25)
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
  date: string,
  fixed: boolean,
  timeCircles: boolean = true
) {
  const dateTime = date ? dayjs(date) : dayjs();
  let value: number;
  if (timeCircles) {
    value = convertCirclesToTimeCircles(
      Number.parseFloat(Web3.utils.fromWei(amount, "ether")),
      dateTime.toString()
    );
  } else {
    value = Number.parseFloat(Web3.utils.fromWei(amount, "ether"));
  }
  if (fixed) {
    return Number.parseFloat(Web3.utils.fromWei(value, "ether")).toFixed(2);
  } else {
    return Web3.utils.fromWei(value, "ether");
  }
}


*/
export function displayCirclesAmount(
  amount: string,
  date: number = now,
  fixed: boolean
) {
  return new BN("0");
}
function convertCirclesToTimeCircles(amount: BN, date: number = now) {
  return new BN("0");
}
export function convertTimeCirclesToCircles(amount: BN, date: number = now) {
  return new BN("0");
}