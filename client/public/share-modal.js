/* share-modal.js - Updated with delay to ensure DOM elements are present */
document.addEventListener("DOMContentLoaded", () => {
  // Delay execution to ensure the shareModalTrigger element is available
  setTimeout(() => {
    const shareModalTrigger = document.getElementById("shareModalTrigger");
    if (shareModalTrigger) {
      shareModalTrigger.addEventListener("click", () => {
        // Logic to open the modal goes here.
        console.log("Share modal triggered");
      });
    } else {
      console.warn("Share modal trigger element not found.");
    }
  }, 1000); // Delay for 1 second after DOMContentLoaded
});
