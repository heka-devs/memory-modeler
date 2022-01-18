import BaseModel from "./BaseModel";

class MemoryModel<RecordType> extends BaseModel<RecordType> {
  _records: RecordType[];
  constructor(name: string) {
    super(name);
    this._records = [];
  }

  doesRecordMatchesFilter(record: RecordType, filterQuery: Partial<RecordType>) {
    return Object.entries(filterQuery).every(([filterKey, filterValue]) => {
      const recordValue = record[filterKey as keyof RecordType];
      return filterValue === recordValue;
    });
  }

  async create(record: RecordType) {
    const preparedRecord = this.createPreparation(record);
    this._records.push(preparedRecord);
    return preparedRecord;
  }

  async match(filterQuery: Partial<RecordType>) {
    const preparedQuery = this.matchPreparation(filterQuery);

    const matchedRecords = this._records.filter((record) => {
      const recordMatchesFilter = this.doesRecordMatchesFilter(record, preparedQuery);
      return recordMatchesFilter;
    });

    return matchedRecords;
  }

  async update(updateFilter: Partial<RecordType>, updateFields: Partial<RecordType>) {
    const preparedFilter = this.updatePreparation(updateFilter);

    let updateCounter = 0;
    const updatedRecords = this._records.map((record) => {
      const recordMatchesFilter = this.doesRecordMatchesFilter(record, preparedFilter);
      if (recordMatchesFilter) {
        updateCounter++;
        return { ...record, ...updateFields };
      } else {
        return record;
      }
    });

    this._records = updatedRecords;
    return updateCounter;
  }

  async delete(deleteFilter: Partial<RecordType>) {
    const preparedDeleteFilter = this.deletePreparation(deleteFilter);

    const recordsToKeep = this._records.filter((record) => {
      const recordMatchesFilter = this.doesRecordMatchesFilter(record, preparedDeleteFilter);
      return !recordMatchesFilter;
    });

    const deletedCount = this._records.length - recordsToKeep.length;
    this._records = recordsToKeep;
    return deletedCount;
  }
}

export default MemoryModel;
