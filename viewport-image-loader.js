/**
 * ViewportImageLoader - Efficient lazy loading for low-processing devices
 * Only loads images/videos visible in viewport, unloads when scrolled out
 * Uses Intersection Observer API for optimal performance
 */

class ViewportImageLoader {
  constructor(options = {}) {
    this.loadThreshold = options.loadThreshold || '50px';
    this.unloadThreshold = options.unloadThreshold || '100px';
    this.rootMargin = `${this.loadThreshold} 0px ${this.loadThreshold} 0px`;
    this.loadedImages = new Map();
    this.observer = null;
    this.videoObserver = null;
    
    this.init();
  }

  init() {
    // Observer for loading images when visible
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: this.rootMargin,
        threshold: 0.01 // Trigger even if 1% is visible
      }
    );

    // Separate observer for videos (more aggressive unloading)
    this.videoObserver = new IntersectionObserver(
      (entries) => this.handleVideoIntersection(entries),
      {
        root: null,
        rootMargin: this.unloadThreshold,
        threshold: 0
      }
    );
  }

  /**
   * Observe all images/videos in a container
   */
  observeContainer(container) {
    if (!container) return;

    // Observe all images
    const images = container.querySelectorAll('img[data-src]');
    images.forEach(img => {
      // Store original src in data-src
      if (!img.dataset.src && img.src) {
        img.dataset.src = img.src;
        img.src = ''; // Clear src to prevent loading
      }
      this.observer.observe(img);
    });

    // Observe all videos
    const videos = container.querySelectorAll('video[data-src]');
    videos.forEach(video => {
      if (!video.dataset.src && video.src) {
        video.dataset.src = video.src;
        video.src = ''; // Clear src to prevent loading
      }
      this.videoObserver.observe(video);
    });
  }

  /**
   * Handle image intersection (load/unload)
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target;

      if (entry.isIntersecting) {
        // Load image when entering viewport
        this.loadElement(element);
      } else {
        // Unload image when leaving viewport (with delay to prevent thrashing)
        this.scheduleUnload(element);
      }
    });
  }

  /**
   * Handle video intersection (aggressive unloading for memory)
   */
  handleVideoIntersection(entries) {
    entries.forEach(entry => {
      const video = entry.target;

      if (entry.isIntersecting) {
        // Load video when visible
        this.loadElement(video);
      } else {
        // Immediately unload video when out of viewport
        this.unloadVideo(video);
      }
    });
  }

  /**
   * Load an image or video element
   */
  loadElement(element) {
    if (this.loadedImages.has(element)) return; // Already loaded

    const src = element.dataset.src;
    if (!src) return;

    if (element.tagName === 'VIDEO') {
      this.loadVideo(element, src);
    } else if (element.tagName === 'IMG') {
      this.loadImage(element, src);
    }
  }

  /**
   * Load image with error handling
   */
  loadImage(img, src) {
    if (img.src === src) return; // Already loaded

    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      this.loadedImages.set(img, true);
      img.classList.add('loaded');
    };

    tempImg.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      img.classList.add('error');
    };

    tempImg.src = src;
  }

  /**
   * Load video element
   */
  loadVideo(video, src) {
    if (video.src === src) return; // Already loaded

    video.src = src;
    this.loadedImages.set(video, true);
    video.classList.add('loaded');
    video.load();
  }

  /**
   * Schedule unload with debounce to prevent thrashing
   */
  scheduleUnload(element) {
    if (!this.loadedImages.has(element)) return;

    // Clear any pending unload
    if (element.unloadTimer) {
      clearTimeout(element.unloadTimer);
    }

    // Schedule unload after delay (500ms to prevent rapid load/unload cycles)
    element.unloadTimer = setTimeout(() => {
      this.unloadElement(element);
    }, 500);
  }

  /**
   * Unload an element (clear from memory)
   */
  unloadElement(element) {
    if (!this.loadedImages.has(element)) return;

    if (element.tagName === 'VIDEO') {
      this.unloadVideo(element);
    } else if (element.tagName === 'IMG') {
      this.unloadImage(element);
    }

    this.loadedImages.delete(element);
  }

  /**
   * Unload image (clear src)
   */
  unloadImage(img) {
    if (img.src && img.dataset.src) {
      img.src = '';
      img.classList.remove('loaded');
    }
  }

  /**
   * Unload video (stop playback, clear src)
   */
  unloadVideo(video) {
    // Stop playback and reset
    video.pause();
    video.currentTime = 0;
    video.src = '';
    video.load();
    video.classList.remove('loaded');
  }

  /**
   * Unobserve all elements in container
   */
  unobserveContainer(container) {
    if (!container) return;

    const images = container.querySelectorAll('img');
    images.forEach(img => this.observer.unobserve(img));

    const videos = container.querySelectorAll('video');
    videos.forEach(video => this.videoObserver.unobserve(video));
  }

  /**
   * Stop all observers and clean up
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
    this.loadedImages.clear();
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.ViewportImageLoader = ViewportImageLoader;
}
