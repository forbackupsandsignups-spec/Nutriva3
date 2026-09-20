/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Clock, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Activity,
  Dumbbell,
  Timer,
  Info
} from "lucide-react";
import { Card, Button, Input } from "./ui";
import { UserProfile, ExerciseEntry } from "../types";
import { useTranslation } from "react-i18next";

interface ExerciseLogProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const EXERCISE_TYPES = [
  { id: 'running', nameAr: 'جري', nameEn: 'Running', met: 9.8 },
  { id: 'walking', nameAr: 'مشي', nameEn: 'Walking', met: 3.5 },
  { id: 'swimming', nameAr: 'سباحة', nameEn: 'Swimming', met: 7.0 },
  { id: 'cycling', nameAr: 'ركوب دراجات', nameEn: 'Cycling', met: 7.5 },
  { id: 'weightlifting', nameAr: 'رفع أثقال', nameEn: 'Weightlifting', met: 6.0 },
  { id: 'yoga', nameAr: 'يوغا', nameEn: 'Yoga', met: 2.5 },
  { id: 'hiit', nameAr: 'تمارين عالية الكثافة', nameEn: 'HIIT', met: 8.0 },
  { id: 'football', nameAr: 'كرة قدم', nameEn: 'Football', met: 8.0 },
];

export const ExerciseLog: React.FC<ExerciseLogProps> = ({ userProfile, onUpdateProfile }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_TYPES[0].id);
  const [duration, setDuration] = useState<number>(30);
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');

  const today = new Date().toDateString();
  const todayExercises = (userProfile.exerciseLog || []).filter(
    ex => new Date(ex.date).toDateString() === today
  );

  const calculateCalories = (met: number, durationMins: number, weightKg: number, intensityLevel: string) => {
    // Basic MET formula: Calories = MET * weight_kg * (duration_mins / 60)
    let adjustedMet = met;
    if (intensityLevel === 'low') adjustedMet *= 0.8;
    if (intensityLevel === 'high') adjustedMet *= 1.2;
    
    return Math.round(adjustedMet * weightKg * (durationMins / 60));
  };

  const handleAddExercise = () => {
    const exerciseInfo = EXERCISE_TYPES.find(ex => ex.id === selectedExercise);
    if (!exerciseInfo) return;

    const burned = calculateCalories(exerciseInfo.met, duration, userProfile.weight, intensity);
    
    const newEntry: ExerciseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      type: selectedExercise,
      nameAr: exerciseInfo.nameAr,
      nameEn: exerciseInfo.nameEn,
      durationMinutes: duration,
      intensity,
      caloriesBurned: burned
    };

    onUpdateProfile({
      ...userProfile,
      exerciseLog: [newEntry, ...(userProfile.exerciseLog || [])]
    });
  };

  const handleRemoveExercise = (id: string) => {
    onUpdateProfile({
      ...userProfile,
      exerciseLog: (userProfile.exerciseLog || []).filter(ex => ex.id !== id)
    });
  };

  const totalBurnedToday = todayExercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-black text-black">{isRTL ? 'تمارينك الرياضية' : 'Your Exercises'}</h2>
        <p className="text-text-muted font-bold italic">
          {isRTL ? 'سجل نشاطك البدني لحساب السعرات المحروقة بدقة.' : 'Log your physical activity to accurately calculate calories burned.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-6 border-none shadow-xl bg-white flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                {isRTL ? 'نوع التمرين' : 'Exercise Type'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EXERCISE_TYPES.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex.id)}
                    className={`p-3 rounded-xl text-xs font-bold transition-all border-2 ${
                      selectedExercise === ex.id 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-black/5 border-transparent text-text-muted hover:bg-black/10'
                    }`}
                  >
                    {isRTL ? ex.nameAr : ex.nameEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                {isRTL ? 'المدة (بالدقائق)' : 'Duration (minutes)'}
              </label>
              <div className="flex items-center gap-4">
                <Input 
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="h-12 text-lg font-black"
                />
                <Timer className="text-primary shrink-0" size={24} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                {isRTL ? 'كثافة التمرين' : 'Exercise Intensity'}
              </label>
              <div className="flex bg-black/5 p-1 rounded-xl">
                {(['low', 'moderate', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${
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

            <Button 
              onClick={handleAddExercise}
              className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {isRTL ? 'إضافة التمرين' : 'Add Exercise'}
            </Button>
          </Card>

          <Card className="p-6 border-none shadow-md bg-accent/5 flex items-start gap-4">
            <Info className="text-accent shrink-0 mt-1" size={20} />
            <p className="text-xs font-bold text-accent/80 leading-relaxed italic">
              {isRTL 
                ? 'يتم حساب السعرات المحروقة بناءً على وزنك الحالي وشدة التمرين المختارة.' 
                : 'Calories burned are calculated based on your current weight and the selected intensity.'}
            </p>
          </Card>
        </div>

        {/* List & Stats */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border-none shadow-lg bg-white flex flex-col gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                <Flame size={20} />
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                {isRTL ? 'إجمالي حرق اليوم' : 'Total Burned Today'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-black">{totalBurnedToday}</span>
                <span className="text-xs font-bold text-text-muted">{isRTL ? 'سعرة' : 'kcal'}</span>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-lg bg-white flex flex-col gap-2">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-2">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                {isRTL ? 'عدد التمارين' : 'Exercise Count'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-black">{todayExercises.length}</span>
                <span className="text-xs font-bold text-text-muted">{isRTL ? 'تمارين' : 'workouts'}</span>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-black text-xl flex items-center gap-2">
              <Dumbbell className="text-primary" size={24} />
              {isRTL ? 'سجل تمارين اليوم' : 'Today\'s Workouts'}
            </h3>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {todayExercises.length > 0 ? (
                  todayExercises.map((ex) => (
                    <motion.div
                      key={ex.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Card className="p-5 border-none shadow-md bg-white hover:shadow-lg transition-all group">
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <Activity size={24} />
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <h4 className="font-black text-lg">{isRTL ? ex.nameAr : ex.nameEn}</h4>
                              <div className={`flex items-center gap-3 text-xs text-text-muted font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {ex.durationMinutes} {isRTL ? 'دقيقة' : 'min'}
                                </span>
                                <span>|</span>
                                <span className="capitalize">{isRTL ? (ex.intensity === 'low' ? 'منخفض' : ex.intensity === 'moderate' ? 'متوسط' : 'مرتفع') : ex.intensity}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                              <div className="flex items-baseline gap-1 text-primary font-black text-xl">
                                <span>-{ex.caloriesBurned}</span>
                                <span className="text-[10px]">{isRTL ? 'سعرة' : 'kcal'}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveExercise(ex.id)}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center bg-black/5 rounded-3xl border-2 border-dashed border-black/10">
                    <Activity className="text-black/10 mb-4" size={48} />
                    <p className="text-sm font-bold text-text-muted italic">
                      {isRTL ? 'لا توجد تمارين مسجلة لليوم بعد.' : 'No workouts logged for today yet.'}
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
