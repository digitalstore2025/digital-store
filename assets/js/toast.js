// ===================================
// Toast Notification System
// Modern, accessible toast notifications
// ===================================

'use strict';

class ToastNotification {
  static container = null;
  static toasts = [];
  static maxToasts = 3;

  /**
   * Initialize toast container
   */
  static init() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'الإشعارات');
    this.container.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.container);
  }

  /**
   * Show toast notification
   * @param {string} message - The message to display
   * @param {string} type - success, error, warning, info
   * @param {number} duration - Duration in milliseconds
   * @param {object} options - Additional options
   */
  static show(message, type = 'success', duration = 3000, options = {}) {
    this.init();

    // Limit number of toasts
    if (this.toasts.length >= this.maxToasts) {
      this.toasts[0].remove();
    }

    const toast = this.createToast(message, type, duration, options);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }

    return toast;
  }

  /**
   * Create toast element
   */
  static createToast(message, type, duration, options) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    // Sanitize message
    const sanitizedMessage = typeof DOMPurify !== 'undefined'
      ? DOMPurify.sanitize(message)
      : this.escapeHTML(message);

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${this.getIcon(type)}</span>
        <span class="toast-message">${sanitizedMessage}</span>
      </div>
      ${options.closeable !== false ? `
        <button class="toast-close" aria-label="إغلاق">
          <span aria-hidden="true">×</span>
        </button>
      ` : ''}
    `;

    // Progress bar
    if (duration > 0 && options.showProgress !== false) {
      const progress = document.createElement('div');
      progress.className = 'toast-progress';
      progress.style.animationDuration = `${duration}ms`;
      toast.appendChild(progress);
    }

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.remove(toast));
    }

    // Action button
    if (options.action) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'toast-action';
      actionBtn.textContent = options.action.text;
      actionBtn.addEventListener('click', () => {
        options.action.onClick();
        this.remove(toast);
      });
      toast.querySelector('.toast-content').appendChild(actionBtn);
    }

    return toast;
  }

  /**
   * Remove toast
   */
  static remove(toast) {
    toast.classList.add('removing');

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Get icon for toast type
   */
  static getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      loading: '⏳'
    };
    return icons[type] || icons.info;
  }

  /**
   * Escape HTML
   */
  static escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Shorthand methods
   */
  static success(message, duration, options) {
    return this.show(message, 'success', duration, options);
  }

  static error(message, duration, options) {
    return this.show(message, 'error', duration, options);
  }

  static warning(message, duration, options) {
    return this.show(message, 'warning', duration, options);
  }

  static info(message, duration, options) {
    return this.show(message, 'info', duration, options);
  }

  static loading(message, options) {
    return this.show(message, 'loading', 0, { ...options, closeable: true });
  }

  /**
   * Clear all toasts
   */
  static clearAll() {
    this.toasts.forEach(toast => this.remove(toast));
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.ToastNotification = ToastNotification;
}

export default ToastNotification;
