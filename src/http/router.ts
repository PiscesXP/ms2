import { config } from "../config";
import {
  backup,
  checkStatus,
  getBackupList,
  getStdout,
  restartServer,
  rollback,
  sendToStdin,
} from "../minecraft";
import { formatResponse, ResponseCode } from "./format";
import { Express } from "express";

export const setupRouters = (server: Express) => {
  server.get("/validate", (req, res) => {
    if (req?.cookies?.token === config.server.token) {
      return res.send(formatResponse());
    } else {
      return res.send(
        formatResponse({
          code: ResponseCode.authInvalid,
          message: "请先验证身份.",
        })
      );
    }
  });

  server.post("/validate", (req, res) => {
    if (req?.body?.token === config.server.token) {
      res.cookie("token", config.server.token);
      res.send(
        formatResponse({
          message: "身份验证成功.",
        })
      );
    } else {
      res.send(
        formatResponse({
          message: "身份验证失败.",
        })
      );
    }
  });

  server.use("/mc", (req, res, next) => {
    if (req?.cookies?.token === config.server.token) {
      return next();
    } else {
      res.send(
        formatResponse({
          code: ResponseCode.authInvalid,
          message: "请先验证身份.",
        })
      );
    }
  });

  server.get("/mc/stdout", (req, res) => {
    /*  const combined = getStdout().reduce(
    (previousValue, currentValue, currentIndex, array) => {
      return previousValue + currentValue.data;
    },
    ""
  );*/
    return res.send(
      formatResponse({
        data: {
          stdout: getStdout(),
        },
      })
    );
  });

  server.post("/mc/stdin", (req, res) => {
    const toSend = req?.body?.stdin;
    if (toSend) {
      sendToStdin(toSend);
    }
    res.send(formatResponse());
  });

  server.post("/mc/backup", (req, res) => {
    backup().then((version) => {
      res.send(
        formatResponse({
          data: {
            version,
          },
        })
      );
    });
  });
  server.get("/mc/backup", (req, res) => {
    res.send(
      formatResponse({
        data: {
          backups: getBackupList(),
        },
      })
    );
  });

  server.post("/mc/rollback", (req, res) => {
    const backupName = req?.body?.backupName;
    rollback(backupName)
      .then(() => {
        res.send(formatResponse());
      })
      .catch((error) => {
        res.send(
          formatResponse({ code: ResponseCode.backupFailed, data: error })
        );
      });
  });

  server.get("/mc/status", (req, res) => {
    res.send(
      formatResponse({
        data: {
          status: checkStatus(),
        },
      })
    );
  });

  server.post("/mc/restart", (req, res) => {
    const force = !!req.body?.force;
    restartServer(force)
      .then(() => {
        res.send(formatResponse());
      })
      .catch((error) => {
        res.send(
          formatResponse({
            code: ResponseCode.restartFailed,
            data: {
              msg: error,
            },
          })
        );
      });
  });
};
