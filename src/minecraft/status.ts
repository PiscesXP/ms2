import * as moment from "moment";

enum IOType {
  stdin = "stdin",
  stdout = "stdout",
  stderr = "stderr",
}

export enum RunningFlag {
  RUNNING = "running",
  STOPPED = "stopped",
  EXITED = "exited",
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
      `[${moment(item.time).format("YYYY-MM-DD HH:mm:ss")}][${item.type}] ${item.data.replace(
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
  runningFlag: RunningFlag = RunningFlag.STOPPED;
  dataPool: IODataPool = new IODataPool();
  indexCounter = 0;

  isRunning() {
    return this.runningFlag === RunningFlag.RUNNING;
  }

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

export const processData = new ProcessData();
