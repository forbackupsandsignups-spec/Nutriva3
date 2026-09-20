/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, Calendar, Trash2, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodDiaryEntry } from '../types';
import { Card } from './ui';

interface FoodDiaryProps {
  entries: FoodDiaryEntry[];
  onOpenCamera: () => void;
  onDeleteEntry: (id: string) => void;
}

export const FoodDiary: React.FC<FoodDiaryProps> = ({ entries, onOpenCamera, onDeleteEntry }) => {
  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-black p-8 text-white min-h-[220px] flex flex-col justify-end">
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 text-right">
          <h2 className="text-4xl font-black mb-3">يوميات الطعام</h2>
          <p className="text-white/60 text-sm font-bold max-w-[280px] mr-0 ml-auto leading-relaxed">
            استخدم الكاميرا لتصوير وجباتك وسيقوم الذكاء الاصطناعي بتحليلها تلقائياً.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onOpenCamera}
        className="w-full h-20 bg-primary text-white rounded-3xl flex items-center justify-between px-8 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all group"
      >
        <div className="bg-white/20 p-3 rounded-2xl group-hover:rotate-12 transition-transform">
          <Camera size={24} />
        </div>
        <span className="text-xl font-black">تحليل وجبة جديدة</span>
        <ChevronRight size={24} />
      </button>

      {/* History List */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center px-2 flex-row-reverse">
          <h3 className="text-xl font-black text-black">الوجبات المصورة</h3>
          <div className="flex items-center gap-2 text-text-muted">
            <span className="text-sm font-bold">{entries.length} وجبات</span>
            <Calendar size={18} />
          </div>
        </div>

        {entries.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-text-muted mb-4">
              <Camera size={32} />
            </div>
            <h4 className="text-lg font-black text-black mb-2">لا توجد صور بعد</h4>
            <p className="text-sm text-text-muted font-bold max-w-[200px]">ابدأ بتصوير أول وجبة لك ليتم تحليلها هنا.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white border border-black/5 rounded-3xl overflow-hidden hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-black/5"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={entry.imageUrl} 
                    alt={entry.nameAr} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <button 
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-red-500/80 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <span className="text-[10px] text-white/70 font-black uppercase tracking-widest block mb-1">
                        {new Date(entry.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <h4 className="text-white font-black text-lg">{entry.nameAr}</h4>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-primary/5 p-2 rounded-xl text-center">
                      <span className="block text-[8px] text-primary/60 font-black mb-1">سعرات</span>
                      <span className="text-xs font-black text-primary">{entry.calories}</span>
                    </div>
                    <div className="bg-black/5 p-2 rounded-xl text-center">
                      <span className="block text-[8px] text-text-muted font-black mb-1">بروتين</span>
                      <span className="text-xs font-black text-black">{entry.protein}ج</span>
                    </div>
                    <div className="bg-black/5 p-2 rounded-xl text-center">
                      <span className="block text-[8px] text-text-muted font-black mb-1">كارب</span>
                      <span className="text-xs font-black text-black">{entry.carbs}ج</span>
                    </div>
                    <div className="bg-black/5 p-2 rounded-xl text-center">
                      <span className="block text-[8px] text-text-muted font-black mb-1">دهون</span>
                      <span className="text-xs font-black text-black">{entry.fat}ج</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-black/5 p-3 rounded-2xl">
                    <Info size={14} className="text-text-muted mt-1 shrink-0" />
                    <p className="text-[11px] text-text-muted font-bold leading-relaxed text-right">
                      {entry.analysis}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};