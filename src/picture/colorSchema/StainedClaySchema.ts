import { ColorSchema } from "./ColorSchema";

/**
 * 只用陶瓦.
 * */
export class StainedClaySchema extends ColorSchema {
  setupColors(): void {
    this.addColor(209, 177, 161, "stained_hardened_clay", 0)
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
