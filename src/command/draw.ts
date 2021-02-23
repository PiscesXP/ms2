import axios from "axios";
import {PNG} from "pngjs";
import {mapColorConvert} from "../picture";

export const drawPicture = (command: string): string[] => {
  const [, x, y, z, target, url] = command.split(" ");
  if (["north", "south", "east", "west"].indexOf(target) < 0) {
    return [];
  }
  axios.get(url, {responseType: 'arraybuffer'})
    .then((res) => {
      if (res.headers["content-type"] === "image/png") {
        return mapColorConvert(Number(x), Number(y), Number(z), new PNG().parse(res.data), target);
      }
    })
  return [];
}