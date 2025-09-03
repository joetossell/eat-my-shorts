// Eat My Shorts - content.js
// Removes YouTube Shorts from YouTube pages

function removeShortsAndRecommended() {
  // Remove Shorts shelf on homepage and other pages
  document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-reel-item-renderer').forEach(el => {
    el.remove();
    console.log('[Eat My Shorts] Removed Shorts shelf or reel:', el);
  });

  // Remove Shorts from sidebar
  document.querySelectorAll('a[title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"]').forEach(el => {
    let parent = el.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, li');
    if (parent) {
      parent.remove();
      console.log('[Eat My Shorts] Removed Shorts sidebar parent:', parent);
    } else {
      el.remove();
      console.log('[Eat My Shorts] Removed Shorts sidebar entry:', el);
    }
  });

  // Remove Shorts from search results
  document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer').forEach(el => {
    const badge = el.querySelector('a[href*="/shorts/"]');
    if (badge) {
      el.remove();
      console.log('[Eat My Shorts] Removed Shorts from search results:', el);
    }
  });

  // Remove Shorts from video pages (redirect if on a Shorts page)
  if (window.location.pathname.startsWith('/shorts/')) {
    console.log('[Eat My Shorts] Redirecting from Shorts page to homepage.');
    window.location.href = 'https://www.youtube.com/';
  }

  // Remove recommended videos sidebar on watch pages
  document.querySelectorAll('ytd-watch-next-secondary-results-renderer, #related, ytd-compact-video-renderer').forEach(el => {
    el.remove();
    console.log('[Eat My Shorts] Removed recommended sidebar or compact video:', el);
  });

  // Remove recommended videos on homepage ("Recommended" and similar shelves)
  document.querySelectorAll('ytd-rich-shelf-renderer, ytd-shelf-renderer').forEach(el => {
    // Try to match shelves with "Recommended" or similar titles
    const title = el.querySelector('#title, .shelf-title, h2');
    if (title && /recommended|for you|up next|suggested/i.test(title.textContent)) {
      el.remove();
      console.log('[Eat My Shorts] Removed recommended shelf:', el);
    }
  });
}


// --- Aggressively block endless scroll on YouTube ---
function removeEndlessScrollElements() {
  // Remove "Show more" or "Load more" buttons
  const showMoreSelectors = [
    'ytd-continuation-item-renderer',
    'tp-yt-paper-button[aria-label="Show more"]',
    'tp-yt-paper-button[aria-label="Load more"]',
    'button[aria-label="Show more"]',
    'button[aria-label="Load more"]',
    '#continuations',
    '.ytp-show-more',
    '.ytp-load-more',
    'ytd-button-renderer[is-paper-button]'
  ];
  showMoreSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.remove();
      console.log('[Eat My Shorts] Removed endless scroll button or container:', el);
    });
  });

  // Aggressively limit the number of video items on the page
  const maxVideos = 40; // You can adjust this number
  const videoSelectors = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-playlist-video-renderer'
  ];
  videoSelectors.forEach(sel => {
    const videos = Array.from(document.querySelectorAll(sel));
    if (videos.length > maxVideos) {
      videos.slice(maxVideos).forEach(el => {
        el.remove();
        console.log('[Eat My Shorts] Removed extra video to block endless scroll:', el);
      });
    }
  });
}

// Run on load

function runAllRemovals() {
  console.log('[Eat My Shorts] Running all removal features.');
  removeShortsAndRecommended();
  removeEndlessScrollElements();
}

runAllRemovals();

// Run on navigation and DOM changes (YouTube is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log('[Eat My Shorts] Detected navigation, rerunning all removal features.');
    setTimeout(runAllRemovals, 500);
  }
  runAllRemovals();
}).observe(document.body, { childList: true, subtree: true });
