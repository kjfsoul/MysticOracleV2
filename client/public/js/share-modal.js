// Share Modal Script
// This script handles the share functionality for the Mystic Arcana application

// Wait for DOM to be fully loaded
function initShareModal() {
  // Find the share button and modal elements
  const shareButton = document.querySelector('#share-button');
  const shareModal = document.querySelector('#share-modal');
  const closeButton = document.querySelector('#share-modal-close');

  // Log for debugging
  console.log('Share modal initialization:', {
    shareButtonExists: !!shareButton,
    shareModalExists: !!shareModal,
    closeButtonExists: !!closeButton
  });

  // Only attach event listeners if the elements exist
  if (shareButton && shareModal) {
    // Open modal when share button is clicked
    shareButton.addEventListener('click', function(e) {
      e.preventDefault();
      shareModal.classList.remove('hidden');
      shareModal.classList.add('flex');
    });

    // Close modal when close button is clicked
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        shareModal.classList.add('hidden');
        shareModal.classList.remove('flex');
      });
    }

    // Close modal when clicking outside
    shareModal.addEventListener('click', function(e) {
      if (e.target === shareModal) {
        shareModal.classList.add('hidden');
        shareModal.classList.remove('flex');
      }
    });

    // Handle share buttons
    const shareLinks = document.querySelectorAll('.share-link');
    shareLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.getAttribute('data-platform');
        const url = window.location.href;
        const title = document.title;
        let shareUrl;

        switch(platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
          case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
            break;
          default:
            // Copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
              alert('Link copied to clipboard!');
            }).catch(err => {
              console.error('Could not copy text: ', err);
            });
            return;
        }

        // Open share URL in new window
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  } else {
    console.log('Share modal elements not found on this page');
  }
}

// Try to initialize immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initShareModal, 1);
} else {
  // Otherwise wait for DOM to be loaded
  document.addEventListener('DOMContentLoaded', initShareModal);
}

// Fallback - try again after a delay to ensure all elements are loaded
setTimeout(initShareModal, 1000);
