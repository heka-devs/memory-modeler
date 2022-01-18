import BaseModel from "./BaseModel";

export interface ICustomModelOptions {
  create: <T>(tableName: string, record: T) => Promise<T>;
  match: <T>(tableName: string, filterQuery: Partial<T>) => Promise<T[]>;
  update: <T>(tableName: string, record: Partial<T>) => Promise<T>;
  delete: <T>(tableName: string, deleteQuery: Partial<T>) => Promise<number>;
}

class CustomModel<RecordType> extends BaseModel<RecordType> {
  readonly modelOptions: ICustomModelOptions;

  constructor(name: string, options: ICustomModelOptions) {
    super(name);
    this.modelOptions = options;
  }

  async create(record: RecordType) {
    const preparedRecord = this.createPreparation(record);
    const createdRecord = await this.modelOptions.create<RecordType>(this._name, preparedRecord);
    return createdRecord;
  }

  async match(filterQuery: Partial<RecordType>) {
    const preparedQuery = this.matchPreparation(filterQuery);

    const matchedRecords = await this.modelOptions.match<RecordType>(this._name, preparedQuery);
    return matchedRecords;
  }

  async update(record: Partial<RecordType>) {
    const validatedRecord = this.updatePreparation(record);

    const updatedRecord = await this.modelOptions.update<Partial<RecordType>>(this._name, validatedRecord);

    return updatedRecord;
  }

  async delete(deleteFilter: Partial<RecordType>) {
    const deletedRecord = await this.modelOptions.delete<RecordType>(this._name, deleteFilter);
    console.log({ deletedRecord });
    return true;
  }
}

export default CustomModel;
