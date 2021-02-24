import { ColorSchema } from "./ColorSchema";

/**
 * 只用混凝土.
 * */
export class ConcreteOnlySchema extends ColorSchema {
  setupColors(): void {
    this.addColor(255, 255, 255, "concrete", 0)
      .addColor(216, 127, 51, "concrete", 1)
      .addColor(178, 76, 216, "concrete", 2)
      .addColor(102, 153, 216, "concrete", 3)
      .addColor(229, 229, 51, "concrete", 4)
      .addColor(127, 204, 25, "concrete", 5)
      .addColor(242, 127, 165, "concrete", 6)
      .addColor(76, 76, 76, "concrete", 7)
      .addColor(153, 153, 153, "concrete", 8)
      .addColor(76, 127, 153, "concrete", 9)
      .addColor(127, 63, 178, "concrete", 10)
      .addColor(51, 76, 178, "concrete", 11)
      .addColor(102, 76, 51, "concrete", 12)
      .addColor(102, 127, 51, "concrete", 13)
      .addColor(153, 51, 51, "concrete", 14)
      .addColor(25, 25, 25, "concrete", 15);
  }
}
