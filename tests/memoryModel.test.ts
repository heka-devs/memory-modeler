import MemoryModel from "../src/modelTypes/MemoryModel";

interface User {
  id: number;
  name: string;
}

describe("doesRecordMatchFilter", () => {
  test("doesRecordMatchFilter", () => {
    const model = new MemoryModel<User>("users", {
      createPreparation: (user) => user,
      updatePreparation: (user) => user
    });
    const record = { id: 1, name: "Denis" };

    expect(model.doesRecordMatchFilter(record, {})).toBe(true);
    expect(model.doesRecordMatchFilter(record, { id: 1 })).toBe(true);
    expect(model.doesRecordMatchFilter(record, { id: 1, name: "Denis" })).toBe(true);
    expect(model.doesRecordMatchFilter(record, { name: "Denis" })).toBe(true);

    expect(model.doesRecordMatchFilter(record, { id: 2 })).toBe(false);
    expect(model.doesRecordMatchFilter(record, { id: 1, name: "notDenis" })).toBe(false);
    expect(model.doesRecordMatchFilter(record, { id: 2, name: "Denis" })).toBe(false);
    expect(model.doesRecordMatchFilter(record, { id: 2, name: "notDenis" })).toBe(false);
  });
});
