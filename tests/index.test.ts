import { main } from "../src/index";

test("should run the main function ", () => {
  const result = main("tony");
  expect(result).toBe("hello tony");
});
