import { defaultModelCreation } from "../src/createModel";
import { create, match, update, deleteRecords, matchUnique } from "./customModelHelper";
interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}
type IDefaultedFields = Pick<User, "id" | "createdAt" | "updatedAt">;

const modelTypeToTest: "custom" | "memory" = (process.env.MODEL_TO_TEST as "custom" | "memory") || "custom";

const createModel = defaultModelCreation<IDefaultedFields>(
  modelTypeToTest,
  {
    create,
    match,
    update,
    delete: deleteRecords,
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
    const user = await users.create({ name: "Tony" });
    expect(user).toMatchObject({
      id: user.id,
      name: "Tony"
    });
    if (modelTypeToTest === "memory") {
      expect(user).toMatchObject({ createdAt: "2000-10-00T10:00:00", updatedAt: "2000-10-00T10:00:00" });
    }
  });
});

describe("match", () => {
  test("can match records based on query", async () => {
    const user = await users.create({ name: "Denis" });

    const matchedUsers = await users.match({ id: user.id });
    expect(matchedUsers.length).toBe(1);
    expect(matchedUsers[0].name).toBe("Denis");
  });
});

describe("update", () => {
  test("can update record", async () => {
    const user = await users.create({ name: "denis2" });

    const updatedUserCount = await users.update({ id: user.id }, { name: "Deniz" });
    expect(updatedUserCount).toBe(1);
    const updatedUsers = await users.match({ id: user.id });
    expect(updatedUsers).toMatchObject([{ id: user.id, name: "Deniz" }]);
    if (modelTypeToTest === "memory") {
      expect(updatedUsers[0]).toMatchObject({ createdAt: "2000-10-00T10:00:00", updatedAt: "2020-12-00T10:00:00" });
    }
  });
});

describe("delete", () => {
  test("can delete record", async () => {
    const _user1 = await users.create({ name: "SimonDelete" });
    const _user2 = await users.create({ name: "SimonDelete" });

    const deletedUserCount = await users.delete({ name: "SimonDelete" });
    expect(deletedUserCount).toBe(2);
    const deletedUsers = await users.match({ name: "SimonDelete" });
    expect(deletedUsers.length).toBe(0);
  });
});

describe("matchUnique", () => {
  test("can match specific record", async () => {
    const user = await users.create({ name: "Tom" });

    const specifiedUser = await users.matchUnique({ id: user.id });
    expect(specifiedUser).toMatchObject(user);
  });
});
