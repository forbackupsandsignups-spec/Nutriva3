/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, ProgressBar } from "./components/ui";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import { 
  Menu, 
  X, 
  ChevronLeft, 
  Flame, 
  Dumbbell, 
  Beef, 
  UtensilsCrossed,
  ArrowRight,
  TrendingUp,
  Search,
  Plus,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, NutritionStats } from "./types";
import { calculateNutrition } from "./lib/nutrition-engine";
import { auth, db, googleProvider, signInWithPopup, signOut, handleFirestoreError, OperationType, testConnection } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

type AppView = 'landing' | 'onboarding' | 'dashboard';

export default function App() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Update document direction on language change
  useEffect(() => {
    const dir = i18n.dir();
    document.body.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<NutritionStats | null>(null);

  // Firebase Auth Listener
  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setUserProfile(null);
        setStats(null);
        setView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Profile Listener
  useEffect(() => {
    if (!user) return;

    const path = `users/${user.uid}`;
    const unsubscribe = onSnapshot(doc(db, path), (snapshot) => {
      if (snapshot.exists()) {
        const profile = snapshot.data() as UserProfile;
        setUserProfile(profile);
        setStats(calculateNutrition(profile));
        setView('dashboard');
      } else {
        // User is logged in but has no profile
        setView('onboarding');
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [user]);

  const handleOnboardingComplete = async (profile: UserProfile) => {
    if (!user) return;
    
    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, path), profile);
      // State will be updated by onSnapshot
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleProfileUpdate = async (profile: UserProfile) => {
    if (!user) return;

    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, path), profile);
      // State will be updated by onSnapshot
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="text-primary animate-spin" size={48} />
      </div>
    );
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (view === 'dashboard' && stats && userProfile) {
    return (
      <Dashboard 
        userProfile={userProfile} 
        stats={stats} 
        onLogout={handleSignOut} 
        onProfileUpdate={handleProfileUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-main overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <UtensilsCrossed className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-primary leading-none">Nutriva</span>
              <span className="text-xs font-bold text-text-muted mt-0.5">لقمة وميزان</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm">
            <a href="#" className="text-primary">الرئيسية</a>
            <a href="#how" className="hover:text-primary transition-colors">كيف تعمل؟</a>
            <a href="#" className="hover:text-primary transition-colors">الوصفات</a>
            <a href="#" className="hover:text-primary transition-colors">الأطعمة</a>
            <a href="#" className="hover:text-primary transition-colors">عن Nutriva</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleSignIn}>تسجيل الدخول</Button>
            <Button size="sm" onClick={handleSignIn}>ابدأ مجاناً</Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full bg-white border-b border-black/5 p-6 flex flex-col gap-6 md:hidden shadow-xl"
            >
              <a href="#" className="text-lg font-bold text-primary">الرئيسية</a>
              <a href="#how" className="text-lg font-bold">كيف تعمل؟</a>
              <a href="#" className="text-lg font-bold">الوصفات</a>
              <a href="#" className="text-lg font-bold">الأطعمة</a>
              <Button className="w-full" onClick={handleSignIn}>ابدأ مجاناً</Button>
              <Button variant="ghost" className="w-full" onClick={handleSignIn}>تسجيل الدخول</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full w-fit">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-extrabold tracking-wide uppercase">مرحباً بك في مستقبل التغذية</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-primary">
              لقمتك اليوم،<br />
              <span className="text-accent">ميزانك غداً.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-lg font-medium">
              خطة غذائية تناسب هدفك، ذوقك، ميزانيتك وحياتك اليومية — بدون تعقيد. Nutriva تفهمك وتنمو معك.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="lg" className="gap-2" onClick={handleSignIn}>
                أنشئ خطتي الغذائية
                <ChevronLeft size={20} />
              </Button>
              <Button size="lg" variant="outline">اكتشف Nutriva</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard UI Mockup */}
            <div className="relative bg-white/40 p-4 md:p-8 rounded-[2.5rem] border border-white/50 backdrop-blur-sm shadow-2xl">
              <Card className="p-8 border-none shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem]" />
                
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <h3 className="text-2xl font-black">هدفي اليومي</h3>
                      <p className="text-sm text-text-muted font-bold mt-1">أحمد، أنت تبلي بلاءً حسناً!</p>
                    </div>
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                      <Flame className="text-accent" size={32} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                      <ProgressBar 
                        label="السعرات" 
                        value={1420} 
                        max={2000} 
                        color="bg-primary" 
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-background p-3 rounded-xl text-center border border-black/5">
                          <span className="block text-[10px] font-bold text-text-muted mb-1">بروتين</span>
                          <span className="font-black text-sm text-primary">92ج</span>
                        </div>
                        <div className="bg-background p-3 rounded-xl text-center border border-black/5">
                          <span className="block text-[10px] font-bold text-text-muted mb-1">كارب</span>
                          <span className="font-black text-sm text-primary">126ج</span>
                        </div>
                        <div className="bg-background p-3 rounded-xl text-center border border-black/5">
                          <span className="block text-[10px] font-bold text-text-muted mb-1">دهون</span>
                          <span className="font-black text-sm text-primary">38ج</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 text-right">
                      <h4 className="font-bold text-sm flex items-center gap-2 justify-end">
                        <UtensilsCrossed size={16} className="text-primary" />
                        الوجبة القادمة
                      </h4>
                      <Card className="p-4 bg-primary/5 border-primary/10 shadow-none">
                        <div className="flex items-center gap-3 justify-end">
                          <div className="text-right">
                            <span className="block font-black text-sm">فراخ مشوية + أرز</span>
                            <span className="text-[10px] font-bold text-text-muted">610 سعرة حرارية</span>
                          </div>
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <Beef className="text-primary" size={24} />
                          </div>
                        </div>
                        <Button className="w-full mt-4 h-9 text-xs" variant="primary">سجل الوجبة</Button>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-text-muted">الوزن الحالي</span>
                  <span className="font-black text-sm text-primary">86.2 كجم</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Dumbbell className="text-accent" size={20} />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-text-muted">الإنجاز</span>
                  <span className="font-black text-sm text-primary">75%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-black text-primary">كيف تعمل Nutriva؟</h2>
            <p className="text-text-muted font-bold max-w-2xl mx-auto">أربعة خطوات بسيطة تفصلك عن نسختك الأفضل والأكثر صحة.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { id: '01', title: 'اعرف هدفك', desc: 'أدخل بياناتك وهدفك بوضوح.' },
              { id: '02', title: 'Nutriva تفهمك', desc: 'تتعرف على تفضيلاتك وحياتك اليومية.' },
              { id: '03', title: 'احصل على خطتك', desc: 'وجبات محسوبة تناسب احتياجاتك.' },
              { id: '04', title: 'تابع تقدمك', desc: 'راقب التغيرات وعدل خطتك.' }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col gap-6 group text-right">
                <div className="text-6xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">
                  {step.id}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-black text-primary">{step.title}</h3>
                  <p className="text-text-muted font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
