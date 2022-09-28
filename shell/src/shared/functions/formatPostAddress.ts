import type { PostAddress } from "../api/data/types";

export default function formatShippingAddress(address?: PostAddress, multiline: Boolean = false) {
  console.log("adad", address);
  if (!address) return "";
  let str = "";
  if (address.name) {
    str += address.name + (multiline ? "<br/>" : ", ");
  }
  str += address.street + " ";
  str += address.house + (multiline ? "<br/>" : ", ");
  str += address.zip + " ";
  str += address.city + "";
  str += address.notificationEmail ? "<br/>" + address.notificationEmail : "";
  return str;
}
