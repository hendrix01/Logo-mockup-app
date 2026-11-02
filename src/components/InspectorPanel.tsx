import React from 'react';
import { ProductItem, LogoState, BlendMode, DecalFinish } from '../types/mockup';
import {
  Sliders,
  RotateCw,
  Maximize2,
  Layers,
  Sparkles,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
} from 'lucide-react';

interface InspectorPanelProps {
  product: ProductItem;
  logo: LogoState;
  onUpdateLogo: (updates: Partial<LogoState>) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  product,
  logo,
  onUpdateLogo,
}) => {
  const blendModes: { id: BlendMode; name: string; desc: string }[] = [
    { id: 'multiply', name: 'Multiply (Fabric)', desc: 'Natural fabric fold & texture blend' },
    { id: 'normal', name: 'Normal', desc: 'Solid opaque print' },
    { id: 'screen', name: 'Screen', desc: 'Bright print for dark garments' },
    { id: 'overlay', name: 'Overlay', desc: 'Textured fabric integration' },
  ];

  const decalFinishes: { id: DecalFinish; name: string }[] = [
    { id: 'matte', name: 'Matte Screenprint' },
    { id: 'gloss', name: 'Gloss Vinyl' },
    { id: 'embroidery', name: 'Embroidered Stitch' },
    { id: 'vintage', name: 'Vintage Washed' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 text-slate-200">
      {/* 1. Placement Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Placement Presets
          </label>
          <span className="text-[10px] text-slate-500 font-mono">
            {product.presets.length} options
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {product.presets.map((preset) => {
            const isActive =
              Math.abs(logo.x - preset.x) < 4 &&
              Math.abs(logo.y - preset.y) < 4 &&
              Math.abs(logo.scale - preset.scale) < 0.15;
            return (
              <button
                key={preset.id}
                onClick={() =>
                  onUpdateLogo({
                    x: preset.x,
                    y: preset.y,
                    scale: preset.scale,
                    rotation: preset.rotation,
                  })
                }
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                  isActive
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold">{preset.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  X:{preset.x}% Y:{preset.y}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-800" />

      {/* 2. Scale & Sizing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            Size / Scale
          </label>
          <span className="text-xs font-mono tabular-nums text-cyan-300">
            {Math.round(logo.scale * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.2"
          max="2.5"
          step="0.05"
          value={logo.scale}
          onChange={(e) => onUpdateLogo({ scale: parseFloat(e.target.value) })}
          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
        />
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onUpdateLogo({ scale: 0.5 })}
            className="flex-1 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white transition-colors"
          >
            Small (50%)
          </button>
          <button
            onClick={() => onUpdateLogo({ scale: 1.0 })}
            className="flex-1 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white transition-colors"
          >
            Regular (100%)
          </button>
          <button
            onClick={() => onUpdateLogo({ scale: 1.5 })}
            className="flex-1 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white transition-colors"
          >
            Large (150%)
          </button>
        </div>
      </div>

      {/* 3. Rotation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
            Rotation Angle
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tabular-nums text-indigo-300">
              {logo.rotation}°
            </span>
            {logo.rotation !== 0 && (
              <button
                onClick={() => onUpdateLogo({ rotation: 0 })}
                title="Reset angle to 0"
                className="text-[10px] text-slate-500 hover:text-slate-300 underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={logo.rotation}
          onChange={(e) => onUpdateLogo({ rotation: parseInt(e.target.value, 10) })}
          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateLogo({ rotation: (logo.rotation - 45 + 360) % 360 > 180 ? ((logo.rotation - 45 + 360) % 360) - 360 : (logo.rotation - 45 + 360) % 360 })}
            className="flex-1 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            -45°
          </button>
          <button
            onClick={() => onUpdateLogo({ rotation: (logo.rotation + 45) % 360 > 180 ? ((logo.rotation + 45) % 360) - 360 : (logo.rotation + 45) % 360 })}
            className="flex-1 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <RotateCw className="w-3 h-3" />
            +45°
          </button>
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-800" />

      {/* 4. Fine Position Tuning (X, Y) */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-200 block">
          Position Coordinate Offsets
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 w-8">X-Pos</span>
            <input
              type="range"
              min="0"
              max="100"
              value={logo.x}
              onChange={(e) => onUpdateLogo({ x: parseInt(e.target.value, 10) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-xs font-mono tabular-nums text-slate-400 w-9 text-right">
              {logo.x}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 w-8">Y-Pos</span>
            <input
              type="range"
              min="0"
              max="100"
              value={logo.y}
              onChange={(e) => onUpdateLogo({ y: parseInt(e.target.value, 10) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-xs font-mono tabular-nums text-slate-400 w-9 text-right">
              {logo.y}%
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-800" />

      {/* 5. Fabric Blending & Finish */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Fabric Blend Mode
          </label>
          <span className="text-[10px] text-slate-500 uppercase font-mono">
            {logo.blendMode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {blendModes.map((b) => (
            <button
              key={b.id}
              onClick={() => onUpdateLogo({ blendMode: b.id })}
              className={`p-2 text-left rounded-lg border transition-all ${
                logo.blendMode === b.id
                  ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-xs font-semibold">{b.name}</div>
              <div className="text-[9px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                {b.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Decal Finish Style */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Decal Finish Effect
        </label>
        <div className="grid grid-cols-2 gap-2">
          {decalFinishes.map((f) => (
            <button
              key={f.id}
              onClick={() => onUpdateLogo({ decalFinish: f.id })}
              className={`p-2 text-center text-xs font-medium rounded-lg border transition-all ${
                logo.decalFinish === f.id
                  ? 'bg-amber-500/20 border-amber-500/80 text-amber-200 font-semibold shadow-sm'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Opacity & Flips */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">Print Opacity</span>
          <span className="text-xs font-mono tabular-nums text-slate-400">
            {logo.opacity}%
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={logo.opacity}
          onChange={(e) => onUpdateLogo({ opacity: parseInt(e.target.value, 10) })}
          className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg"
        />

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onUpdateLogo({ flipX: !logo.flipX })}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
              logo.flipX
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Flip H</span>
          </button>

          <button
            onClick={() => onUpdateLogo({ flipY: !logo.flipY })}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
              logo.flipY
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FlipVertical className="w-3.5 h-3.5" />
            <span>Flip V</span>
          </button>
        </div>
      </div>
    </div>
  );
};
