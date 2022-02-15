export function logStack(message:string, args?:any) {
  const stack = new Error().stack.replace("Error", "");
  if (args) {
    console.log(message, args);
  } else {
    console.log(message + stack);
  }
}
export function log(message:string, args?:any) {
  if (args) {
    console.log(message, args);
  } else {
    console.log(message);
  }
}