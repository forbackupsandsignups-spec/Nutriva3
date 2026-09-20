/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button } from "./ui";
import { UserProfile, Order } from "../types";
import { Check, Crown, ShieldCheck, Zap, AlertCircle, Calendar, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface SubscriptionsProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export const Subscriptions = ({ userProfile, onProfileUpdate }: SubscriptionsProps) => {
  const { t, i18n } = useTranslation();
  const currentTier = userProfile.subscription?.tier || 'free';
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      nameAr: 'مجاني',
      nameEn: 'Free',
      price: '0',
      periodAr: 'للأبد',
      periodEn: 'Forever',
      featuresAr: ['حساب سعرات حرارية بسيط', 'قائمة أطعمة عربية محدودة', 'نصائح تغذية عامة'],
      featuresEn: ['Simple calorie tracking', 'Limited Arabic food database', 'General nutrition tips'],
      icon: <Zap size={24} className="text-text-muted" />,
      color: 'bg-text-muted/10'
    },
    {
      id: 'plus',
      nameAr: 'Plus',
      nameEn: 'Plus',
      price: '29',
      periodAr: 'ريال/شهر',
      periodEn: 'SAR/mo',
      featuresAr: ['تتبع دقيق للمغذيات الكبرى', 'قاعدة بيانات أطعمة غير محدودة', 'تذكيرات وجبات ذكية', 'تقييم ذكي للوجبات'],
      featuresEn: ['Detailed macro tracking', 'Unlimited food database', 'Smart meal reminders', 'Smart meal evaluation'],
      icon: <ShieldCheck size={24} className="text-primary" />,
      color: 'bg-primary/10',
      popular: true
    },
    {
      id: 'pro',
      nameAr: 'Pro',
      nameEn: 'Pro',
      price: '59',
      periodAr: 'ريال/شهر',
      periodEn: 'SAR/mo',
      featuresAr: ['كل ميزات Plus', 'خبير تغذية ذكي (AI) غير محدود', 'تصدير التقارير بصيغة PDF', 'خطط تمارين رياضية مخصصة'],
      featuresEn: ['All Plus features', 'Unlimited AI Nutritionist', 'Export PDF reports', 'Custom workout plans'],
      icon: <Crown size={24} className="text-accent" />,
      color: 'bg-accent/10'
    }
  ];

  const handleUpdatePlan = (tier: 'free' | 'plus' | 'pro') => {
    setLoadingPlan(tier);
    // Simulate API call to payment gateway
    setTimeout(() => {
      const plan = plans.find(p => p.id === tier);
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        tier: tier as 'plus' | 'pro',
        amount: parseInt(plan?.price || '0'),
        currency: i18n.language === 'ar' ? 'ريال' : 'SAR',
        paymentMethod: 'instapay',
        status: 'completed'
      };

      const updatedProfile: UserProfile = {
        ...userProfile,
        subscription: {
          tier,
          status: 'active',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        orders: [newOrder, ...(userProfile.orders || [])]
      };
      onProfileUpdate(updatedProfile);
      setLoadingPlan(null);
    }, 1500);
  };

  const handleCancel = () => {
    if (confirm(i18n.language === 'ar' ? 'هل أنت متأكد من إلغاء اشتراكك؟ ستبقى ميزاتك فعالة حتى نهاية الفترة.' : 'Are you sure you want to cancel? Your features will remain active until the end of the period.')) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        subscription: {
          ...userProfile.subscription!,
          status: 'cancelled'
        }
      };
      onProfileUpdate(updatedProfile);
    }
  };

  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-black text-primary">{isRTL ? 'خطط الاشتراك' : 'Subscription Plans'}</h2>
        <p className="text-sm font-bold text-text-muted mt-1 italic">
          {isRTL ? 'اختر الباقة التي تناسب أهدافك الصحية' : 'Choose the plan that best fits your health goals'}
        </p>
      </div>

      {/* Current Subscription Status */}
      <Card className="p-6 border-none shadow-xl bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20" />
        <div className={`relative z-10 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            {currentTier === 'pro' ? <Crown size={32} /> : currentTier === 'plus' ? <ShieldCheck size={32} /> : <Zap size={32} />}
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <span className="text-xs font-bold opacity-70 block uppercase tracking-widest">
              {isRTL ? 'اشتراكك الحالي' : 'Current Subscription'}
            </span>
            <h3 className="text-2xl font-black">
              Nutriva {currentTier.toUpperCase()} 
              {userProfile.subscription?.status === 'cancelled' && (
                <span className="text-xs bg-red-500/50 px-2 py-1 rounded-lg ml-2 align-middle">
                  {isRTL ? 'ملغي' : 'Cancelled'}
                </span>
              )}
            </h3>
          </div>
        </div>

        {currentTier !== 'free' && (
          <div className={`relative z-10 flex flex-col items-center md:items-end gap-3 ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-xl">
              <Calendar size={14} />
              <span>
                {isRTL ? 'ينتهي في: ' : 'Expires on: '}
                {new Date(userProfile.subscription?.expiryDate || '').toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
              </span>
            </div>
            {userProfile.subscription?.status === 'active' && (
              <Button 
                variant="ghost" 
                onClick={handleCancel}
                className="text-white/60 hover:text-white hover:bg-white/10 text-xs font-bold"
              >
                {isRTL ? 'إلغاء الاشتراك' : 'Cancel Subscription'}
              </Button>
            )}
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex"
          >
              <Card className={`p-8 border-none shadow-xl flex flex-col w-full relative overflow-hidden ${
                plan.id === 'pro' 
                  ? 'bg-black text-white shadow-2xl shadow-accent/40' 
                  : plan.popular 
                  ? 'border-2 border-primary shadow-primary/10' 
                  : ''
              }`}>
                {plan.popular && (
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {isRTL ? 'الأكثر طلباً' : 'Popular'}
                  </div>
                )}
                
                <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-12 h-12 ${plan.id === 'pro' ? 'bg-accent' : plan.color} rounded-xl flex items-center justify-center`}>
                    {plan.id === 'pro' ? <Crown size={24} className="text-black" /> : plan.icon}
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h4 className={`text-xl font-black ${plan.id === 'pro' ? 'text-accent' : 'text-primary'}`}>{isRTL ? plan.nameAr : plan.nameEn}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-black ${plan.id === 'pro' ? 'text-white' : ''}`}>{plan.price}</span>
                      <span className={`text-xs font-bold ${plan.id === 'pro' ? 'text-white' : 'text-text-muted'}`}>{isRTL ? plan.periodAr : plan.periodEn}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-8 flex-1">
                  {(isRTL ? plan.featuresAr : plan.featuresEn).map((feature, i) => (
                    <div key={i} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                      <div className={`w-5 h-5 ${plan.id === 'pro' ? 'bg-accent' : 'bg-primary/10'} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                        <Check size={12} className={plan.id === 'pro' ? 'text-black' : 'text-primary'} />
                      </div>
                      <span className={`text-sm font-black leading-tight ${plan.id === 'pro' ? 'text-white' : 'text-text-muted'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    disabled={currentTier === plan.id || loadingPlan !== null}
                    onClick={() => handleUpdatePlan(plan.id as any)}
                    className={`w-full h-14 rounded-2xl font-black text-sm shadow-lg transition-all ${
                      currentTier === plan.id 
                      ? 'bg-text-muted/10 text-text-muted cursor-default' 
                      : plan.id === 'pro'
                      ? 'bg-white text-black hover:bg-accent hover:scale-105'
                      : plan.popular 
                      ? 'bg-primary text-white shadow-primary/30 hover:scale-105' 
                      : 'bg-white border-2 border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Zap size={20} />
                      </motion.div>
                    ) : (
                      currentTier === plan.id 
                      ? (isRTL ? 'باقتك الحالية' : 'Current Plan') 
                      : (isRTL ? 'اختيار الباقة' : 'Choose Plan')
                    )}
                  </Button>

                  {plan.id !== 'free' && currentTier !== plan.id && (
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://ipn.eg/S/fatmamohamed3531/instapay/0DBuBm', '_blank')}
                      className={`w-full h-14 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                        plan.id === 'pro'
                        ? 'bg-accent text-black border-none hover:scale-105 shadow-lg shadow-accent/20'
                        : 'border-primary/20 text-primary hover:bg-primary/5'
                      }`}
                    >
                      <ExternalLink size={14} />
                      <span>{isRTL ? 'ادفع عبر إنستا باي' : 'Pay via InstaPay'}</span>
                    </Button>
                  )}
                </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className={`p-8 bg-background border-none shadow-none flex flex-col md:flex-row items-center gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
          <AlertCircle size={24} className="text-accent" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h5 className="font-black text-primary text-lg mb-1">{isRTL ? 'هل لديك أسئلة؟' : 'Have Questions?'}</h5>
          <p className="text-sm font-bold text-text-muted leading-relaxed opacity-80">
            {isRTL 
              ? 'نظام الاشتراكات لدينا آمن تماماً. يمكنك تغيير باقتك في أي وقت، وسيتم تعديل الرسوم تلقائياً بناءً على الفترة المتبقية.' 
              : 'Our subscription system is completely secure. You can change your plan at any time, and fees will be adjusted automatically based on the remaining period.'}
          </p>
        </div>
      </Card>
    </div>
  );
};
