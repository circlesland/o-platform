/*
 * displayCurrencies = { CRC, TIME_CRC, EURS }
 */
import Web3 from "web3";
import dayjs from "dayjs";
import { BN } from "ethereumjs-util";
import { me } from "./stores/me";

export class Currency {
  public static instance() {
    return this._instance;
  }
  private static _instance: Currency = new Currency();

  now: number;
  oneYearInSeconds: number;
  oneDayInSeconds: number;
  day0Unix: number;
  transactionDateUnix: number;
  yearsSinceDay0Unix: number;
  daysSinceDay0Unix: number;
  dayInCurrentCycle: number;
  baseCirclesPerDayValue: number;
  previousCirclesPerDayValue: number;
  circlesValue: (x: number) => number;
  lerp: (x: number, y: number, a: number) => number;

  constructor() {
    this.now = dayjs().unix();
    this.oneYearInSeconds = 31557600; // This is 365,25 Days in seconds.
    this.oneDayInSeconds = 86400;
    this.day0Unix = dayjs("2020-10-15T00:00:00.000Z").unix();
    this.transactionDateUnix = dayjs("2021-10-16T00:00:00.000Z").unix();

    this.yearsSinceDay0Unix =
      (this.transactionDateUnix - this.day0Unix) / this.oneYearInSeconds;
    this.daysSinceDay0Unix =
      (this.transactionDateUnix - this.day0Unix) / this.oneDayInSeconds;
    this.dayInCurrentCycle = Math.ceil(this.daysSinceDay0Unix % 365.25);

    this.baseCirclesPerDayValue = 8;
    this.previousCirclesPerDayValue = 8;

    this.circlesValue = (x: number) => x * 1.07;
    this.lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
  }

  private getBaseCirclesPerDayValue(yearsSince: number) {
    let circlesPerDayValue = this.baseCirclesPerDayValue;

    for (let index = 0; index < yearsSince; index++) {
      this.previousCirclesPerDayValue = circlesPerDayValue;
      circlesPerDayValue = this.circlesValue(circlesPerDayValue);
    }

    return circlesPerDayValue;
  }

  public static currencySymbol = { CRC: "c", TIME_CRC: "⦿", EURS: "€" };

  public convertEuroToCircles(amount: number, date: string) {
    return this.convertTimeCirclesToCircles(amount * 10, date);
  }

  public convertTimeCirclesToCircles(amount: number, date: string) {
    if (!amount) {
      throw new Error(window.i18n("shared.currency.errors.argumentMissing"));
    }

    const transactionDateUnix = date ? dayjs(date).unix() : this.now;
    const daysSinceDay0Unix =
      (transactionDateUnix - this.day0Unix) / this.oneDayInSeconds;
    const dayInCurrentCycle = Math.ceil(daysSinceDay0Unix % 365.25);
    const yearsSince =
      (transactionDateUnix - this.day0Unix) / this.oneYearInSeconds;
    const perDayValue = this.getBaseCirclesPerDayValue(yearsSince);

    return parseFloat(
      (
        (amount / 24) *
        this.lerp(
          this.previousCirclesPerDayValue,
          perDayValue,
          dayInCurrentCycle / 365.25
        )
      ).toFixed(12)
    );
  }

  public convertCirclesToTimeCircles(amount: number, date: string) {
    const transactionDateUnix = date ? dayjs(date).unix() : this.now;
    const daysSinceDay0Unix =
      (transactionDateUnix - this.day0Unix) / this.oneDayInSeconds;
    const dayInCurrentCycle = Math.ceil(daysSinceDay0Unix % 365.25);
    const yearsSince =
      (transactionDateUnix - this.day0Unix) / this.oneYearInSeconds;
    const perDayValue = this.getBaseCirclesPerDayValue(yearsSince);

    return (
      (amount /
        this.lerp(
          this.previousCirclesPerDayValue,
          perDayValue,
          dayInCurrentCycle / 365.25
        )) *
      24
    );
  }

  public displayAmount(
    amount: string,
    date: string,
    displayCurrency: any,
    from?: string,
    raw?: boolean
  ) {
    if (!amount) {
      throw new Error(window.i18n("shared.currency.errors.argumentMissing"));
    }
    if (!me) {
      throw new Error(window.i18n("shared.currency.errors.argumentMissing"));
    }
    //console.log("AMOUNT", amount);
    //console.log("displayCurrency", displayCurrency);

    const dateTime = date ? dayjs(date) : dayjs();
    let value: number;

    if (displayCurrency == "CRC") {
      value = Number.parseFloat(Web3.utils.fromWei(amount, "ether"));
    } else if (displayCurrency == "EURS") {
      if (from === "erc20") {
        value = Number.parseFloat(Web3.utils.fromWei(amount, "ether"));
      } else {
        value =
          this.convertCirclesToTimeCircles(
            Number.parseFloat(Web3.utils.fromWei(amount, "ether")),
            dateTime.toString()
          ) / 10;
      }
    } else if (displayCurrency == "TIME_CRC") {
      if (from === "erc20") {
        value = Number.parseFloat(Web3.utils.fromWei(amount, "ether")) * 10;
      } else {
        value = this.convertCirclesToTimeCircles(
          Number.parseFloat(Web3.utils.fromWei(amount, "ether")),
          dateTime.toString()
        );
      }
    }
    if (raw) {
      return value;
    } else {
      return value.toFixed(2);
    }
  }

  public displayCirclesAmount(
    amount: string,
    date: string,
    fixed: boolean,
    timeCircles: boolean = true
  ) {
    if (!amount) {
      throw new Error(window.i18n("shared.currency.errors.argumentMissing"));
    }
    const dateTime = date ? dayjs(date) : dayjs();
    let value: number;
    if (timeCircles) {
      value = this.convertCirclesToTimeCircles(
        Number.parseFloat(Web3.utils.fromWei(amount, "ether")),
        dateTime.toString()
      );
    } else {
      value = Number.parseFloat(Web3.utils.fromWei(amount, "ether"));
    }
    if (fixed) {
      return value.toFixed(2);
    } else {
      return value;
    }
  }
}
