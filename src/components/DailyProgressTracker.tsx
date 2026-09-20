/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, ProgressBar, Button } from "./ui";
import { Droplets, Timer, Plus, Footprints } from "lucide-react";
import { UserProfile, ExerciseEntry } from "../types";
import { motion } from "motion/react";

interface DailyProgressTrackerProps {
  userProfile: UserProfile;
  waterIntake: number;
  waterTarget: number;
  onAddWater: () => void;
  onLogExercise: () => void;
}

export const DailyProgressTracker = ({ 
  userProfile, 
  waterIntake, 
  waterTarget, 
  onAddWater,
  onLogExercise
}: DailyProgressTrackerProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const todayActiveMinutes = useMemo(() => {
    const today = new Date().toDateString();
    return (userProfile.exerciseLog || [])
      .filter((ex: ExerciseEntry) => new Date(ex.date).toDateString() === today)
      .reduce((sum: number, ex: ExerciseEntry) => sum + ex.durationMinutes, 0);
  }, [userProfile.exerciseLog]);

  const activeMinutesGoal = useMemo(() => {
    switch (userProfile.activityLevel) {
      case 'sedentary': return 20;
      case 'light': return 30;
      case 'moderate': return 45;
      case 'high': return 60;
      case 'extreme': return 90;
      default: return 30;
    }
  }, [userProfile.activityLevel]);

  const waterPercentage = Math.min(Math.round((waterIntake / waterTarget) * 100), 100);
  const activityPercentage = Math.min(Math.round((todayActiveMinutes / activeMinutesGoal) * 100), 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Water Tracker Card */}
      <Card className="p-6 border-none shadow-lg bg-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />
        
        <div className={`flex justify-between items-start mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`p-3 rounded-2xl bg-blue-50 text-blue-600`}>
            <Droplets size={24} />
          </div>
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="font-black text-lg text-primary">{isRTL ? 'ترطيب الجسم' : 'Hydration'}</h3>
            <span className="text-xs font-bold text-text-muted italic">
              {isRTL ? `الهدف: ${(waterTarget / 1000).toFixed(1)} لتر` : `Goal: ${(waterTarget / 1000).toFixed(1)}L`}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`flex justify-between items-baseline ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-3xl font-black text-primary">
              {(waterIntake / 1000).toFixed(1)} <span className="text-sm font-bold opacity-60">{isRTL ? 'لتر' : 'L'}</span>
            </span>
            <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {waterPercentage}%
            </span>
          </div>

          <ProgressBar 
            value={waterIntake} 
            max={waterTarget} 
            color="bg-blue-500" 
            size="md" 
          />

          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
             <p className={`text-[10px] font-bold text-text-muted italic max-w-[150px] ${isRTL ? 'text-right' : 'text-left'}`}>
               {waterPercentage < 50 
                 ? (isRTL ? 'تحتاج للمزيد من الماء لتحسين التمثيل الغذائي.' : 'You need more water to boost metabolism.')
                 : (isRTL ? 'رائع! جسمك يحصل على ترطيب مثالي.' : 'Great! Your body is perfectly hydrated.')}
             </p>
             <Button 
               onClick={onAddWater}
               size="sm"
               className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-200 gap-2 font-black"
             >
               <Plus size={16} />
               <span>{isRTL ? '250 مل' : '250ml'}</span>
             </Button>
          </div>
        </div>
      </Card>

      {/* Active Minutes Card */}
      <Card className="p-6 border-none shadow-lg bg-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />
        
        <div className={`flex justify-between items-start mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`p-3 rounded-2xl bg-orange-50 text-orange-600`}>
            <Timer size={24} />
          </div>
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="font-black text-lg text-primary">{isRTL ? 'النشاط البدني' : 'Activity'}</h3>
            <span className="text-xs font-bold text-text-muted italic">
              {isRTL ? `الهدف: ${activeMinutesGoal} دقيقة` : `Goal: ${activeMinutesGoal}m`}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`flex justify-between items-baseline ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-primary">{todayActiveMinutes}</span>
              <span className="text-sm font-bold opacity-60">{isRTL ? 'دقيقة' : 'min'}</span>
            </div>
            <span className="text-sm font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              {activityPercentage}%
            </span>
          </div>

          <ProgressBar 
            value={todayActiveMinutes} 
            max={activeMinutesGoal} 
            color="bg-orange-500" 
            size="md" 
          />

          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
             <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
               <div className="flex items-center gap-1 text-[10px] font-black text-orange-600">
                 <Footprints size={12} />
                 <span>{userProfile.healthSync?.todaySteps?.toLocaleString() || 0} {isRTL ? 'خطوة' : 'steps'}</span>
               </div>
               <p className={`text-[10px] font-bold text-text-muted italic mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                 {activityPercentage < 100 
                   ? (isRTL ? `يتبقى ${activeMinutesGoal - todayActiveMinutes} دقيقة للوصول لهدفك.` : `${activeMinutesGoal - todayActiveMinutes}m left to hit your goal.`)
                   : (isRTL ? 'حققت هدف النشاط اليومي! استمر!' : 'Daily activity goal achieved! Keep it up!')}
               </p>
             </div>
             <Button 
               onClick={onLogExercise}
               variant="outline"
               size="sm"
               className="h-10 px-4 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl gap-2 font-black"
             >
               <Plus size={16} />
               <span>{isRTL ? 'تمرين' : 'Log'}</span>
             </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
