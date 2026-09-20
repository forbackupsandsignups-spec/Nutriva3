/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  IceCream, 
  Droplets, 
  Footprints, 
  Leaf,
  ChevronRight,
  Flame,
  Star
} from "lucide-react";
import { Card, Button } from "./ui";
import { UserProfile, Challenge, ActiveChallenge } from "../types";
import { SAMPLE_CHALLENGES } from "../data/challenges";

interface ChallengesProps {
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({ userProfile, onUpdateProfile }) => {
  const activeChallenges = userProfile.activeChallenges || [];

  const iconMap: Record<string, any> = {
    IceCream: <IceCream />,
    Droplets: <Droplets />,
    Footprints: <Footprints />,
    Leaf: <Leaf />
  };

  const handleJoinChallenge = (challenge: Challenge) => {
    const isAlreadyActive = activeChallenges.some(ac => ac.challengeId === challenge.id);
    if (isAlreadyActive) return;

    const newActiveChallenge: ActiveChallenge = {
      challengeId: challenge.id,
      startDate: new Date().toISOString(),
      completedDates: []
    };

    onUpdateProfile({
      ...userProfile,
      activeChallenges: [...activeChallenges, newActiveChallenge]
    });
  };

  const handleMarkComplete = (challengeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedActiveChallenges = activeChallenges.map(ac => {
      if (ac.challengeId === challengeId) {
        if (!ac.completedDates.includes(today)) {
          return {
            ...ac,
            completedDates: [...ac.completedDates, today]
          };
        }
      }
      return ac;
    });

    onUpdateProfile({
      ...userProfile,
      activeChallenges: updatedActiveChallenges
    });
  };

  const getChallengeProgress = (active: ActiveChallenge, totalDays: number) => {
    return (active.completedDates.length / totalDays) * 100;
  };

  const isTodayCompleted = (active: ActiveChallenge) => {
    const today = new Date().toISOString().split('T')[0];
    return active.completedDates.includes(today);
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col gap-2 text-right">
        <h2 className="text-3xl font-black text-black">التحديات الصحية</h2>
        <p className="text-text-muted font-bold">قرارات صغيرة، نتائج كبيرة. ابدأ تحديك اليوم!</p>
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2 justify-end">
            <h3 className="font-black text-xl">تحدياتك الحالية</h3>
            <Flame className="text-orange-500" size={24} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {activeChallenges.map((ac) => {
                const challenge = SAMPLE_CHALLENGES.find(c => c.id === ac.challengeId);
                if (!challenge) return null;
                const progress = getChallengeProgress(ac, challenge.durationDays);
                const completed = isTodayCompleted(ac);

                return (
                  <motion.div
                    key={ac.challengeId}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="p-6 border-none shadow-xl bg-white relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 w-2 h-full ${challenge.color}`} />
                      <div className="flex flex-col gap-4 text-right">
                        <div className="flex justify-between items-start flex-row-reverse">
                          <div className="flex gap-4 items-center flex-row-reverse">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${challenge.color} shadow-lg shadow-black/5`}>
                              {iconMap[challenge.icon]}
                            </div>
                            <div>
                              <h4 className="font-black text-lg">{challenge.titleAr}</h4>
                              <p className="text-[10px] font-bold text-text-muted">اليوم {ac.completedDates.length} من {challenge.durationDays}</p>
                            </div>
                          </div>
                          {progress === 100 && <Trophy className="text-yellow-500" size={24} />}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-2">
                          <motion.div 
                            className={`h-full ${challenge.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>

                        <div className="flex justify-between items-center mt-4 flex-row-reverse">
                          <Button
                            onClick={() => handleMarkComplete(ac.challengeId)}
                            disabled={completed || progress === 100}
                            className={`rounded-full h-10 px-6 font-bold flex items-center gap-2 ${
                              completed 
                                ? "bg-green-500 hover:bg-green-600" 
                                : progress === 100 
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-black hover:bg-gray-800"
                            }`}
                          >
                            {completed ? (
                              <>
                                <span>تم الإنجاز اليوم</span>
                                <CheckCircle2 size={18} />
                              </>
                            ) : progress === 100 ? (
                              <>
                                <span>اكتمل التحدي!</span>
                                <Star size={18} />
                              </>
                            ) : (
                              <>
                                <span>أنجزت اليوم</span>
                                <Plus size={18} />
                              </>
                            )}
                          </Button>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                            <Calendar size={14} />
                            <span>بدأ في {new Date(ac.startDate).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Available Challenges */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-end">
          <h3 className="font-black text-xl">استكشف تحديات جديدة</h3>
          <Trophy className="text-yellow-500" size={24} />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_CHALLENGES.map((challenge) => {
            const isActive = activeChallenges.some(ac => ac.challengeId === challenge.id);
            if (isActive) return null;

            return (
              <Card 
                key={challenge.id} 
                className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col gap-4 text-right"
              >
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white ${challenge.color} shadow-lg shadow-black/5 mb-2`}>
                  {iconMap[challenge.icon]}
                </div>
                <div>
                  <h4 className="font-black text-lg group-hover:text-primary transition-colors">{challenge.titleAr}</h4>
                  <div className="flex items-center gap-1 justify-end text-[10px] font-bold text-text-muted mt-1">
                    <Calendar size={12} />
                    <span>المدة: {challenge.durationDays} أيام</span>
                  </div>
                </div>
                <p className="text-sm text-text-muted font-medium leading-relaxed">{challenge.descriptionAr}</p>
                <Button
                  onClick={() => handleJoinChallenge(challenge)}
                  variant="outline"
                  className="mt-2 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 font-black flex items-center justify-center gap-2"
                >
                  <span>بدء التحدي</span>
                  <ChevronRight size={18} className="rotate-180" />
                </Button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
