/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Crown, 
  ShieldCheck, 
  Zap,
  ExternalLink,
  ShieldCheck as VerifiedIcon,
  HelpCircle,
  ArrowUpRight
} from "lucide-react";
import { Card, Button } from "./ui";
import { UserProfile, Order } from "../types";
import { useTranslation } from "react-i18next";

interface OrdersPageProps {
  userProfile: UserProfile;
  onUpgradeClick?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ userProfile, onUpgradeClick }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const currentTier = userProfile.subscription?.tier || 'free';
  const orders = userProfile.orders || [];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
      case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'failed': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className={`flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-black text-black tracking-tight">{isRTL ? 'إدارة الاشتراكات والطلبات' : 'Subscription & Orders'}</h2>
        <p className="text-text-muted font-bold text-sm">
          {isRTL ? 'تابع حالة اشتراكك، تفاصيل الدفع، وتأكيد تفعيل باقة Pro الخاصة بك.' : 'Track your subscription status, payment details, and Pro activation.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Current Status & Payment Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Status Card */}
          <Card className="p-8 border-none shadow-2xl bg-white relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-2 h-full ${currentTier === 'pro' ? 'bg-accent' : currentTier === 'plus' ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex flex-col gap-8`}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${currentTier === 'pro' ? 'bg-black text-accent' : currentTier === 'plus' ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>
                    {currentTier === 'pro' ? <Crown size={28} /> : currentTier === 'plus' ? <ShieldCheck size={28} /> : <Zap size={28} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-black leading-none mb-2">
                      Nutriva {currentTier.toUpperCase()}
                    </h3>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${userProfile.subscription?.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                        {userProfile.subscription?.status === 'active' ? (isRTL ? 'نشط الآن' : 'Active Now') : (isRTL ? 'غير مفعل' : 'Inactive')}
                      </span>
                    </div>
                  </div>
                </div>
                {currentTier === 'free' && (
                  <Button onClick={onUpgradeClick} className="bg-primary text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-xs">
                    {isRTL ? 'ترقية لباقة Pro' : 'Upgrade to Pro'}
                  </Button>
                )}
              </div>

              {/* Details Grid */}
              <div className={`grid grid-cols-2 gap-4 border-t border-black/5 pt-6 ${isRTL ? 'text-right' : ''}`}>
                <div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">{isRTL ? 'تاريخ التجديد' : 'Renewal Date'}</span>
                  <p className="font-bold text-black flex items-center gap-2 justify-start flex-row">
                    <Calendar size={14} className="text-primary" />
                    {userProfile.subscription?.expiryDate 
                      ? new Date(userProfile.subscription.expiryDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US') 
                      : (isRTL ? 'لا يوجد' : 'None')}
                  </p>
                </div>
                <div>
                   <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">{isRTL ? 'طريقة الدفع' : 'Payment Method'}</span>
                   <p className="font-bold text-black flex items-center gap-2 justify-start flex-row">
                    <CreditCard size={14} className="text-primary" />
                    {currentTier === 'free' ? (isRTL ? 'مجاني' : 'Free') : 'InstaPay'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Orders History */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className="font-black text-xl flex items-center gap-2">
                <Package size={22} className="text-primary" />
                {isRTL ? 'تاريخ المعاملات' : 'Order History'}
              </h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order.id} className="p-5 border-none shadow-sm bg-white hover:shadow-md transition-all">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.tier === 'pro' ? 'bg-black text-accent' : 'bg-primary/10 text-primary'}`}>
                          {order.tier === 'pro' ? <Crown size={18} /> : <ShieldCheck size={18} />}
                        </div>
                        <div>
                          <h4 className="font-black text-sm">{isRTL ? `باقة ${order.tier.toUpperCase()}` : `${order.tier.toUpperCase()} Plan`}</h4>
                          <span className="text-[10px] text-text-muted font-bold block">{new Date(order.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      </div>
                      <div className={`flex flex-col items-end gap-1 ${isRTL ? 'items-start' : 'items-end'}`}>
                        <span className="font-black text-black">{order.amount} {order.currency}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="p-10 border-2 border-dashed border-black/5 rounded-3xl flex flex-col items-center justify-center text-center">
                  <Package size={32} className="text-black/10 mb-2" />
                  <p className="text-xs font-bold text-text-muted">{isRTL ? 'لا توجد معاملات بعد' : 'No transactions yet'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activation & Help */}
        <div className="flex flex-col gap-6">
          {/* Activation Step */}
          <Card className="p-6 border-none shadow-xl bg-black text-white flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-black">
                <VerifiedIcon size={20} />
              </div>
              <h4 className="font-black text-lg">{isRTL ? 'تأكيد التفعيل' : 'Confirm Activation'}</h4>
            </div>
            
            <div className={`flex flex-col gap-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs font-bold text-white/70 leading-relaxed">
                {isRTL 
                  ? 'بعد الدفع عبر إنستا باي، يرجى إرسال لقطة شاشة (Screenshot) للعملية لتأكيد تفعيل باقة Pro فوراً.' 
                  : 'After paying via InstaPay, please send a screenshot of the transaction to activate your Pro plan instantly.'}
              </p>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => window.open('https://ipn.eg/S/fatmamohamed3531/instapay/0DBuBm', '_blank')}
                  className="w-full bg-accent text-black font-black h-12 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <ExternalLink size={16} />
                  {isRTL ? 'رابط الدفع المباشر' : 'Direct Payment Link'}
                </Button>
                
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-12 rounded-xl font-black text-xs">
                  {isRTL ? 'تواصل مع الدعم للتفعيل' : 'Contact Support for Activation'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick FAQ */}
          <Card className="p-6 border-none shadow-lg bg-white flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-primary" />
              <h5 className="font-black text-sm">{isRTL ? 'أسئلة شائعة' : 'Common Questions'}</h5>
            </div>
            <div className={`flex flex-col gap-3 ${isRTL ? 'text-right' : ''}`}>
              {[
                { qAr: 'متى يتم تفعيل الحساب؟', qEn: 'When is it activated?', aAr: 'عادة خلال أقل من ساعة من تأكيد الدفع.', aEn: 'Usually within 1 hour after confirmation.' },
                { qAr: 'هل الدفع آمن؟', qEn: 'Is payment secure?', aAr: 'نعم، يتم الدفع عبر منصة إنستا باي الرسمية.', aEn: 'Yes, via the official InstaPay platform.' }
              ].map((faq, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-black">{isRTL ? faq.qAr : faq.qEn}</p>
                  <p className="text-[10px] font-bold text-text-muted">{isRTL ? faq.aAr : faq.aEn}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
