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

// Decoding an image can be done by sticking it in an HTML
// canvas, as we can read individual pixels off the canvas.
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

export default (() =>
  // Create an event handler to receive messages from the main
  // thread.
  {
    window.onmessage = async (event) => {
      // Just get the bytes directly from the pluginMessage since
      // that's the only type of message we'll receive in this
      // plugin. In more complex plugins, you'll want to check the
      // type of the message.
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
          10
        );
        const newBytes = await encode(canvas, ctx, converted);
        window.parent.postMessage({ pluginMessage: newBytes }, "*");
      }
    };
  })();
