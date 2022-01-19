import { defaultModelCreation } from "../src/createModel";

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
}
type IDefaultedFields = Pick<User, "id" | "createdAt" | "updatedAt">;

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

const matchUnique = async (tableName: string, query: any) => {
  console.log(tableName, query);
  return query;
};
const createModel = defaultModelCreation<IDefaultedFields>(
  "memory",
  {
    create,
    match,
    update,
    delete: softDelete,
    matchUnique
  },
  {
    createPreparation: (record) => {
      record.id = Math.floor(Math.random() * 1000000) + 1;
      record.createdAt = "2000-10-00T10:00:00";
      record.updatedAt = "2000-10-00T10:00:00";
      return record;
    },
    updatePreparation: (record) => {
      record.updatedAt = "2020-12-00T10:00:00";
      return record;
    }
  }
);

const users = createModel<User>("users");

describe("create", () => {
  test("can create a user record", async () => {
    const user = await users.create({ firstName: "Tony" });
    expect(user).toEqual({
      id: user.id,
      firstName: "Tony",
      createdAt: "2000-10-00T10:00:00",
      updatedAt: "2000-10-00T10:00:00"
    });
  });
});

describe("match", () => {
  test("can match records based on query", async () => {
    const user = await users.create({ firstName: "Denis" });

    const matchedUsers = await users.match({ id: user.id, firstName: "Denis" });
    expect(matchedUsers.length).toBe(1);
    expect(matchedUsers[0].firstName).toBe("Denis");
  });
});

describe("update", () => {
  test("can update record", async () => {
    const user = await users.create({ firstName: "denis2" });

    const updatedUserCount = await users.update({ id: user.id }, { firstName: "Deniz" });
    expect(updatedUserCount).toBe(1);
    const updatedUser = await users.match({ id: user.id });
    expect(updatedUser).toEqual([
      { id: user.id, firstName: "Deniz", createdAt: "2000-10-00T10:00:00", updatedAt: "2020-12-00T10:00:00" }
    ]);
  });
});

describe("delete", () => {
  test("can delete record", async () => {
    const user = await users.create({ firstName: "Simon" });

    const deletedUser = await users.delete({ id: user.id });
    expect(deletedUser).toBe(1);
  });
});

describe("matchUnique", () => {
  test("can match specific record", async () => {
    const user = await users.create({ firstName: "Enrique" });

    const specifiedUser = await users.matchUnique({ firstName: "Enrique" });
    expect(specifiedUser).toMatchObject(user);
  });
});
