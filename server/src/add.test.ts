import { add } from "./add";

test("1 + 2は3になること", () => {
  expect(add(1, 2)).toBe(3);
});
