/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ar: {
    translation: {
      common: {
        dashboard: "لوحة التحكم",
        mealPlan: "خطتي الغذائية",
        recipes: "الوصفات",
        shopping: "المشتريات",
        progress: "تقدمي",
        settings: "الإعدادات",
        logout: "خروج",
        welcome: "مرحباً {{name}} 👋",
        save: "حفظ التعديلات",
        saved: "تم الحفظ بنجاح!",
        reset: "إعادة للوضع التلقائي",
      },
      settings: {
        title: "إعدادات الأهداف",
        subtitle: "قم بتعديل أهدافك اليومية يدوياً أو دع Nutriva تحسبها لك",
        language: "اللغة",
        manualTarget: "هدف السعرات الحرارية",
        protein: "بروتين (جم)",
        carbs: "كارب (جم)",
        fat: "دهون (جم)",
      }
    }
  },
  en: {
    translation: {
      common: {
        dashboard: "Dashboard",
        mealPlan: "Meal Plan",
        recipes: "Recipes",
        shopping: "Shopping List",
        progress: "Progress",
        settings: "Settings",
        logout: "Logout",
        welcome: "Welcome {{name}} 👋",
        save: "Save Changes",
        saved: "Saved successfully!",
        reset: "Reset to Auto",
      },
      settings: {
        title: "Goal Settings",
        subtitle: "Manually adjust your daily goals or let Nutriva calculate them",
        language: "Language",
        manualTarget: "Calorie Target",
        protein: "Protein (g)",
        carbs: "Carbs (g)",
        fat: "Fat (g)",
      }
    }
  }
};

i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
