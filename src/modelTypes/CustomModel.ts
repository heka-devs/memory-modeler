import BaseModel from "./BaseModel";
import type { Without } from "../types";

export interface ICustomModelOptions {
  create: <T>(tableName: string, record: any) => Promise<T>;
  match: <T>(tableName: string, filterQuery: Partial<T>) => Promise<T[]>;
  update: <T>(tableName: string, record: Partial<T>) => Promise<T>;
  delete: <T>(tableName: string, deleteQuery: Partial<T>) => Promise<number>;
}

class CustomModel<RecordType, DefaultedFields = Record<string, never>> extends BaseModel {
  readonly customModelOptions: ICustomModelOptions;

  constructor(name: string, options: ICustomModelOptions) {
    super(name);
    this.customModelOptions = options;
  }

  async create(record: Without<RecordType, DefaultedFields>) {
    const createdRecord = await this.customModelOptions.create<RecordType>(this._name, record);
    return createdRecord;
  }

  async match(filterQuery: Partial<RecordType>) {
    const matchedRecords = await this.customModelOptions.match<RecordType>(this._name, filterQuery);
    return matchedRecords;
  }

  async update(record: Partial<RecordType>) {
    const updatedRecord = await this.customModelOptions.update<Partial<RecordType>>(this._name, record);

    return updatedRecord;
  }

  async delete(deleteFilter: Partial<RecordType>) {
    const deletedRecord = await this.customModelOptions.delete<RecordType>(this._name, deleteFilter);
    console.log({ deletedRecord });
    return true;
  }
}

export default CustomModel;
