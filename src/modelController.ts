import { createModel } from "./createModel";

interface IModelControllerArgs {
  create?: (tableName: string, record: any) => any;
}

function modelController({ create }: IModelControllerArgs) {
  return createModel;
}

export default modelController;
