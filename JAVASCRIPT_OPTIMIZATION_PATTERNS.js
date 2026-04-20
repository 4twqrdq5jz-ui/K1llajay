/**
 * JavaScript Performance Optimization Patterns
 * Examples and best practices for low-end device optimization
 */

// ============================================================================
// 1. FIREBASE OPTIMIZATION
// ============================================================================

// ❌ BAD: Loading all Firebase services
/*
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-storage-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics-compat.js"></script>
*/

// ✅ GOOD: Load only what you need
/*
READ-ONLY PAGES (Gallery, Portfolio, Memes):
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js"></script>

UPLOAD PAGES (Editors):
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-storage-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js"></script>
*/

// ============================================================================
// 2. DOM MANIPULATION OPTIMIZATION
// ============================================================================

// ❌ BAD: DOM manipulation in loops (causes multiple reflows)
function renderItemsBad(items, container) {
  items.forEach(item => {
    const el = document.createElement("div");
    el.textContent = item.name;
    container.appendChild(el); // Reflow happens here EVERY iteration
  });
}

// ✅ GOOD: Batch DOM manipulation with DocumentFragment (single reflow)
function renderItemsGood(items, container) {
  const fragment = document.createDocumentFragment();
  items.forEach(item => {
    const el = document.createElement("div");
    el.textContent = item.name;
    fragment.appendChild(el); // No reflow yet
  });
  container.appendChild(fragment); // Single reflow here
}

// ============================================================================
// 3. EVENT LISTENER OPTIMIZATION
// ============================================================================

// ❌ BAD: Adding listener to every item
function setupItemsClickBad(items) {
  items.forEach(item => {
    item.addEventListener("click", handleItemClick); // Multiple listeners
  });
}

// ✅ GOOD: Event delegation with single listener
function setupItemsClickGood(container) {
  container.addEventListener("click", (e) => {
    const item = e.target.closest(".item");
    if (item) {
      handleItemClick(item);
    }
  });
  // Only ONE listener on parent, not on every child!
}

// ============================================================================
// 4. IMAGE LOADING OPTIMIZATION
// ============================================================================

// ❌ BAD: Eager loading all images
/*
<div class="gallery">
  <img src="image1.jpg" loading="eager" decoding="sync" fetchPriority="high" />
  <img src="image2.jpg" loading="eager" decoding="sync" fetchPriority="high" />
  <img src="image3.jpg" loading="eager" decoding="sync" fetchPriority="high" />
  <img src="image4.jpg" loading="eager" decoding="sync" fetchPriority="high" />
  // ... many more
</div>
*/

// ✅ GOOD: Use lazy loading for off-screen images
/*
<div class="gallery">
  <img src="image1.jpg" loading="lazy" decoding="async" />
  <img src="image2.jpg" loading="lazy" decoding="async" />
  <img src="image3.jpg" loading="lazy" decoding="async" />
  <img src="image4.jpg" loading="lazy" decoding="async" />
  // ... many more
</div>
*/

// ============================================================================
// 5. MEMORY MANAGEMENT - VIDEO OPTIMIZATION
// ============================================================================

// ❌ BAD: Leaving video in memory
function closeModalBad() {
  modal.classList.remove("open");
  // Video stays in memory, player state not cleaned up
}

// ✅ GOOD: Clean up video resources
function closeModalGood() {
  modal.classList.remove("open");
  
  // Release video memory
  modalVid.pause();
  modalVid.currentTime = 0;
  modalVid.src = ""; // Release network resource & memory
  
  // Optional: Remove thumbnail
  if (thumbVideo) {
    thumbVideo.src = "";
  }
}

// ============================================================================
// 6. DEBOUNCING EXPENSIVE OPERATIONS
// ============================================================================

// ❌ BAD: Handler fires on every event
/*
window.addEventListener("resize", () => {
  recalculateGridLayout(); // Expensive operation happens many times
});

window.addEventListener("scroll", () => {
  updateMasonry(); // Expensive operation happens many times
});
*/

// ✅ GOOD: Debounce expensive operations
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedResize = debounce(() => {
  recalculateGridLayout();
}, 250);

const debouncedScroll = debounce(() => {
  updateMasonry();
}, 150);

window.addEventListener("resize", debouncedResize);
window.addEventListener("scroll", debouncedScroll);

// ============================================================================
// 7. CACHING & MEMOIZATION
// ============================================================================

// ❌ BAD: Recalculating expensive operations
function getColorHexBad(colorName) {
  // This gets called multiple times with same color names
  if (colorName === 'red') return '#FF0000';
  if (colorName === 'blue') return '#0000FF';
  // ... more calculations
}

// ✅ GOOD: Memoize (cache) results
const colorHexCache = {
  'red': '#FF0000',
  'blue': '#0000FF'
};

function getColorHexGood(colorName) {
  if (colorHexCache[colorName]) {
    return colorHexCache[colorName];
  }
  
  // Calculate if not cached
  const hex = calculateColorHex(colorName);
  colorHexCache[colorName] = hex;
  return hex;
}

// ============================================================================
// 8. LAZY RENDERING FOR MODALS
// ============================================================================

// ❌ BAD: Render all modal content upfront
let allModalContent = null;

async function openModalBad(id) {
  const product = await fetchProduct(id);
  // Generate ALL variations, images, options upfront
  const html = generateCompleteProductHTML(product);
  modal.innerHTML = html;
  modal.classList.add("open");
}

// ✅ GOOD: Render only visible content
async function openModalGood(id) {
  const product = await fetchProduct(id);
  
  // Render minimal content first
  modal.innerHTML = generateMinimalHTML(product);
  modal.classList.add("open");
  
  // Load additional content after modal is visible
  setTimeout(() => {
    renderProductOptions(product);
    renderProductImages(product);
  }, 0);
}

// ============================================================================
// 9. REQUEST THROTTLING & ABORT
// ============================================================================

// ❌ BAD: Multiple pending requests
let currentRequest = null;

async function searchBad(query) {
  // Previous request might still be pending
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  renderResults(results);
}

// ✅ GOOD: Abort previous requests
let searchController = null;

async function searchGood(query) {
  // Abort previous request
  if (searchController) {
    searchController.abort();
  }
  
  searchController = new AbortController();
  
  try {
    const results = await fetch(
      `/api/search?q=${query}`,
      { signal: searchController.signal }
    ).then(r => r.json());
    
    renderResults(results);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
    }
  }
}

// ============================================================================
// 10. LOCAL STORAGE CACHING
// ============================================================================

// ❌ BAD: Fetch from Firebase every time
async function getItemsBad() {
  const snapshot = await db.ref("items").once("value");
  return snapshot.val();
}

// ✅ GOOD: Cache in localStorage for repeat visits
async function getItemsGood() {
  // Check cache first
  const cached = localStorage.getItem('items_cache');
  const cacheTime = localStorage.getItem('items_cache_time');
  
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  if (cached && cacheTime && (now - parseInt(cacheTime)) < oneHour) {
    return JSON.parse(cached);
  }
  
  // If cache expired or doesn't exist, fetch from Firebase
  const snapshot = await db.ref("items").once("value");
  const data = snapshot.val();
  
  // Cache for future use
  localStorage.setItem('items_cache', JSON.stringify(data));
  localStorage.setItem('items_cache_time', now.toString());
  
  return data;
}

// ============================================================================
// 11. INTERSECTION OBSERVER FOR LAZY LOADING
// ============================================================================

// ✅ GOOD: Use IntersectionObserver for visibility-based optimization
function initLazyVideoLoads() {
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          
          // Only load video when it enters viewport
          if (!video.src && video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
          }
          
          observer.unobserve(video);
        }
      });
    });
    
    document.querySelectorAll('video[data-src]').forEach(video => {
      videoObserver.observe(video);
    });
  }
}

// ============================================================================
// 12. REQUESTANIMATIONFRAME FOR SMOOTH ANIMATIONS
// ============================================================================

// ❌ BAD: Animation without requestAnimationFrame
let scrollTop = 0;
function updateScrollPositionBad() {
  scrollTop = window.scrollY;
  updateParallaxBg(); // Runs on every frame without synchronization
}

// ✅ GOOD: Use requestAnimationFrame
let scrollTop = 0;
let animationFrameId = null;

function syncScrollPositionGood() {
  cancelAnimationFrame(animationFrameId);
  
  animationFrameId = requestAnimationFrame(() => {
    scrollTop = window.scrollY;
    updateParallaxBg(); // Runs synchronized with browser repaint
  });
}

window.addEventListener('scroll', syncScrollPositionGood);

// ============================================================================
// 13. MONITORING PERFORMANCE
// ============================================================================

// ✅ GOOD: Monitor performance on low-end devices
function monitorPerformance() {
  // Check memory usage
  if (performance.memory) {
    const memUsed = performance.memory.usedJSHeapSize;
    const memLimit = performance.memory.jsHeapSizeLimit;
    const ratio = memUsed / memLimit;
    
    console.log(`Memory: ${(ratio * 100).toFixed(1)}%`);
    
    if (ratio > 0.85) {
      console.warn('High memory usage detected on low-end device');
      // Unload unnecessary resources
      unloadBackgroundImages();
      pauseAnimations();
    }
  }
  
  // Check window.PerformanceEventTiming (when available)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) {
            console.warn(`Slow interaction: ${entry.name} took ${entry.duration}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['interaction'] });
    } catch (e) {
      // PerformanceObserver for interactions not supported
    }
  }
}

// Call on interval
setInterval(monitorPerformance, 5000);
