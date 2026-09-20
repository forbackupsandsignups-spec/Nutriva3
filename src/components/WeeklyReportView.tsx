/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Flame, 
  Activity,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Card, Button } from "./ui";
import { WeeklyReport } from "../types";
import { useTranslation } from "react-i18next";

interface WeeklyReportViewProps {
  report: WeeklyReport;
  onClose: () => void;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({ report, onClose }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header/Banner */}
        <div className="bg-primary p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full -translate-x-10 translate-y-10 blur-2xl" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div className={`relative z-10 flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent" size={24} />
              <span className="text-xs font-black uppercase tracking-widest opacity-80">
                {isRTL ? 'تقريرك الذكي للأسبوع' : 'Your Smart Weekly Report'}
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-none">
              {isRTL ? 'ملخص إنجازاتك' : 'Achievement Summary'}
            </h2>
            <p className="text-white/70 font-bold italic text-sm">
              {new Date(report.startDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')} - {new Date(report.endDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
            </p>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-10">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: isRTL ? 'متوسط السعرات' : 'Avg Calories', value: report.stats.avgCalories, unit: 'kcal', icon: <Flame size={18} />, color: 'text-orange-500 bg-orange-50' },
              { label: isRTL ? 'إجمالي التمارين' : 'Total Workouts', value: report.stats.totalWorkouts, unit: '', icon: <Activity size={18} />, color: 'text-primary bg-primary/5' },
              { label: isRTL ? 'تغير الوزن' : 'Weight Change', value: report.stats.weightChange, unit: 'kg', icon: report.stats.weightChange <= 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />, color: 'text-accent bg-accent/5' },
              { label: isRTL ? 'أيام شرب الماء' : 'Water Days', value: report.stats.waterGoalMetDays, unit: '/7', icon: <Droplets size={18} />, color: 'text-blue-500 bg-blue-50' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 border border-black/5 items-center text-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-black">{stat.value}{stat.unit}</span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Section */}
          <section className="flex flex-col gap-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Trophy className="text-accent" size={24} />
              <h3 className="font-black text-xl">{isRTL ? 'أبرز الإنجازات' : 'Top Achievements'}</h3>
            </div>
            <div className="grid gap-3">
              {(isRTL ? report.achievementsAr : report.achievementsEn).map((achievement, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl bg-accent/5 border border-accent/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Sparkles className="text-accent shrink-0 mt-0.5" size={16} />
                  <span className="text-sm font-bold text-black/80">{achievement}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <section className="flex flex-col gap-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Lightbulb className="text-primary" size={24} />
              <h3 className="font-black text-xl">{isRTL ? 'نصائح مخصصة لك' : 'Personalized Tips'}</h3>
            </div>
            <div className="grid gap-3">
              {(isRTL ? report.tipsAr : report.tipsEn).map((tip, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <ArrowRight className={`text-primary ${isRTL ? 'rotate-180' : ''}`} size={14} />
                  </div>
                  <span className="text-sm font-bold text-black/80">{tip}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Suggested Goals */}
          <section className="flex flex-col gap-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="text-black" size={24} />
              <h3 className="font-black text-xl">{isRTL ? 'أهداف الأسبوع القادم' : 'Upcoming Goals'}</h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {(isRTL ? report.suggestedGoalsAr : report.suggestedGoalsEn).map((goal, i) => (
                <span key={i} className="px-4 py-2 bg-black text-white text-xs font-black rounded-full shadow-lg shadow-black/10">
                  {goal}
                </span>
              ))}
            </div>
          </section>

          <Button 
            onClick={onClose}
            className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            {isRTL ? 'فهمت، لننطلق!' : "Got it, let's go!"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
