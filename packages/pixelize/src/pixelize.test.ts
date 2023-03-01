import {
  divideLinearArrayByThreshold,
  translateVec2IndexIn2DArrayToIndexInLinearArray,
} from ".";
import { describe, expect, it } from "vitest";

// describe("flatten 2x2 image by threshold 1", () => {
//   const initial = new Uint8ClampedArray([
//     0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255,
//   ]);
//   const answer = new Uint8ClampedArray([
//     128, 128, 128, 255, 128, 128, 128, 255, 128, 128, 128, 255, 128, 128, 128,
//     255,
//   ]);

//   expect(faltten(initial, THRESHOLD.ONE)).toEqual(answer);
// });

describe("translate vec2 to linear", () => {
  it("", () => {
    expect(
      translateVec2IndexIn2DArrayToIndexInLinearArray({ x: 50, y: 0 }, 100)
    ).toBe(50);
  });
  it("", () => {
    expect(
      translateVec2IndexIn2DArrayToIndexInLinearArray({ x: 4, y: 4 }, 10)
    ).toBe(44);
  });
  it("", () => {
    expect(
      translateVec2IndexIn2DArrayToIndexInLinearArray({ x: 100, y: 0 }, 200)
    ).toBe(100);
  });
  it("", () => {
    expect(
      translateVec2IndexIn2DArrayToIndexInLinearArray({ x: 0, y: 9 }, 200)
    ).toBe(1800);
  });
});

describe("divide", () => {
  it("", () => {
    expect(divideLinearArrayByThreshold(1, 100, 100).length).toBe(10000);
  });

  it("", () => {
    expect(divideLinearArrayByThreshold(1, 100, 100).length).toBe(2500);
  });
});
