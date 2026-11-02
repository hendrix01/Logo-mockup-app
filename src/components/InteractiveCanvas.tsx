import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProductItem, ProductColor, LogoState } from '../types/mockup';
import { ProductMockupSvg } from './ProductMockupSvg';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  FlipHorizontal,
  Move,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface InteractiveCanvasProps {
  product: ProductItem;
  color: ProductColor;
  logo: LogoState;
  onUpdateLogo: (updates: Partial<LogoState>) => void;
  onOpenAiGen?: () => void;
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  product,
  color,
  logo,
  onUpdateLogo,
  onOpenAiGen,
  canvasContainerRef,
  svgRef,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [stageBg, setStageBg] = useState<'dark' | 'grid' | 'light'>('dark');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const dragStartRef = useRef<{ x: number; y: number; initialLogoX: number; initialLogoY: number }>({
    x: 0,
    y: 0,
    initialLogoX: 50,
    initialLogoY: 50,
  });

  const resizeStartRef = useRef<{
    y: number;
    initialScale: number;
  }>({
    y: 0,
    initialScale: 1,
  });

  const rotateStartRef = useRef<{
    angle: number;
    initialRotation: number;
  }>({
    angle: 0,
    initialRotation: 0,
  });

  // Safe area dimensions in SVG units (600x600 viewBox)
  const zoneLeft = (product.printableArea.x / 100) * 600;
  const zoneTop = (product.printableArea.y / 100) * 600;
  const zoneWidth = (product.printableArea.width / 100) * 600;
  const zoneHeight = (product.printableArea.height / 100) * 600;

  // Center of logo in SVG coordinates
  const logoCenterX = zoneLeft + (logo.x / 100) * zoneWidth;
  const logoCenterY = zoneTop + (logo.y / 100) * zoneHeight;

  // Base size and current bounding box size
  const baseSize = Math.min(zoneWidth, zoneHeight) * 0.75;
  const logoWidth = baseSize * logo.scale;
  const logoHeight = baseSize * logo.scale;

  // Start dragging logo
  const handleLogoMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialLogoX: logo.x,
      initialLogoY: logo.y,
    };
  };

  // Start resizing via corner handle
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      y: e.clientY,
      initialScale: logo.scale,
    };
  };

  // Start rotating via rotation handle
  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerScreenX = rect.left + (logoCenterX / 600) * rect.width;
    const centerScreenY = rect.top + (logoCenterY / 600) * rect.height;
    const initialAngle = Math.atan2(e.clientY - centerScreenY, e.clientX - centerScreenX) * (180 / Math.PI);
    rotateStartRef.current = {
      angle: initialAngle,
      initialRotation: logo.rotation,
    };
  };

  // Unified global mouse move and mouse up listeners
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = 600 / rect.width;
      const scaleY = 600 / rect.height;

      if (isDragging) {
        const deltaScreenX = e.clientX - dragStartRef.current.x;
        const deltaScreenY = e.clientY - dragStartRef.current.y;
        const deltaSvgX = deltaScreenX * scaleX;
        const deltaSvgY = deltaScreenY * scaleY;

        const deltaPercentX = (deltaSvgX / zoneWidth) * 100;
        const deltaPercentY = (deltaSvgY / zoneHeight) * 100;

        const nextX = Math.round(Math.max(-20, Math.min(120, dragStartRef.current.initialLogoX + deltaPercentX)));
        const nextY = Math.round(Math.max(-20, Math.min(120, dragStartRef.current.initialLogoY + deltaPercentY)));

        onUpdateLogo({ x: nextX, y: nextY });
      } else if (isResizing) {
        const deltaY = resizeStartRef.current.y - e.clientY;
        const scaleDelta = deltaY * 0.008;
        const nextScale = Math.min(2.5, Math.max(0.15, Number((resizeStartRef.current.initialScale + scaleDelta).toFixed(2))));
        onUpdateLogo({ scale: nextScale });
      } else if (isRotating) {
        const centerScreenX = rect.left + (logoCenterX / 600) * rect.width;
        const centerScreenY = rect.top + (logoCenterY / 600) * rect.height;
        const currentAngle = Math.atan2(e.clientY - centerScreenY, e.clientX - centerScreenX) * (180 / Math.PI);
        const deltaAngle = currentAngle - rotateStartRef.current.angle;
        let nextRotation = Math.round(rotateStartRef.current.initialRotation + deltaAngle);
        // Normalize rotation to [-180, 180]
        while (nextRotation > 180) nextRotation -= 360;
        while (nextRotation < -180) nextRotation += 360;
        onUpdateLogo({ rotation: nextRotation });
      }
    },
    [isDragging, isResizing, isRotating, zoneWidth, zoneHeight, logoCenterX, logoCenterY, onUpdateLogo, svgRef]
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, handleGlobalMouseMove, handleGlobalMouseUp]);

  // Center alignment shortcuts
  const handleCenterAlign = () => {
    onUpdateLogo({ x: 50, y: 50 });
  };

  const handleRotate90 = () => {
    const nextRot = (logo.rotation + 90) % 360;
    onUpdateLogo({ rotation: nextRot > 180 ? nextRot - 360 : nextRot });
  };

  const handleToggleFlip = () => {
    onUpdateLogo({ flipX: !logo.flipX });
  };

  // Stage background style
  const getStageBgClass = () => {
    if (stageBg === 'grid') {
      return 'bg-[#0B0F19] bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px]';
    }
    if (stageBg === 'light') {
      return 'bg-gradient-to-b from-slate-200 to-slate-300';
    }
    return 'bg-gradient-to-b from-[#0E1524] via-[#0B0F19] to-[#070A11]';
  };

  return (
    <div
      ref={canvasContainerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${getStageBgClass()}`}
    >
      {/* Floating Canvas Top Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#131B2E]/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-xl text-xs text-slate-300">
        <span className="font-semibold text-white tracking-wide">{product.name}</span>
        <span className="text-slate-500">·</span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
            style={{ backgroundColor: color.hex }}
          />
          {color.name}
        </span>
      </div>

      {/* Floating Canvas Top Right Tools (Guides, Stage background, Zoom) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#131B2E]/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-1.5 shadow-xl text-slate-300">
        <button
          onClick={() => setShowGuides(!showGuides)}
          title={showGuides ? 'Hide Print Boundary' : 'Show Print Boundary'}
          className={`p-2 rounded-lg transition-colors ${
            showGuides ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          {showGuides ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        <button
          onClick={() => setStageBg(stageBg === 'dark' ? 'grid' : stageBg === 'grid' ? 'light' : 'dark')}
          title="Toggle Canvas Background"
          className="px-2 py-1 text-xs font-mono font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition-colors uppercase"
        >
          {stageBg}
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        <button
          onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
          title="Zoom Out"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono tabular-nums px-1.5 text-slate-400 min-w-[36px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.15).toFixed(2))))}
          title="Zoom In"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          title="Reset View"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Scalable SVG Stage */}
      <div
        className="relative max-w-[620px] max-h-[620px] w-full aspect-square transition-transform duration-100 ease-out flex items-center justify-center p-4"
        style={{ transform: `scale(${zoom})` }}
      >
        <ProductMockupSvg
          canvasRef={svgRef}
          product={product}
          color={color}
          logo={logo}
          showPrintBoundary={showGuides}
          isInteractive={true}
          onLogoMouseDown={handleLogoMouseDown}
        />

        {/* Interactive Bounding Box Overlay for Logo When Present */}
        {logo.src && showGuides && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${(logoCenterX / 600) * 100}%`,
              top: `${(logoCenterY / 600) * 100}%`,
              width: `${(logoWidth / 600) * 100}%`,
              height: `${(logoHeight / 600) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${logo.rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Box Border */}
            <div className="w-full h-full border border-cyan-400/80 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.3)] pointer-events-none relative">
              {/* Rotation Handle on Top */}
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-cyan-400 text-slate-950 rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing pointer-events-auto hover:scale-110 transition-transform"
                onMouseDown={handleRotateMouseDown}
                title="Drag to Rotate Logo"
              >
                <RotateCw className="w-3 h-3 stroke-[3]" />
              </div>
              {/* Line linking rotation knob to box */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[1.5px] h-3 bg-cyan-400/80 pointer-events-none" />

              {/* Center Drag Handle */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-cyan-500/20 hover:bg-cyan-500/50 rounded-full border border-cyan-300 flex items-center justify-center cursor-move pointer-events-auto transition-colors"
                onMouseDown={handleLogoMouseDown}
                title="Drag to Reposition"
              >
                <Move className="w-3.5 h-3.5 text-cyan-100" />
              </div>

              {/* Corner Scale Handles */}
              <div
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-cyan-500 rounded-sm cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                onMouseDown={handleResizeMouseDown}
                title="Drag to Scale Logo"
              />
              <div
                className="absolute -top-2 -left-2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-sm pointer-events-none"
              />
              <div
                className="absolute -top-2 -right-2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-sm pointer-events-none"
              />
              <div
                className="absolute -bottom-2 -left-2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-sm pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Canvas Bottom Center Quick Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#131B2E]/95 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2 shadow-2xl">
        <button
          onClick={handleCenterAlign}
          title="Center In Print Area"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
        >
          <Move className="w-3.5 h-3.5 text-cyan-400" />
          <span>Center</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700" />

        <button
          onClick={handleRotate90}
          title="Rotate 90 Degrees"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>+90°</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700" />

        <button
          onClick={handleToggleFlip}
          title="Flip Horizontally"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            logo.flipX ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span>Flip</span>
        </button>

        {onOpenAiGen && (
          <>
            <div className="w-[1px] h-4 bg-slate-700" />
            <button
              onClick={onOpenAiGen}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-md transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Scene</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
