/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, Button } from "./ui";
import { 
  Coffee, 
  UtensilsCrossed, 
  Plus, 
  Clock, 
  ChevronLeft,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";
import { UserProfile, NutritionStats } from "../types";

interface MealPlanProps {
  userProfile: UserProfile;
  stats: NutritionStats;
  onSwapMeal?: (mealType: string, currentMeal: any) => void;
}

export const MealPlan = ({ userProfile, stats, onSwapMeal }: MealPlanProps) => {
  const defaultPlan = [
    {
      id: 'm1',
      type: "breakfast",
      label: "فطور",
      time: "08:00 ص",
      name: "فول مدمس بزيت الزيتون + بيضة مسلوقة",
      calories: 420,
      macros: { p: 22, c: 35, f: 18 },
      icon: <Coffee />,
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      id: 'm2',
      type: "snacks",
      label: "سناك 1",
      time: "11:30 ص",
      name: "حبة تفاح + 5 حبات لوز",
      calories: 150,
      macros: { p: 3, c: 25, f: 6 },
      icon: <Plus />,
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      id: 'm3',
      type: "lunch",
      label: "غداء",
      time: "03:00 م",
      name: "صدر دجاج مشوي + 150ج أرز بني + سلطة خضراء",
      calories: 650,
      macros: { p: 45, c: 60, f: 15 },
      icon: <UtensilsCrossed />,
      color: "bg-green-500/10 text-green-600"
    },
    {
      id: 'm4',
      type: "snacks",
      label: "سناك 2",
      time: "06:30 م",
      name: "زبادي يوناني بالعسل",
      calories: 180,
      macros: { p: 15, c: 20, f: 2 },
      icon: <Plus />,
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      id: 'm5',
      type: "dinner",
      label: "عشاء",
      time: "09:00 م",
      name: "علبة تونة مصفاة + قطعة خبز أسمر + سلطة",
      calories: 400,
      macros: { p: 35, c: 25, f: 12 },
      icon: <UtensilsCrossed />,
      color: "bg-blue-500/10 text-blue-600"
    }
  ];

  // Map userProfile.mealPlan to the display format if available, otherwise use default
  const getDisplayPlan = () => {
    if (!userProfile.mealPlan) return defaultPlan;

    const plan: any[] = [];
    const mp = userProfile.mealPlan;
    
    // Helper to extract first item from arrays
    const extract = (arr: any[] | undefined, type: string, label: string, time: string, icon: any, color: string) => {
      if (arr && arr.length > 0) {
        const item = arr[0];
        plan.push({
          id: item.id,
          type,
          label,
          time,
          name: item.name,
          calories: item.calories,
          macros: { p: item.protein, c: item.carbs, f: item.fat },
          icon,
          color
        });
      } else {
        // Fallback to default for this specific slot if missing in mealPlan
        const def = defaultPlan.find(d => d.type === type && d.label === label);
        if (def) plan.push(def);
      }
    };

    extract(mp.breakfast, 'breakfast', 'فطور', '08:00 ص', <Coffee />, "bg-orange-500/10 text-orange-600");
    extract(mp.snacks, 'snacks', 'سناك 1', '11:30 ص', <Plus />, "bg-purple-500/10 text-purple-600");
    extract(mp.lunch, 'lunch', 'غداء', '03:00 م', <UtensilsCrossed />, "bg-green-500/10 text-green-600");
    // Snacks can have multiple, but for UI we show slots
    if (mp.snacks && mp.snacks.length > 1) {
      extract([mp.snacks[1]], 'snacks', 'سناك 2', '06:30 م', <Plus />, "bg-purple-500/10 text-purple-600");
    } else {
      extract(undefined, 'snacks', 'سناك 2', '06:30 م', <Plus />, "bg-purple-500/10 text-purple-600");
    }
    extract(mp.dinner, 'dinner', 'عشاء', '09:00 م', <UtensilsCrossed />, "bg-blue-500/10 text-blue-600");

    return plan;
  };

  const PLAN = getDisplayPlan();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center flex-row-reverse">
        <div className="flex flex-col text-right">
          <h2 className="text-2xl font-black text-primary">خطتك لليوم</h2>
          <p className="text-sm font-bold text-text-muted mt-1 italic">خطة متوازنة تعتمد على 2100 سعرة حرارية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 font-bold">
            تبديل الخطة
            <RefreshCw size={16} />
          </Button>
          <Button size="sm" className="gap-2 font-bold bg-accent hover:bg-accent/90 border-none shadow-lg shadow-accent/20">
             تحسين بالذكاء الاصطناعي
            <Sparkles size={16} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {PLAN.map((meal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 border-none shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-center gap-6 text-right flex-row-reverse">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-2xl ${meal.color}`}>
                {meal.icon}
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-center flex-row-reverse">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="font-black text-primary">{meal.type}</span>
                    <div className="w-1 h-1 bg-text-muted rounded-full opacity-30" />
                    <div className="flex items-center gap-1 text-text-muted font-bold text-xs flex-row-reverse">
                      <Clock size={12} />
                      {meal.time}
                    </div>
                  </div>
                  <span className="text-xs font-black text-accent bg-accent/5 px-2 py-1 rounded-lg">
                    {meal.calories} سعرة
                  </span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{meal.name}</h3>
                <div className="flex gap-4 mt-1 justify-end">
                   <div className="flex items-center gap-1 flex-row-reverse">
                     <span className="text-[10px] font-bold text-text-muted">بروتين</span>
                     <span className="text-xs font-black">{meal.macros.p}ج</span>
                   </div>
                   <div className="flex items-center gap-1 flex-row-reverse">
                     <span className="text-[10px] font-bold text-text-muted">كارب</span>
                     <span className="text-xs font-black">{meal.macros.c}ج</span>
                   </div>
                   <div className="flex items-center gap-1 flex-row-reverse">
                     <span className="text-[10px] font-bold text-text-muted">دهون</span>
                     <span className="text-xs font-black">{meal.macros.f}ج</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapMeal?.(meal.type, meal);
                  }}
                  title="تبديل الوجبة"
                >
                  <RefreshCw size={14} />
                </Button>
                <ChevronLeft size={24} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 transition-all" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <h3 className="text-xl font-black text-right">نصائح غذائية لليوم</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 bg-primary/5 border-primary/10 shadow-none text-right">
             <h4 className="font-black text-primary mb-2">اشرب المزيد من الماء 💧</h4>
             <p className="text-sm font-medium text-text-muted leading-relaxed">
               بناءً على نشاطك اليوم، نوصي بشرب 3.2 لتر من الماء. لقد شربت حتى الآن 1.5 لتر فقط.
             </p>
          </Card>
          <Card className="p-6 bg-accent/5 border-accent/10 shadow-none text-right">
             <h4 className="font-black text-accent mb-2">وجبة بعد التمرين 🏋️‍♂️</h4>
             <p className="text-sm font-medium text-text-muted leading-relaxed">
               لا تنسى تناول مصدر بروتين سريع الامتصاص بعد تمرين المقاومة اليوم لضمان أفضل استشفاء عضلي.
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
