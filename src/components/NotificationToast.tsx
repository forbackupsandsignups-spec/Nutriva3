/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotificationToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationToast = ({ message, isOpen, onClose }: NotificationToastProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -100, x: "-50%" }}
          className="fixed top-0 left-1/2 z-[200] w-[90%] max-w-md bg-accent text-white p-4 rounded-2xl shadow-2xl shadow-accent/20 flex items-center gap-4 flex-row-reverse border border-white/20"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Bell size={20} className="animate-bounce" />
          </div>
          <div className="flex-1 text-right">
            <h4 className="font-black text-sm">تذكير نوتريفا الذكي</h4>
            <p className="text-xs font-bold opacity-90">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
