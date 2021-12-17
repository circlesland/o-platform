export function displayableName(firstName: string, lastName?: string) {
  return `${firstName} ${lastName ? lastName : ""}`;
}
