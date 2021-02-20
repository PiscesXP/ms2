/**
 * 一键清理 “clean snow <x y z> [n=10] [h=5]”
 * @param command
 */
export const clean = (command: string): string[] => {
  let arr = command.split(" ");
  if (arr.length >= 5) {
    let target = arr[1];
    let x = Number(arr[2]);
    let y = Number(arr[3]);
    let z = Number(arr[4]);
    let n = Number(arr[5] ?? "10");
    let h = Number(arr[6] ?? "5");
    if (target === "snow") {
      return [`fill ${x + n} ${y + h} ${z + n} ${x - n} ${y - h} ${z - n} air 0 replace snow_layer`];
    } else if (target === "water") {
      return [`fill ${x + n} ${y + h} ${z + n} ${x - n} ${y - h} ${z - n} air 0 replace water`];
    }
  }
  return [];
}