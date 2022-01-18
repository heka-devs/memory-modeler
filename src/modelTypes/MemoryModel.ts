import BaseModel from "./BaseModel";
import type { Without } from "../types";

export interface IMemoryModelOptions {
  createPreparation: <T>(record: any) => T;
  updatePreparation: <T>(record: any) => T;
}

class MemoryModel<RecordType, DefaultedFields = Record<string, never>> extends BaseModel {
  _records: RecordType[];
  readonly memoryModelOptions: IMemoryModelOptions;

  constructor(name: string, options: IMemoryModelOptions) {
    super(name);
    this._records = [];
    this.memoryModelOptions = options;
  }

  doesRecordMatchFilter(record: RecordType, filterQuery: Partial<RecordType>) {
    return Object.entries(filterQuery).every(([filterKey, filterValue]) => {
      const recordValue = record[filterKey as keyof RecordType];
      return filterValue === recordValue;
    });
  }

  async create(record: Without<RecordType, DefaultedFields>) {
    const recordWithDefaults = this.memoryModelOptions.createPreparation<RecordType>({ ...record });
    this._records.push(recordWithDefaults);
    return recordWithDefaults;
  }

  async match(filterQuery: Partial<RecordType>) {
    const matchedRecords = this._records.filter((record) => {
      const recordMatchesFilter = this.doesRecordMatchFilter(record, filterQuery);
      return recordMatchesFilter;
    });

    return matchedRecords;
  }

  async update(updateFilter: Partial<RecordType>, updateFields: Partial<RecordType>) {
    let fieldsCopy = { ...updateFields };
    if (this.memoryModelOptions.updatePreparation) {
      fieldsCopy = this.memoryModelOptions.updatePreparation<Partial<RecordType>>(updateFields);
    }

    let updateCounter = 0;
    const updatedRecords = this._records.map((record) => {
      const recordMatchesFilter = this.doesRecordMatchFilter(record, updateFilter);
      if (recordMatchesFilter) {
        updateCounter++;
        return { ...record, ...fieldsCopy };
      } else {
        return record;
      }
    });

    this._records = updatedRecords;
    return updateCounter;
  }

  async delete(deleteFilter: Partial<RecordType>) {
    const recordsToKeep = this._records.filter((record) => {
      const recordMatchesFilter = this.doesRecordMatchFilter(record, deleteFilter);
      return !recordMatchesFilter;
    });

    const deletedCount = this._records.length - recordsToKeep.length;
    this._records = recordsToKeep;
    return deletedCount;
  }
}

export default MemoryModel;
