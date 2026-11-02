import React, { useState, useRef } from 'react';
import { SAMPLE_LOGOS, SampleLogo } from '../data/sampleLogos';
import { Upload, Sparkles, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

interface LogoUploaderProps {
  currentLogoSrc: string;
  currentLogoName: string;
  onSelectLogo: (src: string, name: string) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoSrc,
  currentLogoName,
  onSelectLogo,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiPromptBox, setShowAiPromptBox] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, SVG, JPG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectLogo(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Generate Logo with AI
  const handleGenerateAiLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/mockup/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate logo');
      }

      if (data.imageUrl) {
        onSelectLogo(data.imageUrl, `AI Logo: ${aiPrompt.slice(0, 18)}`);
        setShowAiPromptBox(false);
        setAiPrompt('');
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error communicating with AI service');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 space-y-4">
      {/* 1. File Upload Dropzone */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-200">
            Upload Your Logo
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            PNG · SVG · JPG · WebP
          </span>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
            isDraggingOver
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-900/60 hover:bg-slate-800/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-200">
              Drag & drop logo here or <span className="text-indigo-400">browse</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Transparent background recommended
            </p>
          </div>
        </div>
      </div>

      {/* 2. Active Placed Logo Preview */}
      {currentLogoSrc && (
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shrink-0">
              <img
                src={currentLogoSrc}
                alt="Active logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200 truncate">
                  {currentLogoName}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Placed on mockup
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI Logo Creator Expandable Option */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              AI Logo Generator
            </span>
          </div>
          <button
            onClick={() => setShowAiPromptBox(!showAiPromptBox)}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showAiPromptBox ? 'Close' : 'Create Logo'}
          </button>
        </div>

        {showAiPromptBox && (
          <form onSubmit={handleGenerateAiLogo} className="mt-3 space-y-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. minimalist geometric hawk emblem..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {aiError && (
              <p className="text-[11px] text-rose-400 leading-tight">{aiError}</p>
            )}
            <button
              type="submit"
              disabled={isGeneratingAi || !aiPrompt.trim()}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg shadow transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Brand Mark...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Brand Mark</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* 4. Curated Sample Logos */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">
            Sample Brand Badges
          </span>
          <span className="text-[10px] text-slate-500">
            Click to test
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_LOGOS.map((sample: SampleLogo) => {
            const isCurrent = currentLogoSrc === sample.dataUrl;
            return (
              <button
                key={sample.id}
                onClick={() => onSelectLogo(sample.dataUrl, sample.name)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-2 group ${
                  isCurrent
                    ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-800/80 p-1 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img
                    src={sample.dataUrl}
                    alt={sample.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-center w-full">
                  <span className="text-[11px] font-medium text-slate-200 block truncate">
                    {sample.name}
                  </span>
                  <span className="text-[9px] text-slate-500 block truncate">
                    {sample.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
