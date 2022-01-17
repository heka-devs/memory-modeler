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
  // async _update(matchBy, updatedRecord: RecordType) {
  //   this._records.push(record);
  //   return record;
  // }

  // async _delete(record: RecordType) {
  //   this._records.push(record);
  //   return record;
  // }
}

export default MemoryModel;
