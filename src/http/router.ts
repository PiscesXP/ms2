import { server } from "./server";
import { config } from "../config";
import {
  backup,
  checkStatus,
  getBackupList,
  getStdout,
  restartServer,
  rollback,
  sendToStdin,
} from "../minecraft/mcProcess";

server.get("/validate", (req, res, next) => {
  if (req?.cookies?.token === config.server.token) {
    return res.send({
      result: "ok",
    });
  } else {
    return res.send({
      result: "invalid",
    });
  }
});

server.post("/validate", (req, res) => {
  if (req?.body?.token === config.server.token) {
    res.cookie("token", config.server.token);
    res.send({
      result: "ok",
    });
  } else {
    res.send({
      result: "invalid",
    });
  }
});

server.use("/mc", (req, res, next) => {
  if (req?.cookies?.token === config.server.token) {
    return next();
  } else {
    res.send({
      result: "invalid",
    });
  }
});

server.get("/mc/stdout", (req, res) => {
  /*  const combined = getStdout().reduce(
    (previousValue, currentValue, currentIndex, array) => {
      return previousValue + currentValue.data;
    },
    ""
  );*/
  return res.send({
    stdout: getStdout(),
  });
});

server.post("/mc/stdin", (req, res) => {
  const toSend = req?.body?.stdin;
  if (toSend) {
    sendToStdin(toSend);
  }
  res.send({
    result: "ok",
  });
});

server.post("/mc/backup", (req, res) => {
  backup().then((version) => {
    res.send({
      result: "ok",
      version,
    });
  });
});
server.get("/mc/backup", (req, res) => {
  res.send({
    backups: getBackupList(),
  });
});

server.post("/mc/rollback", (req, res) => {
  const backupName = req?.body?.backupName;
  rollback(backupName)
    .then(() => {
      res.send({
        result: "ok",
      });
    })
    .catch((error) => {
      res.send({
        result: "fail",
      });
    });
});

server.get("/mc/status", (req, res) => {
  res.send({
    status: checkStatus(),
  });
});

server.post("/mc/restart", (req, res) => {
  restartServer()
    .then(() => {
      res.send({
        result: "ok",
      });
    })
    .catch((error) => {
      res.send({
        result: "fail",
        msg: error,
      });
    });
});
