// client/src/utils/image-editor-handler.ts
document.addEventListener('DOMContentLoaded', () => {
  // Wait for DOM to be ready
  const downloadButton = document.querySelector(".tui-image-editor-main-container .tui-image-editor-download-btn");
  
  downloadButton?.addEventListener("click", () => {
    console.log("Download button clicked!");
  });
});
