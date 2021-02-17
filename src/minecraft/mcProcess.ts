import { spawn } from "child_process";
import { config } from "../config";
import { dateToText } from "../time";
import { ncp } from "ncp";
import * as fs from "fs";
import { processData, RunningFlag } from "./status";

const { worlds: worldsDir, levelName } = config.mc;

function startMinecraftServer() {
  console.log("starting minecraft server...");
  const _mcp = spawn(config.mc.path, {
    detached: true,
    //linux下需要设置工作目录为mc根目录
    cwd: config.mc.cwd,
  });
  _mcp.stdout.on("data", (data: Buffer) => {
    processData.appendStdout(data.toString());
  });
  _mcp.stderr.on("data", (data: Buffer) => {
    processData.appendStderr(data.toString());
  });
  _mcp.on("exit", () => {
    console.log("exit");
    //异常退出(?)
    processData.runningFlag = RunningFlag.STOPPED;
  });
  _mcp.on("close", () => {
    console.log("close");
    processData.runningFlag = RunningFlag.STOPPED;
  });
  _mcp.on("error", (e) => {
    console.log("error", e);
    processData.runningFlag = RunningFlag.EXITED;
  });
  console.log("minecraft server started");
  processData.runningFlag = RunningFlag.RUNNING;

  //listen Ctrl-C
  process.on("SIGINT", () => {
    if (processData.isRunning()) {
      console.log("stopping mc server...");
      _mcp.on("exit", () => {
        console.log("mc server stopped.");
        process.exit(0);
      });
      _mcp.stdin.write("stop\n");
    } else {
      process.exit(0);
    }
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
      const backupName = `${levelName}-${datePostfix}`;

      ncp(
        `${worldsDir}/${levelName}`,
        `${worldsDir}/${backupName}`,
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
  return fs.readdirSync(`${worldsDir}`);
};

export const rollback = (backupName: string) =>
  new Promise<void>((resolve, reject) => {
    if (fs.readdirSync(`${worldsDir}`).includes(backupName)) {
      mcProcess.on("close", () => {
        //save current game
        ncp(
          `${worldsDir}/${levelName}`,
          `${worldsDir}/${levelName}.old`,
          (error) => {
            if (error) {
              console.log(`error while rollback:${error}`);
              reject(error);
            } else {
              //remove old game
              fs.rmSync(`${worldsDir}/${levelName}`, {
                recursive: true,
              });
              //copy backup version
              ncp(
                `${worldsDir}/${backupName}`,
                `${worldsDir}/${levelName}`,

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
  return processData.runningFlag;
};

// 重启服务器
// 设置force参数可以强制重启
export const restartServer = (force = false) =>
  new Promise<void>((resolve, reject) => {
    if (force || !processData.isRunning()) {
      mcProcess = startMinecraftServer();
      if (processData.isRunning()) {
        resolve();
      } else {
        reject("Server restart failed!");
      }
    } else {
      reject("Server doesn't need to restart");
    }
  });
