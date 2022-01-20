import BaseModel from "./BaseModel";
import type { Without } from "../types";

export interface ICustomModelOptions {
  create?: <I, O>(tableName: string, record: I) => Promise<O>;
  match?: <T>(tableName: string, filterQuery: Partial<T>) => Promise<T[]>;
  update?: <T>(tableName: string, updateFilter: Partial<T>, updateFields: Partial<T>) => Promise<number>;
  delete?: <T>(tableName: string, deleteQuery: Partial<T>) => Promise<number>;
  matchUnique?: <T>(tableName: string, filterQuery: Partial<T>) => Promise<T | null>;
}

class CustomModel<RecordType, DefaultedFields = Record<string, never>> extends BaseModel {
  readonly customModelOptions: ICustomModelOptions;

  constructor(name: string, options: ICustomModelOptions) {
    super(name);
    this.customModelOptions = options;
  }

  async create(record: Without<RecordType, DefaultedFields>) {
    if (this.customModelOptions.create) {
      const createdRecord = await this.customModelOptions.create<Without<RecordType, DefaultedFields>, RecordType>(
        this._name,
        record
      );
      return createdRecord;
    } else {
      throw new Error("Custom model create function not implemented");
    }
  }

  async match(filterQuery: Partial<RecordType>) {
    if (this.customModelOptions.match) {
      const matchedRecords = await this.customModelOptions.match<Partial<RecordType>>(this._name, filterQuery);
      return matchedRecords;
    } else {
      throw new Error("Custom model match function not implemented");
    }
  }

  async update(updateFilter: Partial<RecordType>, updateFields: Partial<RecordType>) {
    if (this.customModelOptions.update) {
      const countOfUpdatedRecords = await this.customModelOptions.update<Partial<RecordType>>(
        this._name,
        updateFilter,
        updateFields
      );

      return countOfUpdatedRecords;
    } else {
      throw new Error("Custom model update function not implemented");
    }
  }

  async delete(deleteFilter: Partial<RecordType>) {
    if (this.customModelOptions.delete) {
      const deletedRecordCount = await this.customModelOptions.delete<Partial<RecordType>>(this._name, deleteFilter);
      return deletedRecordCount;
    } else {
      throw new Error("Custom model delete function not implemented");
    }
  }

  async matchUnique(filterQuery: Partial<RecordType>) {
    if (this.customModelOptions.matchUnique && this.customModelOptions.matchUnique) {
      const matchedRecords = await this.customModelOptions.matchUnique<Partial<RecordType>>(this._name, filterQuery);
      return matchedRecords;
    } else {
      throw new Error("Custom model matchUnique function not implemented");
    }
  }
}

export default CustomModel;
