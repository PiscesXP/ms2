import { config } from "../config";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { setupRouters } from "./router";

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

setupRouters(server);

export const startHttpServer = () => {
  server.listen(config.server.port, () => {
    console.log("Http server started.");
  });
};
