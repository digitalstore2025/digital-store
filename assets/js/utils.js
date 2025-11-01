// ===================================
// Sky Learning Platform - Utility Functions
// Performance, Security, and Helper Functions
// ===================================

'use strict';

// ===================================
// Security Utils
// ===================================
export const SecurityUtils = {
  /**
   * Sanitize HTML to prevent XSS attacks
   * Uses DOMPurify when available, falls back to basic sanitization
   */
  sanitizeHTML(html) {
    if (typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(html);
    }

    // Basic fallback sanitization
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  /**
   * Escape HTML special characters
   */
  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Validate input against XSS patterns
   */
  isValidInput(input) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi
    ];

    return !xssPatterns.some(pattern => pattern.test(input));
  }
};

// ===================================
// Error Handler
// ===================================
export class ErrorHandler {
  static errors = [];
  static maxErrors = 50;

  static handle(error, context = '', showToUser = false) {
    const errorInfo = {
      message: error.message || error,
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack || '',
      userAgent: navigator.userAgent
    };

    // Log to console
    console.error(`[Sky Learning Error] ${context}:`, error);

    // Store error
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Show to user if requested
    if (showToUser && typeof ToastNotification !== 'undefined') {
      ToastNotification.show(
        'حدث خطأ غير متوقع. نعمل على إصلاحه!',
        'error'
      );
    }

    // Send to analytics if available
    if (window.Analytics) {
      window.Analytics.trackError(errorInfo);
    }

    return errorInfo;
  }

  static getErrors() {
    return [...this.errors];
  }

  static clearErrors() {
    this.errors = [];
  }
}

// ===================================
// Storage Manager
// ===================================
export class StorageManager {
  constructor(key, useSession = false) {
    this.key = key;
    this.storage = useSession ? sessionStorage : localStorage;
    this.isAvailable = this.checkAvailability();
    this.cache = null;
  }

  checkAvailability() {
    try {
      const test = '__storage_test__';
      this.storage.setItem(test, test);
      this.storage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('Storage not available:', e);
      return false;
    }
  }

  get(defaultValue = null) {
    if (!this.isAvailable) {
      return this.cache || defaultValue;
    }

    try {
      const item = this.storage.getItem(this.key);
      this.cache = item ? JSON.parse(item) : defaultValue;
      return this.cache;
    } catch (error) {
      ErrorHandler.handle(error, `StorageManager.get(${this.key})`);
      return defaultValue;
    }
  }

  set(value) {
    this.cache = value;

    if (!this.isAvailable) {
      return false;
    }

    try {
      this.storage.setItem(this.key, JSON.stringify(value));
      return true;
    } catch (error) {
      ErrorHandler.handle(error, `StorageManager.set(${this.key})`);
      return false;
    }
  }

  remove() {
    this.cache = null;

    if (!this.isAvailable) {
      return false;
    }

    try {
      this.storage.removeItem(this.key);
      return true;
    } catch (error) {
      ErrorHandler.handle(error, `StorageManager.remove(${this.key})`);
      return false;
    }
  }

  clear() {
    this.cache = null;

    if (!this.isAvailable) {
      return false;
    }

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'StorageManager.clear');
      return false;
    }
  }
}

// ===================================
// Performance Utils
// ===================================
export const PerformanceUtils = {
  /**
   * Debounce function - delays execution until after wait time
   */
  debounce(func, wait = 300) {
    let timeoutId;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeoutId);
        func.apply(this, args);
      };
      clearTimeout(timeoutId);
      timeoutId = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function - executes at most once per wait time
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Lazy load images
   */
  lazyLoadImages(selector = 'img[data-src]') {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);

            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
          }
        });
      });

      document.querySelectorAll(selector).forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll(selector).forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  },

  /**
   * Measure performance
   */
  measurePerformance(name, callback) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

    if (window.Analytics) {
      window.Analytics.trackTiming(name, duration);
    }

    return result;
  },

  /**
   * Request Animation Frame with fallback
   */
  requestAnimFrame: window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { setTimeout(callback, 1000 / 60); }
};

// ===================================
// Validation Utils
// ===================================
export const ValidationUtils = {
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidJourneyId(id) {
    const validJourneys = [
      'london', 'paris', 'amazon',
      'island', 'mountain', 'space'
    ];
    return validJourneys.includes(id?.toLowerCase());
  },

  sanitizeJourneyId(id) {
    if (!id || typeof id !== 'string') {
      return null;
    }
    return id.toLowerCase().trim();
  }
};

// ===================================
// Rate Limiter
// ===================================
export class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    console.warn('Rate limit exceeded');
    return false;
  }

  reset() {
    this.requests = [];
  }
}

// ===================================
// DOM Utils
// ===================================
export const DOMUtils = {
  /**
   * Create element with attributes
   */
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  },

  /**
   * Remove all children from element
   */
  removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  /**
   * Add multiple event listeners
   */
  addEventListeners(element, events) {
    Object.entries(events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  }
};

// ===================================
// Animation Utils
// ===================================
export const AnimationUtils = {
  /**
   * Animate element with class
   */
  animate(element, animationClass, duration = 1000) {
    return new Promise(resolve => {
      element.classList.add(animationClass);

      setTimeout(() => {
        element.classList.remove(animationClass);
        resolve();
      }, duration);
    });
  },

  /**
   * Fade in element
   */
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';

    let opacity = 0;
    const increment = 50 / duration;

    const fade = () => {
      opacity += increment;
      element.style.opacity = opacity;

      if (opacity < 1) {
        requestAnimationFrame(fade);
      }
    };

    fade();
  },

  /**
   * Fade out element
   */
  fadeOut(element, duration = 300) {
    let opacity = 1;
    const decrement = 50 / duration;

    const fade = () => {
      opacity -= decrement;
      element.style.opacity = opacity;

      if (opacity > 0) {
        requestAnimationFrame(fade);
      } else {
        element.style.display = 'none';
      }
    };

    fade();
  },

  /**
   * Slide down element
   */
  slideDown(element, duration = 300) {
    element.style.maxHeight = '0';
    element.style.overflow = 'hidden';
    element.style.display = 'block';

    const height = element.scrollHeight;

    element.style.transition = `max-height ${duration}ms ease-in-out`;
    element.style.maxHeight = height + 'px';

    setTimeout(() => {
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
    }, duration);
  }
};

// ===================================
// Export all utilities
// ===================================
export default {
  SecurityUtils,
  ErrorHandler,
  StorageManager,
  PerformanceUtils,
  ValidationUtils,
  RateLimiter,
  DOMUtils,
  AnimationUtils
};
