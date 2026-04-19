/**
 * Device Optimization Utility
 * Detects device capabilities and applies performance optimizations
 * for lower RAM, CPU, and GPU devices
 */

(function() {
  'use strict';

  // Device capability detection
  const DeviceOptimization = {
    // Check device capabilities
    isLowEndDevice() {
      // Check available memory (if supported)
      const memory = navigator.deviceMemory;
      if (memory && memory <= 4) return true;

      // Check processor cores
      const cores = navigator.hardwareConcurrency;
      if (cores && cores <= 2) return true;

      // Check performance entries
      if (performance.memory) {
        const ratio = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
        if (ratio > 0.85) return true;
      }

      return false;
    },

    // Check for prefersReducedMotion
    prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Check connection speed
    isSlowNetwork() {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!connection) return false;
      
      const effectiveType = connection.effectiveType;
      return effectiveType === '2g' || effectiveType === '3g' || effectiveType === '4g' && connection.downlink < 5;
    },

    // Apply CSS optimizations
    applyOptimizations() {
      const isLowEnd = this.isLowEndDevice();
      const prefersReduced = this.prefersReducedMotion();
      const isSlowNet = this.isSlowNetwork();

      // Set data attributes on document root
      if (isLowEnd) {
        document.documentElement.setAttribute('data-low-end-device', 'true');
      }
      if (prefersReduced) {
        document.documentElement.setAttribute('data-prefers-reduced-motion', 'true');
      }
      if (isSlowNet) {
        document.documentElement.setAttribute('data-slow-network', 'true');
      }

      // Inject optimization stylesheet
      this.injectOptimizationStyles(isLowEnd, prefersReduced, isSlowNet);

      // Disable backdrop filters on low-end devices
      if (isLowEnd || prefersReduced) {
        this.disableBackdropFilters();
      }

      // Reduce animations on low-end devices
      if (isLowEnd || prefersReduced) {
        this.reduceAnimations();
      }

      // Disable high-cost visual effects
      if (isLowEnd) {
        this.disableExpensiveEffects();
      }

      // Lazy load images on slow networks
      if (isSlowNet) {
        this.lazyLoadImages();
      }
    },

    // Inject optimization CSS
    injectOptimizationStyles(isLowEnd, prefersReduced, isSlowNet) {
      const style = document.createElement('style');
      let css = '';

      // For low-end devices
      if (isLowEnd || prefersReduced) {
        css += `
          /* Disable expensive animations */
          * {
            animation-duration: 0s !important;
            transition-duration: 0.1s !important;
            transition-timing-function: linear !important;
          }

          /* Remove backdrop filters - very expensive */
          .sidebar, .topbar, .upload-box, .modal, .modal-content {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* Simplify button hover effects */
          .button::before {
            animation: none !important;
            transition: filter 0.1s linear !important;
          }

          /* Disable expensive will-change */
          .button, .button::before, .grid-item img, 
          .grid-item video, .modal-arrow {
            will-change: auto !important;
          }

          /* Reduce filter complexity */
          .button::before {
            filter: none !important;
          }

          /* Remove box-shadows on low-end */
          * {
            box-shadow: none !important;
          }

          /* Disable fixed background attachment */
          body::before {
            background-attachment: scroll !important;
          }
        `;
      }

      // For slow networks
      if (isSlowNet) {
        css += `
          /* Reduce animation smoothness to save bandwidth */
          * {
            transition-duration: 0.05s !important;
          }

          /* Load images in lower quality first */
          img {
            image-rendering: pixelated;
          }
        `;
      }

      style.textContent = css;
      document.head.appendChild(style);
    },

    // Disable backdrop filters
    disableBackdropFilters() {
      const elements = document.querySelectorAll('[style*="backdrop-filter"]');
      elements.forEach(el => {
        el.style.backdropFilter = 'none';
      });
    },

    // Reduce animations
    reduceAnimations() {
      document.body.style.animation = 'none';
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      animatedElements.forEach(el => {
        el.style.animation = 'none';
      });
    },

    // Disable expensive effects
    disableExpensiveEffects() {
      // Disable fixed backgrounds
      if (document.body.style.backgroundAttachment === 'fixed') {
        document.body.style.backgroundAttachment = 'scroll';
      }

      // Remove complex filters
      const filtered = document.querySelectorAll('[style*="filter"]');
      filtered.forEach(el => {
        if (el.style.filter && el.style.filter.includes('blur')) {
          el.style.filter = el.style.filter.replace(/blur\([^)]*\)/g, '');
        }
      });
    },

    // Lazy load images
    lazyLoadImages() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                observer.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    },

    // Optimize Firebase loading
    reduceFirebaseFeatures() {
      // Only load database module, not storage or auth unless needed
      window.OPTIMIZE_FIREBASE = true;
    }
  };

  // Run optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      DeviceOptimization.applyOptimizations();
    });
  } else {
    DeviceOptimization.applyOptimizations();
  }

  // Also apply optimizations at script load time for quick effect
  DeviceOptimization.applyOptimizations();

  // Expose for external use
  window.DeviceOptimization = DeviceOptimization;
})();
