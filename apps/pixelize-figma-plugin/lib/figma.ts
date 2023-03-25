async function pixelizeImages(node: GeometryMixin) {
  const newFills = [];
  if (!node.fills) return;
  for (const paint of node.fills as Paint[]) {
    if (paint.type === "IMAGE") {
      if (paint.imageHash === null) return;
      const image = figma.getImageByHash(paint.imageHash);

      if (!image) return;
      const bytes = await image.getBytesAsync();

      const newPaint = JSON.parse(JSON.stringify(paint));

      figma.ui.postMessage(bytes);

      const newBytes: Uint8Array = await new Promise((resolve) => {
        const initialOnmessageInstance = figma.ui.onmessage;
        figma.ui.onmessage = (value) => {
          figma.ui.onmessage = initialOnmessageInstance;
          resolve(value);
        };
      });

      newPaint.imageHash = figma.createImage(newBytes).hash;
      newFills.push(newPaint);
    }
  }
  node.fills = newFills;
}

export default (() => {
  figma.showUI(__html__, { visible: true });
  figma.ui.onmessage = async (msg) => {
    if (msg.revert === true) {
      figma.triggerUndo();
    } else {
      (figma.currentPage.selection as unknown as GeometryMixin[]).forEach(
        (node: GeometryMixin) => {
          pixelizeImages(node);
        }
      );
    }
  };
})();
