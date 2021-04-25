import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Safe} from "./circles/types";

export async function augmentSafeWithTime(safe: Safe) {
  let avgBlockTime: number = 5.2;
  let sampleRate: number = 20;
  let lastTimestamp: number = null;
  let lastTimestampBlockNo: number = null;

  let allTransactions = Object.values(safe.transfers.rows);

  for (let transactionIndex = 0; transactionIndex < allTransactions.length; transactionIndex++) {
    const transaction = allTransactions[transactionIndex];

    try {
      if (!lastTimestamp || transactionIndex % sampleRate == 0) {
        if (transaction.time) {
          lastTimestamp = transaction.time;
          lastTimestampBlockNo = transaction.firstBlock;
        } else {
          const block = await RpcGateway.get().eth.getBlock(transaction.firstBlock);
          if (typeof block.timestamp === "string") {
            lastTimestamp = parseInt(block.timestamp);
          } else {
            lastTimestamp = block.timestamp;
          }
          lastTimestampBlockNo = transaction.firstBlock;
        }
      }

      const passedBlocksSinceLastTimestampBlockNo = lastTimestampBlockNo - transaction.firstBlock;
      const passedSecondsSinceLastTimestamp = passedBlocksSinceLastTimestampBlockNo * avgBlockTime;
      const currentBlockTimestamp = lastTimestamp - passedSecondsSinceLastTimestamp;

      if (!transaction.time) {
        transaction.time = parseInt(currentBlockTimestamp.toFixed());
      }
    } catch (e) {
      console.warn("Couldn't determine the time of block " + transaction.firstBlock + ": " + e.toString());
    }
  }
}