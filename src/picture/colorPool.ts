import * as fs from "fs";
import { PNG } from "pngjs";

type Color = {
  r: number,
  g: number,
  b: number,
  id: string,
  data: number
}

export class ColorPool {
  private colorList: Color[] = [];

  addColor(r: number, g: number, b: number, id: string, data: number = 0) {
    this.colorList.push({r: r, g: g, b: b, id: id, data: data});
  }

  private chooseColor(r: number, g: number, b: number): Color {
    const colorMap = new Map<number, Color>();
    this.colorList.forEach(color => {
      const rmean = (r + color.r) / 2;
      const R2 = Math.pow(r - color.r, 2);
      const G2 = Math.pow(g - color.g, 2);
      const B2 = Math.pow(b - color.b, 2);
      colorMap.set(Math.sqrt((2 + rmean / 256) * R2 + 4 * G2 + (2 + (255 - rmean) / 256) * B2), color);
    })
    const array = Array.from(colorMap.keys());
    return colorMap.get(array.sort((a, b) => a - b)[0]);
  }

  fitPicture(filePath: string): Color[][] {
    const result: Color[][] = [];
    const png = fs.createReadStream(filePath).pipe(new PNG());
    png.on("parsed", () => {
      for (let y = 0; y < png.height; y++) {
        const line: Color[] = [];
        for (let x = 0; x < png.width; x++) {
          const idx = (png.width * y + x) << 2;
          line.push(this.chooseColor(png.data[idx], png.data[idx+1], png.data[idx+2]));
        }
        result.push(line);
      }
      png.pack().pipe(fs.createWriteStream("/home/qian/Download/头像.png"));
    });
    return result;
  }

}

