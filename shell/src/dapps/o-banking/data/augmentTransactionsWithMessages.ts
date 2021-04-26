import {Safe} from "./circles/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export async function augmentSafeWithProfiles(safe:Safe) {
/*
  fetch("https://api.circles.garden/api/transfers/0xa9ae71e783b858105fab3fcd61e4f624df19218b68a271c8743685db5c326ffc/", {
    "body": "{\"address\":\"0x9B74661e83F6696AdF872576f886Dc5Eb569B0bD\",\"signature\":\"0x05236302793a245794c1d6f2a3af3f510ee07aeb3ef0369d93e85d7d9613994c1d03aacaf63bbf4618334d80d50808186a02ad7ab82d070f40c009f011ca21ba1b\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  });

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
 */
  return safe;
}