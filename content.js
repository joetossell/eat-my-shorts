// Eat My Shorts - content.js
// Removes YouTube Shorts from YouTube pages

function removeShortsAndRecommended() {
  // Remove Shorts shelf on homepage and other pages
  document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-reel-item-renderer').forEach(el => el.remove());

  // Remove Shorts from sidebar
  document.querySelectorAll('a[title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"]').forEach(el => {
    let parent = el.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, li');
    if (parent) parent.remove();
    else el.remove();
  });

  // Remove Shorts from search results
  document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer').forEach(el => {
    const badge = el.querySelector('a[href*="/shorts/"]');
    if (badge) el.remove();
  });

  // Remove Shorts from video pages (redirect if on a Shorts page)
  if (window.location.pathname.startsWith('/shorts/')) {
    window.location.href = 'https://www.youtube.com/';
  }

  // Remove recommended videos sidebar on watch pages
  document.querySelectorAll('ytd-watch-next-secondary-results-renderer, #related, ytd-compact-video-renderer').forEach(el => el.remove());

  // Remove recommended videos on homepage ("Recommended" and similar shelves)
  document.querySelectorAll('ytd-rich-shelf-renderer, ytd-shelf-renderer').forEach(el => {
    // Try to match shelves with "Recommended" or similar titles
    const title = el.querySelector('#title, .shelf-title, h2');
    if (title && /recommended|for you|up next|suggested/i.test(title.textContent)) {
      el.remove();
    }
  });
}

// Run on load
removeShortsAndRecommended();
// Run on navigation (YouTube is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(removeShortsAndRecommended, 500);
  }
  removeShortsAndRecommended();
}).observe(document.body, { childList: true, subtree: true });
