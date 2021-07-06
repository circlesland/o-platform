export function arraysEqual(array1:any[], array2:any[]) : boolean {
   return array1.length === array2.length
       && array1.every((value, index) => value === array2[index]);
}