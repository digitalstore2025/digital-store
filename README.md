# ✈️ Sky Learning - منصة الطائرة التعليمية التفاعلية

<div align="center">

![Sky Learning Logo](https://img.shields.io/badge/Sky-Learning-blue?style=for-the-badge&logo=airplanesymbol)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**منصة تعليمية رقمية مبتكرة لتعليم اللغة الإنجليزية للأطفال والطلاب المبتدئين (مستوى A1)**

[الرئيسية](#features) • [المميزات](#features) • [البدء](#getting-started) • [التثبيت](#installation) • [الاستخدام](#usage)

</div>

---

## 🌟 نظرة عامة

**Sky Learning** هي منصة تعليمية تفاعلية فريدة من نوعها تستخدم مفهوم **الطائرة التعليمية المتنقلة** لتعليم اللغة الإنجليزية للأطفال. تأخذ المنصة الطلاب في رحلات مشوقة حول العالم، حيث يتعلمون من خلال:

- 🎮 ألعاب تفاعلية ممتعة
- 📖 قصص تعليمية مثيرة
- 🌍 استكشاف أماكن حقيقية حول العالم
- 👥 شخصيات كرتونية محببة (الكابتن علي، المعلمة سارة، أحمد، ليلى)
- 🏆 نظام مكافآت ومستويات محفز

---

## ✨ المميزات الرئيسية

### 🛫 رحلات تعليمية حول العالم

- **6 وجهات سياحية مختلفة**:
  - 🏰 لندن - العاصمة البريطانية
  - 🗼 باريس - مدينة النور
  - 🌳 غابة الأمازون - استكشاف الطبيعة
  - 🏝️ جزيرة استوائية - المرح الصيفي
  - ⛰️ الجبال الثلجية - مغامرة شتوية
  - 🚀 محطة الفضاء - استكشاف الكون

### 🎮 ألعاب تعليمية متنوعة

1. **لعبة السحب والإفلات** 🎯
2. **لعبة التوصيل** 🃏
3. **لعبة بناء الكلمات** 🔤
4. **اختبار المعرفة** ❓
5. **لعبة النطق** 🎤
6. **لعبة الذاكرة** 🧠

### 👥 شخصيات محببة

- **الكابتن علي** 👨‍✈️: قائد الطائرة ومعلم الجغرافيا
- **المعلمة سارة** 👩‍🏫: معلمة اللغة الإنجليزية المتحمسة
- **أحمد** 🧒: الطالب الفضولي المغامر
- **ليلى** 👧: الطالبة الذكية المتفوقة

---

## 🚀 البدء السريع

### المتطلبات الأساسية

- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- اتصال بالإنترنت (للميزات التفاعلية المتقدمة)

### التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/your-username/sky-learning.git

# 2. الانتقال إلى مجلد المشروع
cd digital-store

# 3. فتح الملف الرئيسي في المتصفح
# ما عليك سوى فتح index.html في متصفحك المفضل
```

### البنية الأساسية للمشروع

```
digital-store/
│
├── index.html                    # الصفحة الرئيسية
├── README.md                     # هذا الملف
├── manifest.json                 # PWA Manifest
├── service-worker.js             # Service Worker للعمل دون اتصال
├── offline.html                  # صفحة عدم الاتصال
│
├── assets/                       # الملفات الثابتة
│   ├── css/
│   │   ├── style.css            # ملف الأنماط الرئيسي
│   │   └── enhancements.css     # التحسينات (Dark Mode, Toast, etc.)
│   ├── js/
│   │   ├── app.js               # التطبيق الرئيسي (محدث وآمن)
│   │   ├── utils.js             # أدوات الأمان والأداء
│   │   ├── toast.js             # نظام الإشعارات
│   │   ├── theme-manager.js     # إدارة الوضع الليلي/النهاري
│   │   ├── analytics.js         # نظام التحليلات
│   │   └── achievements.js      # نظام الإنجازات المتقدم
│   └── images/                  # الصور والأيقونات
│
├── pages/                        # الصفحات الفرعية
│   ├── journeys/                # صفحات الرحلات
│   │   └── london.html
│   ├── games/                   # صفحات الألعاب
│   │   └── word-building.html
│   └── characters.html          # صفحة الشخصيات
│
└── blog/                        # المدونة
    └── article-1.html
```

---

## 💻 التقنيات المستخدمة

- **HTML5**: بنية صفحات الويب
- **CSS3**: التصميم والتنسيق
  - Flexbox & Grid Layout
  - CSS Animations
  - Responsive Design
  - Gradient Backgrounds
  - CSS Custom Properties (Dark Mode)

- **JavaScript (ES6+)**: التفاعلية والديناميكية
  - DOM Manipulation
  - Event Handling
  - Local Storage API
  - Speech Synthesis API
  - Drag and Drop API
  - Service Worker API (PWA)
  - IntersectionObserver API

- **PWA (Progressive Web App)**:
  - Service Worker للعمل دون اتصال
  - Web App Manifest للتثبيت
  - Offline Support

- **الأمان والأداء**:
  - DOMPurify لحماية من XSS
  - Error Handling الشامل
  - Performance Optimizations
  - Lazy Loading

---

## 🔒 التحسينات الأمنية والأداء

### الأمان
- ✅ حماية من هجمات XSS باستخدام DOMPurify
- ✅ معالجة آمنة للإدخالات
- ✅ إدارة آمنة للـ LocalStorage مع دعم وضع التصفح الخفي
- ✅ معالجة شاملة للأخطاء

### الأداء
- ✅ تحميل كسول للموارد
- ✅ Debouncing و Throttling للأحداث
- ✅ استخدام Document Fragment
- ✅ تحسين الرسوم المتحركة بـ will-change
- ✅ Rate Limiting للطلبات

### تجربة المستخدم
- ✅ إشعارات Toast حديثة
- ✅ وضع ليلي/نهاري
- ✅ دعم PWA للتثبيت والعمل دون اتصال
- ✅ تحسينات إمكانية الوصول (ARIA)
- ✅ نظام تحليلات يحترم الخصوصية

### نظام الإنجازات المتقدم
- 🏆 20+ إنجاز في فئات مختلفة
- 🔥 نظام الـ Streaks اليومية
- 📊 تتبع التقدم التفصيلي
- 🎯 مكافآت ونقاط

---

## 🎨 التصميم والتجربة

### الألوان الرئيسية

```css
--primary-blue: #1e90ff;    /* الأزرق الأساسي */
--sky-blue: #87ceeb;        /* أزرق السماء */
--cloud-white: #f0f8ff;     /* أبيض الغيوم */
--sunset-orange: #ff6b35;   /* برتقالي الغروب */
--grass-green: #4ade80;     /* أخضر العشب */
```

---

## 📊 نظام التتبع والمكافآت

### نظام النقاط

- ✅ إكمال رحلة: **100 نقطة**
- 🎯 إجابة صحيحة: **10-30 نقطة**
- 🎮 إكمال لعبة: **50 نقطة**
- 🏆 إنجاز جديد: **25-100 نقطة**

### المستويات

- المستوى 1: 0-499 نقطة
- المستوى 2: 500-999 نقطة
- المستوى 3: 1000-1499 نقطة
- المستوى 4: 1500+ نقطة

---

## 📱 التوافق مع الأجهزة

| الجهاز | الدعم | ملاحظات |
|--------|-------|---------|
| 💻 Desktop | ✅ كامل | التجربة الأمثل |
| 📱 Mobile | ✅ كامل | تصميم متجاوب |
| 🖥️ Tablet | ✅ كامل | واجهة محسنة |

### المتصفحات المدعومة

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

---

## 📞 التواصل والدعم

- 📧 **البريد الإلكتروني**: info@skylearning.com
- 🌐 **الموقع**: www.skylearning.com
- 📱 **الهاتف**: +966 XX XXX XXXX

---

## 🌟 ابدأ الرحلة الآن!

<div align="center">

**Sky Learning - حيث يلتقي التعلم بالمغامرة!**

---

صُنع بكل ❤️ من أجل مستقبل أطفالنا

**© 2025 Sky Learning Platform. All Rights Reserved.**

</div>

---

## 🚀 النشر والاستضافة

### نشر على Netlify (موصى به)

1. **عبر GitHub:**
   ```bash
   # رفع الكود على GitHub
   git push origin main
   ```

2. **الربط بـ Netlify:**
   - اذهب إلى [Netlify](https://netlify.com)
   - اضغط "Add new site" > "Import an existing project"
   - اختر مستودع GitHub الخاص بك
   - الإعدادات:
     - Build command: (اتركه فارغاً)
     - Publish directory: `.`
   - اضغط "Deploy site"

3. **إضافة Domain مخصص (اختياري):**
   - اذهب إلى Site settings > Domain management
   - أضف domain الخاص بك

### نشر على GitHub Pages

```bash
# في ملف netlify.toml موجود بالفعل
# لكن للنشر على GitHub Pages:

1. اذهب إلى Settings > Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Save

الرابط سيكون: https://username.github.io/repository-name
```

### نشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel

# للإنتاج
vercel --prod
```

### اختبار محلي

```bash
# استخدم أي خادم HTTP بسيط:

# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve

# أو افتح index.html مباشرة في المتصفح
```

---

## 📊 الإحصائيات النهائية

```
📁 إجمالي الملفات: 25+
  ├─ 6 صفحات رحلات تعليمية
  ├─ 6 ألعاب تفاعلية
  ├─ 3 مقالات مدونة
  └─ نظام PWA كامل

📚 المحتوى التعليمي:
  ├─ 100+ كلمة إنجليزية
  ├─ 25+ تمرين تفاعلي
  ├─ 20+ إنجاز قابل للفتح
  └─ نظام نقاط ومستويات

💻 التقنيات:
  ├─ HTML5 + CSS3 + JavaScript ES6+
  ├─ PWA مع Service Worker
  ├─ Web Speech API
  ├─ Local Storage API
  └─ Analytics & Achievement System

🔒 الأمان:
  ├─ XSS Protection (DOMPurify)
  ├─ Error Handling شامل
  ├─ Input Validation
  └─ Safe Storage Management

⚡ الأداء:
  ├─ Lazy Loading
  ├─ Debouncing/Throttling
  ├─ Offline Support
  └─ Optimized Animations
```

---

## 🎯 خارطة الطريق المستقبلية

- [ ] إضافة المزيد من الرحلات (مصر، اليابان، أستراليا)
- [ ] نظام الفصول الدراسية للمعلمين
- [ ] تقارير تقدم مفصلة للآباء
- [ ] تطبيق موبايل (React Native)
- [ ] دعم لغات إضافية (فرنسية، إسبانية)
- [ ] محتوى فيديو تفاعلي
- [ ] مسابقات بين الطلاب
- [ ] شهادات إكمال للمراحل

