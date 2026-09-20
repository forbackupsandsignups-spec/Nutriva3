/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Volume2, 
  VolumeX, 
  Play, 
  Coffee, 
  UtensilsCrossed, 
  Apple, 
  Droplets, 
  X 
} from 'lucide-react';
import { UserProfile, MealItem } from '../types';
import { Button } from './ui';
import { useTranslation } from 'react-i18next';

interface NotificationCenterProps {
  userProfile: UserProfile;
  loggedMeals: MealItem[];
  onTriggerTestReminder: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
  onOpenSettings: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userProfile,
  loggedMeals,
  onTriggerTestReminder,
  onOpenSettings
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const notifs = userProfile.notifications;
  const isEnabled = notifs?.enabled ?? true;

  // Determine which meals have been logged today
  // A meal is logged if loggedMeals has at least 1 item or matches time/type
  const mealSchedule = [
    {
      id: 'breakfast' as const,
      nameAr: 'الإفطار',
      nameEn: 'Breakfast',
      time: notifs?.breakfastTime || '08:00',
      icon: <Coffee size={16} className="text-orange-500" />
    },
    {
      id: 'lunch' as const,
      nameAr: 'الغداء',
      nameEn: 'Lunch',
      time: notifs?.lunchTime || '14:00',
      icon: <UtensilsCrossed size={16} className="text-green-600" />
    },
    {
      id: 'snack' as const,
      nameAr: 'السناك الخفيف',
      nameEn: 'Healthy Snack',
      time: notifs?.snackTime || '16:30',
      icon: <Apple size={16} className="text-purple-600" />
    },
    {
      id: 'dinner' as const,
      nameAr: 'العشاء',
      nameEn: 'Dinner',
      time: notifs?.dinnerTime || '20:00',
      icon: <UtensilsCrossed size={16} className="text-blue-600" />
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl transition-all ${
          isOpen ? 'bg-primary text-white shadow-md' : 'bg-black/5 hover:bg-black/10 text-black/80'
        }`}
        aria-label="Notifications"
        title={isRTL ? 'مركز التنبيهات الذكية' : 'Smart Notification Center'}
      >
        <Bell size={20} />
        {/* Active notification indicator */}
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-black/10 z-50 overflow-hidden text-right`}
          >
            {/* Header */}
            <div className={`p-4 bg-primary text-white flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-accent">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-black text-sm">
                    {isRTL ? 'التنبيهات الذكية' : 'Smart Notifications'}
                  </h4>
                  <span className="text-[10px] text-white/80 font-bold block">
                    {isEnabled 
                      ? (isRTL ? 'مفعلة وتتابع جدول وجباتك' : 'Active & tracking your meals') 
                      : (isRTL ? 'التنبيهات معطلة' : 'Notifications disabled')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {/* Test Reminder Action Box */}
              <div className={`p-3.5 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col gap-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-black flex items-center gap-1.5">
                    <Play size={14} className="text-accent" />
                    {isRTL ? 'تجربة تذكير ذكي الآن' : 'Test Smart Reminder Now'}
                  </span>
                  <span className="text-[10px] font-bold text-text-muted">
                    {isRTL ? 'معاينة فورية' : 'Instant Demo'}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-text-muted leading-relaxed">
                  {isRTL 
                    ? 'اضغط لتجربة كيف تظهر التنبيهات المخصصة بالوجبة المخططة والنصيحة الذكية:' 
                    : 'Tap any meal to preview how smart reminders look with meal suggestions and tips:'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {mealSchedule.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onTriggerTestReminder(m.id);
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white hover:bg-black/5 border border-black/5 font-black text-xs text-black flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02]"
                    >
                      {m.icon}
                      <span>{isRTL ? m.nameAr : m.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="flex flex-col gap-2">
                <span className={`text-[11px] font-black uppercase text-text-muted tracking-wider block ${isRTL ? 'text-right' : 'text-left'}`}>
                  {isRTL ? 'جدول تذكيرات اليوم المحددة' : "Today's Reminder Schedule"}
                </span>

                <div className="flex flex-col gap-1.5">
                  {mealSchedule.map(meal => (
                    <div
                      key={meal.id}
                      className={`p-3 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-between ${
                        isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center">
                          {meal.icon}
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-black">
                            {isRTL ? meal.nameAr : meal.nameEn}
                          </h5>
                          <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                            <Clock size={10} />
                            {meal.time}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onTriggerTestReminder(meal.id);
                          setIsOpen(false);
                        }}
                        className="text-[10px] font-black text-primary hover:underline px-2 py-1 bg-primary/5 rounded-lg"
                      >
                        {isRTL ? 'معاينة' : 'Preview'}
                      </button>
                    </div>
                  ))}

                  {/* Water reminder row */}
                  {userProfile.waterNotifications?.enabled && (
                    <div
                      className={`p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between ${
                        isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-8 h-8 rounded-lg bg-white text-blue-500 shadow-2xs flex items-center justify-center">
                          <Droplets size={16} />
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-blue-900">
                            {isRTL ? 'تذكير شرب الماء' : 'Hydration Reminder'}
                          </h5>
                          <span className="text-[10px] font-bold text-blue-600">
                            {isRTL 
                              ? `كل ${userProfile.waterNotifications.frequencyHours} ساعات` 
                              : `Every ${userProfile.waterNotifications.frequencyHours} hrs`}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        {isRTL ? 'مفعل' : 'Active'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer / Settings Link */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSettings();
                  }}
                  className="text-xs font-black text-primary hover:underline flex items-center gap-1.5 w-full justify-center py-2"
                >
                  <Settings size={14} />
                  <span>{isRTL ? 'تعديل أوقات ونغمات التذكير' : 'Configure Reminder Times & Sound'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
