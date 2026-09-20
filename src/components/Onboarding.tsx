/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Button, Card, Input } from "./ui";
import { 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  User, 
  Zap, 
  Salad, 
  Heart, 
  Wallet, 
  Coffee,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    allergies: [],
    mealsPerDay: 3,
    budget: 'medium'
  });

  const totalSteps = 8;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleAllergy = (allergy: string) => {
    const current = profile.allergies || [];
    if (current.includes(allergy)) {
      updateProfile({ allergies: current.filter(a => a !== allergy) });
    } else {
      updateProfile({ allergies: [...current, allergy] });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-primary">ما هو هدفك الأساسي؟</h2>
              <p className="text-text-muted font-bold mt-2">سنقوم بتخصيص خطتك بناءً على هذا الاختيار.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'lose', label: 'خسارة الوزن', icon: <TrendingUp className="rotate-180" /> },
                { id: 'gain', label: 'زيادة الوزن', icon: <TrendingUp /> },
                { id: 'muscle', label: 'بناء العضلات', icon: <Dumbbell /> },
                { id: 'maintain', label: 'المحافظة على الوزن', icon: <Target /> },
                { id: 'health', label: 'تحسين جودة الأكل', icon: <Heart /> },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { updateProfile({ goal: item.id as any }); nextStep(); }}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-right ${
                    profile.goal === item.id ? 'border-primary bg-primary/5' : 'border-black/5 hover:border-primary/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    profile.goal === item.id ? 'bg-primary text-white' : 'bg-black/5 text-text-muted'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-black text-lg">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-primary">أخبرنا عنك قليلاً</h2>
              <p className="text-text-muted font-bold mt-2">نحتاج لهذه البيانات لحساب احتياجك الدقيق.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="الاسم" placeholder="أحمد..." onChange={e => updateProfile({ name: e.target.value })} />
              <Input label="العمر" type="number" placeholder="25" onChange={e => updateProfile({ age: parseInt(e.target.value) })} />
              <Input label="الطول (سم)" type="number" placeholder="175" onChange={e => updateProfile({ height: parseInt(e.target.value) })} />
              <Input label="الوزن (كجم)" type="number" placeholder="80" onChange={e => updateProfile({ weight: parseInt(e.target.value) })} />
            </div>
            <div className="flex gap-4">
              {['male', 'female'].map(g => (
                <button
                  key={g}
                  onClick={() => updateProfile({ gender: g as any })}
                  className={`flex-1 p-4 rounded-xl border-2 font-bold ${
                    profile.gender === g ? 'border-primary bg-primary/5 text-primary' : 'border-black/5'
                  }`}
                >
                  {g === 'male' ? 'ذكر' : 'أنثى'}
                </button>
              ))}
            </div>
            <Button onClick={nextStep} disabled={!profile.name || !profile.age || !profile.gender}>متابعة</Button>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-primary">ما هو مستوى نشاطك؟</h2>
              <p className="text-text-muted font-bold mt-2">هل تتحرك كثيراً خلال اليوم؟</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { id: 'sedentary', label: 'قليل', desc: 'جلوس دائم، لا تمارين' },
                { id: 'light', label: 'خفيف', desc: 'تمارين خفيفة 1-3 أيام' },
                { id: 'moderate', label: 'متوسط', desc: 'تمارين 3-5 أيام' },
                { id: 'high', label: 'مرتفع', desc: 'تمارين شاقة 6-7 أيام' },
                { id: 'extreme', label: 'مرتفع جداً', desc: 'تمارين شاقة جداً أو وظيفة بدنية' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { updateProfile({ activityLevel: item.id as any }); nextStep(); }}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    profile.activityLevel === item.id ? 'border-primary bg-primary/5' : 'border-black/5'
                  }`}
                >
                  <div className="text-right">
                    <span className="block font-black text-lg">{item.label}</span>
                    <span className="text-xs text-text-muted font-bold">{item.desc}</span>
                  </div>
                  {profile.activityLevel === item.id && <CheckCircle2 className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-primary">ما هو نظامك الغذائي المفضل؟</h2>
              <p className="text-text-muted font-bold mt-2">يمكنك تغييره لاحقاً.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'standard', label: 'عادي' },
                { id: 'high_protein', label: 'عالي البروتين' },
                { id: 'vegetarian', label: 'نباتي' },
                { id: 'vegan', label: 'نباتي صارم' },
                { id: 'low_carb', label: 'منخفض الكربوهيدرات' },
                { id: 'flexible', label: 'مرن' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { updateProfile({ dietType: item.id as any }); nextStep(); }}
                  className={`p-4 rounded-2xl border-2 font-black transition-all ${
                    profile.dietType === item.id ? 'border-primary bg-primary/5 text-primary' : 'border-black/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 6: // Allergies
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-primary">هل تعاني من أي حساسيات؟</h2>
              <p className="text-text-muted font-bold mt-2">سنستبعد هذه الأطعمة من خطتك.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['الحليب', 'المكسرات', 'البيض', 'القمح', 'السمك', 'المأكولات البحرية', 'فول الصويا'].map(a => (
                <button
                  key={a}
                  onClick={() => toggleAllergy(a)}
                  className={`p-4 rounded-xl border-2 font-bold transition-all ${
                    profile.allergies?.includes(a) ? 'border-primary bg-primary/5 text-primary' : 'border-black/5'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <Button onClick={nextStep}>متابعة</Button>
          </div>
        );
      case 8: // Final
        return (
          <div className="flex flex-col gap-8 items-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} className="text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-primary">اكتملت البيانات!</h2>
              <p className="text-text-muted font-bold mt-2 leading-relaxed">
                نقوم الآن بتحليل بياناتك وتجهيز أفضل خطة غذائية تناسب نمط حياتك.
              </p>
            </div>
            <div className="w-full bg-primary/5 p-6 rounded-2xl border border-primary/10 text-right">
              <h4 className="font-black text-primary mb-2">ملخص سريع:</h4>
              <ul className="space-y-2 text-sm font-bold">
                <li className="flex justify-between"><span>الهدف:</span> <span className="text-primary">{profile.goal === 'lose' ? 'خسارة الوزن' : 'بناء العضلات'}</span></li>
                <li className="flex justify-between"><span>السعرات المتوقعة:</span> <span className="text-primary">~1850 سعرة</span></li>
              </ul>
            </div>
            <Button className="w-full" size="lg" onClick={() => onComplete(profile as UserProfile)}>
              ابدأ رحلتي مع Nutriva
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-6 text-center py-10">
            <h2 className="text-2xl font-black">الخطوة القادمة...</h2>
            <Button onClick={nextStep}>متابعة</Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center p-6 md:p-12 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Progress bar */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-bold text-text-muted">
             <span>الخطوة {step} من {totalSteps}</span>
             <button onClick={() => setStep(1)} className="text-primary/50 hover:text-primary transition-colors">إلغاء</button>
          </div>
          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>

        {/* Back button */}
        {step > 1 && step < totalSteps && (
          <button 
            onClick={prevStep}
            className="flex items-center gap-2 text-text-muted font-bold hover:text-primary transition-colors w-fit"
          >
            <ChevronRight size={20} />
            رجوع
          </button>
        )}

        {/* Step Content */}
        <div className="flex-1">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

// Internal icons helper
function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function Dumbbell(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 6.5h11" />
      <path d="M6.5 17.5h11" />
      <path d="m3 21 18-18" />
      <path d="m3 3 18 18" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="6.5" r="2.5" />
    </svg>
  );
}
