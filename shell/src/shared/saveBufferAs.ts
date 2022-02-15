export function saveBufferAs(data:Buffer, fileName:string) {
  let file = new File([data], fileName, {type: "application/pdf"});
  let exportUrl = URL.createObjectURL(file);
  window.location.assign(exportUrl);
  URL.revokeObjectURL(exportUrl);
}