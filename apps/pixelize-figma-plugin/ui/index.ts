export default (() => {
  const createButton = document.querySelector("#create");
  if (createButton) {
    createButton.addEventListener("click", () => {
      //   console.log("click");
      parent.postMessage({ pluginMessage: "xx" }, "*");
    });
  }
})();
