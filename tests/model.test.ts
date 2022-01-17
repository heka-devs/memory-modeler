import createModel from "../src/createModel";

interface User {
  firstName: string;
}

const users = createModel<User>({
  name: "users"
});

describe("create", () => {
  test("can create a user record", async () => {
    const user = await users.create({ firstName: "Tony" });
    console.log(user);
    expect(user).toEqual({ firstName: "Tony" });
  });
});
