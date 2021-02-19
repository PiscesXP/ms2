/**
 * Bresenham方法生成八分之一个圆弧，圆心为坐标原点
 * @param radius 半径
 */
function bresenham(radius: number): number[][] {
  let pointArray: number[][] = []
  let x = 0;
  let y = radius;
  let d = 3 - 2 * radius;
  while (x < y) {
    pointArray.push([x, y]);
    if (d < 0) {
      d = d+4*x +6;
    } else {
      d = d + 4 * (x - y) + 10;
      y--;
    }
    x++;
  }
  if (x === y) {
    pointArray.push([x, y]);
  }
  return pointArray;
}

/**
 * 给定圆心坐标和半径，生成圆的边缘坐标
 * @param x
 * @param y
 * @param radius 半径
 */
function getCircle(x: number, y: number, radius: number): number[][] {
  let partPoints = bresenham(radius);
  // 通过Set去除可能出现的重复点
  let pointSet = new Set<string>();
  for (const point of partPoints) {
    pointSet.add((x + point[0]) + " " + (y + point[1]));
    pointSet.add((x + point[1]) + " " + (y + point[0]));
    pointSet.add((x + point[0]) + " " + (y - point[1]));
    pointSet.add((x + point[1]) + " " + (y - point[0]));
    pointSet.add((x - point[0]) + " " + (y + point[1]));
    pointSet.add((x - point[1]) + " " + (y + point[0]));
    pointSet.add((x - point[0]) + " " + (y - point[1]));
    pointSet.add((x - point[1]) + " " + (y - point[0]));
  }
  return [...pointSet].map(value => value.split(" ").map(n => Number(n)))
}

/**
 * 画圆命令 “circle x y z r block_id”
 * @param command
 */
export const drawCircle = (command: string): string[] => {
  let arr = command.split(" ");
  let [,x, y, z, r, block] = arr;
  let points = getCircle(Number(x), Number(z), Number(r));
  return points.map(p => `fill ${p[0]} ${y} ${p[1]} ${p[0]} ${y} ${p[1]} ${block}`);
}