import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, X, Loader2, ShieldCheck, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PhotoUploadModal: React.FC = () => {
  const { isPhotoUploadOpen, setIsPhotoUploadOpen, updateProfile, showToast, profile } = useApp();
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isPhotoUploadOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('Image size exceeds 15MB limit', 'error');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePermanent = async () => {
    if (!previewUrl) {
      showToast('Please choose or drop an image first', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profile/set-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: previewUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to save permanent photo');
      }

      const data = await res.json();
      const newPhotoUrl = data.photoUrl || previewUrl;

      // Update state in AppContext
      await updateProfile({
        photo: newPhotoUrl,
        photoUrl: newPhotoUrl,
        isPhotoLocked: true,
      });

      showToast('कव्यांश की आधिकारिक तस्वीर स्थायी रूप से सेट हो गई है! (Permanent Photo Saved)', 'success');
      setIsPhotoUploadOpen(false);
      setPreviewUrl(null);
      setFileName(null);
    } catch (err: any) {
      showToast(err.message || 'Error saving photo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Profile Photo • स्थायी तस्वीर</span>
            </div>
            <h3 className="text-xl font-black text-white font-hindi">
              कव्यांश की स्थायी तस्वीर सेट करें
            </h3>
            <p className="text-xs text-slate-400">
              Set Kavyansh's permanent official photograph across the entire website.
            </p>
          </div>
          <button
            onClick={() => {
              setIsPhotoUploadOpen(false);
              setPreviewUrl(null);
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone & Preview */}
        <div className="space-y-4 relative z-10">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />

          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative w-48 h-56 mx-auto rounded-2xl overflow-hidden border-2 border-orange-500 shadow-xl bg-slate-950">
                <img
                  src={previewUrl}
                  alt="Kavyansh Preview"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-2 right-2 bg-emerald-500/90 text-white p-1 rounded-full shadow">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-200">
                  {fileName || 'Kavyansh Photo Ready'}
                </p>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready to be permanently applied across the website</span>
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-300 transition underline underline-offset-4 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Select different image file</span>
                </button>
              </div>
            </div>
          ) : profile.photo || profile.photoUrl ? (
            <div className="space-y-4">
              <div className="relative w-48 h-56 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl bg-slate-950">
                <img
                  src={profile.photo || profile.photoUrl}
                  alt="Current Kavyansh Photo"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Locked</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>आधिकारिक तस्वीर स्थायी रूप से सुरक्षित व लॉक है</span>
                </div>
                <p className="text-xs text-slate-400">
                  यह तस्वीर पूरी वेबसाइट पर स्थायी रूप से सक्रिय है।
                </p>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFile(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition flex items-center justify-center gap-2 ${
                  dragOver
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-slate-700 hover:border-orange-500/80 bg-slate-800/40 hover:bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold">नई तस्वीर बदलें या ड्रैग करें (Replace Photo)</span>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                dragOver
                  ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
                  : 'border-slate-700 hover:border-orange-500/80 bg-slate-800/40 hover:bg-slate-800/80'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center shadow-inner">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  Drop image here or Click to Browse
                </p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Select Kavyansh's photograph from your device. It will be saved permanently to server storage and public assets.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition">
                <Camera className="w-4 h-4" />
                <span>Choose Image File</span>
              </div>
            </div>
          )}

          {/* Current Status Info */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upon clicking <strong className="text-slate-200">"Save Permanently"</strong>, this photo replaces all baseline files on the server and is locked into the database.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 relative z-10">
          <button
            type="button"
            onClick={() => {
              setIsPhotoUploadOpen(false);
              setPreviewUrl(null);
            }}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSavePermanent}
            disabled={!previewUrl || isSubmitting}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition cursor-pointer ${
              !previewUrl || isSubmitting
                ? 'bg-orange-600/50 cursor-not-allowed text-white/50'
                : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/25'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving permanently...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Permanently (स्थायी करें)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
