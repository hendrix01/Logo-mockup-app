export type ProductCategory = 'apparel' | 'drinkware' | 'accessories';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  isDark: boolean;
}

export interface PrintableArea {
  x: number;      // % from left (0 - 100)
  y: number;      // % from top (0 - 100)
  width: number;  // % width (0 - 100)
  height: number; // % height (0 - 100)
  label?: string;
  shape?: 'rect' | 'cylinder' | 'curved';
}

export interface ProductPreset {
  id: string;
  name: string;
  x: number;      // % within printable area (0 - 100)
  y: number;      // % within printable area (0 - 100)
  scale: number;  // relative scale
  rotation: number;
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  subtitle: string;
  defaultColorId: string;
  colors: ProductColor[];
  printableArea: PrintableArea;
  presets: ProductPreset[];
  renderType: 'tshirt' | 'hoodie' | 'mug' | 'tumbler' | 'totebag' | 'phonecase' | 'hat';
}

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';
export type DecalFinish = 'matte' | 'gloss' | 'vintage' | 'embroidery';

export interface LogoState {
  src: string;
  name: string;
  x: number;          // % within printable area (0 - 100)
  y: number;          // % within printable area (0 - 100)
  scale: number;      // 0.2 to 2.5
  rotation: number;   // -180 to 180 degrees
  opacity: number;    // 0 to 100
  blendMode: BlendMode;
  decalFinish: DecalFinish;
  flipX: boolean;
  flipY: boolean;
}

export type ViewTab = 'studio' | 'gallery' | 'ai-generator';

export interface AiGeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  size: '1K' | '2K' | '4K';
  createdAt: number;
  productName?: string;
}
