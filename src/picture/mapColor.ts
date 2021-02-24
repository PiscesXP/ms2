import { PNG } from "pngjs";
import { parseSchema } from "./colorSchema";

/**
 * 在指定坐标处绘制一副像素画
 * @param x
 * @param y
 * @param z
 * @param png png图片
 * @param towards 基点为图片左上角，确定朝向
 * @param colorSchema
 */
export const mapColorConvert = (
  x: number,
  y: number,
  z: number,
  png: PNG,
  towards: string,
  colorSchema: string = ""
) => {
  const result = [];
  const colorArray = parseSchema(colorSchema).fitPicture(png);
  for (let i = 0; i < colorArray.length; i++) {
    for (let j = 0; j < colorArray[0].length; j++) {
      const color = colorArray[i][j];
      let position: number[] = [];
      if (towards === "south") {
        position = [x - j, y, z - i];
      } else if (towards === "west") {
        position = [x + i, y, z - j];
      } else if (towards === "east") {
        position = [x - i, y, z + j];
      } else {
        position = [x + j, y, z + i];
      }
      if (color.id === "air") {
        continue;
      }
      if (color.id === "water") {
        position[1]--;
        result.push(`fill ${position.join(" ")} ${position.join(" ")} stone`);
        position[1]++;
      }
      result.push(
        `fill ${position.join(" ")} ${position.join(" ")} ${color.id} ${
          color.data
        }`
      );
    }
  }
  return result;
};
