/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, Input } from "./ui";
import { UserProfile } from "../types";
import { Save, RefreshCw, AlertCircle, Languages, LogOut, Smartphone, Bell, BellOff, Clock, Droplets, Heart, Sparkles, Volume2, Play } from "lucide-react";
import { useGoogleFit } from "../hooks/useGoogleFit";

interface SettingsProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
  onTriggerTestReminder?: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export const SettingsView = ({ userProfile, onProfileUpdate, onLogout, onTriggerTestReminder }: SettingsProps) => {
  const { t, i18n } = useTranslation();
  const { syncData, isSyncing, error: syncError } = useGoogleFit((steps, calories) => {
    onProfileUpdate({
      ...userProfile,
      healthSync: {
        googleFitEnabled: true,
        lastSync: new Date().toISOString(),
        todaySteps: steps,
        todayBurnedCalories: calories
      }
    });
  });

  const [targetCalories, setTargetCalories] = useState(userProfile.manualOverrides?.targetCalories?.toString() || "");
  const [protein, setProtein] = useState(userProfile.manualOverrides?.protein?.toString() || "");
  const [carbs, setCarbs] = useState(userProfile.manualOverrides?.carbs?.toString() || "");
  const [fat, setFat] = useState(userProfile.manualOverrides?.fat?.toString() || "");
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [notifsEnabled, setNotifsEnabled] = useState(userProfile.notifications?.enabled ?? true);
  const [breakfastTime, setBreakfastTime] = useState(userProfile.notifications?.breakfastTime || "08:00");
  const [lunchTime, setLunchTime] = useState(userProfile.notifications?.lunchTime || "14:00");
  const [dinnerTime, setDinnerTime] = useState(userProfile.notifications?.dinnerTime || "20:00");
  const [snackTime, setSnackTime] = useState(userProfile.notifications?.snackTime || "16:30");
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState(userProfile.notifications?.smartRemindersEnabled ?? true);
  const [soundEnabled, setSoundEnabled] = useState(userProfile.notifications?.soundEnabled ?? true);
  const [healthUpdateEnabled, setHealthUpdateEnabled] = useState(userProfile.notifications?.healthUpdateEnabled || false);
  const [healthUpdateTime, setHealthUpdateTime] = useState(userProfile.notifications?.healthUpdateTime || "21:00");

  const [waterNotifsEnabled, setWaterNotifsEnabled] = useState(userProfile.waterNotifications?.enabled || false);
  const [waterFrequency, setWaterFrequency] = useState(userProfile.waterNotifications?.frequencyHours?.toString() || "2");
  const [waterStartTime, setWaterStartTime] = useState(userProfile.waterNotifications?.startTime || "08:00");
  const [waterEndTime, setWaterEndTime] = useState(userProfile.waterNotifications?.endTime || "22:00");

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onLogout();
    }, 1000);
  };

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      manualOverrides: {
        targetCalories: targetCalories ? parseInt(targetCalories) : undefined,
        protein: protein ? parseInt(protein) : undefined,
        carbs: carbs ? parseInt(carbs) : undefined,
        fat: fat ? parseInt(fat) : undefined,
      },
      notifications: {
        enabled: notifsEnabled,
        breakfastTime,
        lunchTime,
        dinnerTime,
        snackTime,
        smartRemindersEnabled,
        soundEnabled,
        healthUpdateEnabled,
        healthUpdateTime
      },
      waterNotifications: {
        enabled: waterNotifsEnabled,
        frequencyHours: parseInt(waterFrequency),
        startTime: waterStartTime,
        endTime: waterEndTime
      }
    };
    onProfileUpdate(updatedProfile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const resetToAuto = () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      manualOverrides: undefined
    };
    onProfileUpdate(updatedProfile);
    setTargetCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className={`flex flex-col ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
        <h2 className="text-2xl font-black text-primary">{t('settings.title')}</h2>
        <p className="text-sm font-bold text-text-muted mt-1 italic">{t('settings.subtitle')}</p>
      </div>

      <Card className={`p-8 border-none shadow-xl flex flex-col gap-6 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
        {/* Language Selection */}
        <div className="flex flex-col gap-4 border-b border-black/5 pb-6">
          <label className="font-black text-sm flex items-center gap-2">
            <Languages size={18} className="text-primary" />
            {t('settings.language')}
          </label>
          <div className="flex gap-2">
            {[
              { id: 'ar', label: 'العربية' },
              { id: 'en', label: 'English' }
            ].map(lang => (
              <Button
                key={lang.id}
                variant={i18n.language === lang.id ? 'primary' : 'outline'}
                onClick={() => i18n.changeLanguage(lang.id)}
                className="flex-1 font-bold h-12"
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Health Sync Section */}
        <div className="flex flex-col gap-4 border-b border-black/5 pb-6">
          <label className="font-black text-sm flex items-center gap-2">
            <Smartphone size={18} className="text-primary" />
            {i18n.language === 'ar' ? 'الأجهزة المتصلة' : 'Connected Devices'}
          </label>
          <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 ${userProfile.healthSync?.googleFitEnabled ? 'bg-primary/5 border-primary/20' : 'bg-white border-black/5'}`}>
            <div className={`flex items-center gap-4 ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <img src="https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png" alt="Google Fit" className="w-6 h-6" />
              </div>
              <div className={i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}>
                <span className="block font-black text-sm">Google Fit</span>
                <span className="text-[10px] font-bold text-text-muted opacity-60">
                  {userProfile.healthSync?.googleFitEnabled 
                    ? (i18n.language === 'ar' ? `آخر مزامنة: ${new Date(userProfile.healthSync.lastSync!).toLocaleTimeString('ar-SA')}` : `Last sync: ${new Date(userProfile.healthSync.lastSync!).toLocaleTimeString()}`)
                    : (i18n.language === 'ar' ? 'غير متصل' : 'Not Connected')}
                </span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant={userProfile.healthSync?.googleFitEnabled ? 'outline' : 'primary'}
              onClick={syncData}
              disabled={isSyncing}
              className="font-bold h-10 px-4"
            >
              {isSyncing ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                userProfile.healthSync?.googleFitEnabled ? (i18n.language === 'ar' ? 'تحديث' : 'Sync Now') : (i18n.language === 'ar' ? 'ربط' : 'Connect')
              )}
            </Button>
          </div>
          {syncError && <p className="text-[10px] text-red-500 font-bold">{syncError}</p>}
        </div>

        {/* Notifications Section */}
        <div className="flex flex-col gap-6 border-b border-black/5 pb-6">
          <div className={`flex items-center justify-between ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
            <label className="font-black text-sm flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              {i18n.language === 'ar' ? 'تذكيرات الوجبات الذكية' : 'Smart Meal Reminders'}
            </label>
            <button 
              onClick={() => setNotifsEnabled(!notifsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifsEnabled ? 'bg-primary' : 'bg-black/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifsEnabled ? (i18n.dir() === 'rtl' ? 'left-1' : 'right-1') : (i18n.dir() === 'rtl' ? 'right-1' : 'left-1')}`} />
            </button>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${notifsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {[
              { id: 'breakfast', label: i18n.language === 'ar' ? 'الإفطار' : 'Breakfast', val: breakfastTime, setter: setBreakfastTime },
              { id: 'lunch', label: i18n.language === 'ar' ? 'الغداء' : 'Lunch', val: lunchTime, setter: setLunchTime },
              { id: 'snack', label: i18n.language === 'ar' ? 'السناك' : 'Snack', val: snackTime, setter: setSnackTime },
              { id: 'dinner', label: i18n.language === 'ar' ? 'العشاء' : 'Dinner', val: dinnerTime, setter: setDinnerTime },
            ].map(meal => (
              <div key={meal.id} className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{meal.label}</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={meal.val}
                    onChange={(e) => meal.setter(e.target.value)}
                    className="w-full h-10 pl-4 pr-4 rounded-xl bg-black/5 border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none text-center"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Smart Suggestion & Motivation Toggle */}
          <div className={`p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between ${notifsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'} ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex items-center gap-3 ${i18n.dir() === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <h5 className="text-xs font-black text-black">
                  {i18n.language === 'ar' ? 'تخصيص التنبيه الذكي بالوجبة والنصائح' : 'Smart Plan & Nutrition Tips in Reminder'}
                </h5>
                <p className="text-[10px] text-text-muted font-bold mt-0.5">
                  {i18n.language === 'ar' 
                    ? 'اقتراح وجبتك المجدولة، وحساب السعرات المتبقية لليوم، ونصيحة تحفيزية' 
                    : 'Suggests planned meal, remaining calories, and tailored health tip'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSmartRemindersEnabled(!smartRemindersEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${smartRemindersEnabled ? 'bg-primary' : 'bg-black/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${smartRemindersEnabled ? (i18n.dir() === 'rtl' ? 'left-1' : 'right-1') : (i18n.dir() === 'rtl' ? 'right-1' : 'left-1')}`} />
            </button>
          </div>

          {/* Sound Chime Toggle */}
          <div className={`flex items-center justify-between ${notifsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'} ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex items-center gap-2.5 ${i18n.dir() === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <Volume2 size={18} className="text-accent" />
              <div>
                <span className="text-xs font-black text-black block">
                  {i18n.language === 'ar' ? 'نغمة التنبيه الصوتية' : 'Notification Chime Sound'}
                </span>
                <span className="text-[10px] text-text-muted font-bold">
                  {i18n.language === 'ar' ? 'تشغيل نغمة هادئة ومريحة عند وصول موعد الوجبة' : 'Play subtle chime when reminder triggers'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${soundEnabled ? 'bg-accent' : 'bg-black/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${soundEnabled ? (i18n.dir() === 'rtl' ? 'left-1' : 'right-1') : (i18n.dir() === 'rtl' ? 'right-1' : 'left-1')}`} />
            </button>
          </div>

          {/* Instant Test Section */}
          {onTriggerTestReminder && (
            <div className={`p-4 rounded-2xl bg-gray-50 border border-black/5 flex flex-col gap-2.5 ${notifsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'} ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black flex items-center gap-1.5">
                  <Play size={14} className="text-primary" />
                  {i18n.language === 'ar' ? 'تجربة التنبيه الذكي فوراً' : 'Test Smart Reminder Now'}
                </span>
                <span className="text-[10px] font-bold text-text-muted">
                  {i18n.language === 'ar' ? 'معاينة تجريبية' : 'Live Preview'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'breakfast' as const, label: i18n.language === 'ar' ? 'الإفطار 🍳' : 'Breakfast 🍳' },
                  { id: 'lunch' as const, label: i18n.language === 'ar' ? 'الغداء 🍱' : 'Lunch 🍱' },
                  { id: 'snack' as const, label: i18n.language === 'ar' ? 'السناك 🍎' : 'Snack 🍎' },
                  { id: 'dinner' as const, label: i18n.language === 'ar' ? 'العشاء 🥗' : 'Dinner 🥗' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => onTriggerTestReminder(item.id)}
                    type="button"
                    className="h-9 px-3 rounded-xl bg-white hover:bg-primary/5 text-primary border border-primary/20 text-xs font-black transition-all hover:scale-[1.02] shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Health Update Reminder */}
          <div className={`pt-4 border-t border-black/5 flex flex-col gap-4 ${notifsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className={`flex items-center justify-between ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
              <label className="font-black text-sm flex items-center gap-2">
                <Heart size={18} className="text-red-500" />
                {i18n.language === 'ar' ? 'تذكير تحديث الوزن والبيانات' : 'Health Data Update Reminder'}
              </label>
              <button 
                onClick={() => setHealthUpdateEnabled(!healthUpdateEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${healthUpdateEnabled ? 'bg-red-500' : 'bg-black/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${healthUpdateEnabled ? (i18n.dir() === 'rtl' ? 'left-1' : 'right-1') : (i18n.dir() === 'rtl' ? 'right-1' : 'left-1')}`} />
              </button>
            </div>
            <div className={`flex flex-col gap-2 ${healthUpdateEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {i18n.language === 'ar' ? 'وقت التذكير اليومي' : 'Daily Reminder Time'}
              </label>
              <input 
                type="time" 
                value={healthUpdateTime}
                onChange={(e) => setHealthUpdateTime(e.target.value)}
                className="w-full md:w-1/3 h-10 pl-4 pr-4 rounded-xl bg-black/5 border-none text-sm font-bold focus:ring-2 focus:ring-red-500/20 outline-none"
              />
            </div>
          </div>

          {!notifsEnabled && (
            <p className="text-[10px] text-text-muted font-bold italic text-center">
              {i18n.language === 'ar' ? 'التنبيهات معطلة حالياً' : 'Notifications are currently disabled'}
            </p>
          )}
        </div>

        {/* Water Notifications Section */}
        <div className="flex flex-col gap-6 border-b border-black/5 pb-6">
          <div className={`flex items-center justify-between ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
            <label className="font-black text-sm flex items-center gap-2">
              <Droplets size={18} className="text-blue-500" />
              {i18n.language === 'ar' ? 'تذكيرات شرب الماء' : 'Water Reminders'}
            </label>
            <button 
              onClick={() => setWaterNotifsEnabled(!waterNotifsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${waterNotifsEnabled ? 'bg-blue-500' : 'bg-black/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${waterNotifsEnabled ? (i18n.dir() === 'rtl' ? 'left-1' : 'right-1') : (i18n.dir() === 'rtl' ? 'right-1' : 'left-1')}`} />
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${waterNotifsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {i18n.language === 'ar' ? 'التكرار (ساعات)' : 'Frequency (Hours)'}
              </label>
              <Input 
                type="number"
                min="1"
                max="6"
                value={waterFrequency}
                onChange={(e) => setWaterFrequency(e.target.value)}
                className="h-10 text-sm font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {i18n.language === 'ar' ? 'من' : 'From'}
              </label>
              <input 
                type="time" 
                value={waterStartTime}
                onChange={(e) => setWaterStartTime(e.target.value)}
                className="w-full h-10 pl-4 pr-4 rounded-xl bg-black/5 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {i18n.language === 'ar' ? 'إلى' : 'To'}
              </label>
              <input 
                type="time" 
                value={waterEndTime}
                onChange={(e) => setWaterEndTime(e.target.value)}
                className="w-full h-10 pl-4 pr-4 rounded-xl bg-black/5 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 text-accent ${i18n.dir() === 'rtl' ? 'justify-end' : 'justify-start'}`}>
          <AlertCircle size={18} />
          <span className="text-xs font-bold">تنبيه: التعديل اليدوي سيتجاوز الحسابات التلقائية للنظام.</span>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">{t('settings.manualTarget')}</label>
            <Input 
              type="number"
              placeholder="مثال: 2000"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              className={i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">{t('settings.protein')}</label>
              <Input 
                type="number"
                placeholder="150"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className={i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">{t('settings.carbs')}</label>
              <Input 
                type="number"
                placeholder="200"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className={i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">{t('settings.fat')}</label>
              <Input 
                type="number"
                placeholder="60"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className={i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}
              />
            </div>
          </div>
        </div>

        <div className={`flex gap-4 mt-4 ${i18n.dir() === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          <Button 
            onClick={handleSave}
            className="flex-1 gap-2 font-black"
          >
            {isSaved ? t('common.saved') : t('common.save')}
            <Save size={18} />
          </Button>
          <Button 
            variant="outline"
            onClick={resetToAuto}
            className={`gap-2 font-black border-red-100 text-red-500 hover:bg-red-50 ${i18n.dir() === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}
          >
            {t('common.reset')}
            <RefreshCw size={18} />
          </Button>
        </div>
      </Card>
      
      <Card className="p-6 bg-primary/5 border-primary/10 shadow-none text-right">
        <h4 className="font-black text-primary mb-2 text-lg">لماذا قد تحتاج للتعديل اليدوي؟</h4>
        <p className="text-sm font-medium text-text-muted leading-relaxed">
          تعتمد Nutriva على معادلة Mifflin-St Jeor وهي الأكثر دقة حالياً. ومع ذلك، إذا كنت رياضي محترف أو لديك تعليمات خاصة من طبيب تغذية، يمكنك ضبط الأرقام هنا لتناسب حالتك الخاصة بدقة.
        </p>
      </Card>

      <div className="pt-4 border-t border-black/5">
        <Button 
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full gap-2 font-black border-red-200 text-red-500 hover:bg-red-50 h-14 ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {isLoggingOut ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <>
              {t('common.logout')}
              <LogOut size={20} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
