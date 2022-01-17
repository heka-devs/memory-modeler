import MemoryModel from "./memoryModel";

interface ICreateModelArgs {
  name: string;
}

function createModel<RecordType>({ name }: ICreateModelArgs) {
  return new MemoryModel<RecordType>(name);
}

export default createModel;
