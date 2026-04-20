"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <main className="min-h-screen relative bg-deep-space text-white selection:bg-neon-cyan selection:text-deep-space">
      <header className="sticky top-0 z-50 bg-deep-space/70 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter">
            <span className="text-white">عقل </span>
            <span className="text-neon-cyan">اصطناعي</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-neon-cyan transition-colors">
              المميزات
            </a>
            <a href="#use-cases" className="hover:text-neon-cyan transition-colors">
              حالات الاستخدام
            </a>
            <a href="#pricing" className="hover:text-neon-cyan transition-colors">
              الأسعار
            </a>
          </nav>

          <a
            href="#pricing"
            className="bg-electric-purple/20 border border-electric-purple text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-electric-purple hover:shadow-[0_0_15px_#8A2BE2] transition-all duration-300"
            data-crm-id="nav-start-free"
            data-fb-event="InitiateCheckout"
          >
            ابدأ مجاناً
          </a>
        </div>
      </header>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-purple/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.article
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col gap-6 text-right"
          >
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              صنّاع محتوى رقمي..
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-electric-purple">
                بلا حدود.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-lg">
              حوّل نصوصك إلى فيديوهات عربية واقعية في ثوانٍ. محرك ذكاء اصطناعي
              مدرب على اللهجات العربية، مزامنة دقيقة للشفاه (Lip-Sync)، وجاهز
              للإنتاج.
            </p>

            <div className="pt-4">
              <a
                href="#pricing"
                className="inline-block bg-neon-cyan text-deep-space px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_25px_#00F0FF] transition-all duration-300 transform hover:-translate-y-1"
                data-crm-id="hero-tripwire-offer"
                data-fb-event="Lead"
              >
                اكتشف العرض الحصري ($7 فقط)
              </a>
            </div>
          </motion.article>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-video rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 shadow-2xl flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-deep-space to-electric-purple/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-r-[16px] border-r-white border-b-[10px] border-b-transparent mr-1" />
                </div>
                <p className="text-neon-cyan font-semibold text-sm">
                  معاينة الأفاتار الذكي
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 bg-deep-space relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              بنية تحتية متطورة
            </h2>
            <p className="text-gray-400">صُمم ليلبي احتياجات الإنتاج الاحترافي</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            <div className="md:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors flex flex-col justify-end">
              <h3 className="text-2xl font-bold mb-2 text-neon-cyan">
                خوارزميات التوليد (Diffusion Models)
              </h3>
              <p className="text-gray-400 text-sm">
                توليد إطارات عالية الدقة مع الحفاظ على التناسق البصري في كل ثانية
                من الفيديو.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors flex flex-col justify-end">
              <h3 className="text-xl font-bold mb-2 text-electric-purple">
                تركيب صوتي عصبي عربي
              </h3>
              <p className="text-gray-400 text-sm">
                نماذج Neural TTS مدربة على مخارج الحروف العربية بدقة متناهية.
              </p>
            </div>

            <div className="md:col-span-3 bg-gradient-to-r from-electric-purple/20 to-neon-cyan/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  معالجة فورية عبر السحابة
                </h3>
                <p className="text-gray-300 text-sm max-w-xl">
                  بنية سحابية موزعة تضمن لك تصيير الفيديوهات في جزء من الوقت
                  المعتاد، بدون استهلاك موارد جهازك الشخصي.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">حالات الاستخدام</h2>
          <p className="text-gray-400">
            الإعلانات، الشروحات، المحتوى التعليمي، والمواد التسويقية القصيرة.
          </p>
        </div>
      </section>

      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-5xl font-black text-neon-cyan mb-2">
                +10,000
              </div>
              <div className="text-gray-400 font-medium">فيديو مُولد</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <div className="text-5xl font-black text-electric-purple mb-2">
                99.9%
              </div>
              <div className="text-gray-400 font-medium">وقت التشغيل (Uptime)</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6"
            >
              <div className="text-5xl font-black text-white mb-2">15</div>
              <div className="text-gray-400 font-medium">لهجة عربية مدعومة</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">الأسعار</h2>
          <p className="text-gray-400">
            ابدأ بعرض تجريبي منخفض التكلفة، ثم انتقل إلى الخطة المناسبة لحجم
            إنتاجك.
          </p>
        </div>
      </section>
    </main>
  );
}
