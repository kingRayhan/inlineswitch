import { inlineSwitch, DuplicateCaseError, switchValue } from "./inlineswitch";

describe("inlineSwitch", () => {
  test("matches exact values", () => {
    const result = inlineSwitch(5, [
      [1, (v) => `One: ${v}`],
      [5, (v) => `Five: ${v}`],
      [10, (v) => `Ten: ${v}`],
    ]);
    expect(result).toBe("Five: 5");
  });

  test("matches array values", () => {
    const result = inlineSwitch(3, [
      [[1, 2, 3], (v) => `Small: ${v}`],
      [[4, 5, 6], (v) => `Medium: ${v}`],
      [[7, 8, 9], (v) => `Large: ${v}`],
    ]);
    expect(result).toBe("Small: 3");
  });

  test("matches using predicate functions", () => {
    const result = inlineSwitch(15, [
      [(v) => v < 10, (v) => `Small: ${v}`],
      [(v) => v >= 10 && v < 20, (v) => `Medium: ${v}`],
      [(v) => v >= 20, (v) => `Large: ${v}`],
    ]);
    expect(result).toBe("Medium: 15");
  });

  test("uses default handler when no match found", () => {
    const result = inlineSwitch(
      42,
      [
        [1, (v) => `One: ${v}`],
        [2, (v) => `Two: ${v}`],
      ],
      (v) => `Default: ${v}`
    );
    expect(result).toBe("Default: 42");
  });

  test("returns undefined when no match and no default handler", () => {
    const result = inlineSwitch(42, [
      [1, (v) => `One: ${v}`],
      [2, (v) => `Two: ${v}`],
    ]);
    expect(result).toBeUndefined();
  });

  test("throws error on duplicate simple values", () => {
    expect(() => {
      inlineSwitch(5, [
        [1, (v) => `One: ${v}`],
        [1, (v) => `Also One: ${v}`],
      ]);
    }).toThrow(DuplicateCaseError);
  });

  test("works with string values", () => {
    const result = inlineSwitch("apple", [
      ["banana", () => "yellow"],
      ["apple", () => "red"],
      ["orange", () => "orange"],
    ]);
    expect(result).toBe("red");
  });

  test("works with mixed types of patterns", () => {
    const result = inlineSwitch(7, [
      [5, (v) => `Exact: ${v}`],
      [[6, 7, 8], (v) => `Array: ${v}`],
      [(v) => v > 10, (v) => `Predicate: ${v}`],
    ]);
    expect(result).toBe("Array: 7");
  });
});

describe("switchValue", () => {
  test("works with simple values", () => {
    const result = switchValue(
      "hello",
      ["hi", () => "greeting"],
      ["hello", () => "world"],
      ["bye", () => "farewell"]
    );
    expect(result).toBe("world");
  });

  test("works with arrays", () => {
    const result = switchValue(
      2,
      [[1, 2, 3], (v) => `Small: ${v}`],
      [[4, 5, 6], (v) => `Medium: ${v}`]
    );
    expect(result).toBe("Small: 2");
  });
});
