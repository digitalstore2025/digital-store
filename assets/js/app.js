// ===================================
// Sky Learning Platform - Main JavaScript
// Interactive Educational Platform
// ===================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initializeClouds();
  initializeSmoothScroll();
  initializeInteractiveElements();
  initializeProgressTracking();
});

// ===================================
// Cloud Animation System
// ===================================
function initializeClouds() {
  const skyBackground = document.querySelector('.sky-background');
  if (!skyBackground) return;

  const cloudCount = 8;
  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.width = `${Math.random() * 50 + 60}px`;
    cloud.style.height = `${Math.random() * 20 + 30}px`;
    cloud.style.top = `${Math.random() * 100}%`;
    cloud.style.animationDuration = `${Math.random() * 30 + 40}s`;
    cloud.style.animationDelay = `${Math.random() * 10}s`;
    skyBackground.appendChild(cloud);
  }
}

// ===================================
// Smooth Scrolling
// ===================================
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
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
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Game cards click effects
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.animation = 'pulse 0.5s';
      setTimeout(() => {
        this.style.animation = '';
      }, 500);
    });
  });

  // Character animations
  const characterAvatars = document.querySelectorAll('.character-avatar');
  characterAvatars.forEach(avatar => {
    avatar.addEventListener('click', function() {
      this.style.transform = 'scale(1.2) rotate(360deg)';
      setTimeout(() => {
        this.style.transform = '';
      }, 600);
    });
  });
}

// ===================================
// Progress Tracking System
// ===================================
class LearningProgress {
  constructor() {
    this.progress = this.loadProgress();
  }

  loadProgress() {
    const saved = localStorage.getItem('skyLearningProgress');
    return saved ? JSON.parse(saved) : {
      completedJourneys: [],
      totalPoints: 0,
      level: 1,
      achievements: []
    };
  }

  saveProgress() {
    localStorage.setItem('skyLearningProgress', JSON.stringify(this.progress));
  }

  completeJourney(journeyId) {
    if (!this.progress.completedJourneys.includes(journeyId)) {
      this.progress.completedJourneys.push(journeyId);
      this.progress.totalPoints += 100;
      this.checkLevelUp();
      this.saveProgress();
      this.showAchievement('رحلة مكتملة!', `لقد أكملت رحلة ${journeyId}`);
    }
  }

  checkLevelUp() {
    const newLevel = Math.floor(this.progress.totalPoints / 500) + 1;
    if (newLevel > this.progress.level) {
      this.progress.level = newLevel;
      this.showAchievement('مستوى جديد!', `لقد وصلت إلى المستوى ${newLevel}`);
    }
  }

  showAchievement(title, message) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
    `;
    achievement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #4ade80, #22c55e);
      color: white;
      padding: 1.5rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideIn 0.5s ease-out;
    `;
    document.body.appendChild(achievement);
    setTimeout(() => {
      achievement.style.animation = 'slideOut 0.5s ease-out';
      setTimeout(() => achievement.remove(), 500);
    }, 3000);
  }

  getProgress() {
    return this.progress;
  }
}

const progressTracker = new LearningProgress();

function initializeProgressTracking() {
  const progress = progressTracker.getProgress();
  console.log('Current Progress:', progress);

  // Display progress if element exists
  const progressDisplay = document.getElementById('progress-display');
  if (progressDisplay) {
    progressDisplay.innerHTML = `
      <div class="progress-stats">
        <span>المستوى: ${progress.level}</span>
        <span>النقاط: ${progress.totalPoints}</span>
        <span>الرحلات المكتملة: ${progress.completedJourneys.length}</span>
      </div>
    `;
  }
}

// ===================================
// Interactive Games Functions
// ===================================

// Drag and Drop Game
function initDragDropGame(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const words = ['plane', 'cloud', 'sky', 'pilot', 'travel'];
  const arabicWords = ['طائرة', 'سحابة', 'سماء', 'طيار', 'سفر'];

  let draggedElement = null;

  words.forEach((word, index) => {
    const wordElement = document.createElement('div');
    wordElement.textContent = word;
    wordElement.draggable = true;
    wordElement.className = 'draggable-word';
    wordElement.style.cssText = `
      background: #3b82f6;
      color: white;
      padding: 1rem;
      margin: 0.5rem;
      border-radius: 10px;
      cursor: move;
      display: inline-block;
    `;

    wordElement.addEventListener('dragstart', function(e) {
      draggedElement = this;
      this.style.opacity = '0.5';
    });

    wordElement.addEventListener('dragend', function() {
      this.style.opacity = '1';
    });

    container.appendChild(wordElement);
  });
}

// Matching Game
function initMatchingGame(containerId) {
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

  pairs.forEach(pair => {
    const card = document.createElement('div');
    card.className = 'matching-card';
    card.innerHTML = `
      <div class="card-front">${pair.emoji}</div>
      <div class="card-back">
        <p>${pair.english}</p>
        <p>${pair.arabic}</p>
      </div>
    `;
    card.style.cssText = `
      background: white;
      padding: 1.5rem;
      margin: 0.5rem;
      border-radius: 10px;
      cursor: pointer;
      display: inline-block;
      transition: all 0.3s ease;
    `;

    card.addEventListener('click', function() {
      if (selectedCards.length < 2 && !this.classList.contains('matched')) {
        this.classList.add('selected');
        selectedCards.push(this);

        if (selectedCards.length === 2) {
          setTimeout(checkMatch, 500);
        }
      }
    });

    container.appendChild(card);
  });

  function checkMatch() {
    // Matching logic would go here
    selectedCards = [];
  }
}

// Word Building Game
function initWordBuildingGame(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const targetWord = 'AIRPLANE';
  const letters = targetWord.split('').sort(() => Math.random() - 0.5);
  let currentWord = '';

  const displayDiv = document.createElement('div');
  displayDiv.className = 'word-display';
  displayDiv.style.cssText = `
    font-size: 2rem;
    margin: 2rem 0;
    min-height: 60px;
    border: 2px dashed #3b82f6;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
  `;
  container.appendChild(displayDiv);

  const lettersDiv = document.createElement('div');
  lettersDiv.className = 'letters-container';
  container.appendChild(lettersDiv);

  letters.forEach(letter => {
    const letterBtn = document.createElement('button');
    letterBtn.textContent = letter;
    letterBtn.className = 'letter-btn';
    letterBtn.style.cssText = `
      background: #fbbf24;
      color: #1f2937;
      border: none;
      padding: 1rem 1.5rem;
      margin: 0.5rem;
      border-radius: 10px;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    letterBtn.addEventListener('click', function() {
      currentWord += letter;
      displayDiv.textContent = currentWord;
      this.disabled = true;
      this.style.opacity = '0.5';

      if (currentWord === targetWord) {
        displayDiv.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
        displayDiv.style.color = 'white';
        progressTracker.progress.totalPoints += 50;
        progressTracker.saveProgress();
        setTimeout(() => {
          alert('أحسنت! لقد كونت الكلمة الصحيحة!');
        }, 300);
      }
    });

    lettersDiv.appendChild(letterBtn);
  });

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'إعادة المحاولة';
  resetBtn.style.cssText = `
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    margin-top: 1rem;
    border-radius: 10px;
    cursor: pointer;
  `;
  resetBtn.addEventListener('click', function() {
    currentWord = '';
    displayDiv.textContent = '';
    displayDiv.style.background = '';
    displayDiv.style.color = '';
    document.querySelectorAll('.letter-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
    });
  });
  container.appendChild(resetBtn);
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
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.currentQuestion >= this.questions.length) {
      this.showResults();
      return;
    }

    const question = this.questions[this.currentQuestion];
    this.container.innerHTML = `
      <div class="quiz-container">
        <h3>السؤال ${this.currentQuestion + 1} من ${this.questions.length}</h3>
        <p class="question-text">${question.question}</p>
        <div class="answers-container">
          ${question.answers.map((answer, index) => `
            <button class="answer-btn" onclick="quiz.checkAnswer(${index})">
              ${answer}
            </button>
          `).join('')}
        </div>
        <div class="score-display">النقاط: ${this.score}</div>
      </div>
    `;

    // Add styles
    const style = `
      <style>
        .quiz-container {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .question-text {
          font-size: 1.3rem;
          margin: 2rem 0;
          color: #1f2937;
        }
        .answer-btn {
          display: block;
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 1rem;
          margin: 0.5rem 0;
          border-radius: 10px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .answer-btn:hover {
          background: #2563eb;
          transform: translateX(-5px);
        }
        .score-display {
          margin-top: 2rem;
          font-size: 1.2rem;
          font-weight: bold;
          color: #4ade80;
        }
      </style>
    `;
    this.container.insertAdjacentHTML('beforebegin', style);
  }

  checkAnswer(answerIndex) {
    const question = this.questions[this.currentQuestion];
    if (answerIndex === question.correct) {
      this.score += 10;
      progressTracker.progress.totalPoints += 10;
      progressTracker.saveProgress();
      alert('إجابة صحيحة! 🎉');
    } else {
      alert('حاول مرة أخرى! الإجابة الصحيحة: ' + question.answers[question.correct]);
    }
    this.currentQuestion++;
    this.render();
  }

  showResults() {
    const percentage = (this.score / (this.questions.length * 10)) * 100;
    this.container.innerHTML = `
      <div class="quiz-results">
        <h2>النتيجة النهائية</h2>
        <div class="score-circle">
          <span class="score-number">${percentage.toFixed(0)}%</span>
        </div>
        <p>لقد حصلت على ${this.score} من ${this.questions.length * 10} نقطة!</p>
        <button onclick="location.reload()" class="retry-btn">إعادة الاختبار</button>
      </div>
    `;

    if (percentage >= 70) {
      progressTracker.showAchievement('نجاح باهر!', 'لقد اجتزت الاختبار بنجاح!');
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
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('voice-input').value = transcript;
      };
    }
  }
}

// ===================================
// Animation Utilities
// ===================================
function animateElement(element, animation) {
  element.style.animation = animation;
  element.addEventListener('animationend', () => {
    element.style.animation = '';
  }, { once: true });
}

// ===================================
// Export functions for global use
// ===================================
window.progressTracker = progressTracker;
window.Quiz = Quiz;
window.initDragDropGame = initDragDropGame;
window.initMatchingGame = initMatchingGame;
window.initWordBuildingGame = initWordBuildingGame;
