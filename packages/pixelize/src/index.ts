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

export const getIndicesIn2DArray = (
  t: number,
  x: number,
  y: number,
  width: number,
  height: number
): Vec2[] => {
  const localRightEnd = Math.min(x + t + 1, width);
  const localBottomEnd = Math.min(y + t + 1, height);

  const arr = new Array(localRightEnd - x)
    .fill(null)
    .map((_, i) => x + i)
    .map((x) =>
      new Array(localBottomEnd - y).fill(null).map((_, i) => ({ x, y: y + i }))
    );
  return arr.flat().flat();
};

export const divideLinearArrayByThreshold = (
  t: number,
  width: number,
  height: number
) => {
  const indices: Vec2[] = [];
  for (let y = 0; y < height; y += t + 1) {
    for (let x = 0; x < width; x += t + 1) {
      indices.push({ x, y });
    }
  }
  return indices;
};

export const translateVec2IndexIn2DArrayToIndexInLinearArray = (
  vec2: Vec2,
  width: number
) => {
  return (vec2.x + vec2.y * width) * 4;
};

export const convert = async (
  imgSrc: string | { pixels: Uint8ClampedArray; width: number; height: number },
  t: number
) => {
  let width: number, height: number, data: Uint8ClampedArray;

  if (typeof imgSrc === "string") {
    const {
      width: rW,
      height: rH,
      data: rD,
    } = await getImageDatafromImageSrc(imgSrc);

    width = rW;
    height = rH;
    data = rD;
  } else {
    width = imgSrc.width;
    height = imgSrc.height;
    data = imgSrc.pixels as unknown as Uint8ClampedArray;
  }

  const sections = divideLinearArrayByThreshold(t, width, height);

  const divied2 = sections.map(({ x, y }) => {
    const indicies = getIndicesIn2DArray(t, x, y, width, height);

    const leng = indicies.length;

    const { r, g, b } = indicies.reduce(
      (acc, cur) => {
        const index = translateVec2IndexIn2DArrayToIndexInLinearArray(
          cur,
          width
        );
        const { r, g, b } = getAvgRGB([
          data[index],
          data[index + 1],
          data[index + 2],
          data[index + 3],
        ]);

        acc.r += r;
        acc.g += g;
        acc.b += b;

        return acc;
      },
      { r: 0, g: 0, b: 0 }
    );

    return {
      indicies,
      r: r / leng,
      g: g / leng,
      b: b / leng,
    };
  });

  const dataCopied = data.slice();

  divied2.forEach(({ indicies, r, g, b }) => {
    indicies.forEach((vec2) => {
      const index = translateVec2IndexIn2DArrayToIndexInLinearArray(
        vec2,
        width
      );

      dataCopied[index] = r;
      dataCopied[index + 1] = g;
      dataCopied[index + 2] = b;
    });
  });

  return new ImageData(dataCopied, width, height);
};

export const drawNew = async (t: number) => {
  const newData = await convert("/fallout4.jpg", t);
  const $canvas = document.createElement("canvas");
  document.body.appendChild($canvas);
  $canvas.width = newData.width;
  $canvas.height = newData.height;
  const ctx = $canvas.getContext("2d");
  ctx?.putImageData(newData, 0, 0);
};
