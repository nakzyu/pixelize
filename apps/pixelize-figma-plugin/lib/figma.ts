async function invertImages(node: GeometryMixin) {
  const newFills = [];
  if (!node.fills) return;
  for (const paint of node.fills as Paint[]) {
    if (paint.type === "IMAGE") {
      // Get the (encoded) bytes for this image.
      if (paint.imageHash === null) return;
      const image = figma.getImageByHash(paint.imageHash);
      if (!image) return;
      const bytes = await image.getBytesAsync();

      // Create an invisible iframe to act as a "worker" which
      // will do the task of decoding and send us a message
      // when it's done.
      figma.showUI(__html__, { visible: false });

      // Send the raw bytes of the file to the worker.
      figma.ui.postMessage(bytes);

      // Wait for the worker's response.
      const newBytes: Uint8Array = await new Promise((resolve, reject) => {
        figma.ui.onmessage = (value) => resolve(value);
      });

      // Create a new paint for the new image.
      const newPaint = JSON.parse(JSON.stringify(paint));
      newPaint.imageHash = figma.createImage(newBytes).hash;
      console.log("push!!");
      newFills.push(newPaint);
    }
  }
  node.fills = newFills;
  figma.closePlugin();
}

const selected = figma.currentPage.selection[0] as GeometryMixin;
invertImages(selected);

export default {};
