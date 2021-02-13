import { spawn } from "child_process";
import { config } from "./config";
import { dateToText } from "./time";

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

console.log("Starting minecraft server...");
const mcProcess = spawn(config.mc.path, {
  detached: true,
});

mcProcess.stdout.on("data", (data: Buffer) => {
  processData.appendStdout(data.toString());
});
mcProcess.stderr.on("data", (data: Buffer) => {
  processData.appendStderr(data.toString());
});
mcProcess.on("exit", () => {
  console.log("exit");
});
mcProcess.on("close", () => {
  console.log("close");
});
mcProcess.on("error", (e) => {
  console.log("error", e);
});

//listen Ctrl-C
process.on("SIGINT", () => {
  console.log("stopping mc server...");
  mcProcess.on("exit", () => {
    console.log("mc server stopped.");
    process.exit(0);
  });
  mcProcess.stdin.write("stop\n");
});

//----------------------------------------------------------------------------------------------------------------------

export const getStdout = () => {
  return processData.dataPool.getAll();
};

export const sendToStdin = (data: string) => {
  processData.appendStdin(data);
  mcProcess.stdin.write(data + "\n");
};

console.log("okay");
