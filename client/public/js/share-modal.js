// Share Modal Script
// This script handles the share functionality for the Mystic Arcana application

function initShareModal() {
  // Find the share button and modal elements
  const shareButton = document.querySelector('#share-button');
  const shareModal = document.querySelector('#share-modal');
  const closeButton = document.querySelector('#share-modal-close'); // May or may not exist depending on modal structure

  // Log for debugging
  console.log('Attempting Share modal initialization:', {
    shareButtonExists: !!shareButton,
    shareModalExists: !!shareModal,
    closeButtonExists: !!closeButton
  });

  // --- CORE LOGIC: Only proceed if essential elements are found ---
  if (shareButton && shareModal) {
    console.log('Share button and modal found. Attaching listeners.');

    // Open modal when share button is clicked
    shareButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default link behavior if it's an anchor
      console.log('Share button clicked');
      shareModal.classList.remove('hidden');
      shareModal.classList.add('flex'); // Assuming flex is used for visibility
    });

    // Close modal when close button is clicked (if it exists)
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        console.log('Share modal close button clicked');
        shareModal.classList.add('hidden');
        shareModal.classList.remove('flex');
      });
    } else {
      console.log('Share modal close button (#share-modal-close) not found.');
    }

    // Close modal when clicking on the modal background (the overlay)
    shareModal.addEventListener('click', function(e) {
      // Check if the click is directly on the modal background, not its children
      if (e.target === shareModal) {
        console.log('Share modal background clicked');
        shareModal.classList.add('hidden');
        shareModal.classList.remove('flex');
      }
    });

    // Handle specific share platform links within the modal
    const shareLinks = document.querySelectorAll('#share-modal .share-link'); // Be more specific with selector
    console.log(`Found ${shareLinks.length} share links inside the modal.`);

    shareLinks.forEach(link => {
      // Extra safety check, though querySelectorAll shouldn't return null items
      if (!link) {
          console.warn('Encountered a null element in shareLinks NodeList.');
          return; // Skip this iteration
      }
      
      link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
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
