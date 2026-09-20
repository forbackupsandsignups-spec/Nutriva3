/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Card, Button, Input } from "./ui";
import { ShoppingCart, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
  category: string;
}

interface ShoppingListProps {
  items: ShoppingItem[];
  onSetItems: (items: ShoppingItem[]) => void;
}

export const ShoppingList = ({ items, onSetItems }: ShoppingListProps) => {
  const [newItemName, setNewItemName] = useState("");

  const addItem = () => {
    if (!newItemName) return;
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      amount: "1",
      checked: false,
      category: "أخرى"
    };
    onSetItems([newItem, ...items]);
    setNewItemName("");
  };

  const updateAmount = (id: string, amount: string) => {
    onSetItems(items.map(item => item.id === id ? { ...item, amount } : item));
  };

  const toggleItem = (id: string) => {
    onSetItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeItem = (id: string) => {
    onSetItems(items.filter(item => item.id !== id));
  };

  // Group by category
  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-right">
          <h2 className="text-3xl font-black text-primary">قائمة المشتريات</h2>
          <p className="text-text-muted font-bold mt-1 italic">تسوق بذكاء بناءً على خطتك الأسبوعية.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={addItem} className="font-black px-8">إضافة</Button>
          <Input 
            placeholder="أضف غرضاً يدوياً..." 
            className="text-right h-12" 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-10">
          {categories.map(cat => (
            <div key={cat} className="flex flex-col gap-4">
              <h3 className="text-xl font-black text-primary border-r-4 border-primary pr-4 flex items-center justify-end gap-2">
                {cat}
              </h3>
              <div className="grid gap-3">
                {items.filter(i => i.category === cat).map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      item.checked ? 'bg-black/5 border-transparent opacity-60' : 'bg-white border-black/5 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-4 justify-end pr-4">
                      <div className="flex items-center gap-3">
                        <Input 
                          value={item.amount}
                          onChange={(e) => updateAmount(item.id, e.target.value)}
                          className="w-24 h-9 text-center text-xs font-bold bg-primary/5 border-none"
                          placeholder="الكمية"
                        />
                        <div className="text-right">
                          <span className={`block font-black text-sm ${item.checked ? 'line-through text-text-muted' : 'text-primary'}`}>
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          item.checked ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'border-black/10 hover:border-primary/30'
                        }`}
                      >
                        {item.checked && <CheckCircle2 size={14} />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="flex flex-col items-center gap-6 py-24 bg-white rounded-[3rem] border-2 border-dashed border-primary/10">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/30">
                <ShoppingCart size={40} />
              </div>
              <div className="text-center">
                <p className="font-black text-lg text-text-muted">قائمة المشتريات فارغة</p>
                <p className="text-xs font-bold text-text-muted opacity-60 mt-1">ابدأ بإضافة المكونات من صفحة الوصفات</p>
              </div>
            </div>
          )}
        </div>

        <Card className="p-8 border-none shadow-2xl bg-primary text-white flex flex-col gap-8 sticky top-24">
           <div className="flex justify-between items-center flex-row-reverse">
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
               <ShoppingCart size={28} />
             </div>
             <div className="text-right">
                <span className="text-xs font-bold opacity-60 block">تسوق بذكاء</span>
                <span className="text-xl font-black">ملخص القائمة</span>
             </div>
           </div>

           <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black flex-row-reverse">
                  <span>نسبة الإنجاز</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full">
                    {items.filter(i => i.checked).length} / {items.length}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,184,0,0.5)]" 
                    style={{ width: `${(items.filter(i => i.checked).length / Math.max(items.length, 1)) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <span className="block text-2xl font-black">{items.length}</span>
                  <span className="text-[10px] font-bold opacity-60 uppercase">إجمالي القطع</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
                  <span className="block text-2xl font-black">{categories.length}</span>
                  <span className="text-[10px] font-bold opacity-60 uppercase">فئات</span>
                </div>
              </div>
           </div>

           <p className="text-xs font-medium opacity-70 leading-relaxed italic text-right border-r-2 border-white/20 pr-3">
             تم تحديث هذه القائمة بناءً على خطتك الغذائية للأسبوع القادم لضمان توفر كل ما تحتاجه.
           </p>

           <Button variant="outline" className="w-full bg-white text-primary hover:bg-white/90 border-none font-black h-12">
             مشاركة القائمة
           </Button>
        </Card>
      </div>
    </div>
  );
};
