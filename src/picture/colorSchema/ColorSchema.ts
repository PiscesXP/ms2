import { PNG } from "pngjs";
import { Color } from "../color";

/**
 * 抽象的schema.
 * 仅需实现setupColors().
 * */
export abstract class ColorSchema {
  private colorList: Color[] = [];

  constructor() {
    this.setupColors();
  }

  abstract setupColors(): void;

  protected addColor(
    r: number,
    g: number,
    b: number,
    id: string,
    data: number = 0
  ) {
    this.colorList.push({ r: r, g: g, b: b, id: id, data: data });
    return this;
  }

  private chooseColor(r: number, g: number, b: number): Color {
    const colorMap = new Map<number, Color>();
    this.colorList.forEach((color) => {
      const rmean = (r + color.r) / 2;
      const R2 = Math.pow(r - color.r, 2);
      const G2 = Math.pow(g - color.g, 2);
      const B2 = Math.pow(b - color.b, 2);
      colorMap.set(
        Math.sqrt(
          (2 + rmean / 256) * R2 + 4 * G2 + (2 + (255 - rmean) / 256) * B2
        ),
        color
      );
    });
    const array = Array.from(colorMap.keys());
    return colorMap.get(array.sort((a, b) => a - b)[0]);
  }

  fitPicture(png: PNG, bgBlock: string = "air"): Color[][] {
    const result: Color[][] = [];
    for (let y = 0; y < png.height; y++) {
      const line: Color[] = [];
      for (let x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2;
        if (png.data[idx + 3] > 250) {
          line.push(
            this.chooseColor(
              png.data[idx],
              png.data[idx + 1],
              png.data[idx + 2]
            )
          );
        } else {
          line.push({ r: 0, g: 0, b: 0, id: bgBlock, data: 0 });
        }
      }
      result.push(line);
    }
    return result;
  }
}
