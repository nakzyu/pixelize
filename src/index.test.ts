import { faltten, THRESHOLD } from ".";
import { describe, expect } from "vitest";

describe("flatten 2x2 image by threshold 1", () => {
  const initial = new Uint8ClampedArray([
    0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  ]);
  const answer = new Uint8ClampedArray([
    128, 128, 128, 255, 128, 128, 128, 255, 128, 128, 128, 255, 128, 128, 128,
    255,
  ]);

  expect(faltten(initial, THRESHOLD.ONE)).toEqual(answer);
});
