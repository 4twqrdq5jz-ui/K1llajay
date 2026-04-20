/**
 * Anti-Lag Optimization Utility
 * Prevents lagging through performance optimization techniques
 */

(function() {
  'use strict';

  window.AntiLagOptimization = {
    // ========================================================================
    // 1. BATCH DOM OPERATIONS - Prevent multiple reflows
    // ========================================================================
    
    /**
     * Create elements and batch append (single reflow instead of many)
     * @param {Array} items - Data to render
     * @param {Function} createEl - Function to create element from item
     * @param {Element} container - Target container
     */
    batchAppendElements(items, createEl, container) {
      const fragment = document.createDocumentFragment();
      items.forEach(item => {
        const el = createEl(item);
        fragment.appendChild(el);
      });
      container.appendChild(fragment);
    },

    // ========================================================================
    // 2. PASSIVE EVENT LISTENERS - Don't block scrolling
    // ========================================================================
    
    /**
     * Add passive event listener for better scroll performance
     */
    addPassiveListener(element, event, handler) {
      if (!element) return;
      
      try {
        // Try passive listener first (modern browsers)
        element.addEventListener(event, handler, { passive: true });
      } catch (e) {
        // Fallback for older browsers
        element.addEventListener(event, handler, false);
      }
    },

    /**
     * Setup passive scroll listeners on all scrollable containers
     */
    optimizeScrollListeners() {
      const scrollableElements = document.querySelectorAll(
        '[data-scrollable], .main-content, main'
      );
      
      scrollableElements.forEach(el => {
        // Use passive: true for better scroll performance
        el.addEventListener('scroll', this.throttle(this.handleScroll, 100), {
          passive: true
        });
      });
    },

    // ========================================================================
    // 3. THROTTLE & DEBOUNCE - Reduce handler firing frequency
    // ========================================================================
    
    /**
     * Throttle function - Fire at most once every N milliseconds
     */
    throttle(fn, delay) {
      let lastRun = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastRun >= delay) {
          lastRun = now;
          fn.apply(this, args);
        }
      };
    },

    /**
     * Debounce function - Fire after N milliseconds of inactivity
     */
    debounce(fn, delay) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    // ========================================================================
    // 4. REQUESTANIMATIONFRAME - Sync with browser repaint
    // ========================================================================
    
    /**
     * RAF-throttle for smooth 60fps operations
     */
    rafThrottle(fn) {
      let rafId = null;
      return function(...args) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          fn.apply(this, args);
          rafId = null;
        });
      };
    },

    handleScroll() {
      // Placeholder for scroll handlers
      // Override in specific implementations
    },

    // ========================================================================
    // 5. IMAGE LOADING OPTIMIZATION
    // ========================================================================
    
    /**
     * Setup efficient image loading strategy
     */
    optimizeImageLoading() {
      // Use native lazy loading
      const images = document.querySelectorAll('img[data-lazy]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Load image
              if (img.dataset.lazy) {
                img.src = img.dataset.lazy;
                img.removeAttribute('data-lazy');
                observer.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback: load all images immediately
        images.forEach(img => {
          if (img.dataset.lazy) {
            img.src = img.dataset.lazy;
          }
        });
      }
    },

    /**
     * Cleanup images to prevent memory leaks
     */
    cleanupImages(container) {
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        img.src = '';
        img.alt = '';
      });
    },

    // ========================================================================
    // 6. VIDEO OPTIMIZATION - Prevent video jank
    // ========================================================================
    
    /**
     * Clean up video resources
     */
    cleanupVideo(videoEl) {
      if (!videoEl) return;
      videoEl.pause();
      videoEl.currentTime = 0;
      videoEl.src = '';
      videoEl.load(); // Force cleanup
    },

    /**
     * Preload video metadata only (not full video)
     */
    optimizeVideoPreload(videoEl) {
      if (!videoEl) return;
      videoEl.preload = 'metadata';
      videoEl.muted = true;
      videoEl.playsInline = true;
    },

    // ========================================================================
    // 7. CSS PERFORMANCE - Prevent layout thrashing
    // ========================================================================
    
    /**
     * Batch read/write DOM operations
     * Bad: read, write, read, write (causes thrashing)
     * Good: read all, write all
     */
    batchStyleUpdates(elements, updates) {
      // Read all values first
      const originalValues = elements.map(el => ({
        element: el,
        original: el.getAttribute('style')
      }));

      // Write all updates
      elements.forEach((el, idx) => {
        Object.assign(el.style, updates[idx] || {});
      });

      return originalValues;
    },

    /**
     * Use transform instead of position changes (GPU accelerated)
     * Bad: left, top, width, height (causes reflow)
     * Good: transform: translate(), scale() (GPU accelerated)
     */
    moveWithTransform(element, x, y) {
      element.style.transform = `translate(${x}px, ${y}px)`;
    },

    // ========================================================================
    // 8. MODAL OPTIMIZATION - Prevent modal jank
    // ========================================================================
    
    /**
     * Open modal with optimal performance
     */
    openModalOptimal(modal, content) {
      // Prepare content before showing
      modal.appendChild(content);
      
      // Trigger reflow (allows browser to prepare)
      // eslint-disable-next-line no-unused-expressions
      modal.offsetHeight;
      
      // Add open class (triggers CSS animation)
      modal.classList.add('open');
    },

    /**
     * Close modal and cleanup
     */
    closeModalOptimal(modal) {
      modal.classList.remove('open');
      
      // Wait for animation to finish before cleaning up
      setTimeout(() => {
        const videos = modal.querySelectorAll('video');
        videos.forEach(vid => this.cleanupVideo(vid));
        
        const images = modal.querySelectorAll('img');
        images.forEach(img => {
          img.src = '';
        });
      }, 300); // Match CSS animation duration
    },

    // ========================================================================
    // 9. ANIMATION FRAME LIMITING
    // ========================================================================
    
    /**
     * Limit animation frame rate to prevent GPU overload
     */
    limitFrameRate(targetFps) {
      const frameTime = 1000 / targetFps;
      let lastFrameTime = 0;
      
      return (callback) => {
        return (currentTime) => {
          if (currentTime - lastFrameTime >= frameTime) {
            lastFrameTime = currentTime;
            callback(currentTime);
          }
        };
      };
    },

    // ========================================================================
    // 10. MEMORY LEAK PREVENTION
    // ========================================================================
    
    /**
     * Remove all event listeners from element
     */
    removeAllListeners(element) {
      if (!element) return;
      const clone = element.cloneNode(true);
      element.parentNode?.replaceChild(clone, element);
      return clone;
    },

    /**
     * Cleanup all resources in container
     */
    cleanupContainer(container) {
      if (!container) return;

      // Stop all videos
      container.querySelectorAll('video').forEach(vid => {
        this.cleanupVideo(vid);
      });

      // Clear all images
      this.cleanupImages(container);

      // Remove text content gradually to prevent jank
      container.querySelectorAll('*').forEach(el => {
        el.textContent = '';
      });
    },

    // ========================================================================
    // 11. CSS WILL-CHANGE MANAGEMENT
    // ========================================================================
    
    /**
     * Add will-change for animations, remove after
     */
    animateWithWillChange(element, animationDuration) {
      element.style.willChange = 'transform, opacity';
      
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, animationDuration + 100);
    },

    // ========================================================================
    // 12. INITIALIZATION
    // ========================================================================
    
    /**
     * Initialize all anti-lag optimizations
     */
    init() {
      // Add passive listeners
      this.optimizeScrollListeners();

      // Setup lazy image loading
      this.optimizeImageLoading();

      // Setup throttled resize handler
      window.addEventListener('resize', 
        this.throttle(() => {
          // Handle resize efficiently
          if (window.innerWidth <= 768) {
            document.body.style.setProperty('--mobile', '1');
          } else {
            document.body.style.setProperty('--mobile', '0');
          }
        }, 250), 
        { passive: true }
      );

      console.log('Anti-Lag Optimizations initialized');
    }
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.AntiLagOptimization.init();
    });
  } else {
    window.AntiLagOptimization.init();
  }
})();
