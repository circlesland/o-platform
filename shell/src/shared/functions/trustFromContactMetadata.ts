import {Contact, ContactDirection, ContactPoint} from "../api/data/types";

export function trustFromContactMetadata(contact:Contact) {
  const trustMetadata: ContactPoint = contact.metadata.find(
    (p) => p.name === "CrcTrust"
  );
  let trustIn = 0;
  let trustOut = 0;

  if (trustMetadata) {
    trustMetadata.directions.forEach((d, i) => {
      if (d == ContactDirection.In) {
        trustIn = parseInt(trustMetadata.values[i]);
      } else if (d == ContactDirection.Out) {
        trustOut = parseInt(trustMetadata.values[i]);
      }
    });
  }
  return {trustIn, trustOut};
}