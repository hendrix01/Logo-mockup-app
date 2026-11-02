import React, { useState } from 'react';
import { ProductItem, ProductColor, LogoState, AiGeneratedImage } from '../types/mockup';
import {
  Sparkles,
  Wand2,
  Download,
  Image as ImageIcon,
  Loader2,
  Layers,
  Sliders,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface AiGeneratorViewProps {
  currentProduct: ProductItem;
  currentColor: ProductColor;
  logo: LogoState;
  onUseAsLogo?: (src: string, name: string) => void;
  getCompositeDataUrl: () => Promise<string | null>;
}

export const AiGeneratorView: React.FC<AiGeneratorViewProps> = ({
  currentProduct,
  currentColor,
  logo,
  onUseAsLogo,
  getCompositeDataUrl,
}) => {
  const [activeMode, setActiveMode] = useState<'create' | 'edit'>('create');

  // Generation state (gemini-3-pro-image-preview)
  const [createPrompt, setCreatePrompt] = useState<string>(
    `High-end commercial product photography of a ${currentColor.name.toLowerCase()} ${currentProduct.name.toLowerCase()} featuring minimalist brand emblem in center, studio lighting, neutral travertine surface, professional editorial shot, 8k resolution`
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9' | '3:4'>('1:1');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Edit state (gemini-nano-banana-2.1)
  const [editPrompt, setEditPrompt] = useState<string>(
    'Add warm morning sunlight streaming in through a nearby window, casting soft shadows onto a natural wooden tabletop.'
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Gallery of generated images
  const [history, setHistory] = useState<AiGeneratedImage[]>([]);
  const [previewModalImage, setPreviewModalImage] = useState<AiGeneratedImage | null>(null);

  // Preset inspiration prompts
  const samplePrompts = [
    {
      title: 'Studio Travertine',
      prompt: `Commercial studio photography of a ${currentColor.name.toLowerCase()} ${currentProduct.name.toLowerCase()} on a sleek limestone surface, soft directional daylight, shallow depth of field, 8k luxury product shot`,
    },
    {
      title: 'Lifestyle Cafe',
      prompt: `Cozy Scandinavian coffee house setting, ${currentColor.name.toLowerCase()} ${currentProduct.name.toLowerCase()} placed on a warm oak table next to an espresso and fresh journal, cinematic natural bokeh`,
    },
    {
      title: 'Urban Streetwear',
      prompt: `Editorial fashion photoshoot in an architectural concrete warehouse, model wearing a ${currentColor.name.toLowerCase()} ${currentProduct.name.toLowerCase()} with crisp graphic logo print, high-contrast strobe lighting`,
    },
    {
      title: 'Outdoor Adventure',
      prompt: `Rugged outdoor alpine mountain setting at golden hour sunrise, ${currentColor.name.toLowerCase()} ${currentProduct.name.toLowerCase()} on a granite rock overlooking misty pine forest, cinematic commercial grade`,
    },
  ];

  // Handler for Generating High-Quality Scene with gemini-3-pro-image-preview
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createPrompt.trim()) return;

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch('/api/mockup/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: createPrompt.trim(),
          model: 'gemini-3-pro-image-preview',
          imageSize,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        const newEntry: AiGeneratedImage = {
          id: `gen-${Date.now()}`,
          url: data.imageUrl,
          prompt: createPrompt,
          model: data.modelUsed || 'gemini-3-pro-image-preview',
          size: imageSize,
          createdAt: Date.now(),
          productName: currentProduct.name,
        };
        setHistory((prev) => [newEntry, ...prev]);
        setPreviewModalImage(newEntry);
      }
    } catch (err: any) {
      console.error(err);
      setGenerateError(err.message || 'An error occurred during AI image generation');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for Editing Current Mockup with gemini-nano-banana-2.1
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;

    setIsEditing(true);
    setEditError(null);

    try {
      // Grab composite base image from current canvas
      const currentCanvasBase64 = await getCompositeDataUrl();
      if (!currentCanvasBase64) {
        throw new Error('Could not capture current mockup canvas for editing.');
      }

      const res = await fetch('/api/mockup/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt.trim(),
          imageBase64: currentCanvasBase64,
          model: 'gemini-nano-banana-2.1',
          imageSize: '1K',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to edit image');
      }

      if (data.imageUrl) {
        const newEntry: AiGeneratedImage = {
          id: `edit-${Date.now()}`,
          url: data.imageUrl,
          prompt: editPrompt,
          model: 'gemini-nano-banana-2.1',
          size: '1K',
          createdAt: Date.now(),
          productName: `${currentProduct.name} (Edited)`,
        };
        setHistory((prev) => [newEntry, ...prev]);
        setPreviewModalImage(newEntry);
      }
    } catch (err: any) {
      console.error(err);
      setEditError(err.message || 'An error occurred while editing the image with Gemini');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = (imgUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full">
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Gemini AI Scene Studio
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Generate photorealistic campaign scenes with <code className="text-indigo-300 font-mono text-xs">gemini-3-pro-image-preview</code> at 1K, 2K, or 4K, or modify your mockup with <code className="text-purple-300 font-mono text-xs">gemini-nano-banana-2.1</code>.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md mb-6">
        <button
          onClick={() => setActiveMode('create')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMode === 'create'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Lifestyle Scene</span>
        </button>

        <button
          onClick={() => setActiveMode('edit')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeMode === 'edit'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Edit Mockup with AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-5">
          {activeMode === 'create' ? (
            /* Mode 1: High-Quality Generation */
            <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Model: gemini-3-pro-image-preview
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Current: {currentProduct.name} ({currentColor.name})
                </span>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Prompt Description
                </label>
                <textarea
                  rows={4}
                  value={createPrompt}
                  onChange={(e) => setCreatePrompt(e.target.value)}
                  placeholder="Describe your target mockup photo scene, lighting, backdrop, and composition..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>

              {/* Resolution Affordance (1K, 2K, 4K) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    Output Image Resolution
                  </label>
                  <span className="text-[11px] font-mono text-indigo-300">
                    {imageSize === '1K' ? '1024 × 1024' : imageSize === '2K' ? '2048 × 2048' : '4096 × 4096'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        imageSize === size
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['1:1', '4:3', '16:9', '3:4'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-mono transition-all ${
                        aspectRatio === ratio
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Inspiration Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-slate-400">
                  Quick Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setCreatePrompt(p.prompt)}
                      className="text-[11px] px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-md text-slate-300 transition-colors"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {generateError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {generateError}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating || !createPrompt.trim()}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Rendering with Gemini 3 Pro ({imageSize})...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Scene ({imageSize})</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Mode 2: Generative Image Editor (gemini-nano-banana-2.1) */
            <form onSubmit={handleEdit} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Model: gemini-nano-banana-2.1
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Source: Live Mockup Canvas
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300">
                This mode captures your active mockup placement and applies natural language edits using <strong>gemini-nano-banana-2.1</strong>.
              </div>

              {/* Edit Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Edit Instructions
                </label>
                <textarea
                  rows={4}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g. Add realistic fabric wrinkles around the chest graphic, soften lighting, and place against a sunlit urban concrete wall..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none leading-relaxed"
                />
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {editError}
                </div>
              )}

              <button
                type="submit"
                disabled={isEditing || !editPrompt.trim()}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Editing Mockup with Nano Banana 2.1...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-purple-200" />
                    <span>Apply AI Image Edit</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Gallery / Output Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              Generated Mockup Gallery
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {history.length} renders
            </span>
          </div>

          {history.length === 0 ? (
            <div className="h-72 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-900/30">
              <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-medium text-slate-400">
                No scenes generated yet
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Pick a resolution and prompt on the left to render high-fidelity commercial shots using Gemini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex gap-3 group"
                >
                  <div
                    onClick={() => setPreviewModalImage(item)}
                    className="w-24 h-24 rounded-lg overflow-hidden bg-slate-950 shrink-0 cursor-pointer border border-slate-800 relative group-hover:scale-105 transition-transform"
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                          {item.size}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono truncate">
                          {item.model}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-snug">
                        {item.prompt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-800">
                      <button
                        onClick={() => handleDownload(item.url, `mockup-${item.id}`)}
                        className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Save</span>
                      </button>

                      {onUseAsLogo && (
                        <button
                          onClick={() => onUseAsLogo(item.url, `AI: ${item.prompt.slice(0, 15)}`)}
                          className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Use on Mockup</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Gemini Render ({previewModalImage.size})
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {previewModalImage.prompt}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded text-xs"
              >
                Close (Esc)
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-black/40 max-h-[70vh] overflow-hidden">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.prompt}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
              <span className="text-xs font-mono text-slate-500">
                Model: {previewModalImage.model} · {previewModalImage.size}
              </span>
              <button
                onClick={() => handleDownload(previewModalImage.url, `gemini-render-${previewModalImage.id}`)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res Render</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
