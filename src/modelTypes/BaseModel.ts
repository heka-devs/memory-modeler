class BaseModel<RecordType> {
  readonly _name: string;
  constructor(name: string) {
    this._name = name;
  }

  createPreparation(record: RecordType) {
    return record;
  }

  matchPreparation(filterQuery: Partial<RecordType>) {
    return filterQuery;
  }

  updatePreparation(record: Partial<RecordType>) {
    return record;
  }
}

export default BaseModel;
