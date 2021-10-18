import {LastUbiTransactionDocument} from "./api/data/types";
import {getUBIService} from "../dapps/o-banking/processes/getUBIService";
import {me} from "./stores/me";

export class UbiTimer {

  private _lastRetrievalAt:Date|null;
  private _lastTryAt:Date|null;
  private _initRoundsLeft:number = 2;

  get isInitialized() : boolean {
    return this._initRoundsLeft < 1;
  }

  armUbiTimer() {
    const dueIn = this.getDueInMilliseconds();
    const at = new Date(Date.now() + dueIn);
    console.log("Next UBI at " + at.toISOString());

    setTimeout(async () => {
      console.error("Requesting UBI ...");

      let safeAddress = "";
      const unsub = me.subscribe($me => {
        safeAddress = $me.circlesAddress;
      });
      unsub();

      await getUBIService({
        data: {
          safeAddress: safeAddress,
          privateKey: sessionStorage.getItem("circlesKey")
        }
      });

      // restart the thing
      await this.init();
    }, dueIn);
  }

  async init() {
    this._initRoundsLeft--;
    if (this._initRoundsLeft <= 0) {
      this.armUbiTimer();
      return;
    }

    const lastUbi = await this.getLastRetrievalDateOrNull();
    if (!lastUbi) {
      setTimeout(async () => {
        await this.init();
      }, 1000 * 60);
      return;
    } else {
      this._lastRetrievalAt = lastUbi;
      this._initRoundsLeft = 0;
      this.armUbiTimer();
    }
  }

  getDueInMilliseconds() : number {
    if (!this.isInitialized) {
      throw new Error(`!this.isInitialized`);
    }
    const now = Date.now();
    if (this._lastTryAt && (now - this._lastTryAt.getTime()) < 60000) {
      // Last try is less than 60 sec ago. Tries should be at least 60 sec apart from each
      // other to let the indexer some time to index the transaction
      return 60000 - (now - this._lastTryAt.getTime());
    }
    if (!this._lastRetrievalAt) {
      this._lastTryAt = new Date();
      return 0; // Do it now
    }

    const nextRetrievalAt = this._lastRetrievalAt.getTime() + 24 * 60 * 60 * 1000;
    return now - nextRetrievalAt;
  }

  private async getLastRetrievalDateOrNull() : Promise<Date|null> {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: LastUbiTransactionDocument
    });
    if ((result.errors && result.errors.length) || !result.data.lastUBITransaction) {
      return null;
    }
    return new Date(Date.parse(result.data.lastUBITransaction));
  }
}