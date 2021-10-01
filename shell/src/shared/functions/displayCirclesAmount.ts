import Web3 from "web3";

export function displayCirclesAmount(amount) {
  return Number.parseFloat(Web3.utils.fromWei(amount, "ether")).toFixed(2);
}
