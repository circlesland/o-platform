export function displayableName(firstName: string, lastName?: string) {
  return `${firstName} ${lastName ? lastName : ""}`;
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
