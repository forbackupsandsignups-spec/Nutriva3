/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, Input } from "./ui";
import { HEALTH_ARTICLES, Article } from "../data/articles";
import { Search, BookOpen, Clock, Tag, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const HealthArticles = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const isRTL = i18n.dir() === 'rtl';
  
  const categoriesAr = ["الكل", "تغذية أساسية", "بناء عضلات", "صحة نفسية", "أنظمة غذائية"];
  const categoriesEn = ["All", "Basic Nutrition", "Muscle Building", "Mental Health", "Diet Systems"];
  const categories = isRTL ? categoriesAr : categoriesEn;

  const filteredArticles = HEALTH_ARTICLES.filter(article => {
    const title = isRTL ? article.titleAr : article.titleEn;
    const category = isRTL ? article.categoryAr : article.categoryEn;
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === (isRTL ? "الكل" : "All") || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-black text-primary">{isRTL ? 'مكتبة المقالات الصحية' : 'Health Articles Library'}</h2>
        <p className="text-sm font-bold text-text-muted mt-1 italic">
          {isRTL ? 'مقالات تعليمية موثوقة لمساعدتك في رحلتك الصحية' : 'Trusted educational articles to help your health journey'}
        </p>
      </div>

      <div className={`flex flex-col md:flex-row gap-4 items-center ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        <div className="relative flex-1 w-full">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-muted`} size={18} />
          <Input 
            placeholder={isRTL ? "ابحث عن مقال..." : "Search for an article..."}
            className={`w-full h-12 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={`flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap font-bold h-12"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredArticles.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ y: -5 }}
            className="flex"
          >
            <Card className="p-0 border-none shadow-xl overflow-hidden flex flex-col md:flex-row w-full group">
              <div className="md:w-48 h-48 md:h-auto overflow-hidden">
                <img 
                  src={article.image} 
                  alt={isRTL ? article.titleAr : article.titleEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className={`flex-1 p-6 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                    {isRTL ? article.categoryAr : article.categoryEn}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-text-muted font-bold">
                    <Clock size={10} />
                    <span>{isRTL ? article.readTimeAr : article.readTimeEn}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-primary mb-3 leading-tight">
                  {isRTL ? article.titleAr : article.titleEn}
                </h3>
                <p className="text-sm font-medium text-text-muted mb-6 flex-1 line-clamp-2">
                  {isRTL ? article.excerptAr : article.excerptEn}
                </p>
                <Button 
                  onClick={() => setSelectedArticle(article)}
                  variant="ghost" 
                  className={`p-0 h-auto text-primary font-black hover:bg-transparent hover:underline gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {isRTL ? 'اقرأ المزيد' : 'Read More'}
                  {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="py-20 text-center">
          <BookOpen className="mx-auto text-text-muted/20 mb-4" size={64} />
          <p className="font-bold text-text-muted">
            {isRTL ? 'لم يتم العثور على مقالات تطابق بحثك' : 'No articles found matching your search'}
          </p>
        </div>
      )}

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-64 relative">
                <img 
                  src={selectedArticle.image} 
                  className="w-full h-full object-cover"
                  alt={isRTL ? selectedArticle.titleAr : selectedArticle.titleEn}
                />
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-12 h-12 bg-black/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-black/40 transition-all`}
                >
                  <X size={24} />
                </button>
              </div>
              <div className={`p-8 md:p-12 overflow-y-auto flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                   <span className="bg-primary/10 text-primary text-xs font-black px-4 py-1.5 rounded-full">
                     {isRTL ? selectedArticle.categoryAr : selectedArticle.categoryEn}
                   </span>
                   <div className="flex items-center gap-1 text-xs text-text-muted font-black opacity-60">
                      <Clock size={14} />
                      <span>{isRTL ? selectedArticle.readTimeAr : selectedArticle.readTimeEn}</span>
                   </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-8 leading-tight">
                  {isRTL ? selectedArticle.titleAr : selectedArticle.titleEn}
                </h2>
                <div className="space-y-6">
                   <p className="text-lg font-bold text-text-muted leading-relaxed">
                     {isRTL ? selectedArticle.excerptAr : selectedArticle.excerptEn}
                   </p>
                   <div className="h-px bg-black/5 w-20" />
                   <p className="text-md font-medium text-text-muted leading-loose whitespace-pre-wrap">
                     {isRTL ? selectedArticle.contentAr : selectedArticle.contentEn}
                   </p>
                </div>
                
                <div className={`mt-12 flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  {(selectedArticle.tags).map(tag => (
                    <span key={tag} className="text-[10px] font-black text-text-muted/60 bg-black/5 px-3 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
