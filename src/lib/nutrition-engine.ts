/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivityLevel, GoalType, NutritionStats, UserProfile } from "../types";

/**
 * Calculates BMR using Mifflin-St Jeor Equation
 */
export const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

/**
 * Maps activity level to multiplier
 */
const getActivityMultiplier = (level: ActivityLevel): number => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    extreme: 1.9,
  };
  return multipliers[level];
};

/**
 * Calculates TDEE and Target Macros
 */
export const calculateNutrition = (profile: UserProfile): NutritionStats => {
  const bmr = calculateBMR(profile);
  const tdee = bmr * getActivityMultiplier(profile.activityLevel);
  
  let targetCalories = tdee;
  
  // Adjust based on goal
  switch (profile.goal) {
    case 'lose':
      targetCalories -= 500;
      break;
    case 'gain':
      targetCalories += 300;
      break;
    case 'muscle':
      targetCalories += 250;
      break;
    case 'maintain':
    case 'health':
    default:
      break;
  }

  // Macro splits based on diet type
  let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
  
  switch (profile.dietType) {
    case 'high_protein':
      pRatio = 0.4; cRatio = 0.3; fRatio = 0.3;
      break;
    case 'low_carb':
      pRatio = 0.3; cRatio = 0.2; fRatio = 0.5;
      break;
    case 'vegetarian':
    case 'vegan':
      pRatio = 0.25; cRatio = 0.5; fRatio = 0.25;
      break;
    case 'standard':
    case 'flexible':
    default:
      pRatio = 0.3; cRatio = 0.4; fRatio = 0.3;
      break;
  }

  const protein = (targetCalories * pRatio) / 4;
  const carbs = (targetCalories * cRatio) / 4;
  const fat = (targetCalories * fRatio) / 9;

  // Apply manual overrides if they exist
  const finalStats = {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(profile.manualOverrides?.targetCalories ?? targetCalories),
    protein: Math.round(profile.manualOverrides?.protein ?? protein),
    carbs: Math.round(profile.manualOverrides?.carbs ?? carbs),
    fat: Math.round(profile.manualOverrides?.fat ?? fat),
  };

  return finalStats;
};
