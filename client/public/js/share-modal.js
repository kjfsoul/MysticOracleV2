// Share Modal Script - dynamically injects share UI if missing
document.addEventListener('DOMContentLoaded', () => {
  // Helper to create element with attrs
  function create(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
    children.forEach(child => el.appendChild(child));
    return el;
  }

  // Ensure share button exists
  let shareButton = document.getElementById('share-button');
  if (!shareButton) {
    shareButton = create('button', {
      id: 'share-button',
      style: 'position:fixed;bottom:20px;right:20px;padding:10px 15px;background:#FFD700;color:#000;border:none;border-radius:4px;cursor:pointer;z-index:1000;'
    });
    shareButton.textContent = 'Connect';
    document.body.appendChild(shareButton);
  }

  // Ensure share modal exists
  let shareModal = document.getElementById('share-modal');
  if (!shareModal) {
    // Overlay
    shareModal = create('div', {
      id: 'share-modal',
      class: 'hidden',
      style: 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000;'
    });
    // Modal content
    const box = create('div', {
      style: 'background:#fff;padding:20px;border-radius:8px;max-width:90%;text-align:center;'
    });
    // Close button
    const closeBtn = create('button', {
      id: 'share-modal-close',
      style: 'position:absolute;top:10px;right:10px;background:none;border:none;font-size:20px;cursor:pointer;'
    });
    closeBtn.innerHTML = '&times;';
    // Title
    const title = create('h3', {}, []);
    title.textContent = 'Connect with Mystic Arcana';
    box.appendChild(title);
      // Custom action buttons
      const actions = [
        { label: 'Sign Up', url: '/signup' },
        { label: 'Instagram', url: 'https://instagram.com/mysticarcana' },
        { label: 'Twitter', url: 'https://twitter.com/mysticarcana' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/company/mysticarcana' }
      ];
      actions.forEach(({ label, url }) => {
        const btn = create('a', {
          href: url,
          target: '_blank',
          style: 'margin:5px;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;display:inline-block;text-decoration:none;color:#000;'
        });
        btn.textContent = label;
        box.appendChild(btn);
      });
    shareModal.appendChild(box);
    shareModal.appendChild(closeBtn);
    document.body.appendChild(shareModal);
  }

  // Show modal
  shareButton.addEventListener('click', e => {
    e.preventDefault();
    shareModal.classList.remove('hidden');
  });

  // Close modal
  const closeModal = () => shareModal.classList.add('hidden');
  const closeButton = document.getElementById('share-modal-close');
  if (closeButton) closeButton.addEventListener('click', closeModal);
  shareModal.addEventListener('click', e => {
    if (e.target === shareModal) closeModal();
  });

});
