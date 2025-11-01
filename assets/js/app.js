// ===================================
// Sky Learning Platform - Main Application
// Interactive Educational Platform
// ===================================

'use strict';

// Import utilities (when using modules)
// Fallback for non-module usage
const SecurityUtils = window.SecurityUtils || {
  sanitizeHTML: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
};

const ErrorHandler = window.ErrorHandler || {
  handle: (error, context) => console.error(`[${context}]`, error)
};

const StorageManager = window.StorageManager || class {
  constructor(key) {
    this.key = key;
  }
  get(def) {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || def;
    } catch {
      return def;
    }
  }
  set(val) {
    try {
      localStorage.setItem(this.key, JSON.stringify(val));
    } catch {}
  }
};

// ===================================
// Application State
// ===================================
const AppState = {
  initialized: false,
  progressTracker: null,
  activeGames: new Map(),
  serviceWorkerReady: false
};

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  try {
    console.log('[App] Initializing Sky Learning Platform...');

    initializeClouds();
    initializeSmoothScroll();
    initializeInteractiveElements();
    initializeProgressTracking();
    initializeServiceWorker();

    AppState.initialized = true;
    console.log('[App] Initialization complete ✓');

    // Track page view
    if (window.Analytics) {
      window.Analytics.trackPageView();
    }
  } catch (error) {
    ErrorHandler.handle(error, 'App.init');
    if (window.ToastNotification) {
      window.ToastNotification.error('حدث خطأ أثناء تحميل المنصة');
    }
  }
});

// ===================================
// Service Worker Registration
// ===================================
function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('[App] ServiceWorker registered:', registration.scope);
        AppState.serviceWorkerReady = true;

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (window.ToastNotification) {
                window.ToastNotification.info(
                  'يتوفر تحديث جديد!',
                  0,
                  {
                    closeable: true,
                    action: {
                      text: 'تحديث الآن',
                      onClick: () => {
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                        window.location.reload();
                      }
                    }
                  }
                );
              }
            }
          });
        });
      })
      .catch((error) => {
        console.warn('[App] ServiceWorker registration failed:', error);
      });
  }
}

// ===================================
// Cloud Animation System
// ===================================
function initializeClouds() {
  const skyBackground = document.querySelector('.sky-background');
  if (!skyBackground) return;

  const cloudCount = 8;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.cssText = `
      width: ${Math.random() * 50 + 60}px;
      height: ${Math.random() * 20 + 30}px;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 30 + 40}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    fragment.appendChild(cloud);
  }

  skyBackground.appendChild(fragment);
}

// ===================================
// Smooth Scrolling
// ===================================
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Track navigation
        if (window.Analytics) {
          window.Analytics.trackEvent('Navigation', 'scroll', href);
        }
      }
    });
  });
}

// ===================================
// Interactive Elements
// ===================================
function initializeInteractiveElements() {
  // Journey cards hover effects
  const journeyCards = document.querySelectorAll('.journey-card');
  journeyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
    card.addEventListener('click', function() {
      const journeyId = this.dataset.journey;
      if (journeyId && window.Analytics) {
        window.Analytics.trackEvent('Journey', 'click', journeyId);
      }
    });
  });

  // Game cards click effects
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.add('pulse');
      setTimeout(() => {
        this.classList.remove('pulse');
      }, 500);

      const gameId = this.dataset.game;
      if (gameId && window.Analytics) {
        window.Analytics.trackEvent('Game', 'click', gameId);
      }
    });
  });

  // Character animations
  const characterAvatars = document.querySelectorAll('.character-avatar');
  characterAvatars.forEach(avatar => {
    avatar.addEventListener('click', function() {
      this.classList.add('spin');
      setTimeout(() => {
        this.classList.remove('spin');
      }, 600);
    });
  });
}

// ===================================
// Progress Tracking System
// ===================================
class LearningProgress {
  constructor() {
    this.storage = new StorageManager('skyLearningProgress');
    this.progress = this.loadProgress();
  }

  loadProgress() {
    return this.storage.get({
      completedJourneys: [],
      totalPoints: 0,
      level: 1,
      achievements: [],
      wordsLearned: 0,
      gamesPlayed: 0,
      lastVisit: null
    });
  }

  saveProgress() {
    try {
      this.storage.set(this.progress);
      console.log('[Progress] Saved:', this.progress);
    } catch (error) {
      ErrorHandler.handle(error, 'LearningProgress.saveProgress');
    }
  }

  completeJourney(journeyId, score = 100, timeSpent = 0) {
    try {
      if (!this.progress.completedJourneys.includes(journeyId)) {
        this.progress.completedJourneys.push(journeyId);
        this.progress.totalPoints += score;
        this.checkLevelUp();
        this.saveProgress();

        // Show achievement notification
        if (window.ToastNotification) {
          window.ToastNotification.success(
            `رحلة مكتملة! 🎉<br>لقد أكملت رحلة ${this.getJourneyName(journeyId)}<br>+${score} نقطة`,
            5000
          );
        }

        // Update achievement system
        if (window.AchievementSystem) {
          window.AchievementSystem.updateProgress('journeys_completed', this.progress.completedJourneys.length);

          if (score === 100) {
            window.AchievementSystem.updateProgress('journey_perfect', null, {
              journey: journeyId,
              score: 100
            });
          }

          if (timeSpent > 0) {
            window.AchievementSystem.updateProgress('journey_time', null, {
              journey: journeyId,
              time: timeSpent
            });
          }
        }

        // Track in analytics
        if (window.Analytics) {
          window.Analytics.trackJourneyComplete(journeyId, score, timeSpent);
        }
      }
    } catch (error) {
      ErrorHandler.handle(error, 'LearningProgress.completeJourney');
    }
  }

  completeGame(gameId, score = 0, perfect = false) {
    try {
      this.progress.gamesPlayed++;
      this.progress.totalPoints += score;
      this.saveProgress();

      // Update achievements
      if (window.AchievementSystem) {
        window.AchievementSystem.updateProgress('games_played', this.progress.gamesPlayed);

        if (perfect || score === 100) {
          window.AchievementSystem.updateProgress('perfect_game_score', 100);
        }
      }

      // Track in analytics
      if (window.Analytics) {
        window.Analytics.trackGamePlay(gameId, score);
      }
    } catch (error) {
      ErrorHandler.handle(error, 'LearningProgress.completeGame');
    }
  }

  learnWord(word) {
    try {
      this.progress.wordsLearned++;
      this.progress.totalPoints += 5;
      this.saveProgress();

      // Update achievements
      if (window.AchievementSystem) {
        window.AchievementSystem.updateProgress('words_learned', this.progress.wordsLearned);
      }
    } catch (error) {
      ErrorHandler.handle(error, 'LearningProgress.learnWord');
    }
  }

  checkLevelUp() {
    const newLevel = Math.floor(this.progress.totalPoints / 500) + 1;
    if (newLevel > this.progress.level) {
      const oldLevel = this.progress.level;
      this.progress.level = newLevel;

      if (window.ToastNotification) {
        window.ToastNotification.success(
          `🎊 مستوى جديد!<br>لقد وصلت إلى المستوى ${newLevel}`,
          5000
        );
      }

      if (window.Analytics) {
        window.Analytics.trackEvent('Progress', 'level_up', `${oldLevel} → ${newLevel}`, newLevel);
      }
    }
  }

  getJourneyName(journeyId) {
    const names = {
      london: 'لندن',
      paris: 'باريس',
      amazon: 'غابة الأمازون',
      island: 'الجزيرة الاستوائية',
      mountain: 'الجبال الثلجية',
      space: 'محطة الفضاء'
    };
    return names[journeyId] || journeyId;
  }

  getProgress() {
    return this.progress;
  }

  reset() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع التقدم؟')) {
      this.progress = {
        completedJourneys: [],
        totalPoints: 0,
        level: 1,
        achievements: [],
        wordsLearned: 0,
        gamesPlayed: 0,
        lastVisit: null
      };
      this.saveProgress();

      if (window.ToastNotification) {
        window.ToastNotification.info('تم إعادة تعيين التقدم', 3000);
      }
    }
  }
}

// Initialize progress tracker
const progressTracker = new LearningProgress();

function initializeProgressTracking() {
  const progress = progressTracker.getProgress();
  console.log('[Progress] Current progress:', progress);

  // Display progress if element exists
  const progressDisplay = document.getElementById('progress-display');
  if (progressDisplay) {
    updateProgressDisplay(progressDisplay, progress);
  }
}

function updateProgressDisplay(element, progress) {
  const sanitizedHTML = `
    <div class="progress-stats">
      <span>المستوى: ${progress.level}</span>
      <span>النقاط: ${progress.totalPoints}</span>
      <span>الرحلات المكتملة: ${progress.completedJourneys.length}</span>
    </div>
  `;
  element.innerHTML = sanitizedHTML;
}

// ===================================
// Interactive Games Functions
// ===================================

// Drag and Drop Game
function initDragDropGame(containerId) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    const words = ['plane', 'cloud', 'sky', 'pilot', 'travel'];
    const arabicWords = ['طائرة', 'سحابة', 'سماء', 'طيار', 'سفر'];

    let draggedElement = null;
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
      const wordElement = document.createElement('div');
      wordElement.textContent = word;
      wordElement.draggable = true;
      wordElement.className = 'draggable-word';
      wordElement.dataset.index = index;

      wordElement.addEventListener('dragstart', function(e) {
        draggedElement = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      wordElement.addEventListener('dragend', function() {
        this.classList.remove('dragging');
      });

      fragment.appendChild(wordElement);
    });

    container.appendChild(fragment);

    // Track game start
    if (window.Analytics) {
      window.Analytics.trackEvent('Game', 'start', 'drag-drop');
    }
  } catch (error) {
    ErrorHandler.handle(error, 'initDragDropGame');
  }
}

// Matching Game
function initMatchingGame(containerId) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pairs = [
      { english: 'Hello', arabic: 'مرحبا', emoji: '👋' },
      { english: 'Thank you', arabic: 'شكرا', emoji: '🙏' },
      { english: 'Goodbye', arabic: 'وداعا', emoji: '👋' },
      { english: 'Friend', arabic: 'صديق', emoji: '👥' }
    ];

    let selectedCards = [];
    let matchedPairs = 0;
    const fragment = document.createDocumentFragment();

    pairs.forEach(pair => {
      const card = document.createElement('div');
      card.className = 'matching-card';
      card.dataset.english = pair.english;
      card.dataset.arabic = pair.arabic;

      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      cardFront.textContent = pair.emoji;

      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';

      const englishText = document.createElement('p');
      englishText.textContent = pair.english;

      const arabicText = document.createElement('p');
      arabicText.textContent = pair.arabic;

      cardBack.appendChild(englishText);
      cardBack.appendChild(arabicText);

      card.appendChild(cardFront);
      card.appendChild(cardBack);

      card.addEventListener('click', function() {
        if (selectedCards.length < 2 && !this.classList.contains('matched')) {
          this.classList.add('selected');
          selectedCards.push(this);

          if (selectedCards.length === 2) {
            setTimeout(() => checkMatch(selectedCards, pairs.length), 500);
          }
        }
      });

      fragment.appendChild(card);
    });

    function checkMatch(cards, totalPairs) {
      // Matching logic
      const [card1, card2] = cards;
      if (card1.dataset.english === card2.dataset.english) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        if (matchedPairs === totalPairs) {
          if (window.ToastNotification) {
            window.ToastNotification.success('أحسنت! 🎉 لقد أكملت اللعبة!', 3000);
          }
          progressTracker.completeGame('matching', 100, true);
        }
      }

      cards.forEach(card => card.classList.remove('selected'));
      selectedCards = [];
    }

    container.appendChild(fragment);

    if (window.Analytics) {
      window.Analytics.trackEvent('Game', 'start', 'matching');
    }
  } catch (error) {
    ErrorHandler.handle(error, 'initMatchingGame');
  }
}

// Word Building Game
function initWordBuildingGame(containerId) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    const targetWord = 'AIRPLANE';
    const letters = targetWord.split('').sort(() => Math.random() - 0.5);
    let currentWord = '';

    const displayDiv = document.createElement('div');
    displayDiv.className = 'word-display';
    displayDiv.setAttribute('aria-live', 'polite');
    container.appendChild(displayDiv);

    const lettersDiv = document.createElement('div');
    lettersDiv.className = 'letters-container';

    letters.forEach(letter => {
      const letterBtn = document.createElement('button');
      letterBtn.textContent = letter;
      letterBtn.className = 'letter-btn';
      letterBtn.setAttribute('aria-label', `حرف ${letter}`);

      letterBtn.addEventListener('click', function() {
        currentWord += letter;
        displayDiv.textContent = currentWord;
        this.disabled = true;
        this.classList.add('used');

        if (currentWord === targetWord) {
          displayDiv.classList.add('success');
          progressTracker.completeGame('word-building', 50, true);
          progressTracker.learnWord(targetWord);

          setTimeout(() => {
            if (window.ToastNotification) {
              window.ToastNotification.success('أحسنت! 🎉 لقد كونت الكلمة الصحيحة!', 3000);
            }
          }, 300);
        }
      });

      lettersDiv.appendChild(letterBtn);
    });

    container.appendChild(lettersDiv);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'إعادة المحاولة';
    resetBtn.className = 'reset-btn';
    resetBtn.addEventListener('click', function() {
      currentWord = '';
      displayDiv.textContent = '';
      displayDiv.classList.remove('success');
      document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('used');
      });
    });
    container.appendChild(resetBtn);

    if (window.Analytics) {
      window.Analytics.trackEvent('Game', 'start', 'word-building');
    }
  } catch (error) {
    ErrorHandler.handle(error, 'initWordBuildingGame');
  }
}

// ===================================
// Quiz System
// ===================================
class Quiz {
  constructor(questions, containerId) {
    this.questions = questions;
    this.currentQuestion = 0;
    this.score = 0;
    this.container = document.getElementById(containerId);
    this.startTime = Date.now();

    if (this.container) {
      this.render();

      if (window.Analytics) {
        window.Analytics.trackEvent('Quiz', 'start', containerId);
      }
    }
  }

  render() {
    if (!this.container) return;

    if (this.currentQuestion >= this.questions.length) {
      this.showResults();
      return;
    }

    const question = this.questions[this.currentQuestion];

    // Clear container
    this.container.innerHTML = '';

    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';

    const questionHeader = document.createElement('h3');
    questionHeader.textContent = `السؤال ${this.currentQuestion + 1} من ${this.questions.length}`;

    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    questionText.textContent = question.question;

    const answersContainer = document.createElement('div');
    answersContainer.className = 'answers-container';

    question.answers.forEach((answer, index) => {
      const answerBtn = document.createElement('button');
      answerBtn.className = 'answer-btn';
      answerBtn.textContent = answer;
      answerBtn.addEventListener('click', () => this.checkAnswer(index));
      answersContainer.appendChild(answerBtn);
    });

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = `النقاط: ${this.score}`;

    quizContainer.appendChild(questionHeader);
    quizContainer.appendChild(questionText);
    quizContainer.appendChild(answersContainer);
    quizContainer.appendChild(scoreDisplay);

    this.container.appendChild(quizContainer);
  }

  checkAnswer(answerIndex) {
    try {
      const question = this.questions[this.currentQuestion];
      const isCorrect = answerIndex === question.correct;

      if (isCorrect) {
        this.score += 10;
        progressTracker.progress.totalPoints += 10;
        progressTracker.saveProgress();

        if (window.ToastNotification) {
          window.ToastNotification.success('إجابة صحيحة! 🎉', 2000);
        }
      } else {
        if (window.ToastNotification) {
          window.ToastNotification.error(
            `حاول مرة أخرى!<br>الإجابة الصحيحة: ${question.answers[question.correct]}`,
            3000
          );
        }
      }

      this.currentQuestion++;

      setTimeout(() => {
        this.render();
      }, 500);
    } catch (error) {
      ErrorHandler.handle(error, 'Quiz.checkAnswer');
    }
  }

  showResults() {
    try {
      const percentage = (this.score / (this.questions.length * 10)) * 100;
      const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

      this.container.innerHTML = '';

      const resultsContainer = document.createElement('div');
      resultsContainer.className = 'quiz-results';

      const title = document.createElement('h2');
      title.textContent = 'النتيجة النهائية';

      const scoreCircle = document.createElement('div');
      scoreCircle.className = 'score-circle';

      const scoreNumber = document.createElement('span');
      scoreNumber.className = 'score-number';
      scoreNumber.textContent = `${percentage.toFixed(0)}%`;
      scoreCircle.appendChild(scoreNumber);

      const scoreText = document.createElement('p');
      scoreText.textContent = `لقد حصلت على ${this.score} من ${this.questions.length * 10} نقطة!`;

      const retryBtn = document.createElement('button');
      retryBtn.className = 'retry-btn';
      retryBtn.textContent = 'إعادة الاختبار';
      retryBtn.addEventListener('click', () => location.reload());

      resultsContainer.appendChild(title);
      resultsContainer.appendChild(scoreCircle);
      resultsContainer.appendChild(scoreText);
      resultsContainer.appendChild(retryBtn);

      this.container.appendChild(resultsContainer);

      if (percentage >= 70) {
        progressTracker.completeGame('quiz', this.score, true);

        if (window.ToastNotification) {
          window.ToastNotification.success('نجاح باهر! 🎊 لقد اجتزت الاختبار بنجاح!', 5000);
        }
      }

      if (window.Analytics) {
        window.Analytics.trackEvent('Quiz', 'complete', this.container.id, this.score);
        window.Analytics.trackTiming('Quiz', this.container.id, timeSpent);
      }
    } catch (error) {
      ErrorHandler.handle(error, 'Quiz.showResults');
    }
  }
}

// ===================================
// Voice Recognition (optional enhancement)
// ===================================
function initVoiceRecognition() {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        recognition.start();

        if (window.ToastNotification) {
          window.ToastNotification.info('🎤 تحدث الآن...', 3000);
        }
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('voice-input');
        if (input) {
          input.value = transcript;
        }

        if (window.ToastNotification) {
          window.ToastNotification.success(`سمعت: ${transcript}`, 3000);
        }
      };

      recognition.onerror = (event) => {
        ErrorHandler.handle(event.error, 'VoiceRecognition');
        if (window.ToastNotification) {
          window.ToastNotification.error('حدث خطأ في التعرف على الصوت', 3000);
        }
      };
    }
  }
}

// ===================================
// Export functions for global use
// ===================================
window.progressTracker = progressTracker;
window.Quiz = Quiz;
window.initDragDropGame = initDragDropGame;
window.initMatchingGame = initMatchingGame;
window.initWordBuildingGame = initWordBuildingGame;
window.initVoiceRecognition = initVoiceRecognition;

console.log('[App] Sky Learning Platform loaded ✓');
