// ===================================
// Theme Manager - Dark Mode Support
// ===================================

'use strict';

class ThemeManager {
  static currentTheme = 'light';
  static storageKey = 'sky-learning-theme';

  /**
   * Initialize theme manager
   */
  static init() {
    // Load saved theme
    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme);

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.storageKey)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Create theme toggle button if it doesn't exist
    this.createToggleButton();
  }

  /**
   * Get saved theme or system preference
   */
  static getSavedTheme() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      return saved;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Set theme
   */
  static setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);

    // Update toggle button
    this.updateToggleButton();

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme }
    }));

    // Track in analytics
    if (window.Analytics) {
      window.Analytics.trackEvent('Theme', 'change', theme);
    }
  }

  /**
   * Toggle theme
   */
  static toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);

    // Show notification
    if (window.ToastNotification) {
      const message = newTheme === 'dark'
        ? 'تم تفعيل الوضع الليلي 🌙'
        : 'تم تفعيل الوضع النهاري ☀️';
      ToastNotification.info(message, 2000);
    }
  }

  /**
   * Get current theme
   */
  static getTheme() {
    return this.currentTheme;
  }

  /**
   * Create theme toggle button
   */
  static createToggleButton() {
    // Check if button already exists
    if (document.getElementById('theme-toggle')) {
      return;
    }

    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'theme-toggle-btn';
    button.setAttribute('aria-label', 'تبديل الوضع الليلي/النهاري');
    button.setAttribute('title', 'تبديل المظهر');
    button.innerHTML = `
      <span class="theme-icon theme-icon-light">☀️</span>
      <span class="theme-icon theme-icon-dark">🌙</span>
    `;

    button.addEventListener('click', () => this.toggle());

    // Add to page
    document.body.appendChild(button);
  }

  /**
   * Update toggle button
   */
  static updateToggleButton() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    if (this.currentTheme === 'dark') {
      button.classList.add('dark');
    } else {
      button.classList.remove('dark');
    }
  }

  /**
   * Listen to theme changes
   */
  static onChange(callback) {
    window.addEventListener('themechange', (e) => {
      callback(e.detail.theme);
    });
  }
}

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
}

export default ThemeManager;
