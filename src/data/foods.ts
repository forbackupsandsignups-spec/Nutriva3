/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Food } from "../types";

export const ARABIC_FOODS: Food[] = [
  {
    id: "f1",
    nameAr: "فول مدمس بالزيت",
    nameEn: "Fava Beans with Oil",
    calories: 110,
    protein: 8,
    carbs: 18,
    fat: 2,
    servingSize: 100,
    servingUnit: "جم",
    category: "بقوليات",
    allergens: []
  },
  {
    id: "f2",
    nameAr: "بيض مسلوق",
    nameEn: "Boiled Egg",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    servingSize: 100,
    servingUnit: "جم",
    category: "بيض",
    allergens: ["البيض"]
  },
  {
    id: "f3",
    nameAr: "خبز بلدي مصري",
    nameEn: "Egyptian Baladi Bread",
    calories: 250,
    protein: 9,
    carbs: 50,
    fat: 1,
    servingSize: 100,
    servingUnit: "جم",
    category: "حبوب",
    allergens: ["القمح"]
  },
  {
    id: "f4",
    nameAr: "صدور دجاج مشوية",
    nameEn: "Grilled Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: 100,
    servingUnit: "جم",
    category: "دواجن",
    allergens: []
  },
  {
    id: "f5",
    nameAr: "أرز أبيض مطهو",
    nameEn: "Cooked White Rice",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    servingSize: 100,
    servingUnit: "جم",
    category: "حبوب",
    allergens: []
  },
  {
    id: "f6",
    nameAr: "ملوخية",
    nameEn: "Molokhia",
    calories: 45,
    protein: 3,
    carbs: 6,
    fat: 1,
    servingSize: 100,
    servingUnit: "جم",
    category: "خضروات",
    allergens: []
  },
  {
    id: "f7",
    nameAr: "تمر مجدول",
    nameEn: "Medjool Dates",
    calories: 277,
    protein: 1.8,
    carbs: 75,
    fat: 0.2,
    servingSize: 100,
    servingUnit: "جم",
    category: "فواكه",
    allergens: []
  },
  {
    id: "f8",
    nameAr: "زبادي طبيعي",
    nameEn: "Natural Yogurt",
    calories: 60,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    servingSize: 100,
    servingUnit: "جم",
    category: "ألبان",
    allergens: ["الحليب"]
  },
  {
    id: "f9",
    nameAr: "سلطة خضراء",
    nameEn: "Green Salad",
    calories: 25,
    protein: 1.5,
    carbs: 5,
    fat: 0.2,
    servingSize: 100,
    servingUnit: "جم",
    category: "خضروات",
    allergens: []
  },
  {
    id: "f10",
    nameAr: "كشري مصري",
    nameEn: "Egyptian Koshary",
    calories: 180,
    protein: 7,
    carbs: 35,
    fat: 1.5,
    servingSize: 100,
    servingUnit: "جم",
    category: "وجبات عربية",
    allergens: ["القمح"]
  }
];
