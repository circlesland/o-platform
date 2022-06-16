/*
 * displayCurrencies = { CRC, TIME_CRC, EURS }
 */
import Web3 from "web3";
import dayjs from "dayjs";
import { me } from "./stores/me";
import {crcToTc, tcToCrc} from "@jaensen/timecircles";

export class Currency {
  public static instance() {
    return this._instance;
  }
  private static _instance: Currency = new Currency();

  public static currencySymbol = { CRC: "c", TIME_CRC: "⦿", EURS: "€" };

  public convertEuroToCircles(amount: number, date?: string) {
    return this.convertTimeCirclesToCircles(amount * 10, date);
  }

  public convertTimeCirclesToCircles(amount: number, date?: string) {
    return parseFloat(tcToCrc(date ? dayjs(date).toDate() : new Date(), amount).toFixed(12));
  }

  public convertCirclesToTimeCircles(amount: number, date: string) {
    return parseFloat(crcToTc(date ? dayjs(date).toDate() : new Date(), amount).toFixed(12));
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
