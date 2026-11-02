import React from 'react';
import { ViewTab } from '../types/mockup';
import { Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenExport,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#090D16]/95 backdrop-blur-md px-6 flex items-center justify-between gap-8 shrink-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-base font-bold tracking-tight text-white font-display whitespace-nowrap">
          MockupCraft
        </span>
        <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">
          Studio
        </span>
      </div>

      {/* Zone 2: 4 clean single-line nav tabs */}
      <nav className="flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onTabChange('studio')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            currentTab === 'studio'
              ? 'text-white border-b-2 border-indigo-500 font-semibold'
              : ''
          }`}
        >
          Mockup Studio
        </button>

        <button
          onClick={() => onTabChange('gallery')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            currentTab === 'gallery'
              ? 'text-white border-b-2 border-indigo-500 font-semibold'
              : ''
          }`}
        >
          Product Showcase
        </button>

        <button
          onClick={() => onTabChange('ai-generator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
            currentTab === 'ai-generator'
              ? 'text-white border-b-2 border-indigo-500 font-semibold'
              : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Gemini AI Scene</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenExport}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Render</span>
        </button>
      </div>
    </header>
  );
};
