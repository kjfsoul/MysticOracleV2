// Share modal functionality
// This is a completely passive script that won't cause errors
(function () {
  // Only run this code when the DOM is fully loaded and document is defined
  if (typeof document === "undefined") {
    console.log("Document not available, skipping share modal initialization");
    return;
  }

  // Always use DOMContentLoaded to ensure the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Add a longer delay to ensure all dynamic content is loaded
    setTimeout(initShareModal, 2000);
  });

  function initShareModal() {
    // Safely check if the element exists without causing errors
    if (typeof document !== "undefined") {
      try {
        console.log("Initializing share modal functionality");

        // Use querySelector instead of getElementById for better compatibility
        const shareButtons = document.querySelectorAll("[data-share-trigger]");

        if (shareButtons && shareButtons.length > 0) {
          console.log(`Found ${shareButtons.length} share buttons`);

          shareButtons.forEach((button, index) => {
            if (button) {
              // Check if button exists
              console.log(`Adding click listener to share button ${index + 1}`);
              button.addEventListener("click", handleShareClick);
            }
          });
          console.log("Share functionality initialized successfully");
        } else {
          console.log("No share buttons found on the page yet, will retry");
          // Retry after another delay if no buttons found
          setTimeout(initShareModal, 3000);
        }
      } catch (e) {
        // Log the error for debugging
        console.error("Error initializing share modal:", e);
      }
    }
  }

  function handleShareClick(e) {
    // Prevent default behavior
    e.preventDefault();

    // Get share data from data attributes
    const button = e.currentTarget;
    const url = button.getAttribute("data-share-url") || window.location.href;
    const title = button.getAttribute("data-share-title") || document.title;

    // Use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: url,
        })
        .catch(() => {
          // Fallback to clipboard copy
          copyToClipboard(url);
        });
    } else {
      // Fallback to clipboard copy
      copyToClipboard(url);
    }
  }

  function copyToClipboard(text) {
    // Create a temporary input element
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.value = text;
    document.body.appendChild(input);

    // Select and copy the text
    input.select();
    document.execCommand("copy");

    // Remove the temporary element
    document.body.removeChild(input);

    // Show a success message
    showToast("Link copied to clipboard!");
  }

  function showToast(message) {
    // Create a simple toast notification
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    toast.style.color = "white";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "9999";

    // Add the toast to the document
    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
})();
