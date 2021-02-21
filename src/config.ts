import { Command } from "commander";

const program = new Command();

interface OptionTypes {
  minecraft: string;
  executable: string;
  levelName: string;
  port: number;
  token: string;
}

const defaultValues: OptionTypes = {
  executable: "./bedrock_server",
  port: 23333,
  token: "yourtoken",
  levelName: "Bedrock level",
  minecraft: "C:/bin/bedrock-server-1.16.201.03",
};

program
  .version("1.0.0")
  .description("Backend server for Minecraft Server Management System.")

  //mc服务端根目录
  .option(
    "-m, --minecraft <mcDir>",
    "Minecraft root directory",
    defaultValues.minecraft
  )
  //可执行文件
  .option(
    "-e, --executable <executable>",
    "Minecraft server executable",
    defaultValues.executable
  )
  //存档名称
  .option(
    "-l, --level <levelName>",
    "Minecraft level name",
    defaultValues.levelName
  )
  .option(
    "-p, --port <port>",
    "Http server port",
    defaultValues.port.toString()
  )
  .option("-t, --token <token>", "Http server token", defaultValues.token);

program.parse();

const options = <OptionTypes>program.opts();

export const config = {
  mc: {
    cwd: options.minecraft,
    executable: options.executable,
    worlds: `${options.minecraft}/worlds`,
    levelName: `${options.levelName}`,
  },
  server: { port: options.port, token: options.token },
};
