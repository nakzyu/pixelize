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

export const getAvgRGB = (rgbaArr: Uint8ClampedArray) => {
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
    g: getAvgColorVal(colorSum[0], eachCount),
    b: getAvgColorVal(colorSum[0], eachCount),
  };
};

export const faltten = (
  arr: Uint8ClampedArray,
  //threshold pixel
  t: number
) => {};

export const convert = async (imgSrc: string) => {
  const res = await getImageDatafromImageSrc("/icon_13.png");
  // const avg = getAvgRGB(res.data);
  // console.log(avg);
};
