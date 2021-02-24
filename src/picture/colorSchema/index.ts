import { DefaultSchema } from "./DefaultSchema";
import { ConcreteOnlySchema } from "./ConcreteOnlySchema";
import { ConcreteAndStainedClaySchema } from "./ConcreteAndStainedClaySchema";
import { StainedClaySchema } from "./StainedClaySchema";
import { ColorSchema } from "./ColorSchema";

const defaultSchema = new DefaultSchema();
const concreteOnlySchema = new ConcreteOnlySchema();
const concreteAndStainedClaySchema = new ConcreteAndStainedClaySchema();
const stainedClaySchema = new StainedClaySchema();

/**
 * 解析并返回对应的schema.
 * */
export const parseSchema = (schema = ""): ColorSchema => {
  const concreteTest = /concrete/i.test(schema);
  const stainedClayTest = /stainedclay/i.test(schema);
  if (concreteTest && stainedClayTest) {
    return concreteAndStainedClaySchema;
  }
  if (concreteTest) {
    return concreteOnlySchema;
  }
  if (stainedClayTest) {
    return stainedClaySchema;
  }
  return defaultSchema;
};
