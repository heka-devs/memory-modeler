import BaseModel from "./BaseModel";
import type { Without } from "../types";

export interface ICustomModelOptions {
  create: <T>(tableName: string, record: any) => Promise<T>;
  match: <T>(tableName: string, filterQuery: Partial<T>) => Promise<T[]>;
  update: <T>(tableName: string, updateFilter: Partial<T>, updateFields: Partial<T>) => Promise<number>;
  delete: <T>(tableName: string, deleteQuery: Partial<T>) => Promise<number>;
  matchUnique: <T>(tableName: string, filterQuery: Partial<T>) => Promise<T | null>;
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

  async update(updateFilter: Partial<RecordType>, updateFields: Partial<RecordType>) {
    const countOfUpdatedRecords = await this.customModelOptions.update<Partial<RecordType>>(
      this._name,
      updateFilter,
      updateFields
    );

    return countOfUpdatedRecords;
  }

  async delete(deleteFilter: Partial<RecordType>) {
    const deletedRecordCount = await this.customModelOptions.delete<RecordType>(this._name, deleteFilter);
    return deletedRecordCount;
  }

  async matchUnique(filterQuery: Partial<RecordType>) {
    const matchedRecords = await this.customModelOptions.matchUnique<RecordType>(this._name, filterQuery);
    return matchedRecords;
  }
}

export default CustomModel;
