/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, NutritionStats, SmartReminderData, MealItem } from '../types';

export interface GenerateReminderParams {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  userProfile: UserProfile;
  stats: NutritionStats;
  currentCalories: number;
  isAlreadyLogged: boolean;
  language: string;
  customTime?: string;
}

export const getMealPlannedItem = (userProfile: UserProfile, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): MealItem | null => {
  if (!userProfile.mealPlan) return null;
  const items = (userProfile.mealPlan as unknown as Record<string, MealItem[]>)[mealType];
  return items && items.length > 0 ? items[0] : null;
};

export const getFallbackMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', dietType: string, isArabic: boolean) => {
  const isKeto = dietType === 'low_carb';
  const isHighProtein = dietType === 'high_protein';
  const isVeg = dietType === 'vegetarian' || dietType === 'vegan';

  switch (mealType) {
    case 'breakfast':
      if (isKeto) {
        return {
          name: isArabic ? 'بيض مخفوق مع الأفوكادو وزيت الزيتون 🥑' : 'Scrambled Eggs with Avocado & Olive Oil 🥑',
          calories: 380,
          protein: 22,
          carbs: 6,
          fat: 30
        };
      }
      if (isHighProtein) {
        return {
          name: isArabic ? 'شوفان بالواي بروتين مع زبدة الفول السوداني 🥣' : 'Oats with Whey Protein & Peanut Butter 🥣',
          calories: 420,
          protein: 38,
          carbs: 45,
          fat: 10
        };
      }
      if (isVeg) {
        return {
          name: isArabic ? 'فول مدمس بزيت الزيتون والليمون مع خبز حبوب كاملة 🫘' : 'Fava Beans with Olive Oil & Whole Grain Bread 🫘',
          calories: 350,
          protein: 18,
          carbs: 48,
          fat: 9
        };
      }
      return {
        name: isArabic ? 'فول مدمس بزيت الزيتون مع بيضة مسلوقة وخبز أسمر 🍳' : 'Foul Medames with Boiled Egg & Brown Bread 🍳',
        calories: 390,
        protein: 22,
        carbs: 42,
        fat: 14
      };

    case 'lunch':
      if (isKeto) {
        return {
          name: isArabic ? 'صدر دجاج مشوي مع سلطة سيزر بجبن البارميزان 🥗' : 'Grilled Chicken with Caesar Salad & Parmesan 🥗',
          calories: 520,
          protein: 48,
          carbs: 8,
          fat: 32
        };
      }
      if (isHighProtein) {
        return {
          name: isArabic ? 'صدر دجاج مشوي مع أرز بسمتي بني وسلطة خضراء 🍗' : 'Grilled Chicken Breast with Brown Basmati & Salad 🍗',
          calories: 580,
          protein: 52,
          carbs: 60,
          fat: 12
        };
      }
      if (isVeg) {
        return {
          name: isArabic ? 'كشري صحي أو صينية عدس وخضار مشوية مع حمص 🍲' : 'Healthy Lentil & Chickpea Bowl with Steamed Veggies 🍲',
          calories: 480,
          protein: 24,
          carbs: 72,
          fat: 10
        };
      }
      return {
        name: isArabic ? 'سمك فيليه مشوي مع بطاطا حلوة وسلطة كولسلو خفيفة 🐟' : 'Grilled Fish Fillet with Sweet Potato & Salad 🐟',
        calories: 510,
        protein: 44,
        carbs: 48,
        fat: 14
      };

    case 'dinner':
      if (isKeto) {
        return {
          name: isArabic ? 'سالمون مشوي مع بروكلي مطهو على البخار 🥦' : 'Grilled Salmon with Steamed Broccoli 🥦',
          calories: 440,
          protein: 36,
          carbs: 6,
          fat: 28
        };
      }
      if (isHighProtein) {
        return {
          name: isArabic ? 'جبنة قريش مع حبة البركة وسلطة خضراء وتونة 🥗' : 'Cottage Cheese with Tuna & Green Salad 🥗',
          calories: 380,
          protein: 42,
          carbs: 14,
          fat: 8
        };
      }
      return {
        name: isArabic ? 'سلطة تونة خفيفة مع ذرة حلوة وقطعة خبز أسمر 🥪' : 'Light Tuna Salad with Sweet Corn & Brown Toast 🥪',
        calories: 360,
        protein: 34,
        carbs: 30,
        fat: 8
      };

    case 'snack':
      if (isHighProtein) {
        return {
          name: isArabic ? 'زبادي يوناني قليل الدسم مع توت ولوز 🫐' : 'Greek Yogurt with Berries & Almonds 🫐',
          calories: 190,
          protein: 20,
          carbs: 14,
          fat: 5
        };
      }
      return {
        name: isArabic ? 'تفاحة خضراء مع ملعقة زبدة فول سوداني طبيعية 🍏' : 'Green Apple with 1 tbsp Natural Peanut Butter 🍏',
        calories: 180,
        protein: 5,
        carbs: 24,
        fat: 8
      };
  }
};

export const generateSmartMealReminder = (params: GenerateReminderParams): SmartReminderData => {
  const { mealType, userProfile, stats, currentCalories, isAlreadyLogged, language, customTime } = params;
  const isArabic = language === 'ar';
  const name = userProfile.name || (isArabic ? 'صديقنا الرائع' : 'Champ');
  const goal = userProfile.goal || 'lose';
  const remainingCals = Math.max(0, stats.targetCalories - currentCalories);

  // Planned meal or smart fallback
  const plannedItem = getMealPlannedItem(userProfile, mealType);
  const mealInfo = plannedItem ? {
    name: plannedItem.name,
    calories: plannedItem.calories,
    protein: plannedItem.protein,
    carbs: plannedItem.carbs,
    fat: plannedItem.fat
  } : getFallbackMeal(mealType, userProfile.dietType, isArabic);

  // Meal titles & icons
  const mealTitles = {
    breakfast: { ar: 'تذكير ذكي: موعد وجبة الإفطار 🍳', en: 'Smart Reminder: Breakfast Time 🍳' },
    lunch: { ar: 'تذكير ذكي: موعد وجبة الغداء 🍱', en: 'Smart Reminder: Lunch Time 🍱' },
    dinner: { ar: 'تذكير ذكي: موعد وجبة العشاء 🥗', en: 'Smart Reminder: Dinner Time 🥗' },
    snack: { ar: 'تذكير ذكي: موعد السناك الخفيف 🍎', en: 'Smart Reminder: Healthy Snack 🍎' }
  };

  // Generate personalized messages based on goal
  let messageAr = '';
  let messageEn = '';
  let tipAr = '';
  let tipEn = '';

  if (isAlreadyLogged) {
    messageAr = `أحسنت يا ${name}! لقد سجلت وجبتك مسبقاً وتتقدم بثبات نحو هدفك. متبقي لك اليوم ${remainingCals} سعرة حرارية.`;
    messageEn = `Great job, ${name}! You've already logged this meal. You have ${remainingCals} kcal remaining today.`;
    tipAr = 'تذكر شرب كوب ماء للمساعدة على الهضم والحفاظ على النشاط.';
    tipEn = 'Remember to drink a glass of water to aid digestion and maintain energy.';
  } else {
    switch (mealType) {
      case 'breakfast':
        if (goal === 'lose') {
          messageAr = `صباح العزيمة يا ${name}! تناول وجبة فطور غنية بالبروتين يثبت مستويات السكر ويقلل اشتهاء الحلويات باقي اليوم. تبقى لك ${remainingCals} سعرة اليوم.`;
          messageEn = `Good morning ${name}! A protein-packed breakfast stabilizes blood sugar and curbs cravings all day. You have ${remainingCals} kcal remaining.`;
          tipAr = 'البدء بـ 25 جم بروتين على الأقل يرفع معدل الحرق بنسبة 15%.';
          tipEn = 'Starting with at least 25g protein boosts metabolic rate by up to 15%.';
        } else if (goal === 'muscle' || goal === 'gain') {
          messageAr = `صباح القوة يا ${name}! عضلاتك تحتاج الوقود الآن لإنهاء مرحلة الصيام الليلي. تبقى لك ${remainingCals} سعرة حرارية اليوم.`;
          messageEn = `Power up, ${name}! Your muscles need fuel now after the overnight fast. You have ${remainingCals} kcal remaining today.`;
          tipAr = 'ادمج مصدر بروتين سريع وآخر بطيء الامتصاص لأفضل بناء عضلي.';
          tipEn = 'Combine fast and slow digesting proteins for optimal synthesis.';
        } else {
          messageAr = `صباح الخير يا ${name}! حان موعد فطورك لتزويد جسمك بالطاقة والتركيز لإنجاز مهام يومك. تبقى لك ${remainingCals} سعرة.`;
          messageEn = `Good morning ${name}! Time for breakfast to fuel your body and mind for the day ahead. ${remainingCals} kcal remaining.`;
          tipAr = 'الألياف والدهون الصحية تحافظ على صفاء ذهنك وطاقتك.';
          tipEn = 'Fiber and healthy fats keep your mind sharp and energized.';
        }
        break;

      case 'lunch':
        if (goal === 'lose') {
          messageAr = `حان وقت التزود بالطاقة الصحية يا ${name}! وجبة الغداء المتوازنة تحميك من هبوط الطاقة والرغبة في السكريات عصراً. تبقى لك ${remainingCals} سعرة.`;
          messageEn = `Time for a wholesome lunch, ${name}! A balanced midday meal protects against afternoon energy crashes. ${remainingCals} kcal remaining.`;
          tipAr = 'ابدأ بطبق السلطة أو الخضار قبل النشويات لتقليل قفزات الإنسولين.';
          tipEn = 'Start with salad/vegetables before carbs to minimize insulin spikes.';
        } else {
          messageAr = `منتصف اليوم يا ${name}! وقت وجبة الغداء المخططة لتغذية عضلاتك وضمان وصولك لهدفك اليومي. متبقي لك ${remainingCals} سعرة.`;
          messageEn = `Midday recharge, ${name}! Time for your planned lunch to fuel your goals. You have ${remainingCals} kcal remaining.`;
          tipAr = 'تأكد من شرب كوب ماء قبل الوجبة بـ 15 دقيقة.';
          tipEn = 'Drink a glass of water 15 minutes before your meal.';
        }
        break;

      case 'dinner':
        if (goal === 'lose') {
          messageAr = `مساء الخير يا ${name}! وجبة عشاء خفيفة ومحسوبة السعرات تمنحك استشفاءً مريحاً ونوماً عميقاً مع البقاء في عجز السعرات. تبقى لك ${remainingCals} سعرة.`;
          messageEn = `Good evening ${name}! A light, calibrated dinner ensures quality sleep while staying in calorie deficit. ${remainingCals} kcal remaining.`;
          tipAr = 'تجنب الوجبات الدسمة قبل النوم بساعتين لتحسين جودة هرمون النمو وحرق الدهون.';
          tipEn = 'Avoid heavy meals within 2 hours of sleep to boost growth hormone and recovery.';
        } else {
          messageAr = `مساء الإنجاز يا ${name}! حان وقت العشاء لتغطية ما تبقى من أهدافك الغذائية اليوم (${remainingCals} سعرة متبقية).`;
          messageEn = `Evening check-in, ${name}! Time for dinner to close out your daily nutrition targets (${remainingCals} kcal left).`;
          tipAr = 'البروتين بطيء الهضم كالكازين أو البيض يدعم تغذية العضلات طوال الليل.';
          tipEn = 'Slow-digesting protein like cottage cheese or eggs supports nighttime recovery.';
        }
        break;

      case 'snack':
        messageAr = `استراحة سريعة يا ${name}! وجبة خفيفة ذكية تمنع الجوع المفاجئ وتحافظ على حرق السعرات مستقراً. متبقي لك ${remainingCals} سعرة اليوم.`;
        messageEn = `Quick break, ${name}! A smart snack prevents sudden cravings and keeps your metabolism steady. ${remainingCals} kcal left.`;
        tipAr = 'اختر سناك يجمع بين القرمشة الصحية والبروتين كالمكسرات أو الخيار مع الحمص.';
        tipEn = 'Pick snacks combining healthy fats and protein like almonds or veggies with dip.';
        break;
    }
  }

  const times: Record<string, string> = {
    breakfast: userProfile.notifications?.breakfastTime || '08:00',
    lunch: userProfile.notifications?.lunchTime || '14:00',
    dinner: userProfile.notifications?.dinnerTime || '20:00',
    snack: userProfile.notifications?.snackTime || '16:30'
  };

  return {
    id: `${mealType}-${Date.now()}`,
    mealType,
    title: isArabic ? mealTitles[mealType].ar : mealTitles[mealType].en,
    message: isArabic ? messageAr : messageEn,
    tip: isArabic ? tipAr : tipEn,
    targetTime: customTime || times[mealType],
    remainingCalories: remainingCals,
    isAlreadyLogged,
    plannedMeal: mealInfo
  };
};
