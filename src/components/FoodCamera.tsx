/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, Loader2, CameraIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodDiaryEntry } from '../types';

interface FoodCameraProps {
  onSave: (entry: FoodDiaryEntry) => void;
  onClose: () => void;
}

export const FoodCamera: React.FC<FoodCameraProps> = ({ onSave, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Partial<FoodDiaryEntry> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الأذن.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        analyzeImage(dataUrl.split(',')[1]);
        stopCamera();
      }
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) throw new Error('فشل تحليل الصورة');
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("حدث خطأ أثناء تحليل الصورة. حاول مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (analysisResult && capturedImage) {
      const entry: FoodDiaryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        imageUrl: capturedImage,
        nameAr: analysisResult.nameAr || "وجبة غير معروفة",
        nameEn: analysisResult.nameEn || "Unknown Meal",
        calories: analysisResult.calories || 0,
        protein: analysisResult.protein || 0,
        carbs: analysisResult.carbs || 0,
        fat: analysisResult.fat || 0,
        analysis: analysisResult.analysis || "",
      };
      onSave(entry);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md absolute top-0 w-full z-10">
        <button onClick={onClose} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
        <span className="text-white font-black text-lg">يوميات الطعام الذكية</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {!capturedImage ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={capturedImage} 
            alt="Captured meal" 
            className="w-full h-full object-cover"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center"
            >
              <Loader2 size={48} className="text-primary animate-spin mb-4" />
              <h3 className="text-xl font-black mb-2">جاري تحليل وجبتك...</h3>
              <p className="text-sm opacity-80">يقوم الذكاء الاصطناعي بتحديد المكونات وحساب السعرات</p>
            </motion.div>
          )}

          {analysisResult && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 text-right"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  <span className="text-primary font-black text-sm">{analysisResult.calories} سعرة</span>
                </div>
                <h3 className="text-xl font-black text-black">{analysisResult.nameAr}</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-black/5 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] text-text-muted font-bold uppercase mb-1">بروتين</span>
                  <span className="font-black text-black">{analysisResult.protein}ج</span>
                </div>
                <div className="bg-black/5 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] text-text-muted font-bold uppercase mb-1">كارب</span>
                  <span className="font-black text-black">{analysisResult.carbs}ج</span>
                </div>
                <div className="bg-black/5 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] text-text-muted font-bold uppercase mb-1">دهون</span>
                  <span className="font-black text-black">{analysisResult.fat}ج</span>
                </div>
              </div>

              <p className="text-sm text-text-muted font-bold mb-6 leading-relaxed">
                {analysisResult.analysis}
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={handleRetake}
                  className="flex-1 h-14 bg-black/5 text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black/10 transition-all"
                >
                  <RefreshCw size={20} />
                  إعادة تصوير
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-[2] h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  <Check size={20} />
                  تأكيد وحفظ
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-20 left-4 right-4 bg-red-500 text-white p-4 rounded-2xl flex items-center gap-3"
            >
              <X size={20} className="shrink-0" />
              <p className="text-sm font-bold">{error}</p>
              <button onClick={handleRetake} className="mr-auto underline text-xs font-black">حاول مرة أخرى</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!capturedImage && !isAnalyzing && (
        <div className="p-8 pb-12 bg-black flex justify-center items-center">
          <button 
            onClick={captureImage}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white/30 active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
              <CameraIcon size={32} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};