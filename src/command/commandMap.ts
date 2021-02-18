// 后续考虑对命令参数进行验证
// 设置天气
let setWeather = (command: string): string[] => ["weather " + command];
// 设置天气
let setTime = (command: string): string[] => ["time set " + command.split(" ")[0]];
// 不做任何处理的空白实现
let defaultFunc = (command: string): string[] => [command];

/**
 * 提供命令名与对应的处理方法
 */
const commandMap = new Map();
// 修改天气
commandMap.set("clear", setWeather);
commandMap.set("rain", setWeather);
commandMap.set("thunder", setWeather);
// 修改时间
commandMap.set("day", setTime);
commandMap.set("noon", setTime);
commandMap.set("night", setTime);
commandMap.set("midnight", setTime);
// 不处理
commandMap.set("fill", defaultFunc);
commandMap.set("clone", defaultFunc);
commandMap.set("setblock", defaultFunc);

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
  return [];
}