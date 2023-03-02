import { convert } from "pixelize";

function encode(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  imageData: ImageData
): Promise<Uint8Array> {
  ctx.putImageData(imageData, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer)
          resolve(new Uint8Array(reader.result));
        else {
          reject();
        }
      };
      reader.onerror = () => reject(new Error("Could not read from blob"));
      reader.readAsArrayBuffer(blob as Blob);
    });
  });
}

async function decode(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  bytes: Uint8Array
) {
  const url = URL.createObjectURL(new Blob([bytes]));
  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return imageData;
}

export default (() => {
  const $slider = document.querySelector("#slider");
  const $p = document.querySelector(".p_size");
  $slider?.addEventListener("change", (e) => {
    // trigger re-render on change
    window.parent.postMessage({ pluginMessage: {} }, "*");
    if ($p) {
      $p.innerHTML = `block size:${(e.target as HTMLInputElement).value}`;
    }
  });

  const $revert = document.querySelector(".revert");

  $revert?.addEventListener("click", () => {
    window.parent.postMessage({ pluginMessage: { revert: true } }, "*");
  });

  window.onmessage = async (event) => {
    const bytes = event.data.pluginMessage;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = await decode(canvas, ctx, bytes);

      const converted = await convert(
        {
          pixels: imageData.data,
          width: imageData.width,
          height: imageData.height,
        },
        Number(
          (document.querySelector("#slider") as HTMLInputElement)?.value
        ) ?? 1
      );
      const newBytes = await encode(canvas, ctx, converted);
      window.parent.postMessage({ pluginMessage: newBytes }, "*");
    }
  };
})();
