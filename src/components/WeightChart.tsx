/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Card, Button, Input } from "./ui";
import { UserProfile } from "../types";
import { Scale, Plus, History, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface WeightChartProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export const WeightChart = ({ userProfile, onProfileUpdate }: WeightChartProps) => {
  const { t, i18n } = useTranslation();
  const [newWeight, setNewWeight] = useState("");
  const isRTL = i18n.dir() === 'rtl';

  const history = userProfile.weightHistory || [];
  
  // Prepare data for Recharts
  const chartData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short' }),
    weight: h.weight,
    fullDate: h.date
  })).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  const handleAddWeight = () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) return;

    const newEntry = {
      date: new Date().toISOString(),
      weight: weight
    };

    const updatedHistory = [...history, newEntry];
    onProfileUpdate({
      ...userProfile,
      weight: weight, // Update current weight too
      weightHistory: updatedHistory
    });
    setNewWeight("");
  };

  const getWeightChange = () => {
    if (history.length < 2) return null;
    const latest = history[history.length - 1].weight;
    const previous = history[history.length - 2].weight;
    const diff = latest - previous;
    return {
      diff: Math.abs(diff).toFixed(1),
      isLoss: diff < 0,
      isGain: diff > 0
    };
  };

  const weightChange = getWeightChange();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h3 className="text-2xl font-black text-primary flex items-center gap-2">
            <Scale size={24} className="text-accent" />
            {isRTL ? 'تطور الوزن' : 'Weight Progress'}
          </h3>
          <p className="text-sm font-bold text-text-muted mt-1 italic">
            {isRTL ? 'تابع رحلة وصولك للوزن المثالي' : 'Track your journey to your ideal weight'}
          </p>
        </div>

        <div className={`flex items-center gap-2 w-full md:w-auto ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Input 
            type="number"
            placeholder={isRTL ? "الوزن الحالي" : "Current weight"}
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className={`w-32 h-12 ${isRTL ? 'text-right' : 'text-left'}`}
          />
          <Button onClick={handleAddWeight} className="h-12 font-black gap-2">
            <Plus size={18} />
            {isRTL ? 'تسجيل' : 'Log'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 border-none shadow-xl bg-white min-h-[400px] flex flex-col">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4D3E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1B4D3E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
                  reversed={isRTL}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
                  orientation={isRTL ? 'right' : 'left'}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left'
                  }}
                  labelStyle={{ fontWeight: 'black', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#1B4D3E" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6 border-none shadow-xl bg-primary text-white flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10" />
            <div className={`relative z-10 flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                {isRTL ? 'الوزن الحالي' : 'Current Weight'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">{userProfile.weight}</span>
                <span className="text-xs font-bold opacity-60">{isRTL ? 'كجم' : 'kg'}</span>
              </div>
            </div>
            
            {weightChange && (
              <div className={`relative z-10 flex items-center gap-2 p-3 rounded-2xl bg-white/10 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${weightChange.isLoss ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {weightChange.isLoss ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <span className="text-xs font-bold block">
                    {weightChange.isLoss ? (isRTL ? 'خسارة' : 'Loss') : (isRTL ? 'زيادة' : 'Gain')} 
                    {` ${weightChange.diff} `} 
                    {isRTL ? 'كجم' : 'kg'}
                  </span>
                  <span className="text-[10px] opacity-60 italic">
                    {isRTL ? 'مقارنة بآخر قياس' : 'vs last measurement'}
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 border-none shadow-xl flex flex-col gap-4 flex-1">
             <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
               <History size={18} className="text-primary" />
               <h4 className="font-black text-sm">{isRTL ? 'السجل الأخير' : 'Recent History'}</h4>
             </div>
             <div className="flex flex-col gap-3">
               {history.slice(-5).reverse().map((entry, i) => (
                 <div key={i} className={`flex justify-between items-center p-3 rounded-xl bg-black/5 hover:bg-primary/5 transition-colors ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                   <span className="text-xs font-bold text-text-muted">
                     {new Date(entry.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                   </span>
                   <span className="font-black text-primary text-sm">{entry.weight} {isRTL ? 'كجم' : 'kg'}</span>
                 </div>
               ))}
               {history.length === 0 && (
                 <p className="text-xs text-text-muted italic text-center py-4">
                   {isRTL ? 'لا توجد بيانات مسجلة بعد' : 'No data recorded yet'}
                 </p>
               )}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
