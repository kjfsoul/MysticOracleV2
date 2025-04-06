// Share modal functionality
// Only initialize if the document is already loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initShareModal();
} else {
  document.addEventListener("DOMContentLoaded", initShareModal);
}

function initShareModal() {
  // Safely check for the element before adding event listeners
  const shareModalTrigger = document.getElementById("shareModalTrigger");

  if (shareModalTrigger) {
    shareModalTrigger.addEventListener("click", () => {
      console.log("Share modal triggered");
    });
  } else {
    console.log(
      "Share modal functionality will be implemented in a future update."
    );
  }
}
