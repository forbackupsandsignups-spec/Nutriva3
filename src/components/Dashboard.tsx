/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, ProgressBar, Input } from "./ui";
import { Recipes } from "./Recipes";
import { ShoppingList } from "./ShoppingList";
import { Progress } from "./Progress";
import { MealPlan } from "./MealPlan";
import { AIAssistant } from "./AIAssistant";
import { SettingsView } from "./Settings";
import { Subscriptions } from "./Subscriptions";
import { HealthArticles } from "./HealthArticles";
import { NotificationToast } from "./NotificationToast";
import { WeeklyOverviewChart } from "./WeeklyOverviewChart";
import { Challenges } from "./Challenges";
import { OrdersPage } from "./OrdersPage";
import { ExerciseLog } from "./ExerciseLog";
import { WeeklyReportView } from "./WeeklyReportView";
import { 
  Flame, 
  Dumbbell, 
  Beef, 
  UtensilsCrossed,
  Search,
  Plus,
  LayoutDashboard,
  Calendar,
  LogOut,
  Settings,
  TrendingUp,
  Coffee,
  X,
  Check,
  ShoppingCart,
  Sparkles,
  CreditCard,
  BookOpen,
  Smartphone,
  Star,
  Camera as CameraIcon,
  ChevronRight,
  Loader2,
  RefreshCw,
  Trophy,
  Crown,
  Package,
  Bell
} from "lucide-react";
import { QuickMeals } from "./QuickMeals";
import { FoodCamera } from "./FoodCamera";
import { FoodDiary } from "./FoodDiary";
import { DailyProgressTracker } from "./DailyProgressTracker";
import { UserProfile, NutritionStats, MealItem, Food, Recipe, FoodDiaryEntry, MealPlanDay, WeeklyReport, SmartReminderData } from "../types";
import { ARABIC_FOODS } from "../data/foods";
import { motion, AnimatePresence } from "motion/react";
import { useMealNotifications } from "../hooks/useMealNotifications";
import { SmartMealReminderModal } from "./SmartMealReminderModal";
import { NotificationCenter } from "./NotificationCenter";
import { generateSmartMealReminder } from "../utils/smartReminders";
import { playNotificationChime } from "../utils/sound";

interface DashboardProps {
  userProfile: UserProfile;
  stats: NutritionStats;
  onLogout: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
}

type DashboardTab = 'overview' | 'plan' | 'recipes' | 'shopping' | 'progress' | 'settings' | 'subscriptions' | 'articles' | 'diary' | 'challenges' | 'orders' | 'exercise';

export const Dashboard = ({ userProfile, stats, onLogout, onProfileUpdate }: DashboardProps) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [loggedMeals, setLoggedMeals] = useState<MealItem[]>([]);
  const [shoppingItems, setShoppingItems] = useState<any[]>([]);
  
  const waterIntake = useMemo(() => {
    const today = new Date().toDateString();
    if (userProfile.waterIntake?.lastUpdated && new Date(userProfile.waterIntake.lastUpdated).toDateString() === today) {
      return userProfile.waterIntake.amount;
    }
    return 0;
  }, [userProfile.waterIntake]);

  // Weekly Report Logic
  useEffect(() => {
    const today = new Date();
    const isStartOfWeek = today.getDay() === 0 || today.getDay() === 1; // Sun or Mon
    
    if (isStartOfWeek) {
      const lastReport = userProfile.weeklyReports?.[0];
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      if (!lastReport || new Date(lastReport.endDate) < weekAgo) {
        // Generate new report
        const endDate = today.toISOString();
        const startDate = weekAgo.toISOString();
        
        // Simple mock calculations based on profile data
        const diaryEntries = userProfile.foodDiary || [];
        const recentEntries = diaryEntries.filter(e => new Date(e.date) > weekAgo);
        const avgCals = recentEntries.length > 0 
          ? Math.round(recentEntries.reduce((s, e) => s + e.calories, 0) / recentEntries.length)
          : 0;
          
        const recentWorkouts = (userProfile.exerciseLog || []).filter(e => new Date(e.date) > weekAgo);
        
        const newReport: WeeklyReport = {
          id: Math.random().toString(36).substr(2, 9),
          startDate,
          endDate,
          stats: {
            avgCalories: avgCals,
            totalWorkouts: recentWorkouts.length,
            weightChange: -0.5, // Mock data
            waterGoalMetDays: 5 // Mock data
          },
          achievementsAr: [
            recentWorkouts.length > 3 ? 'بطل التمارين! أكملت أكثر من 3 تمارين هذا الأسبوع.' : 'بداية جيدة في النشاط البدني.',
            'التزمت بشرب الماء في أغلب الأيام.',
            'حافظت على تسجيل وجباتك بانتظام.'
          ],
          achievementsEn: [
            recentWorkouts.length > 3 ? 'Workout Hero! Completed more than 3 sessions this week.' : 'Great start with physical activity.',
            'Stayed hydrated on most days.',
            'Maintained regular meal logging.'
          ],
          tipsAr: [
            'حاول زيادة استهلاك البروتين في وجبة الإفطار.',
            'المشي لمدة 15 دقيقة بعد العشاء يساعد في الهضم.',
            'نومك المبكر يعزز من عملية حرق الدهون.'
          ],
          tipsEn: [
            'Try increasing protein intake during breakfast.',
            'A 15-minute walk after dinner aids digestion.',
            'Earlier sleep boosts fat burning process.'
          ],
          suggestedGoalsAr: ['خسارة 0.5 كجم', 'شرب 3 لتر ماء يومياً', 'إكمال 4 تمارين'],
          suggestedGoalsEn: ['Lose 0.5 kg', 'Drink 3L water daily', 'Complete 4 workouts']
        };

        const updatedProfile = {
          ...userProfile,
          weeklyReports: [newReport, ...(userProfile.weeklyReports || [])]
        };
        
        onProfileUpdate(updatedProfile);
        setShowWeeklyReport(newReport);
      }
    }
  }, []);

  const totalCaloriesBurned = useMemo(() => {
    const today = new Date().toDateString();
    return (userProfile.exerciseLog || [])
      .filter(ex => new Date(ex.date).toDateString() === today)
      .reduce((sum, ex) => sum + ex.caloriesBurned, 0);
  }, [userProfile.exerciseLog]);

  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState<WeeklyReport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [alternativeSuggestion, setAlternativeSuggestion] = useState<any | null>(null);
  const [notification, setNotification] = useState<{message: string; show: boolean}>({ message: "", show: false });
  const [activeSmartReminder, setActiveSmartReminder] = useState<SmartReminderData | null>(null);

  // Get next meal based on time
  const nextMealInfo = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return { type: 'breakfast', label: 'الفطور', time: '8:00 ص' };
    if (hour < 16) return { type: 'lunch', label: 'الغداء', time: '2:00 م' };
    if (hour < 21) return { type: 'dinner', label: 'العشاء', time: '8:00 م' };
    return { type: 'breakfast', label: 'الفطور (غداً)', time: '8:00 ص' };
  }, []);

  const handleSuggestAlternative = async (mealType: string) => {
    setIsSuggesting(true);
    try {
      // Find current meal from plan if exists, otherwise use fallback
      const planItem = (userProfile.mealPlan as any)?.[mealType]?.[0];
      
      const currentMeal = planItem ? {
        name: planItem.name,
        calories: planItem.calories,
        protein: planItem.protein,
        carbs: planItem.carbs,
        fat: planItem.fat
      } : {
        name: nextMealInfo.label,
        calories: nextMealInfo.type === 'breakfast' ? 400 : nextMealInfo.type === 'lunch' ? 700 : 500,
        protein: 20,
        carbs: 50,
        fat: 15
      };

      const response = await fetch('/api/suggest-alternative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealItem: currentMeal, userProfile }),
      });

      if (!response.ok) throw new Error('فشل الحصول على اقتراح');
      
      const suggestion = await response.json();
      setAlternativeSuggestion({ ...suggestion, mealType });
    } catch (error) {
      console.error(error);
      setNotification({ message: "عذراً، تعذر الحصول على اقتراح حالياً", show: true });
    } finally {
      setIsSuggesting(false);
    }
  };

  const applyAlternative = (suggestion: any) => {
    const mealType = suggestion.mealType as keyof MealPlanDay;
    const currentPlan = userProfile.mealPlan || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    
    const newItem: MealItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: suggestion.name,
      calories: suggestion.calories,
      protein: suggestion.protein,
      carbs: suggestion.carbs,
      fat: suggestion.fat,
      logged: false
    };

    const updatedPlan: any = { ...currentPlan };
    if (mealType === 'snacks') {
      // If we have multiple snack slots, this is tricky, but let's just replace the first one for now
      // Or handle based on some logic. Let's assume we replace the one being swapped.
      updatedPlan.snacks = [newItem]; 
    } else {
      updatedPlan[mealType as string] = [newItem];
    }

    onProfileUpdate({
      ...userProfile,
      mealPlan: updatedPlan
    });

    setNotification({ message: `تم تبديل الوجبة بـ: ${suggestion.name} ✅`, show: true });
    setAlternativeSuggestion(null);
  };

  // Calculate water target based on weight (35ml per kg)
  const waterTarget = useMemo(() => {
    return Math.round(userProfile.weight * 35);
  }, [userProfile.weight]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMeals = localStorage.getItem("nutriva_meals");
    if (savedMeals) {
      setLoggedMeals(JSON.parse(savedMeals));
    }
    
    const savedShopping = localStorage.getItem("nutriva_shopping");
    if (savedShopping) {
      setShoppingItems(JSON.parse(savedShopping));
    } else {
      // Initial items
      setShoppingItems([
        { id: '1', name: 'طماطم', amount: '1.5 kg', checked: false, category: 'خضروات' },
        { id: '2', name: 'خيار', amount: '1 kg', checked: true, category: 'خضروات' },
        { id: '3', name: 'صدور دجاج', amount: '1.5 kg', checked: false, category: 'بروتين' },
      ]);
    }
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("nutriva_meals", JSON.stringify(loggedMeals));
  }, [loggedMeals]);

  useEffect(() => {
    localStorage.setItem("nutriva_water", waterIntake.toString());
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem("nutriva_shopping", JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  const handleAddToShoppingList = (ingredients: string[]) => {
    const newItems = ingredients.map(ing => ({
      id: Math.random().toString(36).substr(2, 9),
      name: ing,
      amount: "حسب الوصفة",
      checked: false,
      category: "من الوصفات"
    }));
    setShoppingItems(prev => [...newItems, ...prev]);
  };

  const handleAddMealFromRecipe = (recipe: Recipe) => {
    const newItem: MealItem = {
      id: Math.random().toString(36).substr(2, 9),
      foodId: recipe.id,
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      logged: true,
      evaluation: "وصفة Nutriva ✅"
    };
    setLoggedMeals(prev => [...prev, newItem]);
  };

  const addWater = () => {
    const newAmount = Math.min(waterIntake + 250, waterTarget * 2);
    onProfileUpdate({
      ...userProfile,
      waterIntake: {
        amount: newAmount,
        lastUpdated: new Date().toISOString()
      }
    });
  };

  // Calculate current intake
  const currentIntake = useMemo(() => {
    return loggedMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [loggedMeals]);

  const triggerSmartMealReminder = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const isLogged = loggedMeals.some(m => m.name.toLowerCase().includes(mealType) || m.id.startsWith(mealType));
    const reminderData = generateSmartMealReminder({
      mealType,
      userProfile,
      stats,
      currentCalories: currentIntake.calories,
      isAlreadyLogged: isLogged,
      language: i18n.language
    });
    if (userProfile.notifications?.soundEnabled !== false) {
      playNotificationChime();
    }
    setActiveSmartReminder(reminderData);
  };

  const handleQuickLogSmartMeal = (mealItem: MealItem) => {
    const updatedMeals = [...loggedMeals, mealItem];
    setLoggedMeals(updatedMeals);
    localStorage.setItem("nutriva_meals", JSON.stringify(updatedMeals));
    setNotification({
      message: i18n.language === 'ar' 
        ? `تم تسجيل ${mealItem.name} في يومك بنجاح! (+${mealItem.calories} سعرة) 🎯`
        : `Logged ${mealItem.name} successfully! (+${mealItem.calories} kcal) 🎯`,
      show: true
    });
  };

  // Custom smart meal notifications hook
  useMealNotifications(
    userProfile,
    stats,
    currentIntake.calories,
    (reminderData) => {
      setActiveSmartReminder(reminderData);
    },
    (msg) => {
      setNotification({ message: msg, show: true });
    }
  );

  const filteredFoods = ARABIC_FOODS.filter(f => 
    f.nameAr.includes(searchQuery) || f.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const evaluateMeal = (food: Food): string => {
    const pCal = food.protein * 4;
    const cCal = food.carbs * 4;
    const fCal = food.fat * 9;
    const total = pCal + cCal + fCal || 1;

    const pRatio = pCal / total;
    const cRatio = cCal / total;

    if (pRatio > 0.35) return "غنية بالبروتين 🥩";
    if (cRatio < 0.25 && food.calories > 100) return "منخفضة الكاربو 🥗";
    if (pRatio > 0.2 && cRatio > 0.3 && cRatio < 0.6) return "وجبة متوازنة ✅";
    if (food.calories > 500) return "طاقة عالية 🔥";
    if (food.calories < 150) return "وجبة خفيفة 🍎";
    return "وجبة قياسية";
  };

  const addFoodToLog = (food: Food) => {
    const newItem: MealItem = {
      id: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      name: food.nameAr,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      logged: true,
      evaluation: evaluateMeal(food)
    };
    setLoggedMeals([...loggedMeals, newItem]);
    setIsLoggingOpen(false);
    setSearchQuery("");
  };

  const toggleSavedMeal = (food: Food) => {
    const isSaved = userProfile.savedMeals?.some(m => m.id === food.id);
    let updatedSavedMeals = userProfile.savedMeals || [];

    if (isSaved) {
      updatedSavedMeals = updatedSavedMeals.filter(m => m.id !== food.id);
    } else {
      updatedSavedMeals = [...updatedSavedMeals, food];
    }

    onProfileUpdate({
      ...userProfile,
      savedMeals: updatedSavedMeals
    });
  };

  const saveDiaryEntry = (entry: FoodDiaryEntry) => {
    const updatedDiary = [...(userProfile.foodDiary || []), entry];
    onProfileUpdate({
      ...userProfile,
      foodDiary: updatedDiary
    });
    setIsCameraOpen(false);
    setNotification({ message: "تمت إضافة الوجبة ليومياتك بنجاح! 📸", show: true });

    // Also add to daily log
    addFoodToLog({
      id: entry.id,
      nameAr: entry.nameAr,
      nameEn: entry.nameEn,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      servingSize: 1,
      servingUnit: "وجبة",
      category: "يوميات الطعام",
      allergens: []
    });
  };

  const deleteDiaryEntry = (id: string) => {
    const updatedDiary = (userProfile.foodDiary || []).filter(e => e.id !== id);
    onProfileUpdate({
      ...userProfile,
      foodDiary: updatedDiary
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'diary':
        return (
          <FoodDiary 
            entries={userProfile.foodDiary || []} 
            onOpenCamera={() => setIsCameraOpen(true)}
            onDeleteEntry={deleteDiaryEntry}
          />
        );
      case 'overview':
        return (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="flex flex-col gap-6">
              <Card className="p-8 border-none shadow-xl bg-primary text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-20 -translate-y-20" />
                <div className="relative z-10 flex flex-col gap-6 text-right">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="bg-white/10 hover:bg-white/20 text-white h-8 w-8 p-0 rounded-lg"
                        onClick={() => setActiveTab('settings')}
                        title="تعديل الأهداف يدوياً"
                      >
                        <Settings size={16} />
                      </Button>
                      <Flame size={24} className="text-accent" />
                    </div>
                    <span className="font-bold opacity-80 uppercase tracking-widest text-xs">هدفك اليومي</span>
                  </div>
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-xl font-bold opacity-70">/ {stats.targetCalories + (userProfile.healthSync?.todayBurnedCalories || 0) + totalCaloriesBurned} سعرة</span>
                    <span className="text-6xl font-black tracking-tighter">{currentIntake.calories}</span>
                  </div>
                  <ProgressBar 
                    value={currentIntake.calories} 
                    max={stats.targetCalories + (userProfile.healthSync?.todayBurnedCalories || 0) + totalCaloriesBurned} 
                    color="bg-accent" 
                    size="md" 
                  />
                  <div className="flex justify-between items-center flex-row-reverse">
                    <p className="text-sm font-bold opacity-80 italic">
                      {currentIntake.calories === 0 ? "لم تسجل أي وجبة اليوم بعد. ابدأ الآن!" : "استمر في هذا الإنجاز الرائع!"}
                    </p>
                    {((userProfile.healthSync?.todayBurnedCalories || 0) + totalCaloriesBurned > 0) && (
                      <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">
                        + {(userProfile.healthSync?.todayBurnedCalories || 0) + totalCaloriesBurned} سعرة نشاط
                      </span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Daily Progress Tracker (Water & Active Minutes) */}
              <DailyProgressTracker 
                userProfile={userProfile}
                waterIntake={waterIntake}
                waterTarget={waterTarget}
                onAddWater={addWater}
                onLogExercise={() => setActiveTab('exercise')}
              />

              <div className="col-span-full">
                <WeeklyOverviewChart userProfile={userProfile} />
              </div>

              <Card className="col-span-full p-8 border-none shadow-xl text-right">
                <h3 className="font-black text-lg mb-6">المغذيات الكبرى (جم)</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <ProgressBar label="بروتين" value={currentIntake.protein} max={stats.protein} color="bg-primary" size="sm" />
                  <ProgressBar label="كاربوهيدرات" value={currentIntake.carbs} max={stats.carbs} color="bg-accent" size="sm" />
                  <ProgressBar label="دهون" value={currentIntake.fat} max={stats.fat} color="bg-primary-light" size="sm" />
                </div>
              </Card>
            </div>

            {/* Subscription Entry Point (Summary) */}
            <div onClick={() => setActiveTab('subscriptions')}>
              <Card className="flex items-center justify-between p-6 bg-primary border-primary cursor-pointer hover:bg-primary/90 transition-all mb-4 text-white shadow-lg shadow-primary/20">
                <div className="flex items-center gap-4 flex-row-reverse w-full">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
                    <Crown size={24} />
                  </div>
                  <div className="text-right flex-1">
                    <h4 className="font-black">انضم إلى باقة النخبة (Pro)</h4>
                    <p className="text-[10px] text-white/80 font-bold">
                      {(!userProfile.subscription || userProfile.subscription.tier === 'free') 
                        ? "افتح جميع المميزات والوصفات الحصرية الآن"
                        : `أنت مشترك حالياً في باقة ${userProfile.subscription.tier}`}
                    </p>
                  </div>
                  <ChevronRight className="text-white rotate-180" />
                </div>
              </Card>
            </div>

            {/* Challenges Entry Point (Summary) */}
            <div onClick={() => setActiveTab('challenges')}>
              <Card className="flex items-center justify-between p-6 bg-accent/5 border-accent/10 cursor-pointer hover:bg-accent/10 transition-colors mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                    <Trophy size={24} />
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-black">التحديات الحالية</h4>
                    <p className="text-[10px] text-text-muted font-bold">
                      {userProfile.activeChallenges?.length 
                        ? `لديك ${userProfile.activeChallenges.length} تحديات نشطة`
                        : "ابدأ تحدياً جديداً وحفز نفسك"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-accent" />
              </Card>
            </div>

            {/* Diary Entry Point (Summary) */}
            <div onClick={() => setActiveTab('diary')}>
              <Card className="flex items-center justify-between p-6 bg-primary/5 border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                    <CameraIcon size={24} />
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-black">يوميات الطعام المصورة</h4>
                    <p className="text-[10px] text-text-muted font-bold">حلل وجباتك بالذكاء الاصطناعي</p>
                  </div>
                </div>
                <ChevronRight className="text-primary" />
              </Card>
            </div>

            {/* Next Meal Highlight */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center flex-row-reverse">
                <h2 className="text-xl font-black text-primary flex items-center gap-2">
                  <Sparkles size={18} />
                  الوجبة القادمة
                </h2>
                <span className="text-[10px] font-bold text-text-muted bg-black/5 px-3 py-1 rounded-full uppercase tracking-widest">
                  {nextMealInfo.time}
                </span>
              </div>
              <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                <div className="relative z-10 flex flex-col md:flex-row-reverse justify-between items-center gap-6">
                  <div className="flex flex-col items-end text-right flex-1">
                    <span className="text-xs font-black text-primary uppercase tracking-wider mb-1">{nextMealInfo.label}</span>
                    <h3 className="text-2xl font-black text-black mb-3">
                      {nextMealInfo.type === 'breakfast' ? 'فول مدمس بزيت الزيتون + بيضة مسلوقة' : 
                       nextMealInfo.type === 'lunch' ? 'صدر دجاج مشوي + أرز بني + سلطة' : 
                       'علبة تونة مصفاة + قطعة خبز أسمر'}
                    </h3>
                    <div className="flex gap-4 justify-end">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-text-muted uppercase">سعرات</span>
                        <span className="font-black text-black">
                          {nextMealInfo.type === 'breakfast' ? 420 : nextMealInfo.type === 'lunch' ? 650 : 400}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-black/5" />
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-text-muted uppercase">بروتين</span>
                        <span className="font-black text-black">
                          {nextMealInfo.type === 'breakfast' ? 22 : nextMealInfo.type === 'lunch' ? 45 : 35}ج
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                      onClick={() => triggerSmartMealReminder(nextMealInfo.type as any)}
                      variant="outline"
                      className="flex-1 md:flex-none h-14 px-4 gap-2 font-black border-accent/40 text-accent hover:bg-accent/5"
                      title="معاينة التنبيه الذكي لهذه الوجبة"
                    >
                      <Bell size={18} />
                      <span className="hidden sm:inline">تذكير ذكي</span>
                    </Button>
                    <Button 
                      onClick={() => handleSuggestAlternative(nextMealInfo.type)}
                      disabled={isSuggesting}
                      variant="outline" 
                      className="flex-1 md:flex-none h-14 px-6 gap-2 font-black border-dashed border-primary/30 text-primary hover:bg-primary/5"
                    >
                      {isSuggesting ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                      اقتراح بديل
                    </Button>
                    <Button 
                      onClick={() => setIsLoggingOpen(true)}
                      className="flex-1 md:flex-none h-14 px-8 gap-2 font-black shadow-lg shadow-primary/20"
                    >
                      <Check size={18} />
                      تسجيل الوجبة
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Meals Section */}
            <QuickMeals 
              savedMeals={userProfile.savedMeals || []} 
              onAddMeal={addFoodToLog} 
            />

            {/* Meals Section */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center flex-row-reverse">
                <h2 className="text-2xl font-black">وجبات اليوم</h2>
                <Button variant="ghost" size="sm" className="font-bold" onClick={() => setActiveTab('plan')}>عرض الخطة التفصيلية</Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'breakfast', label: 'الفطور', time: '8:00 ص', icon: <Coffee />, color: 'bg-orange-500/10 text-orange-600' },
                  { id: 'lunch', label: 'الغداء', time: '2:00 م', icon: <UtensilsCrossed />, color: 'bg-green-500/10 text-green-600' },
                  { id: 'dinner', label: 'العشاء', time: '8:00 م', icon: <UtensilsCrossed />, color: 'bg-blue-500/10 text-blue-600' },
                  { id: 'snacks', label: 'سناك', time: '4:00 م', icon: <Plus />, color: 'bg-purple-500/10 text-purple-600' }
                ].map((meal, idx) => {
                  const planItem = (userProfile.mealPlan as any)?.[meal.id]?.[0];
                  return (
                    <Card key={idx} className="p-5 flex flex-col gap-4 border-none shadow-md hover:shadow-lg transition-all group cursor-pointer text-right">
                      <div className="flex justify-between items-start flex-row-reverse">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meal.color}`}>
                          {meal.icon}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-text-muted">{meal.time}</span>
                          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-accent hover:bg-accent/10"
                              title="تذكير ذكي ومعاينة"
                              onClick={(e) => {
                                e.stopPropagation();
                                const type = meal.id === 'snacks' ? 'snack' : meal.id as any;
                                triggerSmartMealReminder(type);
                              }}
                            >
                              <Bell size={12} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                              title="اقتراح بديل"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSuggestAlternative(meal.id);
                              }}
                            >
                              <RefreshCw size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-black text-sm">{meal.label}</span>
                        <span className="block text-[10px] font-bold text-primary mt-0.5 truncate">{planItem?.name || "اكتشف وجبتك"}</span>
                        <div className="flex flex-col items-end gap-1 mt-1">
                          <span className="text-[10px] text-text-muted font-bold italic">
                            {loggedMeals.length > idx ? "تم التسجيل بنجاح" : "لم يتم التسجيل"}
                          </span>
                          {loggedMeals[idx]?.evaluation && (
                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                              {loggedMeals[idx].evaluation}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => setIsLoggingOpen(true)}
                        variant="outline" 
                        size="sm" 
                        className="w-full h-9 text-xs border-dashed"
                      >
                        إضافة طعام
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'plan':
        return <MealPlan userProfile={userProfile} stats={stats} onSwapMeal={handleSuggestAlternative} />;
      case 'challenges':
        return <Challenges userProfile={userProfile} onUpdateProfile={onProfileUpdate} />;
      case 'orders':
        return <OrdersPage userProfile={userProfile} onUpgradeClick={() => setActiveTab('subscriptions')} />;
      case 'exercise':
        return <ExerciseLog userProfile={userProfile} onUpdateProfile={onProfileUpdate} />;
      case 'recipes':
        return <Recipes onAddMeal={handleAddMealFromRecipe} onAddToShoppingList={handleAddToShoppingList} />;
      case 'shopping':
        return <ShoppingList items={shoppingItems} onSetItems={setShoppingItems} />;
      case 'progress':
        return <Progress userProfile={userProfile} onProfileUpdate={onProfileUpdate} />;
      case 'settings':
        return (
          <SettingsView 
            userProfile={userProfile} 
            onProfileUpdate={onProfileUpdate} 
            onLogout={onLogout}
            onTriggerTestReminder={triggerSmartMealReminder}
          />
        );
      case 'subscriptions':
        return <Subscriptions userProfile={userProfile} onProfileUpdate={onProfileUpdate} />;
      case 'articles':
        return <HealthArticles />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <LayoutDashboard size={48} className="opacity-20 mb-4" />
            <p className="font-bold">قريباً...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 fixed inset-y-0 ${i18n.dir() === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} bg-white border-black/5 p-6 z-50`}>
        <div className={`flex items-center gap-2 mb-12 ${i18n.dir() === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="text-white" size={18} />
          </div>
          <span className="text-xl font-black text-primary">Nutriva</span>
        </div>

        <nav className={`flex flex-col gap-2 flex-1 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
          {[
            { id: 'overview', label: t('common.dashboard'), icon: <LayoutDashboard size={20} /> },
            { id: 'challenges', label: i18n.language === 'ar' ? 'التحديات' : 'Challenges', icon: <Trophy size={20} /> },
            { id: 'orders', label: i18n.language === 'ar' ? 'إدارة الطلبات' : 'Manage Orders', icon: <Package size={20} /> },
            { id: 'exercise', label: i18n.language === 'ar' ? 'التمارين' : 'Exercise', icon: <Dumbbell size={20} /> },
            { id: 'plan', label: t('common.mealPlan'), icon: <Calendar size={20} /> },
            { id: 'recipes', label: t('common.recipes'), icon: <Search size={20} /> },
            { id: 'shopping', label: t('common.shopping'), icon: <ShoppingCart size={20} /> },
            { id: 'progress', label: t('common.progress'), icon: <TrendingUp size={20} /> },
            { id: 'articles', label: i18n.language === 'ar' ? 'المكتبة الصحية' : 'Health Library', icon: <BookOpen size={20} /> },
            { id: 'subscriptions', label: i18n.language === 'ar' ? 'الاشتراكات' : 'Subscriptions', icon: <CreditCard size={20} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'} ${
                activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <span className={`flex-1 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>{item.label}</span>
              {item.icon}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2 mt-auto">
           <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'} ${
              activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-primary/5 hover:text-primary'
            }`}
           >
             <span className={`flex-1 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>{t('common.settings')}</span>
             <Settings size={20} />
           </button>
           <button onClick={onLogout} className={`flex items-center gap-3 p-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
             <span className={`flex-1 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>{t('common.logout')}</span>
             <LogOut size={20} />
           </button>
        </div>
      </aside>

      <main className={`${i18n.dir() === 'rtl' ? 'lg:pr-64' : 'lg:pl-64'} min-h-screen`}>
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-black/5 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className={`flex items-center gap-4 w-full ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex flex-col flex-1 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
              <h1 className="text-xl font-black">{t('common.welcome', { name: userProfile.name })}</h1>
              <span className="text-xs font-bold text-text-muted italic">
                {activeTab === 'overview' ? 'جاهز لوجبتك القادمة؟' : 
                 activeTab === 'recipes' ? 'ماذا سنطبخ اليوم؟' : 
                 activeTab === 'shopping' ? 'قائمة أغراضك جاهزة' : 'Nutriva معك دائماً'}
              </span>
            </div>
            {activeTab !== 'overview' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveTab('overview')}
                className={`gap-2 font-black text-primary hover:bg-primary/5 px-4 ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {t('common.dashboard')}
                <LayoutDashboard size={18} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="lg:hidden p-2 text-red-500 hover:bg-red-50 rounded-xl"
              title={t('common.logout')}
            >
              <LogOut size={22} />
            </Button>
          </div>
          <div className={`flex items-center gap-3 shrink-0 ${i18n.dir() === 'rtl' ? 'mr-4' : 'ml-4'}`}>
            <NotificationCenter 
              userProfile={userProfile}
              loggedMeals={loggedMeals}
              onTriggerTestReminder={triggerSmartMealReminder}
              onOpenSettings={() => setActiveTab('settings')}
            />
            <div 
              onClick={() => setActiveTab('settings')}
              className="w-10 h-10 bg-primary/10 rounded-full border-2 border-primary/20 shrink-0 flex items-center justify-center font-black text-primary text-sm cursor-pointer hover:bg-primary/20 transition-colors"
              title={userProfile.name}
            >
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto pb-32 lg:pb-6">
           {renderTabContent()}
        </div>

        {/* AI FAB */}
        <button 
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-accent text-white rounded-2xl shadow-xl shadow-accent/30 flex items-center justify-center group hover:scale-110 transition-all z-[60]"
        >
          <Sparkles className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-12 right-0 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            اسأل خبير نوتريفا
          </span>
        </button>

        <AIAssistant 
          userProfile={userProfile}
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
        />

        <NotificationToast 
          message={notification.message}
          isOpen={notification.show}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />

        <SmartMealReminderModal 
          reminder={activeSmartReminder}
          onClose={() => setActiveSmartReminder(null)}
          onQuickLogMeal={handleQuickLogSmartMeal}
          onOpenCamera={() => setIsCameraOpen(true)}
          onOpenSearch={() => setIsLoggingOpen(true)}
          onSnooze={() => {
            setActiveSmartReminder(null);
            setNotification({
              message: i18n.language === 'ar' 
                ? 'تم تأجيل التذكير لمدة 15 دقيقة ⏰' 
                : 'Reminder snoozed for 15 minutes ⏰',
              show: true
            });
          }}
        />
      </main>

      <AnimatePresence>
        {alternativeSuggestion && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlternativeSuggestion(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 bg-primary text-white text-right relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-10 -translate-y-10" />
                <h3 className="text-2xl font-black relative z-10">اقتراح بديل ذكي 💡</h3>
                <p className="text-white/80 font-bold text-sm mt-1">وجبة مماثلة في القيمة الغذائية</p>
              </div>
              
              <div className="p-8 flex flex-col gap-6 text-right">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">الوجبة البديلة</span>
                  <h4 className="text-2xl font-black text-black">{alternativeSuggestion.name}</h4>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-primary/5 p-4 rounded-2xl">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-text-muted">سعرات</span>
                    <span className="font-black text-primary">{alternativeSuggestion.calories}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-text-muted">بروتين</span>
                    <span className="font-black text-primary">{alternativeSuggestion.protein}ج</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-text-muted">كارب</span>
                    <span className="font-black text-primary">{alternativeSuggestion.carbs}ج</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4 border-r-4 border-accent bg-accent/5">
                  <span className="text-xs font-black text-accent">لماذا هذا البديل؟</span>
                  <p className="text-sm font-medium leading-relaxed text-text-muted">{alternativeSuggestion.reason}</p>
                </div>

                <div className="flex gap-4 mt-2">
                  <Button 
                    onClick={() => setAlternativeSuggestion(null)}
                    variant="ghost" 
                    className="flex-1 h-12 font-black text-text-muted"
                  >
                    إلغاء
                  </Button>
                  <Button 
                    onClick={() => applyAlternative(alternativeSuggestion)}
                    className="flex-1 h-12 font-black shadow-lg shadow-primary/20"
                  >
                    اعتماد البديل
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Food Logging Modal */}
      <AnimatePresence>
        {isLoggingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoggingOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center flex-row-reverse">
                <h3 className="text-xl font-black text-primary">تسجيل طعام</h3>
                <button onClick={() => setIsLoggingOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <Input 
                    placeholder="ابحث عن طعام (مثلاً: فول، دجاج...)" 
                    className="pr-12 text-right"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                   <h4 className="text-sm font-bold text-text-muted text-right mb-2">النتائج</h4>
                   <div className="flex flex-col gap-2">
                     {filteredFoods.length > 0 ? filteredFoods.map(food => (
                       <div
                         key={food.id}
                         className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:bg-primary/5 hover:border-primary/20 transition-all text-right group"
                       >
                         <div className="flex items-center gap-3">
                           <div className="flex items-center gap-2">
                             <button
                               onClick={() => toggleSavedMeal(food)}
                               className={`p-2 rounded-lg transition-colors ${userProfile.savedMeals?.some(m => m.id === food.id) ? 'bg-yellow-500/10 text-yellow-600' : 'hover:bg-black/5 text-text-muted'}`}
                               title={userProfile.savedMeals?.some(m => m.id === food.id) ? 'إزالة من الوجبات السريعة' : 'حفظ كوجبة سريعة'}
                             >
                               <Star size={16} fill={userProfile.savedMeals?.some(m => m.id === food.id) ? "currentColor" : "none"} />
                             </button>
                             <button 
                               onClick={() => addFoodToLog(food)}
                               className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <Plus className="text-primary" size={16} />
                             </button>
                           </div>
                           <div className="text-left cursor-pointer" onClick={() => addFoodToLog(food)}>
                             <span className="block text-xs font-black text-primary">{food.calories} سعرة</span>
                             <span className="text-[10px] text-text-muted font-bold tracking-tight">بروتين {food.protein}ج | كارب {food.carbs}ج</span>
                           </div>
                         </div>
                         <div className="text-right flex-1 cursor-pointer" onClick={() => addFoodToLog(food)}>
                           <span className="block font-bold">{food.nameAr}</span>
                           <span className="text-xs text-text-muted">{food.servingSize} {food.servingUnit}</span>
                         </div>
                       </div>
                     )) : (
                       <div className="text-center py-10 text-text-muted font-bold italic">لا توجد نتائج للبحث</div>
                     )}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      


      <AnimatePresence>
        {showWeeklyReport && (
          <WeeklyReportView 
            report={showWeeklyReport} 
            onClose={() => setShowWeeklyReport(null)} 
          />
        )}
      </AnimatePresence>

      {/* Camera Overlay */}
      {isCameraOpen && (
        <FoodCamera 
          onSave={saveDiaryEntry} 
          onClose={() => setIsCameraOpen(false)} 
        />
      )}

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-black/5 h-20 flex items-center justify-around px-2 z-50">
        {[
          { id: 'overview', label: 'الرئيسية', icon: <LayoutDashboard size={20} /> },
          { id: 'exercise', label: 'تمارين', icon: <Dumbbell size={20} /> },
          { id: 'orders', label: 'طلباتي', icon: <Package size={20} /> },
          { id: 'challenges', label: 'تحديات', icon: <Trophy size={20} /> },
          { id: 'log', label: 'تسجيل', icon: <Plus size={24} />, special: true },
          { id: 'recipes', label: 'وصفات', icon: <Search size={20} /> },
          { id: 'shopping', label: 'مشتريات', icon: <ShoppingCart size={20} /> },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => item.id === 'log' ? setIsLoggingOpen(true) : setActiveTab(item.id as DashboardTab)}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.special ? 'relative -top-6' : 
              activeTab === item.id ? 'text-primary' : 'text-text-muted'
            }`}
          >
            {item.special ? (
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-white">
                <Plus className="text-white" size={24} />
              </div>
            ) : item.icon}
            <span className={`text-[10px] font-bold ${item.special ? 'absolute -bottom-6 left-1/2 -translate-x-1/2' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
