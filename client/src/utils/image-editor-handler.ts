// client/src/utils/image-editor-handler.ts
document.addEventListener('DOMContentLoaded', () => {
  // Wait for DOM to be ready
  const downloadButton = document.querySelector(".tui-image-editor-main-container .tui-image-editor-download-btn");
  
  if (downloadButton) {
    // Check if the element exists
    downloadButton.addEventListener("click", (event) => {
      // Your event handler code here
      console.log("Download button clicked!");
      // Add your custom logic here
    });
  } else {
    console.error("Download button not found in the DOM");
  }
});
