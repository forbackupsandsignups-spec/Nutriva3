/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card } from "./ui";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Scale, Flame, Target } from "lucide-react";
import { UserProfile } from "../types";
import { WeightChart } from "./WeightChart";
import { useTranslation } from "react-i18next";

interface ProgressProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export const Progress = ({ userProfile, onProfileUpdate }: ProgressProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const history = userProfile.weightHistory || [];
  const latestWeight = userProfile.weight;
  
  // Calculate average calories from history (mock for now, or real if we had daily calorie logs)
  const avgCalories = 1950; 
  
  const getWeightLossRate = () => {
    if (history.length < 2) return "0.0";
    const start = history[0].weight;
    const end = history[history.length - 1].weight;
    const weeks = Math.max(1, Math.round((new Date(history[history.length - 1].date).getTime() - new Date(history[0].date).getTime()) / (7 * 24 * 60 * 60 * 1000)));
    return ((start - end) / weeks).toFixed(1);
  };

  const totalLoss = history.length > 0 ? (history[0].weight - latestWeight).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { 
            label: isRTL ? "الوزن الحالي" : "Current Weight", 
            value: `${latestWeight} ${isRTL ? 'كجم' : 'kg'}`, 
            change: `${totalLoss} ${isRTL ? 'كجم' : 'kg'}`, 
            icon: <Scale />, 
            color: "text-blue-600 bg-blue-50" 
          },
          { 
            label: isRTL ? "متوسط السعرات" : "Avg Calories", 
            value: `${avgCalories}`, 
            change: "+5%", 
            icon: <Flame />, 
            color: "text-orange-600 bg-orange-50" 
          },
          { 
            label: isRTL ? "أيام الالتزام" : "Commitment Days", 
            value: "18 يوم", 
            change: "مستمر", 
            icon: <Target />, 
            color: "text-green-600 bg-green-50" 
          },
          { 
            label: isRTL ? "معدل النزول" : "Loss Rate", 
            value: `${getWeightLossRate()} ${isRTL ? 'كجم/أسبوع' : 'kg/week'}`, 
            change: "مثالي", 
            icon: <TrendingUp />, 
            color: "text-purple-600 bg-purple-50" 
          },
        ].map((stat, idx) => (
          <Card key={idx} className={`p-6 border-none shadow-md flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <span className="text-xs font-bold text-text-muted mt-2">{stat.label}</span>
            <span className="text-xl font-black text-primary">{stat.value}</span>
          </Card>
        ))}
      </div>

      <WeightChart userProfile={userProfile} onProfileUpdate={onProfileUpdate} />

      <Card className={`p-8 border-none shadow-xl bg-primary text-white flex flex-col md:flex-row items-center gap-8 ${isRTL ? 'text-right' : 'text-left'} overflow-hidden relative`}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
        <div className={`flex-1 flex flex-col gap-4 relative z-10 ${isRTL ? 'items-end' : 'items-start'}`}>
          <h3 className="text-2xl font-black">{isRTL ? 'أنت تقترب من هدفك! 🎯' : 'Approaching your goal! 🎯'}</h3>
          <p className="font-bold opacity-80 leading-relaxed max-w-xl">
            {isRTL 
              ? 'بناءً على التزامك، من المتوقع أن تصل إلى هدفك بحلول نهاية العام. استمر في هذا الحماس!' 
              : 'Based on your commitment, you are expected to reach your goal by the end of the year. Keep it up!'}
          </p>
          <div className={`flex gap-4 mt-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex flex-col">
              <span className="text-xs font-bold opacity-60">{isRTL ? 'الأيام المتبقية' : 'Remaining Days'}</span>
              <span className="text-2xl font-black">58 {isRTL ? 'يوم' : 'days'}</span>
            </div>
            <div className="w-px h-10 bg-white/20 self-center" />
            <div className="flex flex-col">
              <span className="text-xs font-bold opacity-60">{isRTL ? 'الوزن المتبقي' : 'Remaining Weight'}</span>
              <span className="text-2xl font-black">12.2 {isRTL ? 'كجم' : 'kg'}</span>
            </div>
          </div>
        </div>
        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center relative z-10 shrink-0">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/20">
              <TrendingUp className="text-white" size={40} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
