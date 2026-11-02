/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { PRODUCTS } from './data/products';
import { SAMPLE_LOGOS } from './data/sampleLogos';
import { ProductItem, ProductColor, LogoState, ViewTab } from './types/mockup';
import { Navbar } from './components/Navbar';
import { ProductSelector } from './components/ProductSelector';
import { LogoUploader } from './components/LogoUploader';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { InspectorPanel } from './components/InspectorPanel';
import { AiGeneratorView } from './components/AiGeneratorView';
import { MultiProductPreview } from './components/MultiProductPreview';
import { ExportModal } from './components/ExportModal';
import { Shirt, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('studio');
  const [leftNavMode, setLeftNavMode] = useState<'products' | 'logo'>('products');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(PRODUCTS[0].colors[0]);

  // Initial logo set to first sample logo
  const [logo, setLogo] = useState<LogoState>({
    src: SAMPLE_LOGOS[0].dataUrl,
    name: SAMPLE_LOGOS[0].name,
    x: 50,
    y: 44,
    scale: 1.0,
    rotation: 0,
    opacity: 100,
    blendMode: 'multiply',
    decalFinish: 'matte',
    flipX: false,
    flipY: false,
  });

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // SVG ref for exporting and AI capture
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Switch product and ensure valid color
  const handleSelectProduct = (prod: ProductItem) => {
    setSelectedProduct(prod);
    const existingColor = prod.colors.find((c) => c.id === selectedColor.id);
    setSelectedColor(existingColor || prod.colors[0]);

    // Apply default product center preset
    if (prod.presets.length > 0) {
      const centerPreset = prod.presets[0];
      setLogo((prev) => ({
        ...prev,
        x: centerPreset.x,
        y: centerPreset.y,
        scale: centerPreset.scale,
        rotation: centerPreset.rotation,
      }));
    }
  };

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
  };

  const handleUpdateLogo = (updates: Partial<LogoState>) => {
    setLogo((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectLogo = (src: string, name: string) => {
    setLogo((prev) => ({
      ...prev,
      src,
      name,
    }));
  };

  // Capture current SVG canvas as base64 PNG data URL
  const getCompositeDataUrl = useCallback(async (): Promise<string | null> => {
    if (!svgRef.current) return null;
    return new Promise((resolve) => {
      try {
        const svgElement = svgRef.current!;
        const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
        svgCopy.setAttribute('width', '1024');
        svgCopy.setAttribute('height', '1024');

        // Remove print boundary guides from snapshot
        const guides = svgCopy.querySelectorAll('rect[stroke="#06B6D4"]');
        guides.forEach((g) => g.remove());

        const svgString = new XMLSerializer().serializeToString(svgCopy);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1024;
          canvas.height = 1024;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          // Transparent or neutral background
          ctx.drawImage(image, 0, 0, 1024, 1024);
          URL.revokeObjectURL(blobURL);
          resolve(canvas.toDataURL('image/png', 0.95));
        };
        image.onerror = () => resolve(null);
        image.src = blobURL;
      } catch (e) {
        console.error(e);
        resolve(null);
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090D16] text-slate-100 select-none">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 flex overflow-hidden relative">
        {currentTab === 'studio' && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Left Sidebar: Products & Logo (300px) */}
            <aside className="w-[300px] border-r border-slate-800 bg-[#0C121E] flex flex-col shrink-0 z-10">
              {/* Left Pane Mode Tabs */}
              <div className="flex border-b border-slate-800 shrink-0">
                <button
                  onClick={() => setLeftNavMode('products')}
                  className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    leftNavMode === 'products'
                      ? 'text-white border-b-2 border-indigo-500 bg-slate-900/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Products</span>
                </button>
                <button
                  onClick={() => setLeftNavMode('logo')}
                  className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    leftNavMode === 'logo'
                      ? 'text-white border-b-2 border-indigo-500 bg-slate-900/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Logo & Badges</span>
                </button>
              </div>

              {/* Left Content View */}
              <div className="flex-1 overflow-hidden">
                {leftNavMode === 'products' ? (
                  <ProductSelector
                    products={PRODUCTS}
                    selectedProduct={selectedProduct}
                    selectedColor={selectedColor}
                    onSelectProduct={handleSelectProduct}
                    onSelectColor={handleSelectColor}
                  />
                ) : (
                  <LogoUploader
                    currentLogoSrc={logo.src}
                    currentLogoName={logo.name}
                    onSelectLogo={handleSelectLogo}
                  />
                )}
              </div>
            </aside>

            {/* Center Stage: Interactive Mockup Canvas */}
            <section className="flex-1 h-full relative overflow-hidden bg-[#0A0F1A]">
              <InteractiveCanvas
                product={selectedProduct}
                color={selectedColor}
                logo={logo}
                onUpdateLogo={handleUpdateLogo}
                onOpenAiGen={() => setCurrentTab('ai-generator')}
                canvasContainerRef={canvasContainerRef}
                svgRef={svgRef}
              />
            </section>

            {/* Right Sidebar: Precision Inspector Panel (320px) */}
            <aside className="w-[320px] border-l border-slate-800 bg-[#0C121E] flex flex-col shrink-0 z-10">
              <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-semibold text-slate-300 shrink-0">
                <span>Placement & Finish</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedProduct.printableArea.label}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <InspectorPanel
                  product={selectedProduct}
                  logo={logo}
                  onUpdateLogo={handleUpdateLogo}
                />
              </div>
            </aside>
          </div>
        )}

        {/* Tab 2: Full Product Showcase Grid */}
        {currentTab === 'gallery' && (
          <MultiProductPreview
            products={PRODUCTS}
            currentColor={selectedColor}
            logo={logo}
            onSelectProduct={(p) => {
              handleSelectProduct(p);
              setCurrentTab('studio');
            }}
          />
        )}

        {/* Tab 3: Gemini AI Scene Studio (1K, 2K, 4K with gemini-3-pro-image-preview and nano-banana-2.1) */}
        {currentTab === 'ai-generator' && (
          <AiGeneratorView
            currentProduct={selectedProduct}
            currentColor={selectedColor}
            logo={logo}
            onUseAsLogo={(src, name) => {
              handleSelectLogo(src, name);
              setCurrentTab('studio');
            }}
            getCompositeDataUrl={getCompositeDataUrl}
          />
        )}
      </main>

      {/* Export Composite Modal */}
      <ExportModal
        product={selectedProduct}
        color={selectedColor}
        logo={logo}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        svgRef={svgRef}
      />
    </div>
  );
}
