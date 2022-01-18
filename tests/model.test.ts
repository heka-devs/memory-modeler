import { defaultModelCreation } from "../src/createModel";

export type UniqueIdentifier = any;

interface User {
  id: UniqueIdentifier;
  firstName: string;
}

const create = async (tableName: string, record: any) => {
  console.log({ tableName });
  return record;
};

const match = async (tableName: string, filterQuery: any) => {
  console.log(tableName, filterQuery);
  return filterQuery;
};

const update = async (tableName: string, record: any) => {
  console.log(tableName, record);
  return record;
};

const softDelete = async (tableName: string, deleteFilter: Partial<any>) => {
  console.log(tableName, deleteFilter);
  return 1;
};

const createModel = defaultModelCreation("memory", { create, match, update, delete: softDelete });

const users = createModel<User>("users");

describe("create", () => {
  test("can create a user record", async () => {
    const user = await users.create({ id: "f2eaba08-492c-494c-a1be-727856df8c6c", firstName: "Tony" });
    expect(user).toEqual({ id: user.id, firstName: "Tony" });
  });
});

describe("match", () => {
  test("can match records based on query", async () => {
    const user = await users.create({ id: "59c96c5f-6c78-4d06-9722-068280be53a3", firstName: "Denis" });

    const matchedUsers = await users.match({ firstName: "Denis" });
    expect(matchedUsers).toEqual([user]);
  });
});

describe("update", () => {
  test("can update record", async () => {
    const user = await users.create({ id: "36f2089e-b93c-4989-b8dd-63e9c3dee708", firstName: "Denis" });

    const updatedUserCount = await users.update({ id: user.id }, { firstName: "Deniz" });
    expect(updatedUserCount).toBe(1);
    const updatedUser = await users.match({ id: user.id });
    expect(updatedUser).toEqual([{ id: user.id, firstName: "Deniz" }]);
  });
});

describe("delete", () => {
  test("can delete record", async () => {
    const user = await users.create({ id: "38d66c73-d051-4a7b-a116-953f75b26157", firstName: "Simon" });

    const deletedUser = await users.delete({ id: user.id });
    expect(deletedUser).toBe(1);
  });
});
