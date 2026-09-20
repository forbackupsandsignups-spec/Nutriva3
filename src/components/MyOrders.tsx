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
  ChevronLeft
} from "lucide-react";
import { Card, Button } from "./ui";
import { UserProfile, Order } from "../types";
import { useTranslation } from "react-i18next";

interface MyOrdersProps {
  userProfile: UserProfile;
}

export const MyOrders: React.FC<MyOrdersProps> = ({ userProfile }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const currentTier = userProfile.subscription?.tier || 'free';
  const orders = userProfile.orders || [];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'failed': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'failed': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return <Crown size={24} className="text-accent" />;
      case 'plus': return <ShieldCheck size={24} className="text-primary" />;
      default: return <Zap size={24} className="text-text-muted" />;
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className={`flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-3xl font-black text-black">{isRTL ? 'طلباتي واشتراكاتي' : 'My Orders & Subscriptions'}</h2>
        <p className="text-text-muted font-bold">
          {isRTL ? 'تتبع حالة اشتراكك وتفاصيل عمليات الدفع الخاصة بك.' : 'Track your subscription status and payment details.'}
        </p>
      </div>

      {/* Subscription Status Card */}
      <Card className="p-8 border-none shadow-xl bg-white relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-2 h-full ${currentTier === 'pro' ? 'bg-accent' : currentTier === 'plus' ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${currentTier === 'pro' ? 'bg-accent/10' : currentTier === 'plus' ? 'bg-primary/10' : 'bg-gray-100'}`}>
              {getTierIcon(currentTier)}
            </div>
            <div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">
                {isRTL ? 'باقة الاشتراك الحالية' : 'Current Subscription Plan'}
              </span>
              <h3 className="text-2xl font-black text-black">
                {currentTier === 'pro' ? 'Nutriva PRO' : currentTier === 'plus' ? 'Nutriva PLUS' : 'Nutriva FREE'}
              </h3>
              <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${userProfile.subscription?.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {userProfile.subscription?.status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                </span>
                {userProfile.subscription?.expiryDate && (
                  <span className="text-xs text-text-muted font-bold flex items-center gap-1">
                    <Calendar size={12} />
                    {isRTL ? 'ينتهي في: ' : 'Expires on: '}
                    {new Date(userProfile.subscription.expiryDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {currentTier === 'free' && (
            <Button className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              {isRTL ? 'ترقية الآن' : 'Upgrade Now'}
            </Button>
          )}
        </div>
      </Card>

      {/* Orders List */}
      <section className="flex flex-col gap-6">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-start' : 'justify-start'}`}>
          <Package className="text-primary" size={24} />
          <h3 className="font-black text-xl">{isRTL ? 'سجل العمليات' : 'Order History'}</h3>
        </div>

        {orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 border-none shadow-md bg-white hover:shadow-lg transition-all">
                  <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-text-muted">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className="font-black text-lg">باقة {order.tier.toUpperCase()}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {isRTL 
                              ? (order.status === 'completed' ? 'مكتمل' : order.status === 'pending' ? 'معلق' : 'فاشل')
                              : order.status.charAt(0).toUpperCase() + order.status.slice(1)
                            }
                          </span>
                        </div>
                        <div className={`flex items-center gap-3 text-xs text-text-muted font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(order.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                          </span>
                          <span>|</span>
                          <span className="flex items-center gap-1 uppercase">
                            ID: {order.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-col items-end gap-2 w-full md:w-auto ${isRTL ? 'items-start md:items-start' : 'items-end'}`}>
                      <div className="text-xl font-black text-black">
                        {order.amount} {order.currency}
                      </div>
                      <div className={`flex items-center gap-2 text-[10px] font-black px-2 py-1 bg-gray-100 rounded-lg text-text-muted ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span>{isRTL ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                        <span className="uppercase text-black">{order.paymentMethod}</span>
                      </div>
                      {order.paymentMethod === 'instapay' && (
                        <button 
                          onClick={() => window.open('https://ipn.eg/S/fatmamohamed3531/instapay/0DBuBm', '_blank')}
                          className="text-[10px] text-blue-500 font-bold flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink size={10} />
                          {isRTL ? 'عرض تفاصيل الدفع' : 'View payment details'}
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 border-none shadow-sm bg-gray-50/50 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Package size={24} className="text-gray-300" />
            </div>
            <h4 className="font-black text-lg text-black mb-1">{isRTL ? 'لا يوجد سجل معاملات' : 'No Order History'}</h4>
            <p className="text-text-muted text-sm font-medium max-w-xs">
              {isRTL 
                ? 'لم تقم بإجراء أي عمليات شراء بعد. اشترك في الباقات المميزة لترى معاملاتك هنا.' 
                : 'You haven\'t made any purchases yet. Subscribe to premium plans to see your transactions here.'}
            </p>
          </Card>
        )}
      </section>

      {/* Help Section */}
      <Card className={`p-6 border-none bg-blue-50 flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <h5 className="font-black text-blue-900 mb-1">{isRTL ? 'هل تواجه مشكلة في الدفع؟' : 'Problem with payment?'}</h5>
          <p className="text-xs text-blue-700 font-bold leading-relaxed opacity-80">
            {isRTL 
              ? 'إذا قمت بالدفع عبر إنستا باي ولم يتم تفعيل حسابك، يرجى التواصل مع الدعم الفني وإرسال صورة من إيصال الدفع.' 
              : 'If you paid via InstaPay and your account is not activated, please contact support and send a screenshot of the payment receipt.'}
          </p>
        </div>
      </Card>
    </div>
  );
};
