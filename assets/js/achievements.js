// ===================================
// Achievement System - Expanded
// Gamification with badges, streaks, and rewards
// ===================================

'use strict';

class AchievementSystem {
  static achievements = {
    // Journey Achievements
    first_journey: {
      id: 'first_journey',
      name: 'الخطوات الأولى',
      description: 'أكمل أول رحلة تعليمية',
      icon: '👣',
      category: 'journey',
      points: 50,
      requirement: { type: 'journeys_completed', value: 1 }
    },
    world_explorer: {
      id: 'world_explorer',
      name: 'مستكشف العالم',
      description: 'أكمل جميع الرحلات الـ 6',
      icon: '🌍',
      category: 'journey',
      points: 300,
      requirement: { type: 'journeys_completed', value: 6 }
    },
    london_master: {
      id: 'london_master',
      name: 'خبير لندن',
      description: 'احصل على 100% في رحلة لندن',
      icon: '🏰',
      category: 'journey',
      points: 100,
      requirement: { type: 'journey_perfect', journey: 'london' }
    },

    // Learning Achievements
    word_collector: {
      id: 'word_collector',
      name: 'جامع الكلمات',
      description: 'تعلم 50 كلمة جديدة',
      icon: '📝',
      category: 'learning',
      points: 100,
      requirement: { type: 'words_learned', value: 50 },
      progress: { current: 0, target: 50 }
    },
    word_master: {
      id: 'word_master',
      name: 'سيد الكلمات',
      description: 'تعلم 100 كلمة جديدة',
      icon: '📚',
      category: 'learning',
      points: 200,
      requirement: { type: 'words_learned', value: 100 },
      progress: { current: 0, target: 100 }
    },
    vocabulary_expert: {
      id: 'vocabulary_expert',
      name: 'خبير المفردات',
      description: 'تعلم 500 كلمة جديدة',
      icon: '🎓',
      category: 'learning',
      points: 500,
      requirement: { type: 'words_learned', value: 500 },
      progress: { current: 0, target: 500 }
    },

    // Game Achievements
    game_beginner: {
      id: 'game_beginner',
      name: 'لاعب مبتدئ',
      description: 'العب 5 ألعاب',
      icon: '🎮',
      category: 'games',
      points: 50,
      requirement: { type: 'games_played', value: 5 },
      progress: { current: 0, target: 5 }
    },
    perfect_score: {
      id: 'perfect_score',
      name: 'النتيجة المثالية',
      description: 'احصل على 100% في أي لعبة',
      icon: '💯',
      category: 'games',
      points: 100,
      requirement: { type: 'perfect_game_score' }
    },
    game_master: {
      id: 'game_master',
      name: 'سيد الألعاب',
      description: 'احصل على 100% في جميع الألعاب',
      icon: '🏆',
      category: 'games',
      points: 500,
      requirement: { type: 'all_games_perfect' }
    },

    // Streak Achievements
    streak_3: {
      id: 'streak_3',
      name: 'ملتزم',
      description: 'سجل دخول 3 أيام متتالية',
      icon: '🔥',
      category: 'streak',
      points: 50,
      requirement: { type: 'login_streak', value: 3 }
    },
    streak_7: {
      id: 'streak_7',
      name: 'مواظب أسبوعي',
      description: 'سجل دخول 7 أيام متتالية',
      icon: '🌟',
      category: 'streak',
      points: 150,
      requirement: { type: 'login_streak', value: 7 }
    },
    streak_30: {
      id: 'streak_30',
      name: 'بطل الالتزام',
      description: 'سجل دخول 30 يوماً متتالياً',
      icon: '👑',
      category: 'streak',
      points: 500,
      requirement: { type: 'login_streak', value: 30 }
    },

    // Special Achievements
    early_bird: {
      id: 'early_bird',
      name: 'الطائر المبكر',
      description: 'سجل دخول قبل الساعة 8 صباحاً',
      icon: '🌅',
      category: 'special',
      points: 25,
      requirement: { type: 'login_time', before: 8 }
    },
    night_owl: {
      id: 'night_owl',
      name: 'البومة الليلية',
      description: 'تعلم بعد منتصف الليل',
      icon: '🦉',
      category: 'special',
      points: 25,
      requirement: { type: 'activity_time', after: 0, before: 4 }
    },
    speed_learner: {
      id: 'speed_learner',
      name: 'متعلم سريع',
      description: 'أكمل رحلة في أقل من 10 دقائق',
      icon: '⚡',
      category: 'special',
      points: 75,
      requirement: { type: 'journey_time', value: 600 }
    },
    helpful_friend: {
      id: 'helpful_friend',
      name: 'صديق متعاون',
      description: 'شارك المنصة مع 5 أصدقاء',
      icon: '🤝',
      category: 'social',
      points: 100,
      requirement: { type: 'referrals', value: 5 }
    }
  };

  static storage = null;

  /**
   * Initialize achievement system
   */
  static init() {
    this.storage = new (window.StorageManager || class {
      constructor(key) { this.key = key; }
      get(def) { try { return JSON.parse(localStorage.getItem(this.key)) || def; } catch { return def; } }
      set(val) { try { localStorage.setItem(this.key, JSON.stringify(val)); } catch {} }
    })('sky-learning-achievements');

    this.checkDailyStreak();
    this.startPeriodicChecks();

    console.log('[Achievements] System initialized');
  }

  /**
   * Get all achievements
   */
  static getAll() {
    return Object.values(this.achievements);
  }

  /**
   * Get unlocked achievements
   */
  static getUnlocked() {
    const saved = this.storage.get({ unlocked: [], progress: {} });
    return saved.unlocked.map(id => this.achievements[id]).filter(Boolean);
  }

  /**
   * Get achievement progress
   */
  static getProgress() {
    const saved = this.storage.get({ unlocked: [], progress: {} });
    return saved.progress;
  }

  /**
   * Check if achievement is unlocked
   */
  static isUnlocked(achievementId) {
    const saved = this.storage.get({ unlocked: [] });
    return saved.unlocked.includes(achievementId);
  }

  /**
   * Unlock achievement
   */
  static unlock(achievementId, silent = false) {
    if (this.isUnlocked(achievementId)) {
      return false;
    }

    const achievement = this.achievements[achievementId];
    if (!achievement) {
      console.warn(`Achievement not found: ${achievementId}`);
      return false;
    }

    const saved = this.storage.get({ unlocked: [], progress: {} });
    saved.unlocked.push(achievementId);
    this.storage.set(saved);

    // Award points
    if (window.progressTracker) {
      window.progressTracker.progress.totalPoints += achievement.points;
      window.progressTracker.saveProgress();
    }

    // Show notification
    if (!silent && window.ToastNotification) {
      this.showAchievementUnlocked(achievement);
    }

    // Track in analytics
    if (window.Analytics) {
      window.Analytics.trackEvent('Achievement', 'unlocked', achievementId, achievement.points);
    }

    console.log(`[Achievements] Unlocked: ${achievement.name}`);
    return true;
  }

  /**
   * Update achievement progress
   */
  static updateProgress(type, value, data = {}) {
    const saved = this.storage.get({ unlocked: [], progress: {} });

    // Update progress for relevant achievements
    Object.entries(this.achievements).forEach(([id, achievement]) => {
      if (this.isUnlocked(id)) return;

      const req = achievement.requirement;

      if (req.type === type) {
        // Initialize progress if needed
        if (achievement.progress && !saved.progress[id]) {
          saved.progress[id] = { current: 0, target: achievement.progress.target };
        }

        // Update progress
        if (req.type === 'words_learned' || req.type === 'games_played' || req.type === 'login_streak') {
          if (saved.progress[id]) {
            saved.progress[id].current = value;
          }

          // Check if requirement met
          if (value >= req.value) {
            this.unlock(id);
          }
        }

        // Special checks
        if (req.type === 'perfect_game_score' && value === 100) {
          this.unlock(id);
        }

        if (req.type === 'journey_perfect' && data.journey === req.journey && data.score === 100) {
          this.unlock(id);
        }

        if (req.type === 'journey_time' && data.time < req.value) {
          this.unlock(id);
        }
      }
    });

    this.storage.set(saved);
  }

  /**
   * Check daily streak
   */
  static checkDailyStreak() {
    const streakData = this.getStreakData();
    const today = new Date().toDateString();
    const lastVisit = streakData.lastVisit;

    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit === yesterday.toDateString()) {
        // Continue streak
        streakData.currentStreak++;
      } else {
        // Reset streak
        streakData.currentStreak = 1;
      }

      streakData.lastVisit = today;
      streakData.totalDays++;

      this.saveStreakData(streakData);

      // Update achievement progress
      this.updateProgress('login_streak', streakData.currentStreak);

      // Check time-based achievements
      const hour = new Date().getHours();
      if (hour < 8) {
        this.unlock('early_bird', true);
      }
    }
  }

  /**
   * Get streak data
   */
  static getStreakData() {
    const key = 'sky-learning-streak';
    try {
      return JSON.parse(localStorage.getItem(key)) || {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        lastVisit: null
      };
    } catch {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        lastVisit: null
      };
    }
  }

  /**
   * Save streak data
   */
  static saveStreakData(data) {
    data.longestStreak = Math.max(data.currentStreak, data.longestStreak);
    const key = 'sky-learning-streak';
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save streak data:', e);
    }
  }

  /**
   * Show achievement unlocked notification
   */
  static showAchievementUnlocked(achievement) {
    if (!window.ToastNotification) return;

    ToastNotification.show(
      `<strong>إنجاز جديد!</strong><br>${achievement.icon} ${achievement.name}<br><small>+${achievement.points} نقطة</small>`,
      'success',
      5000,
      { closeable: true }
    );
  }

  /**
   * Start periodic checks
   */
  static startPeriodicChecks() {
    // Check every minute for time-based achievements
    setInterval(() => {
      const hour = new Date().getHours();

      if (hour >= 0 && hour < 4) {
        this.unlock('night_owl', true);
      }
    }, 60000);
  }

  /**
   * Get statistics
   */
  static getStatistics() {
    const unlocked = this.getUnlocked();
    const all = this.getAll();
    const streakData = this.getStreakData();

    return {
      totalAchievements: all.length,
      unlockedCount: unlocked.length,
      lockedCount: all.length - unlocked.length,
      completionPercentage: Math.round((unlocked.length / all.length) * 100),
      totalPointsEarned: unlocked.reduce((sum, a) => sum + a.points, 0),
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalDays: streakData.totalDays,
      byCategory: this.getByCategory()
    };
  }

  /**
   * Get achievements by category
   */
  static getByCategory() {
    const unlocked = this.getUnlocked();
    const categories = {};

    Object.values(this.achievements).forEach(achievement => {
      if (!categories[achievement.category]) {
        categories[achievement.category] = { total: 0, unlocked: 0 };
      }
      categories[achievement.category].total++;

      if (unlocked.some(a => a.id === achievement.id)) {
        categories[achievement.category].unlocked++;
      }
    });

    return categories;
  }

  /**
   * Reset all achievements (for testing)
   */
  static reset() {
    this.storage.set({ unlocked: [], progress: {} });
    localStorage.removeItem('sky-learning-streak');
    console.log('[Achievements] Reset complete');
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AchievementSystem.init());
} else {
  AchievementSystem.init();
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.AchievementSystem = AchievementSystem;
}

export default AchievementSystem;
