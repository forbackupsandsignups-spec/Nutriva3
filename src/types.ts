/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dietType: DietType;
  budget: 'low' | 'medium' | 'high';
  mealsPerDay: number;
  allergies: string[];
  manualOverrides?: {
    targetCalories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  subscription?: {
    tier: 'free' | 'plus' | 'pro';
    status: 'active' | 'cancelled' | 'expired';
    expiryDate?: string;
  };
  healthSync?: {
    googleFitEnabled: boolean;
    lastSync?: string;
    todaySteps?: number;
    todayBurnedCalories?: number;
  };
  notifications?: {
    enabled: boolean;
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    snackTime?: string;
    smartRemindersEnabled?: boolean;
    soundEnabled?: boolean;
    reminderTone?: 'motivational' | 'scientific' | 'concise';
    healthUpdateEnabled?: boolean;
    healthUpdateTime?: string;
  };
  savedMeals?: Food[];
  foodDiary?: FoodDiaryEntry[];
  mealPlan?: MealPlanDay;
  weightHistory?: {
    date: string;
    weight: number;
  }[];
  activeChallenges?: ActiveChallenge[];
  waterIntake?: {
    amount: number;
    lastUpdated: string;
  };
  waterNotifications?: {
    enabled: boolean;
    frequencyHours: number; // e.g. every 2 hours
    startTime: string; // e.g. "08:00"
    endTime: string; // e.g. "22:00"
  };
  orders?: Order[];
  exerciseLog?: ExerciseEntry[];
  weeklyReports?: WeeklyReport[];
}

export interface WeeklyReport {
  id: string;
  startDate: string;
  endDate: string;
  achievementsAr: string[];
  achievementsEn: string[];
  tipsAr: string[];
  tipsEn: string[];
  suggestedGoalsAr: string[];
  suggestedGoalsEn: string[];
  stats: {
    avgCalories: number;
    totalWorkouts: number;
    weightChange: number;
    waterGoalMetDays: number;
  };
}

export interface ExerciseEntry {
  id: string;
  date: string;
  type: string;
  nameAr: string;
  nameEn: string;
  durationMinutes: number;
  intensity: 'low' | 'moderate' | 'high';
  caloriesBurned: number;
}

export interface Order {
  id: string;
  date: string;
  tier: 'plus' | 'pro';
  amount: number;
  currency: string;
  paymentMethod: 'instapay' | 'stripe' | 'other';
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
}

export interface Challenge {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationDays: number;
  icon: string;
  color: string;
}

export interface ActiveChallenge {
  challengeId: string;
  startDate: string;
  completedDates: string[];
}

export interface FoodDiaryEntry {
  id: string;
  date: string;
  imageUrl: string;
  nameAr: string;
  nameEn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  analysis: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high' | 'extreme';
export type GoalType = 'lose' | 'gain' | 'maintain' | 'muscle' | 'health';
export type DietType = 'standard' | 'high_protein' | 'vegetarian' | 'vegan' | 'low_carb' | 'flexible';

export interface NutritionStats {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Food {
  id: string;
  nameAr: string;
  nameEn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: number;
  servingUnit: string;
  category: string;
  allergens: string[];
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface MealPlanDay {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export interface MealItem {
  id: string;
  foodId?: string;
  recipeId?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged: boolean;
  evaluation?: string;
}

export interface SmartReminderData {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  message: string;
  tip: string;
  targetTime: string;
  remainingCalories: number;
  isAlreadyLogged: boolean;
  plannedMeal?: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

