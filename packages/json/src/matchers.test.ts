import { describe, expect, it } from "vitest";
import { findCompleteJsonBlock, findPartialJsonBlock } from "./matchers";

describe("findCompleteJsonBlock", () => {
  it("should find a complete JSON block", () => {
    const matcher = findCompleteJsonBlock({ type: "test" });
    const input = '【{"type":"test","data":"value"}】';
    const result = matcher(input);
    expect(result).toEqual({
      startIndex: 0,
      endIndex: input.length,
      outputRaw: input,
    });
  });

  it("should not find incomplete JSON block", () => {
    const matcher = findCompleteJsonBlock({ type: "test" });
    const result = matcher('【{"type":"test","data":"value"}');
    expect(result).toBeUndefined();
  });

  it("should not find JSON block with wrong type", () => {
    const matcher = findCompleteJsonBlock({ type: "test" });
    const result = matcher('【{"type":"other","data":"value"}】');
    expect(result).toBeUndefined();
  });

  it("should find JSON block with custom chars", () => {
    const matcher = findCompleteJsonBlock({
      type: "test",
      startChar: "<<",
      endChar: ">>",
    });
    const input = '<<{"type":"test","data":"value"}>>';
    const result = matcher(input);
    expect(result).toEqual({
      startIndex: 0,
      endIndex: input.length,
      outputRaw: input,
    });
  });
});

describe("findPartialJsonBlock", () => {
  it("should find a partial JSON block", () => {
    const matcher = findPartialJsonBlock({ type: "test" });
    const input = '【{"type":"test","data":"val';
    const result = matcher(input);
    expect(result).toEqual({
      startIndex: 0,
      endIndex: input.length,
      outputRaw: input,
    });
  });

  it("should find a complete JSON block as partial", () => {
    const matcher = findPartialJsonBlock({ type: "test" });
    const input = '【{"type":"test","data":"value"}】';
    const result = matcher(input);
    expect(result).toEqual({
      startIndex: 0,
      endIndex: input.length,
      outputRaw: input,
    });
  });

  it("should not find partial JSON block with wrong type", () => {
    const matcher = findPartialJsonBlock({ type: "test" });
    const result = matcher('【{"type":"other","data":"val');
    expect(result).toBeUndefined();
  });
});
