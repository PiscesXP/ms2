import axios from "axios";
import { PNG } from "pngjs";
import { mapColorConvert } from "../picture";

export const drawPicture = (command: string): Promise<string[]> => {
  const [, x, y, z, ...rest] = command.split(" ");

  /**
   * 支持可选参数.
   * */
  let target = "north";
  let url = "";
  let schema = "";

  for (let param of rest) {
    if (/^http.*$/.test(param)) {
      url = param;
    } else if (["north", "south", "east", "west"].indexOf(param) >= 0) {
      target = param;
    } else {
      schema = param;
    }
  }

  return new Promise<string[]>((resolve, reject) => {
    //url为空
    if (url === "") {
      reject("url为空");
    }

    axios.get(url, { responseType: "arraybuffer" }).then((res) => {
      if (res.headers["content-type"] === "image/png") {
        new PNG().parse(res.data, (err, data) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(
              mapColorConvert(
                Number(x),
                Number(y),
                Number(z),
                data,
                target,
                schema
              )
            );
          }
        });
      }
    });
  });
};
