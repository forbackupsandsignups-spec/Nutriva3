/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Clock, 
  Plus, 
  Trash2, 
  Activity,
  Dumbbell,
  Timer,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { Card, Button, Input, ProgressBar } from "./ui";
import { UserProfile, ExerciseEntry } from "../types";
import { useTranslation } from "react-i18next";

interface FitnessTrackerProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  compact?: boolean;
}

const EXERCISE_TYPES = [
  { id: 'running', nameAr: 'جري', nameEn: 'Running', met: 9.8, icon: '🏃' },
  { id: 'walking', nameAr: 'مشي', nameEn: 'Walking', met: 3.5, icon: '🚶' },
  { id: 'swimming', nameAr: 'سباحة', nameEn: 'Swimming', met: 7.0, icon: '🏊' },
  { id: 'cycling', nameAr: 'ركوب دراجات', nameEn: 'Cycling', met: 7.5, icon: '🚴' },
  { id: 'weightlifting', nameAr: 'رفع أثقال', nameEn: 'Weightlifting', met: 6.0, icon: '🏋️' },
  { id: 'yoga', nameAr: 'يوغا', nameEn: 'Yoga', met: 2.5, icon: '🧘' },
  { id: 'hiit', nameAr: 'تمارين عالية الكثافة', nameEn: 'HIIT', met: 10.0, icon: '⚡' },
  { id: 'football', nameAr: 'كرة قدم', nameEn: 'Football', met: 8.0, icon: '⚽' },
];

export const FitnessTracker: React.FC<FitnessTrackerProps> = ({ userProfile, onUpdateProfile, compact = false }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  const [selectedType, setSelectedType] = useState(EXERCISE_TYPES[0].id);
  const [duration, setDuration] = useState<number>(30);
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [isAdding, setIsAdding] = useState(false);

  const calculateCalories = (met: number, durationMins: number, weightKg: number, intensityLevel: string) => {
    let adjustedMet = met;
    if (intensityLevel === 'low') adjustedMet *= 0.8;
    if (intensityLevel === 'high') adjustedMet *= 1.2;
    return Math.round(adjustedMet * weightKg * (durationMins / 60));
  };

  const estimatedBurn = useMemo(() => {
    const exercise = EXERCISE_TYPES.find(ex => ex.id === selectedType);
    if (!exercise) return 0;
    return calculateCalories(exercise.met, duration, userProfile.weight, intensity);
  }, [selectedType, duration, intensity, userProfile.weight]);

  const handleAddExercise = () => {
    const exerciseInfo = EXERCISE_TYPES.find(ex => ex.id === selectedType);
    if (!exerciseInfo) return;

    const newEntry: ExerciseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      type: selectedType,
      nameAr: exerciseInfo.nameAr,
      nameEn: exerciseInfo.nameEn,
      durationMinutes: duration,
      intensity,
      caloriesBurned: estimatedBurn
    };

    onUpdateProfile({
      ...userProfile,
      exerciseLog: [newEntry, ...(userProfile.exerciseLog || [])]
    });
    setIsAdding(false);
  };

  const today = new Date().toDateString();
  const todayExercises = (userProfile.exerciseLog || []).filter(
    ex => new Date(ex.date).toDateString() === today
  );
  const totalBurnedToday = todayExercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

  if (compact) {
    return (
      <Card className="p-6 border-none shadow-xl bg-white flex flex-col gap-4">
        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center">
              <Flame size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="font-black text-lg">{isRTL ? 'تعقب النشاط' : 'Fitness Tracker'}</h3>
              <p className="text-[10px] font-bold text-text-muted italic">{isRTL ? 'سجل تمرينك الآن' : 'Log your workout'}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-orange-600">{totalBurnedToday}</span>
            <span className="text-[10px] font-bold text-text-muted">{isRTL ? 'سعرة' : 'kcal'}</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {EXERCISE_TYPES.slice(0, 5).map(ex => (
            <button
              key={ex.id}
              onClick={() => {
                setSelectedType(ex.id);
                setIsAdding(true);
              }}
              className="flex-shrink-0 w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center text-xl hover:bg-orange-50 hover:scale-105 transition-all"
            >
              {ex.icon}
            </button>
          ))}
          <button 
            onClick={() => setIsAdding(true)}
            className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary/20 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-black/5 pt-4 flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{isRTL ? 'المدة' : 'Duration'}</label>
                  <Input 
                    type="number" 
                    value={duration} 
                    onChange={e => setDuration(Number(e.target.value))} 
                    className="h-10 text-sm font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{isRTL ? 'الحرق المتوقع' : 'Est. Burn'}</label>
                  <div className="h-10 flex items-center justify-center bg-orange-50 text-orange-600 rounded-xl font-black text-sm">
                    {estimatedBurn} {isRTL ? 'سعرة' : 'kcal'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="flex-1 h-10 font-bold">{isRTL ? 'إلغاء' : 'Cancel'}</Button>
                <Button size="sm" onClick={handleAddExercise} className="flex-1 h-10 font-black">{isRTL ? 'تسجيل' : 'Log'}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-black text-black">{isRTL ? 'مراقب اللياقة البدنية' : 'Fitness Tracker'}</h2>
        <p className="text-text-muted font-bold italic">
          {isRTL ? 'احسب السعرات المحروقة بدقة وسجل تقدمك الرياضي.' : 'Calculate calories burned accurately and track your athletic progress.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-8 border-none shadow-xl bg-white flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest">
                {isRTL ? 'اختر نوع النشاط' : 'Select Activity Type'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EXERCISE_TYPES.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedType(ex.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      selectedType === ex.id 
                        ? 'border-primary bg-primary/5 text-primary shadow-inner' 
                        : 'border-black/5 bg-black/5 text-text-muted hover:bg-black/10'
                    }`}
                  >
                    <span className="text-2xl">{ex.icon}</span>
                    <span className="font-black text-sm">{isRTL ? ex.nameAr : ex.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest">
                  {isRTL ? 'المدة (دقيقة)' : 'Duration (min)'}
                </label>
                <div className="relative">
                  <Input 
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    className="h-14 text-xl font-black pl-12 pr-4 bg-black/5 border-none rounded-2xl focus:ring-primary"
                  />
                  <Timer className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-primary`} size={24} />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest">
                  {isRTL ? 'الشدة' : 'Intensity'}
                </label>
                <div className="flex bg-black/5 p-1.5 rounded-2xl h-14">
                  {(['low', 'moderate', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setIntensity(level)}
                      className={`flex-1 rounded-xl text-[10px] font-black transition-all ${
                        intensity === level 
                          ? 'bg-white text-black shadow-sm' 
                          : 'text-text-muted hover:text-black'
                      }`}
                    >
                      {isRTL 
                        ? (level === 'low' ? 'منخفض' : level === 'moderate' ? 'متوسط' : 'مرتفع')
                        : level.toUpperCase()
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-orange-500/5 p-6 rounded-[2rem] border-2 border-orange-500/10 flex items-center justify-between">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <span className="text-xs font-black text-orange-600 uppercase block mb-1">
                  {isRTL ? 'الحرق التقديري' : 'Estimated Burn'}
                </span>
                <div className="flex items-baseline gap-1 text-3xl font-black text-primary">
                  {estimatedBurn}
                  <span className="text-sm font-bold opacity-60">kcal</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20">
                <Flame className="text-orange-500 animate-pulse" size={32} />
              </div>
            </div>

            <Button 
              onClick={handleAddExercise}
              className="w-full h-16 rounded-[2rem] bg-black text-white font-black text-lg hover:bg-primary transition-all flex items-center justify-center gap-3 group"
            >
              <span>{isRTL ? 'تسجيل النشاط الآن' : 'Log Activity Now'}</span>
              <ChevronRight className={`group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} size={24} />
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
             <Card className="p-8 border-none shadow-xl bg-white flex flex-col gap-4 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
               <span className="text-xs font-black text-text-muted uppercase tracking-widest">{isRTL ? 'حرق اليوم' : 'Daily Burn'}</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black">{totalBurnedToday}</span>
                 <span className="text-sm font-bold text-text-muted">kcal</span>
               </div>
               <ProgressBar value={totalBurnedToday} max={500} color="bg-orange-500" size="sm" />
             </Card>

             <Card className="p-8 border-none shadow-xl bg-white flex flex-col gap-4 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
               <span className="text-xs font-black text-text-muted uppercase tracking-widest">{isRTL ? 'إجمالي التمارين' : 'Total Sessions'}</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black">{todayExercises.length}</span>
                 <span className="text-sm font-bold text-text-muted">{isRTL ? 'جلسات' : 'sessions'}</span>
               </div>
               <div className="flex items-center gap-2 text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full self-start">
                 <TrendingDown size={14} className="rotate-180" />
                 <span>+12% {isRTL ? 'عن الأمس' : 'vs yesterday'}</span>
               </div>
             </Card>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-black text-2xl px-2">{isRTL ? 'الأنشطة الأخيرة' : 'Recent Activities'}</h3>
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                {todayExercises.length > 0 ? (
                  todayExercises.map((ex) => (
                    <motion.div
                      key={ex.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="group"
                    >
                      <Card className="p-6 border-none shadow-lg bg-white hover:shadow-2xl transition-all border-l-4 border-transparent hover:border-primary">
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-16 h-16 bg-black/5 rounded-[1.5rem] flex items-center justify-center text-3xl group-hover:bg-primary group-hover:text-white transition-all">
                              {EXERCISE_TYPES.find(t => t.id === ex.type)?.icon || '🏋️'}
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <h4 className="font-black text-xl">{isRTL ? ex.nameAr : ex.nameEn}</h4>
                              <div className={`flex items-center gap-4 text-sm text-text-muted font-bold mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="flex items-center gap-1.5 bg-black/5 px-3 py-1 rounded-full">
                                  <Clock size={14} />
                                  {ex.durationMinutes} {isRTL ? 'دقيقة' : 'min'}
                                </span>
                                <span className="uppercase text-[10px] tracking-widest text-primary">{isRTL ? (ex.intensity === 'low' ? 'منخفض' : ex.intensity === 'moderate' ? 'متوسط' : 'مرتفع') : ex.intensity}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-text-muted uppercase text-right">{isRTL ? 'تم حرق' : 'Burned'}</span>
                                <span className="font-black text-2xl text-primary">-{ex.caloriesBurned} <span className="text-xs">kcal</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-24 flex flex-col items-center justify-center text-center bg-black/5 rounded-[3rem] border-4 border-dashed border-black/5">
                    <Activity className="text-black/10 mb-6" size={64} />
                    <p className="text-xl font-black text-text-muted italic px-8 leading-relaxed">
                      {isRTL ? 'لم تسجل أي تمرين بعد. ابدأ الآن واجعل حركتك ذات قيمة!' : 'No activities logged yet. Start moving and make it count!'}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
