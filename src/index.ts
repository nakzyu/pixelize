/*
 * `ONE` => 1x1 square
 * `TWO` => 2x2 square
 */
export enum THRESHOLD {
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
  "TEN",
}

type Vec2 = {
  x: number;
  y: number;
};

export const getImageDatafromImageSrc = async (
  imgSrc: string
): Promise<ImageData> =>
  new Promise((resolve, reject) => {
    const $img = document.createElement("img");
    $img.src = imgSrc;

    $img.onload = () => {
      const { width, height } = $img;
      console.log(width, height);
      const $canvas = document.createElement("canvas");
      $canvas.width = width;
      $canvas.height = height;
      const ctx = $canvas.getContext("2d");
      ctx?.drawImage($img, 0, 0);

      const res = ctx?.getImageData(0, 0, width, height);

      if (res) {
        resolve(res);
      }
      reject();
    };
  });

export const getAvgRGB = (rgbaArr: number[]) => {
  const eachCount = rgbaArr.length / 4;
  const colorSum = rgbaArr.reduce((a, b, i) => {
    if ((i + 1) % 4 === 0) return a;

    if (!a[i % 4]) a[i % 4] = 0;
    a[i % 4] += b;
    return a;
  }, {} as Record<number, number>);

  const getAvgColorVal = (number: number, count: number) =>
    Math.floor(number / count);

  return {
    r: getAvgColorVal(colorSum[0], eachCount),
    g: getAvgColorVal(colorSum[1], eachCount),
    b: getAvgColorVal(colorSum[2], eachCount),
  };
};

export const faltten = (
  arr: Uint8ClampedArray,
  //threshold pixel
  t: number
) => {};

export const getIndicesIn2DArray = (
  t: THRESHOLD,
  x: number,
  y: number
): Vec2[] => {
  const indices: Vec2[] = [];
  for (x; x < x + t; x++) {
    for (y; y < y + t; y++) {
      indices.push({ x, y });
    }
  }
  return indices;
};

export const divideLinearArrayByThreshold = (
  t: THRESHOLD,
  width: number,
  height: number
) => {
  const indices: Vec2[] = [];
  for (let x = 0; x < width; x += t + 1) {
    for (let y = 0; y < height; y += t + 1) {
      indices.push({ x, y });
    }
  }
  return indices;
};

export const translateVec2IndexIn2DArrayToIndexInLinearArray = (
  vec2: Vec2,
  width: number
) => {
  return vec2.x + vec2.y * width;
};

const convertLinearArrayToVec2Arr = (arr: Uint8ClampedArray) => {
  return;
};

export const convert = async (imgSrc: string) => {
  const { width, height, data } = await getImageDatafromImageSrc(
    "/icon_13.png"
  );
  const t = THRESHOLD.TWO;
  const divided = divideLinearArrayByThreshold(t, width, height);
};
