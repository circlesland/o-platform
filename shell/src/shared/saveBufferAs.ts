export function saveBufferAs(data: Buffer, fileName: string) {
  let file = new File([data], fileName, { type: "application/pdf" });
  let exportUrl = URL.createObjectURL(file);
  let file_path = exportUrl;
  let a: HTMLAnchorElement = document.createElement("A") as HTMLAnchorElement;
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf("/") + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(exportUrl);
}
