import { config } from "./config";
import * as express from "express";
import * as cookieParser from "cookie-parser";

import {
  backup,
  getBackupList,
  getStdout,
  rollback,
  sendToStdin,
} from "./mcProcess";

const server = express();

//cors
server.use("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.header("Origin") || "*"); //当允许携带cookies此处的白名单不能写’*’
  res.header(
    "Access-Control-Allow-Headers",
    "content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With"
  ); //允许的请求头
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT"); //允许的请求方法
  res.header("Access-Control-Allow-Credentials", "true"); //允许携带cookies
  next();
});

server.use(express.json());
server.use(cookieParser());

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
export const startHttpServer = () => {
  server.listen(config.server.port, () => {
    console.log("Http server started.");
  });
};
