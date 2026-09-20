/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Card, Button, Input } from "./ui";
import { Search, Clock, Flame, ChefHat, Plus, Info, Check, ShoppingCart, X } from "lucide-react";
import { SAMPLE_RECIPES } from "../data/recipes";
import { Recipe } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface RecipesProps {
  onAddMeal?: (recipe: Recipe) => void;
  onAddToShoppingList?: (ingredients: string[]) => void;
}

export const Recipes = ({ onAddMeal, onAddToShoppingList }: RecipesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("الكل");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const allTags = ["الكل", "فطور", "غداء", "عشاء", "سناك", "عالي البروتين", "اقتصادي"];

  const handleAddMeal = (recipe: Recipe) => {
    if (onAddMeal) {
      onAddMeal(recipe);
      setShowSuccess("تمت إضافة الوجبة إلى خطتك!");
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleAddIngredients = (recipe: Recipe) => {
    if (onAddToShoppingList) {
      onAddToShoppingList(recipe.ingredients);
      setShowSuccess("تمت إضافة المكونات إلى قائمة المشتريات!");
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const filteredRecipes = SAMPLE_RECIPES.filter(r => {
    const matchesSearch = r.name.includes(searchQuery);
    const matchesTag = selectedTag === "الكل" || r.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-green-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-green-200 flex items-center gap-2"
          >
            <Check size={20} />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-right">
          <h2 className="text-3xl font-black text-primary">اكتشف الوصفات</h2>
          <p className="text-text-muted font-bold mt-1">وجبات صحية، عربية، وسهلة التحضير.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <Input 
            placeholder="ابحث عن وصفة..." 
            className="pr-12 text-right"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 overflow-x-auto pb-2 flex-row-reverse">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
              selectedTag === tag 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white border border-black/5 text-text-muted hover:border-primary/30'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Recipes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <Card key={recipe.id} className="p-0 overflow-hidden border-none shadow-md hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-primary shadow-sm">
                {recipe.tags[0]}
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4 text-right flex-1">
              <h3 className="text-xl font-black text-primary">{recipe.name}</h3>
              <div className="flex items-center gap-4 justify-end text-xs font-bold text-text-muted">
                <div className="flex items-center gap-1">
                  <span>{recipe.prepTime} دقيقة</span>
                  <Clock size={14} />
                </div>
                <div className="flex items-center gap-1">
                  <span>{recipe.calories} سعرة</span>
                  <Flame size={14} />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                 <div className="flex gap-2">
                    <Button onClick={() => setSelectedRecipe(recipe)} variant="outline" className="flex-1 h-10 text-[10px] font-black">التفاصيل</Button>
                    <Button onClick={() => handleAddMeal(recipe)} className="flex-1 h-10 text-[10px] font-black gap-1">
                      <Plus size={14} />
                      أضف لخطتي
                    </Button>
                 </div>
                 <Button 
                   variant="ghost" 
                   onClick={() => handleAddIngredients(recipe)}
                   className="w-full h-10 text-[10px] font-black gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-none"
                 >
                   <ShoppingCart size={14} />
                   إضافة المكونات للمشتريات
                 </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64">
                <img src={selectedRecipe.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto text-right">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-black text-primary">{selectedRecipe.name}</h3>
                    <div className="flex gap-2 mt-2 justify-end">
                      {selectedRecipe.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-background p-4 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-text-muted mb-1">سعرات</span>
                    <span className="font-black text-primary">{selectedRecipe.calories}</span>
                  </div>
                  <div className="bg-background p-4 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-text-muted mb-1">بروتين</span>
                    <span className="font-black text-primary">{selectedRecipe.protein}ج</span>
                  </div>
                  <div className="bg-background p-4 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-text-muted mb-1">كارب</span>
                    <span className="font-black text-primary">{selectedRecipe.carbs}ج</span>
                  </div>
                  <div className="bg-background p-4 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-text-muted mb-1">دهون</span>
                    <span className="font-black text-primary">{selectedRecipe.fat}ج</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="flex flex-col gap-4">
                     <h4 className="font-black text-xl flex items-center gap-2 justify-end text-primary">
                        المكونات
                        <ChefHat size={20} />
                     </h4>
                     <ul className="space-y-3 font-bold text-text-muted text-sm">
                       {selectedRecipe.ingredients.map((ing, i) => (
                         <li key={i} className="flex items-center gap-2 justify-end">
                           <span>{ing}</span>
                           <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                         </li>
                       ))}
                     </ul>
                   </div>

                   <div className="flex flex-col gap-4">
                     <h4 className="font-black text-xl flex items-center gap-2 justify-end text-primary">
                        طريقة التحضير
                        <Info size={20} />
                     </h4>
                     <ol className="space-y-4 font-medium text-text-muted text-sm">
                       {selectedRecipe.instructions.map((ins, i) => (
                         <li key={i} className="flex gap-3 justify-end leading-relaxed">
                           <span>{ins}</span>
                           <span className="font-black text-primary shrink-0">{i + 1}.</span>
                         </li>
                       ))}
                     </ol>
                   </div>
                </div>

                <Button 
                  onClick={() => {
                    handleAddMeal(selectedRecipe);
                    setSelectedRecipe(null);
                  }}
                  className="w-full mt-10 h-14 text-lg font-black"
                >
                  أضف إلى خطتي الغذائية
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


