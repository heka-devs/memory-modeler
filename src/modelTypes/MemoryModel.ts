import BaseModel from "./BaseModel";
import type { Without } from "../types";

export interface IMemoryModelOptions {
  createPreparation?: (record: any) => any;
  updatePreparation?: (record: any) => any;
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
    let recordCopy = { ...record } as RecordType;
    if (this.memoryModelOptions.createPreparation) {
      recordCopy = this.memoryModelOptions.createPreparation({ ...record }) as RecordType;
    }

    this._records.push(recordCopy);
    return recordCopy;
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
      fieldsCopy = this.memoryModelOptions.updatePreparation(updateFields) as Partial<RecordType>;
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

  async matchUnique(filterQuery: Partial<RecordType>) {
    const matches = await this.match(filterQuery);
    if (matches.length === 1) {
      return matches[0];
    } else if (matches.length === 0) {
      return null;
    } else {
      throw new Error("the match being made is not unique");
    }
  }
}

export default MemoryModel;
