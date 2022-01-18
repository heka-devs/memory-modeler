import MemoryModel from "./modelTypes/MemoryModel";
import CustomModel from "./modelTypes/CustomModel";
import type { ICustomModelOptions } from "./modelTypes/CustomModel";
import type { IMemoryModelOptions } from "./modelTypes/MemoryModel";

export function defaultModelCreation<DefaultedFields = Record<string, never>>(
  modelType: "memory" | "custom",
  customModelOptions: ICustomModelOptions,
  memoryModelOptions: IMemoryModelOptions
) {
  return <RecordType>(name: string) =>
    createModel<RecordType, DefaultedFields>({ name, modelType, customModelOptions, memoryModelOptions });
}

interface ICreateModelArgs {
  name: string;
  modelType: "memory" | "custom";
  customModelOptions: ICustomModelOptions;
  memoryModelOptions: IMemoryModelOptions;
}

export function createModel<RecordType, DefaultedFields>({
  name,
  modelType,
  customModelOptions,
  memoryModelOptions
}: ICreateModelArgs) {
  if (modelType === "custom") {
    return new CustomModel<RecordType, DefaultedFields>(name, customModelOptions);
  } else {
    return new MemoryModel<RecordType, DefaultedFields>(name, memoryModelOptions);
  }
}
