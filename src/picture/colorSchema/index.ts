import { DefaultSchema } from "./DefaultSchema";
import { ConcreteOnlySchema } from "./ConcreteOnlySchema";

export { ColorSchema } from "./ColorSchema";

const defaultSchema = new DefaultSchema();
const concreteOnlySchema = new ConcreteOnlySchema();

export const parseSchema = (schema = "") => {
  if (/concrete/i.test(schema)) {
    return concreteOnlySchema;
  }
  return defaultSchema;
};
