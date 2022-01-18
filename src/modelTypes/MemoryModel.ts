import BaseModel from "./BaseModel";

class MemoryModel<RecordType> extends BaseModel<RecordType> {
  _records: RecordType[];
  constructor(name: string) {
    super(name);
    this._records = [];
  }

  async create(record: RecordType) {
    const preparedRecord = this.createPreparation(record);
    this._records.push(preparedRecord);
    return preparedRecord;
  }

  async match(filterQuery: Partial<RecordType>) {
    const preparedQuery = this.matchPreparation(filterQuery);

    const matchedRecords = this._records.filter((record) => {
      return Object.entries(preparedQuery).every(([filterKey, filterValue]) => {
        const recordValue = record[filterKey as keyof RecordType];
        return filterValue === recordValue;
      });
    });

    return matchedRecords;
  }

  // should update multiple records, remove ATLEAST
  async update(record: any) {
    // const indexOfRecordToUpdate = this._records.findIndex((existingRecord) => existingRecord.pid === record.pid);

    // if (record && record.pid && indexOfRecordToUpdate !== -1) {
    //   this._records[indexOfRecordToUpdate] = { ...this._records[indexOfRecordToUpdate], ...record };
    //   return this._records[indexOfRecordToUpdate];
    // } else {
    //   throw new Error("Cannot update record, no record exists");
    // }
    return record;
  }

  // Take filter query and delete all
  async delete(deleteFilter: Partial<RecordType>) {
    const recordsToKeep = this._records.filter((record) => {
      return Object.entries(deleteFilter).some(([filterKey, filterValue]) => {
        const recordValue = record[filterKey as keyof RecordType];
        return filterValue !== recordValue;
      });
    });
    const deletedCount = this._records.length - recordsToKeep.length;
    this._records = recordsToKeep;
    return deletedCount;
  }
}

export default MemoryModel;
