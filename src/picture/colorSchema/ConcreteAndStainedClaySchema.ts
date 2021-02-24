import { ColorSchema } from "./ColorSchema";

/**
 * 只用混凝土和陶瓦.
 * */
export class ConcreteAndStainedClaySchema extends ColorSchema {
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
      .addColor(25, 25, 25, "concrete", 15)
      .addColor(209, 177, 161, "stained_hardened_clay", 0)
      .addColor(159, 82, 36, "stained_hardened_clay", 1)
      .addColor(149, 87, 108, "stained_hardened_clay", 2)
      .addColor(112, 108, 138, "stained_hardened_clay", 3)
      .addColor(186, 133, 36, "stained_hardened_clay", 4)
      .addColor(103, 117, 53, "stained_hardened_clay", 5)
      .addColor(160, 77, 78, "stained_hardened_clay", 6)
      .addColor(57, 41, 35, "stained_hardened_clay", 7)
      .addColor(135, 107, 98, "stained_hardened_clay", 8)
      .addColor(87, 92, 92, "stained_hardened_clay", 9)
      .addColor(122, 73, 88, "stained_hardened_clay", 10)
      .addColor(76, 62, 92, "stained_hardened_clay", 11)
      .addColor(76, 50, 35, "stained_hardened_clay", 12)
      .addColor(76, 82, 42, "stained_hardened_clay", 13)
      .addColor(142, 60, 46, "stained_hardened_clay", 14)
      .addColor(37, 22, 16, "stained_hardened_clay", 15);
  }
}
