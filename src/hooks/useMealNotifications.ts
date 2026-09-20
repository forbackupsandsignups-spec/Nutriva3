/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { UserProfile, NutritionStats, SmartReminderData } from '../types';
import { useTranslation } from 'react-i18next';
import { playNotificationChime } from '../utils/sound';
import { generateSmartMealReminder } from '../utils/smartReminders';

export const useMealNotifications = (
  userProfile: UserProfile,
  stats: NutritionStats,
  currentCalories: number,
  onTriggerSmartReminder: (data: SmartReminderData) => void,
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void
) => {
  const { i18n } = useTranslation();
  const lastNotifiedRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (userProfile.notifications && userProfile.notifications.enabled === false) return;

    // Request browser notification permission if not yet decided
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }

    const checkNotifications = () => {
      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, '0');
      const currentM = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentH}:${currentM}`;
      const today = now.toDateString();

      const notifs = userProfile.notifications;
      const mealTimes: Array<{
        type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
        time: string;
      }> = [
        { type: 'breakfast', time: notifs?.breakfastTime || '08:00' },
        { type: 'lunch', time: notifs?.lunchTime || '14:00' },
        { type: 'snack', time: notifs?.snackTime || '16:30' },
        { type: 'dinner', time: notifs?.dinnerTime || '20:00' },
      ];

      mealTimes.forEach(meal => {
        if (meal.time === currentTime && lastNotifiedRef.current[meal.type] !== today) {
          lastNotifiedRef.current[meal.type] = today;

          // Generate smart contextual reminder
          const reminderData = generateSmartMealReminder({
            mealType: meal.type,
            userProfile,
            stats,
            currentCalories,
            isAlreadyLogged: false,
            language: i18n.language
          });

          // Play subtle chime sound if sound enabled
          if (notifs?.soundEnabled !== false) {
            playNotificationChime();
          }

          // Trigger in-app smart reminder modal
          onTriggerSmartReminder(reminderData);

          // Browser native notification with rich text
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              const notif = new Notification(reminderData.title, {
                body: `${reminderData.message}\n${reminderData.plannedMeal ? `الوجبة المقترحة: ${reminderData.plannedMeal.name} (${reminderData.plannedMeal.calories} سعرة)` : ''}`,
                icon: '/logo192.png'
              });
              notif.onclick = () => {
                window.focus();
                onTriggerSmartReminder(reminderData);
              };
            } catch {
              // Ignore native notification errors
            }
          }
        }
      });

      // Health update reminder check
      if (userProfile.notifications?.healthUpdateEnabled && userProfile.notifications.healthUpdateTime) {
        if (userProfile.notifications.healthUpdateTime === currentTime && lastNotifiedRef.current['health_update'] !== today) {
          lastNotifiedRef.current['health_update'] = today;
          const title = i18n.language === 'ar' ? 'تحديث البيانات الصحية ⚖️' : 'Update Health Data ⚖️';
          const body = i18n.language === 'ar'
            ? 'حان وقت تسجيل وزنك اليومي وبياناتك الصحية لمتابعة تقدم خطتك!'
            : 'Time to record your daily weight and health stats to track your plan progress!';

          if (userProfile.notifications?.soundEnabled !== false) {
            playNotificationChime();
          }

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(title, { body, icon: '/logo192.png' });
            } catch {}
          }
          showToast(title, 'info');
        }
      }

      // Water intake notifications check
      if (userProfile.waterNotifications?.enabled) {
        const waterConfig = userProfile.waterNotifications;
        const [startH, startM] = (waterConfig.startTime || '08:00').split(':').map(Number);
        const [endH, endM] = (waterConfig.endTime || '22:00').split(':').map(Number);
        const nowH = now.getHours();
        const nowM = now.getMinutes();

        const currentTimeInMins = nowH * 60 + nowM;
        const startTimeInMins = startH * 60 + startM;
        const endTimeInMins = endH * 60 + endM;

        if (currentTimeInMins >= startTimeInMins && currentTimeInMins <= endTimeInMins) {
          const minsSinceStart = currentTimeInMins - startTimeInMins;
          const frequencyMins = (waterConfig.frequencyHours || 2) * 60;

          if (minsSinceStart > 0 && minsSinceStart % frequencyMins === 0 && lastNotifiedRef.current['water'] !== `${today}-${currentTime}`) {
            lastNotifiedRef.current['water'] = `${today}-${currentTime}`;
            const title = i18n.language === 'ar' ? 'حان وقت شرب الماء 💧' : 'Hydration Time 💧';
            const body = i18n.language === 'ar'
              ? 'كوب ماء طازج الآن يحافظ على نشاطك ومعدل الأيض!'
              : 'A fresh glass of water now maintains your energy and metabolic rate!';

            if (userProfile.notifications?.soundEnabled !== false) {
              playNotificationChime();
            }

            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(title, { body, icon: '/logo192.png' });
              } catch {}
            }
            showToast(title, 'info');
          }
        }
      }
    };

    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds
    checkNotifications();

    return () => clearInterval(interval);
  }, [userProfile.notifications, userProfile.waterNotifications, stats, currentCalories, i18n.language, onTriggerSmartReminder, showToast]);
};
