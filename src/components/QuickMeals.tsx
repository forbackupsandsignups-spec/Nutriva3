/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTranslation } from "react-i18next";
import { Card, Button } from "./ui";
import { Food } from "../types";
import { Zap, Plus, Utensils, Star } from "lucide-react";
import { motion } from "motion/react";

interface QuickMealsProps {
  savedMeals: Food[];
  onAddMeal: (food: Food) => void;
}

export const QuickMeals = ({ savedMeals, onAddMeal }: QuickMealsProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Default quick meals if none are saved
  const defaultMeals: Food[] = [
    {
      id: 'q1',
      nameAr: 'بيضة مسلوقة',
      nameEn: 'Boiled Egg',
      calories: 78,
      protein: 6,
      carbs: 0.6,
      fat: 5,
      servingSize: 50,
      servingUnit: 'g',
      category: 'Protein',
      allergens: ['eggs']
    },
    {
      id: 'q2',
      nameAr: 'زبادي يوناني',
      nameEn: 'Greek Yogurt',
      calories: 100,
      protein: 10,
      carbs: 4,
      fat: 0,
      servingSize: 150,
      servingUnit: 'g',
      category: 'Dairy',
      allergens: ['milk']
    },
    {
      id: 'q3',
      nameAr: 'موزة',
      nameEn: 'Banana',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      servingSize: 118,
      servingUnit: 'g',
      category: 'Fruit',
      allergens: []
    }
  ];

  const mealsToDisplay = savedMeals.length > 0 ? savedMeals : defaultMeals;

  return (
    <Card className="p-6 border-none shadow-xl bg-white flex flex-col gap-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-8 h-8 bg-yellow-500/10 text-yellow-600 rounded-lg flex items-center justify-center">
            <Zap size={18} fill="currentColor" />
          </div>
          <h3 className="font-black text-sm">{isRTL ? 'وجبات سريعة' : 'Quick Meals'}</h3>
        </div>
        <span className="text-[10px] font-bold text-text-muted opacity-60">
          {isRTL ? 'إضافة بضغطة واحدة' : 'One-tap add'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mealsToDisplay.map((meal, idx) => (
          <motion.div
            key={meal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => onAddMeal(meal)}
              className={`w-full p-4 rounded-2xl bg-black/5 hover:bg-primary/5 transition-all flex items-center justify-between gap-3 group border-2 border-transparent hover:border-primary/20 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                   <Utensils size={18} className="text-primary/60" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <span className="block font-black text-xs text-primary truncate max-w-[100px]">
                    {isRTL ? meal.nameAr : meal.nameEn}
                  </span>
                  <span className="text-[10px] font-bold text-text-muted italic">
                    {meal.calories} {isRTL ? 'سعرة' : 'kcal'}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={16} />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {savedMeals.length === 0 && (
        <p className="text-[10px] font-bold text-text-muted italic text-center">
          {isRTL ? 'هذه وجبات مقترحة. يمكنك حفظ وجباتك الخاصة لاحقاً.' : 'These are suggested meals. You can save your own later.'}
        </p>
      )}
    </Card>
  );
};
