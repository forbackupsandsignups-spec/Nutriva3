/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Sparkles, 
  Check, 
  Camera, 
  Search, 
  Clock, 
  X, 
  Flame, 
  Dumbbell, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { SmartReminderData, MealItem } from '../types';
import { Button } from './ui';
import { useTranslation } from 'react-i18next';

interface SmartMealReminderModalProps {
  reminder: SmartReminderData | null;
  onClose: () => void;
  onQuickLogMeal: (meal: MealItem) => void;
  onOpenCamera: () => void;
  onOpenSearch: () => void;
  onSnooze?: () => void;
}

export const SmartMealReminderModal: React.FC<SmartMealReminderModalProps> = ({
  reminder,
  onClose,
  onQuickLogMeal,
  onOpenCamera,
  onOpenSearch,
  onSnooze
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  if (!reminder) return null;

  const handleQuickLog = () => {
    if (!reminder.plannedMeal) return;
    const mealItem: MealItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: reminder.plannedMeal.name,
      calories: reminder.plannedMeal.calories,
      protein: reminder.plannedMeal.protein,
      carbs: reminder.plannedMeal.carbs,
      fat: reminder.plannedMeal.fat,
      logged: true,
      evaluation: isRTL ? 'وجبة ذكية مجدولة ✅' : 'Smart Scheduled Meal ✅'
    };
    onQuickLogMeal(mealItem);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto border border-black/5"
        >
          {/* Header Banner */}
          <div className="bg-primary p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-accent/20 rounded-full -translate-x-10 translate-y-10 blur-xl" />

            <div className={`relative z-10 flex items-start justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-accent shrink-0 shadow-inner">
                  <Bell size={24} className="animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-black/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={10} />
                      {isRTL ? 'تذكير ذكي مخصص' : 'Smart Personalized Reminder'}
                    </span>
                    <span className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                      <Clock size={10} />
                      {reminder.targetTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1 leading-tight">
                    {reminder.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Personalized Message Box */}
            <div className={`p-4 rounded-2xl bg-primary/5 border border-primary/10 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-bold text-black/85 leading-relaxed">
                {reminder.message}
              </p>
            </div>

            {/* Planned Meal Highlight */}
            {reminder.plannedMeal && (
              <div className="flex flex-col gap-3">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1">
                    <Flame size={14} className="text-orange-500" />
                    {isRTL ? 'الوجبة المقترحة لخطتك' : 'Suggested Meal for Your Plan'}
                  </span>
                  <span className="text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {reminder.plannedMeal.calories} {isRTL ? 'سعرة حرارية' : 'kcal'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 border border-black/5 flex flex-col gap-3">
                  <h4 className={`text-base font-black text-black ${isRTL ? 'text-right' : 'text-left'}`}>
                    {reminder.plannedMeal.name}
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-black/5">
                    <div className="bg-white p-2 rounded-xl shadow-xs">
                      <span className="text-[10px] font-bold text-text-muted uppercase block">{isRTL ? 'بروتين' : 'Protein'}</span>
                      <span className="text-sm font-black text-primary">{reminder.plannedMeal.protein}g</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-xs">
                      <span className="text-[10px] font-bold text-text-muted uppercase block">{isRTL ? 'كارب' : 'Carbs'}</span>
                      <span className="text-sm font-black text-accent">{reminder.plannedMeal.carbs}g</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-xs">
                      <span className="text-[10px] font-bold text-text-muted uppercase block">{isRTL ? 'دهون' : 'Fat'}</span>
                      <span className="text-sm font-black text-orange-500">{reminder.plannedMeal.fat}g</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Nutrition Tip */}
            {reminder.tip && (
              <div className={`flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                    {isRTL ? 'نصيحة غذائية ذكية' : 'Smart Nutrition Tip'}
                  </span>
                  <p className="text-xs font-bold text-amber-900/90 leading-relaxed mt-0.5">
                    {reminder.tip}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                onClick={handleQuickLog}
                className="w-full h-12 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Check size={18} />
                {isRTL ? 'تسجيل هذه الوجبة بضغطة واحدة ✅' : 'Log This Planned Meal (1-Click) ✅'}
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  onClick={() => {
                    onClose();
                    onOpenCamera();
                  }}
                  variant="outline"
                  className="h-11 border-primary/30 text-primary hover:bg-primary/5 font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Camera size={16} />
                  {isRTL ? 'تصوير وجبتي 📸' : 'Snap Photo 📸'}
                </Button>

                <Button
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  variant="outline"
                  className="h-11 border-black/10 text-black hover:bg-black/5 font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Search size={16} />
                  {isRTL ? 'اختيار طعام آخر' : 'Choose Other Food'}
                </Button>
              </div>

              {onSnooze && (
                <button
                  onClick={() => {
                    onSnooze();
                    onClose();
                  }}
                  className="text-xs text-text-muted hover:text-black font-bold py-1 text-center transition-colors flex items-center justify-center gap-1"
                >
                  <Clock size={12} />
                  {isRTL ? 'تذكيري بعد 15 دقيقة' : 'Remind me in 15 mins'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
