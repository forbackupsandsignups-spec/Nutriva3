/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Card, Button, Input } from "./ui";
import { 
  Send, 
  Bot, 
  User, 
  X, 
  Loader2, 
  Sparkles,
  MessageCircle,
  Minimize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant = ({ userProfile, isOpen, onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `مرحباً ${userProfile.name}! أنا خبير نوتريفا الذكي. كيف يمكنني مساعدتك اليوم في رحلتك نحو الرشاقة والصحة؟` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          userProfile
        })
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "عذراً، واجهت مشكلة في الاتصال. يرجى المحاولة مرة أخرى." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 left-6 md:left-auto md:w-[450px] h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl z-[100] border border-black/5 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-primary text-white flex justify-between items-center flex-row-reverse">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div className="text-right">
                <h3 className="font-black text-sm">خبير نوتريفا الذكي</h3>
                <span className="text-[10px] font-bold opacity-70">متصل الآن</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-background/30"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} flex-row-reverse gap-3`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold leading-relaxed text-right ${
                  msg.role === 'user' ? 'bg-white border border-black/5 rounded-tr-none' : 'bg-primary text-white rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end flex-row-reverse gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl rounded-tl-none">
                  <Loader2 className="animate-spin text-primary" size={20} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-black/5 bg-white">
            <div className="relative flex items-center gap-2 flex-row-reverse">
              <Input 
                placeholder="اسأل الخبير الذكي..." 
                className="pr-4 pl-12 text-right py-6 rounded-2xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading}
                size="icon" 
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-xl h-10 w-10"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
