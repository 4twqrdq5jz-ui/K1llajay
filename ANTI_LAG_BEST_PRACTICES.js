/**
 * ANTI-LAG CHECKLIST - Quick Reference for Developers
 * Use this before adding new features to prevent lag
 */

// ============================================================================
// ✅ DO THIS - Prevents Lag
// ============================================================================

// 1. Batch DOM operations
const fragment = document.createDocumentFragment();
items.forEach(item => {
  fragment.appendChild(createElement(item));
});
container.appendChild(fragment);  // ✅ Single reflow

// 2. Use lazy loading for images
<img src="placeholder.jpg" loading="lazy" decoding="async" />

// 3. Use passive event listeners
element.addEventListener('scroll', handler, { passive: true });

// 4. Clean up resources on close
modal.onclose = () => {
  video.pause();
  video.src = "";  // Release resource
  image.src = "";
};

// 5. Throttle expensive handlers
const throttledScroll = AntiLagOptimization.throttle(handleScroll, 100);

// 6. Use one-time listeners
element.addEventListener('load', handler, { once: true });

// 7. Use transform for animations (GPU accelerated)
element.style.transform = `translate(${x}px, ${y}px)`;

// 8. Remove will-change when not animating
element.style.willChange = 'auto';

// ============================================================================
// ❌ DON'T DO THIS - Causes Lag
// ============================================================================

// 1. ❌ Append DOM in loop
items.forEach(item => {
  container.appendChild(createElement(item));  // WRONG!
});

// 2. ❌ Use eager loading for all images
<img src="image.jpg" loading="eager" />

// 3. ❌ Sync image decoding
<img decoding="sync" />  // Blocks rendering

// 4. ❌ Regular event listeners that aren't passive
element.addEventListener('scroll', handler);  // Can block scroll

// 5. ❌ Leave video playing in hidden modal
// Close without cleanup
modal.classList.remove('open');
// Video still playing in memory!

// 6. ❌ Frequent, unthrottled handlers
window.addEventListener('scroll', handleScroll);  // Fires every frame

// 7. ❌ Animate with left/top instead of transform
element.style.left = x + 'px';
element.style.top = y + 'px';  // Causes layout recalculation

// 8. ❌ Keep will-change on always
element.style.willChange = 'transform, opacity';  // Memory overhead

// ============================================================================
// 🎯 PERFORMANCE CHECKLIST BEFORE COMMITTING CODE
// ============================================================================

/*
[ ] Images use loading="lazy" (except above-fold)
[ ] Images use decoding="async"
[ ] No fetchPriority="high" on non-critical images
[ ] Event listeners use { passive: true } when possible
[ ] DOM operations batched with DocumentFragment
[ ] No DOM appends in loops
[ ] Video/audio cleanup on close
[ ] Expensive handlers throttled/debounced
[ ] will-change removed when not animating
[ ] Animations use transform/opacity (not left/top/width/height)
[ ] No memory leaks (check DevTools Memory tab)
[ ] Scroll performance at 60fps (DevTools Performance)
[ ] No long tasks >50ms (DevTools Performance)
*/

// ============================================================================
// 📏 PERFORMANCE BUDGET
// ============================================================================

const PERFORMANCE_BUDGET = {
  // Maximum time for operations
  grid_render_time: 200,        // ms for 50 items
  modal_open_time: 100,         // ms
  scroll_frame_budget: 16,      // ms per frame (60fps)
  interaction_response: 100,    // ms to first response
  memory_per_modal: 5,          // MB
  
  // Maximum intervals for handlers
  scroll_handler: 100,          // ms throttle
  resize_handler: 250,          // ms debounce
  input_validation: 300,        // ms debounce
};

// ============================================================================
// 🧪 TESTING SCRIPT
// ============================================================================

function testPerformance() {
  console.log('=== PERFORMANCE TEST ===');
  
  // Check memory
  if (performance.memory) {
    const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    const limitMB = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
    console.log(`Memory: ${usedMB}MB / ${limitMB}MB`);
  }
  
  // Check device
  const deviceMemory = navigator.deviceMemory;
  const cpuCores = navigator.hardwareConcurrency;
  console.log(`Device: ${deviceMemory}GB RAM, ${cpuCores} CPU cores`);
  
  // Check connection
  const connection = navigator.connection || navigator.mozConnection;
  if (connection) {
    console.log(`Connection: ${connection.effectiveType}`);
  }
  
  // Check if optimization loaded
  console.log(`Anti-lag loaded: ${!!window.AntiLagOptimization}`);
  console.log(`Device optimization loaded: ${!!window.DeviceOptimization}`);
}

// Run: testPerformance() in console

// ============================================================================
// 🚀 COMMON OPTIMIZATIONS BY COMPONENT
// ============================================================================

// Gallery Component
class Gallery {
  constructor(container) {
    this.container = container;
    this.items = [];
  }
  
  // ✅ CORRECT - Uses batching
  renderItems(items) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      const el = this.createItem(item);
      fragment.appendChild(el);
    });
    this.container.appendChild(fragment);
  }
  
  // ✅ CORRECT - Passive listener
  setupClickHandler() {
    AntiLagOptimization.addPassiveListener(
      this.container,
      'click',
      (e) => this.handleItemClick(e)
    );
  }
  
  createItem(item) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = item.src;
    img.loading = 'lazy';        // ✅ Lazy load
    img.decoding = 'async';      // ✅ Non-blocking
    div.appendChild(img);
    return div;
  }
}

// Modal Component
class Modal {
  open(content) {
    this.modal.appendChild(content);
    this.modal.offsetHeight;  // Trigger reflow
    this.modal.classList.add('open');
  }
  
  // ✅ CORRECT - Proper cleanup
  close() {
    this.modal.classList.remove('open');
    setTimeout(() => {
      // Let animation finish
      AntiLagOptimization.cleanupContainer(this.modal);
    }, 300);
  }
}

// Video Player Component
class VideoPlayer {
  play(videoEl) {
    videoEl.play();
  }
  
  // ✅ CORRECT - Full cleanup
  stop(videoEl) {
    AntiLagOptimization.cleanupVideo(videoEl);
  }
}

// ============================================================================
// 📊 BEFORE & AFTER CODE
// ============================================================================

// BEFORE - Laggy implementation
class BadGallery {
  render(items) {
    items.forEach(item => {
      const div = document.createElement('div');
      const img = document.createElement('img');
      img.src = item.src;
      img.loading = 'eager';        // ❌ Loads immediately
      img.decoding = 'sync';        // ❌ Blocks rendering
      img.fetchPriority = 'high';   // ❌ Not needed
      div.appendChild(img);
      this.container.appendChild(div);  // ❌ N reflows!
    });
  }
  
  closeModal() {
    this.modal.classList.remove('open');
    // ❌ No cleanup - memory leak
  }
}

// AFTER - Optimized implementation
class GoodGallery {
  render(items) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      const div = document.createElement('div');
      const img = document.createElement('img');
      img.src = item.src;
      img.loading = 'lazy';        // ✅ Loads when visible
      img.decoding = 'async';      // ✅ Non-blocking
      // Removed fetchPriority     // ✅ Not needed
      div.appendChild(img);
      fragment.appendChild(div);   // ✅ To fragment first
    });
    this.container.appendChild(fragment);  // ✅ Single reflow!
  }
  
  closeModal() {
    AntiLagOptimization.closeModalOptimal(this.modal);  // ✅ Proper cleanup
  }
}

// ============================================================================
// 💡 TIPS
// ============================================================================

/*
RULE 1: Batch DOM changes
  - Instead of: modify, reflow, modify, reflow
  - Do this: batch changes, single reflow

RULE 2: Prefer passive listeners
  - Scroll, wheel, and touch events should be passive
  - Prevents blocking browser optimizations

RULE 3: Lazy load what you can
  - Images: use loading="lazy"
  - Scripts: defer/async
  - Data: load on demand

RULE 4: Clean up after yourself
  - Close videos properly
  - Remove event listeners
  - Clear object references
  - Allow garbage collection

RULE 5: Throttle/debounce handlers
  - Scroll: throttle 100ms
  - Resize: debounce 250ms
  - Input: debounce 300ms

RULE 6: Use GPU acceleration
  - transform and opacity are GPU-accelerated
  - left, top, width, height cause reflow
  - Animate transforms instead

RULE 7: Monitor memory
  - Watch DevTools Memory tab
  - Look for growing graphs (leaks)
  - Use Performance profiler
  - Test on low-end devices
*/

// ============================================================================
// 🔗 RESOURCES
// ============================================================================

// DevTools Performance Testing
/*
1. Open DevTools (F12)
2. Go to Performance tab
3. CPU Throttle: 6x (simulates low-end device)
4. Click Record
5. Navigate/interact with page
6. Stop recording
7. Look for:
   - Red "Long Tasks" (>50ms) = jank sources
   - Blue tasks are good (<50ms)
   - FPS graph shows frame rate
   - Memory graph shows memory leaks
*/

// Test command in console
/*
window.AntiLagOptimization.init()  // Reinit if needed
testPerformance()                   // Run perf test
document.querySelectorAll('img').forEach(img => {
  console.log(img.src, img.loading, img.decoding)  // Check settings
})
*/
