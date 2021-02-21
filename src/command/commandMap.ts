// 后续考虑对命令参数进行验证
import { drawCircle } from "./circle";
import { clean } from "./clean";

export type commandParser = (command: string) => string[];

// 设置天气
const setWeather: commandParser = (command) => ["weather " + command];
// 设置天气
const setTime: commandParser = (command) => [
  "time set " + command.split(" ")[0],
];

/**
 * 提供命令名与对应的处理方法
 */
const commandMap = new Map<string, commandParser>();
// 修改天气
commandMap.set("clear", setWeather);
commandMap.set("rain", setWeather);
commandMap.set("thunder", setWeather);
// 修改时间
commandMap.set("day", setTime);
commandMap.set("noon", setTime);
commandMap.set("night", setTime);
commandMap.set("midnight", setTime);
// 画圆
commandMap.set("circle", drawCircle);
// 清扫
commandMap.set("clean", clean);

/**
 * 拆分命令为命令组
 * @param command
 * @return string[]
 */
export const parseCommand = (command: string): string[] => {
  let arr = command.split(" ");
  if (commandMap.has(arr[0])) {
    return commandMap.get(arr[0])(command);
  }
  return [command];
};
