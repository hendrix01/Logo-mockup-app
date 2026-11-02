import React, { useState } from 'react';
import { ProductItem, ProductColor, LogoState } from '../types/mockup';
import { Download, Sparkles, X, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  product: ProductItem;
  color: ProductColor;
  logo: LogoState;
  isOpen: boolean;
  onClose: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  product,
  color,
  logo,
  isOpen,
  onClose,
  svgRef,
}) => {
  const [resolution, setResolution] = useState<'standard' | 'high'>('high'); // standard=1200px, high=2400px
  const [backgroundType, setBackgroundType] = useState<'transparent' | 'studio' | 'clean-white'>('studio');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const svgElement = svgRef.current;
      if (!svgElement) throw new Error('SVG Canvas element not available');

      // Clone SVG and adjust attributes
      const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
      svgCopy.setAttribute('width', resolution === 'high' ? '2400' : '1200');
      svgCopy.setAttribute('height', resolution === 'high' ? '2400' : '1200');

      // Remove print boundary guides from export
      const guides = svgCopy.querySelectorAll('rect[stroke="#06B6D4"]');
      guides.forEach((g) => g.remove());

      const svgString = new XMLSerializer().serializeToString(svgCopy);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const targetDim = resolution === 'high' ? 2400 : 1200;
        const canvas = document.createElement('canvas');
        canvas.width = targetDim;
        canvas.height = targetDim;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Apply background if selected
        if (backgroundType === 'studio') {
          const grad = ctx.createRadialGradient(
            targetDim / 2,
            targetDim / 2,
            targetDim * 0.1,
            targetDim / 2,
            targetDim / 2,
            targetDim * 0.7
          );
          grad.addColorStop(0, '#131B2E');
          grad.addColorStop(1, '#070A11');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, targetDim, targetDim);
        } else if (backgroundType === 'clean-white') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetDim, targetDim);
        }

        ctx.drawImage(image, 0, 0, targetDim, targetDim);
        URL.revokeObjectURL(blobURL);

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${product.id}-${color.id}-mockup-${resolution === 'high' ? '4K' : '2K'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#06B6D4', '#EC4899', '#F59E0B'],
        });

        setIsExporting(false);
        onClose();
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Export failed', err);
      setIsExporting(false);
      alert('Could not generate export. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Export Render
            </h3>
            <p className="text-xs text-slate-400">
              Download studio-grade composite PNG
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Resolution Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Export Quality & Dimensions
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResolution('standard')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  resolution === 'standard'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-semibold">Standard (2K)</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  1200 × 1200 px
                </div>
              </button>

              <button
                type="button"
                onClick={() => setResolution('high')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  resolution === 'high'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-semibold flex items-center justify-between">
                  <span>Ultra-Res (4K)</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20 text-amber-300">HQ</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  2400 × 2400 px
                </div>
              </button>
            </div>
          </div>

          {/* Background Style Options */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Backdrop Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBackgroundType('studio')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  backgroundType === 'studio'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Studio Dark
              </button>

              <button
                type="button"
                onClick={() => setBackgroundType('transparent')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  backgroundType === 'transparent'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Transparent
              </button>

              <button
                type="button"
                onClick={() => setBackgroundType('clean-white')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  backgroundType === 'clean-white'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Clean White
              </button>
            </div>
          </div>

          {/* Product Summary */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between text-slate-400">
            <span>Target:</span>
            <span className="text-slate-200 font-medium">
              {product.name} ({color.name})
            </span>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rasterizing High-Res Output...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Download {resolution === 'high' ? '4K' : '2K'} PNG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
