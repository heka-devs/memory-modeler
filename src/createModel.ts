import MemoryModel from "./modelTypes/MemoryModel";
import CustomModel from "./modelTypes/CustomModel";
import type { ICustomModelOptions } from "./modelTypes/CustomModel";

interface ICreateModelArgs {
  name: string;
  modelType: "memory" | "custom";
  customModelOptions: ICustomModelOptions;
}

export function defaultModelCreation(modelType: "memory" | "custom", customModelOptions: ICustomModelOptions) {
  return <T>(name: string) => createModel<T>({ name, modelType, customModelOptions });
}

export function createModel<RecordType>({ name, modelType, customModelOptions }: ICreateModelArgs) {
  if (modelType === "custom") {
    return new CustomModel<RecordType>(name, customModelOptions);
  } else {
    return new MemoryModel<RecordType>(name);
  }
}
