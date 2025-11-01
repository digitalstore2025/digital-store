// ===================================
// Analytics System
// Privacy-friendly analytics tracking
// ===================================

'use strict';

class Analytics {
  static enabled = true;
  static queue = [];
  static sessionId = null;
  static userId = null;

  /**
   * Initialize analytics
   */
  static init(options = {}) {
    this.enabled = options.enabled !== false;
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();

    // Track page view
    this.trackPageView();

    // Track session duration
    this.trackSessionDuration();

    // Track errors globally
    this.setupErrorTracking();

    console.log('[Analytics] Initialized', {
      sessionId: this.sessionId,
      userId: this.userId
    });
  }

  /**
   * Generate unique session ID
   */
  static generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get or create user ID
   */
  static getUserId() {
    const storageKey = 'sky-learning-user-id';
    let userId = localStorage.getItem(storageKey);

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(storageKey, userId);
    }

    return userId;
  }

  /**
   * Track event
   */
  static trackEvent(category, action, label = '', value = null) {
    if (!this.enabled) return;

    const event = {
      type: 'event',
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      page: window.location.pathname
    };

    this.sendEvent(event);

    // Log in development
    if (window.location.hostname === 'localhost') {
      console.log('[Analytics] Event:', event);
    }
  }

  /**
   * Track page view
   */
  static trackPageView(page = window.location.pathname) {
    if (!this.enabled) return;

    const pageView = {
      type: 'pageview',
      page,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };

    this.sendEvent(pageView);
  }

  /**
   * Track learning progress
   */
  static trackLearningProgress(data) {
    this.trackEvent('Learning', 'progress_update', JSON.stringify({
      level: data.level,
      totalPoints: data.totalPoints,
      completedJourneys: data.completedJourneys.length
    }));
  }

  /**
   * Track journey completion
   */
  static trackJourneyComplete(journeyId, score, timeSpent) {
    this.trackEvent('Journey', 'completed', journeyId, score);
    this.trackTiming('Journey', journeyId, timeSpent);
  }

  /**
   * Track game play
   */
  static trackGamePlay(gameName, score, result) {
    this.trackEvent('Game', result, gameName, score);
  }

  /**
   * Track timing
   */
  static trackTiming(category, variable, time) {
    if (!this.enabled) return;

    const timing = {
      type: 'timing',
      category,
      variable,
      time: Math.round(time),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.sendEvent(timing);
  }

  /**
   * Track error
   */
  static trackError(errorInfo) {
    if (!this.enabled) return;

    const error = {
      type: 'error',
      ...errorInfo,
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.sendEvent(error);
  }

  /**
   * Track session duration
   */
  static trackSessionDuration() {
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - startTime;
      this.trackTiming('Session', 'duration', duration);
    });
  }

  /**
   * Setup global error tracking
   */
  static setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: 'Unhandled Promise Rejection',
        reason: event.reason
      });
    });
  }

  /**
   * Send event (override this for actual implementation)
   */
  static sendEvent(event) {
    // Queue event
    this.queue.push(event);

    // In production, send to analytics service
    // For now, just store locally for demo
    this.storeLocally(event);

    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      this.sendToGoogleAnalytics(event);
    }

    // Example: Send to custom endpoint
    // this.sendToEndpoint(event);
  }

  /**
   * Store analytics locally (for demo/development)
   */
  static storeLocally(event) {
    try {
      const key = 'sky-learning-analytics';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      stored.push(event);

      // Keep only last 100 events
      if (stored.length > 100) {
        stored.shift();
      }

      localStorage.setItem(key, JSON.stringify(stored));
    } catch (error) {
      console.warn('Failed to store analytics:', error);
    }
  }

  /**
   * Send to Google Analytics (if available)
   */
  static sendToGoogleAnalytics(event) {
    if (event.type === 'event') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    } else if (event.type === 'pageview') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: event.page
      });
    }
  }

  /**
   * Send to custom endpoint
   */
  static async sendToEndpoint(event) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.warn('Failed to send analytics:', error);
    }
  }

  /**
   * Get analytics data (for dashboard)
   */
  static getData() {
    try {
      const key = 'sky-learning-analytics';
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      return [];
    }
  }

  /**
   * Get statistics
   */
  static getStatistics() {
    const data = this.getData();

    return {
      totalEvents: data.length,
      pageViews: data.filter(e => e.type === 'pageview').length,
      events: data.filter(e => e.type === 'event').length,
      errors: data.filter(e => e.type === 'error').length,
      journeysCompleted: data.filter(e =>
        e.type === 'event' &&
        e.category === 'Journey' &&
        e.action === 'completed'
      ).length,
      gamesPlayed: data.filter(e =>
        e.type === 'event' &&
        e.category === 'Game'
      ).length
    };
  }

  /**
   * Disable analytics
   */
  static disable() {
    this.enabled = false;
    console.log('[Analytics] Disabled');
  }

  /**
   * Enable analytics
   */
  static enable() {
    this.enabled = true;
    console.log('[Analytics] Enabled');
  }

  /**
   * Clear all data
   */
  static clearData() {
    try {
      localStorage.removeItem('sky-learning-analytics');
      this.queue = [];
      console.log('[Analytics] Data cleared');
    } catch (error) {
      console.warn('Failed to clear analytics:', error);
    }
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
  Analytics.init();
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.Analytics = Analytics;
}

export default Analytics;
