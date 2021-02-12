import { config } from "./config";
import * as express from "express";
import * as cookieParser from "cookie-parser";

import { getStdout, sendToStdin } from "./mcProcess";

const server = express();
server.use(express.json());
server.use(cookieParser());

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
    res.end("Invalid token.");
  }
});

server.get("/mc/stdout", (req, res) => {
  const combined = getStdout().reduce(
    (previousValue, currentValue, currentIndex, array) => {
      return previousValue + currentValue.data;
    },
    ""
  );
  return res.send({
    stdout: combined,
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

export const startHttpServer = () => {
  server.listen(config.server.port, () => {
    console.log("Http server started.");
  });
};
