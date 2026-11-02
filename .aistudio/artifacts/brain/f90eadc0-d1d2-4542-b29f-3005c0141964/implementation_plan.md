# MockupCraft Studio — Interactive Product Mockup & AI Generator

A dark-mode product mockup design suite where brands and creators can upload their logo, manipulate it on interactive 2D canvases across apparel, drinkware, bags, phone cases, and hats, or invoke Gemini AI to generate studio-grade realistic mockups and edit imagery at 1K, 2K, and 4K resolutions.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and will govern the implementation:

- **Product Categories Confirmed**: Apparel (classic t-shirt, premium hoodie), drinkware (ceramic mug, stainless travel tumbler), accessories (canvas tote bag, snapback cap, phone case).
- **Positioning Engine Confirmed**: Full interactive canvas featuring drag-and-drop placement, smooth freeform scaling, rotation handle, opacity control, blend modes (Multiply, Screen, Normal, Overlay for fabric integration), and quick-snap alignment presets (Chest Left, Center Chest, Wrap Center, Full Print).
- **Visual Aesthetic Confirmed**: Modern Dark Studio theme with charcoal surface tones (`#0B0F17` / `#131B2E`), subtle borders, focused viewport canvas, and sharp cobalt/amber accents.
- **AI Image Generation & Editing Integration**: Incorporates `gemini-3-pro-image` with 1K / 2K / 4K resolution picker for creating realistic mockups from scratch or photorealistic branding scenes, and `gemini-nano-banana-2.1` for generative prompt-based editing and realistic placement.

---

### 1. Overview & Core Concept

- **What It Does**: MockupCraft Studio allows users to upload any logo (PNG, SVG, JPG, WebP) or generate fresh logos with AI, instantly previewing them realistically across 6+ popular product lines. Users can interactively position, scale, rotate, tint, and blend logos on dynamic product templates, switch product colorways in real time, export high-res renders, and leverage Google Gemini generative models to create photo-realistic lifestyle scenes with custom lighting and folds.
- **Target Audience / Persona**: Brand owners, e-commerce merchants, apparel designers, merchandise creators, and marketing teams needing instant, client-ready product previews without bulky graphic design software.
- **Key Value**: Instant zero-lag browser-based mockup placement combined with cutting-edge server-side Gemini AI generation when studio-grade commercial photography is needed.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Logo Onboarding**:
   - Drag & drop custom logo image (supports transparency auto-detection) or select curated sample brand badges.
   - Optional AI Logo & Asset Creator: Generate new brand vector-style marks or background scenes with text prompts.
2. **Product Catalog Selection**:
   - Visual category switcher: T-Shirts, Hoodies, Ceramic Mugs, Tumblers, Canvas Totes, Phone Cases, Snapback Hats.
   - Live color palette selector per product (Heather Grey, Midnight Black, Pure White, Forest Green, Navy Blue, Terracotta).
3. **Interactive Canvas Studio**:
   - Live stage rendering the product base, fabric displacement/shading overlay, and the interactive logo layer.
   - Bounding-box controls: Drag to reposition within safe print zones, corner scaling handles, rotation ring, and flip options.
   - Print controls panel: Blend modes (`Multiply` for realistic fabric weave simulation, `Normal`, `Screen`), opacity, contrast, and decal finish (Matte, Gloss, Embroidered look).
4. **AI Studio Generator & Image Editor**:
   - **High-Quality Scene Generation**: Powered by `gemini-3-pro-image` with resolution selector (1K, 2K, 4K), prompt input, and aspect ratio controls for generating campaign lifestyle mockups (e.g., "Model wearing black t-shirt in sunlit cafe with coffee cup").
   - **AI Image Editor**: Powered by `gemini-nano-banana-2.1` to modify existing mockups or add environmental elements via natural language prompts.
5. **High-Resolution Export**:
   - One-click instant PNG/JPEG composite download from client canvas.
   - Batch export option across all products simultaneously.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-end industrial dark studio, evoking professional creative tools like Figma, Lightroom, and Cinema 4D.
- **Color Palette**:
  - Neutral Canvas (60%): `#090D16` deep space obsidian background, `#111827` panel surfaces.
  - Structural Surfaces (30%): `#1F2937` borders, hairline dividers (`rgba(255,255,255,0.08)`), `#9CA3AF` body text, `#F9FAFB` headings.
  - Accent Budget (10%): Electric Indigo / Violet (`#6366F1`) and crisp Cyan (`#06B6D4`) for active tools, selection bounding boxes, and generation triggers.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` font family with confident geometric clarity.
  - Numbers & Metrics: `font-mono tabular-nums` for dimensions, angles, zoom level, and resolution indicators.
- **Layout Rhythm**:
  - Top Bar Contract: Brand wordmark ("MockupCraft Studio") — 4 functional nav tabs (Mockup Studio, AI Generator, Product Catalog, Asset Library) — Primary Action ("Export Render").
  - Three-pane desktop layout: Left product/variant selector & assets drawer (280px), Center high-contrast interactive canvas stage with zoom/pan controls, Right precision positioning & material properties inspector (320px).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Engine Rendering (Client Canvas + Server Gemini)**:
  - *Chosen Approach*: Instant client-side HTML5 Canvas / SVG composite for 60fps real-time interactive dragging, rotation, scaling, and fabric multiply blending, alongside server-side Gemini image generation for hyper-realistic lighting, shadows, and lifestyle photography.
  - *Why*: Users require instant, tactile feedback when adjusting logos, which cloud AI APIs cannot deliver with sub-100ms latency. Meanwhile, Gemini handles complex photorealistic scene rendering with configurable 1K/2K/4K outputs.
- **Decision 2: Express Server Proxy with `@google/genai`**:
  - *Chosen Approach*: Server-side endpoints (`/api/mockup/generate`, `/api/mockup/edit`) using Google GenAI SDK with `process.env.GEMINI_API_KEY`.
  - *Why*: Strict security requirement to never expose API keys to the browser, while supporting high-resolution image generation and multi-part image editing.
- **Decision 3: Pre-calibrated Realistic Product Templates**:
  - *Chosen Approach*: High-quality vector/raster product assets with realistic highlight, shadow, and displacement texture layers, allowing dynamic product recoloring and realistic logo contouring.
  - *Why*: Produces believable print-on-demand previews immediately even before invoking AI generation.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MockupCraft Studio                            │
└────────────────────────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│ Left Sidebar │             │ Center Stage │             │Right Sidebar │
│  - Products  │             │- HTML5 Canvas│             │ - Transform  │
│  - Colors    │────────────►│- Interactive │◄────────────│ - Blend Mode │
│  - Logo Drop │             │  Bounding Box│             │ - Decal Style│
│  - Presets   │             │- Grid/Guides │             │ - AI Prompts │
└──────────────┘             └──────────────┘             └──────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   Export & AI Bridge                    │
       │  - Canvas ToBlob (Instant PNG/JPEG 2K client download)  │
       │  - POST /api/generate-image (gemini-3-pro-image 1K/2K/4K)│
       │  - POST /api/edit-image (gemini-nano-banana-2.1)        │
       └─────────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │               Server-Side (@google/genai)               │
       │               server.ts on Express (Port 3000)          │
       └─────────────────────────────────────────────────────────┘
```

#### Core Data Entities
```typescript
interface ProductTemplate {
  id: string;
  name: string;
  category: 'apparel' | 'drinkware' | 'accessories';
  colors: { name: string; hex: string; bgTone: string }[];
  printableArea: { x: number; y: number; width: number; height: number };
  aspectRatio: number;
  baseSvg: string; // Dynamic SVG with shading mask and color fill
}

interface LogoPlacement {
  imageSrc: string;
  x: number;          // Relative % or px within print boundary
  y: number;
  scale: number;
  rotation: number;   // Degrees (0 - 360)
  opacity: number;    // 0 - 1
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  decalFinish: 'matte' | 'gloss' | 'vintage' | 'embroidery';
}

interface AiGenerationRequest {
  model: 'gemini-3-pro-image' | 'gemini-nano-banana-2.1';
  prompt: string;
  imageSize?: '1K' | '2K' | '4K';
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4';
  inputImageBase64?: string;
}
```

#### State & Interaction Flow
- **Interaction Handlers**: Mouse/Touch dragging on canvas updates active logo coordinates with boundary clamping; corner handles resize proportionately; rotation wheel adjusts angle; hotkeys support nudge (arrow keys), reset (`Esc`), and duplicate.
- **Color Customization**: Changing product color swatch updates the dynamic product mesh layer while preserving highlights and shadow multipliers.
- **Export Pipeline**: Generates clean, watermark-free high-resolution renders via offscreen high-DPI canvas composite or saves AI-generated 1K/2K/4K results with download affordances.
