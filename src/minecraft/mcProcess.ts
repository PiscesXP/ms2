import { spawn } from "child_process";
import { config } from "../config";
import { dateToText } from "../time";
import { ncp } from "ncp";
import * as fs from "fs";

//----------------------------------------------------------------------------------------------------------------------

enum IOType {
  stdin = "stdin",
  stdout = "stdout",
  stderr = "stderr",
}

type IODataItem = {
  index: number;
  type: IOType;
  data: string;
  time: Date;
};

class IODataPool {
  private items: IODataItem[] = [];

  append(item: IODataItem) {
    this.items.push(item);
    //log
    console.log(
      `[${dateToText(item.time)}][${item.type}] ${item.data.replace(
        /\r?\n/g,
        "\\n"
      )}`
    );

    //limit to 128 item
    if (this.items.length > 128) {
      this.items.shift();
    }
  }

  getAll() {
    return this.items;
  }

  getStdin() {
    return this.items.filter((value) => value.type === IOType.stdin);
  }

  getStdout() {
    return this.items.filter((value) => value.type === IOType.stdout);
  }

  getStderr() {
    return this.items.filter((value) => value.type === IOType.stderr);
  }
}

class ProcessData {
  isRunning = false;
  dataPool: IODataPool = new IODataPool();
  indexCounter = 0;

  appendStdin(data: string) {
    this.append(data, IOType.stdin);
  }

  appendStdout(data: string) {
    this.append(data, IOType.stdout);
  }

  appendStderr(data: string) {
    this.append(data, IOType.stderr);
  }

  append(data: string, type: IOType) {
    const index = ++this.indexCounter;
    this.dataPool.append({
      index,
      data,
      type,
      time: new Date(),
    });
  }
}

const processData = new ProcessData();

//----------------------------------------------------------------------------------------------------------------------

let runningFlag = false;

function startMinecraftServer() {
  console.log("starting minecraft server...");
  const _mcp = spawn(config.mc.path, {
    detached: true,
  });
  _mcp.stdout.on("data", (data: Buffer) => {
    processData.appendStdout(data.toString());
  });
  _mcp.stderr.on("data", (data: Buffer) => {
    processData.appendStderr(data.toString());
  });
  _mcp.on("exit", () => {
    console.log("exit");
    runningFlag = false;
  });
  _mcp.on("close", () => {
    console.log("close");
    runningFlag = false;
  });
  _mcp.on("error", (e) => {
    console.log("error", e);
    runningFlag = false;
  });
  console.log("minecraft server started");
  runningFlag = true;

  //listen Ctrl-C
  process.on("SIGINT", () => {
    console.log("stopping mc server...");
    _mcp.on("exit", () => {
      console.log("mc server stopped.");
      process.exit(0);
    });
    _mcp.stdin.write("stop\n");
  });
  return _mcp;
}

let mcProcess = startMinecraftServer();

//----------------------------------------------------------------------------------------------------------------------

export const getStdout = () => {
  return processData.dataPool.getAll();
};

export const sendToStdin = (data: string) => {
  processData.appendStdin(data);
  mcProcess.stdin.write(data + "\n");
};

export const backup = () =>
  new Promise<string>((resolve, reject) => {
    console.log("backup...");
    mcProcess.on("close", () => {
      const datePostfix = dateToText(new Date()).toString().replace(":", "-");
      const backupName = `${config.mc.levelName}-${datePostfix}`;

      ncp(
        `${config.mc.worlds}${config.mc.levelName}`,
        `${config.mc.worlds}${backupName}`,
        (error) => {
          if (error) {
            console.log(`backup error:${error}`);
          } else {
            console.log("backup success.");
            resolve(backupName);
            mcProcess = startMinecraftServer();
          }
        }
      );
    });
    mcProcess.stdin.write("stop\n");
  });

export const getBackupList = () => {
  return fs.readdirSync(`${config.mc.worlds}`);
};

export const rollback = (backupName: string) =>
  new Promise<void>((resolve, reject) => {
    if (fs.readdirSync(`${config.mc.worlds}`).includes(backupName)) {
      mcProcess.on("close", () => {
        //save current game
        ncp(
          `${config.mc.worlds}${config.mc.levelName}`,
          `${config.mc.worlds}${config.mc.levelName}.old`,
          (error) => {
            if (error) {
              console.log(`error while rollback:${error}`);
              reject(error);
            } else {
              //remove old game
              fs.rmSync(`${config.mc.worlds}${config.mc.levelName}`, {
                recursive: true,
              });
              //copy backup version
              ncp(
                `${config.mc.worlds}${backupName}`,
                `${config.mc.worlds}${config.mc.levelName}`,

                (error) => {
                  if (error) {
                    console.log(`rollback error:${error}`);
                    reject(error);
                  } else {
                    console.log("rollback success.");
                    mcProcess = startMinecraftServer();
                    resolve();
                  }
                }
              );
            }
          }
        );
      });
      mcProcess.stdin.write("stop\n");
    }
  });

// 检查服务器运行状态
export const checkStatus = () => {
  return runningFlag;
};

// 重启服务器
// 设置force参数可以强制重启
export const restartServer = (force = false) =>
  new Promise<void>((resolve, reject) => {
    if (!(!force && runningFlag)) {
      mcProcess = startMinecraftServer();
      if (runningFlag) {
        resolve();
      } else {
        reject("Server restart failed!");
      }
    } else {
      reject("Server doesn't need to restart");
    }
  });
