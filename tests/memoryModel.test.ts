import MemoryModel from "../src/modelTypes/MemoryModel";

describe("doesRecordMatchesFilter", () => {
  test("doesRecordMatchesFilter", () => {
    const model = new MemoryModel<{ id: number; name: string }>("users");
    const record = { id: 1, name: "Denis" };

    expect(model.doesRecordMatchesFilter(record, {})).toBe(true);
    expect(model.doesRecordMatchesFilter(record, { id: 1 })).toBe(true);
    expect(model.doesRecordMatchesFilter(record, { id: 1, name: "Denis" })).toBe(true);
    expect(model.doesRecordMatchesFilter(record, { name: "Denis" })).toBe(true);

    expect(model.doesRecordMatchesFilter(record, { id: 2 })).toBe(false);
    expect(model.doesRecordMatchesFilter(record, { id: 1, name: "notDenis" })).toBe(false);
    expect(model.doesRecordMatchesFilter(record, { id: 2, name: "Denis" })).toBe(false);
    expect(model.doesRecordMatchesFilter(record, { id: 2, name: "notDenis" })).toBe(false);
  });
});
