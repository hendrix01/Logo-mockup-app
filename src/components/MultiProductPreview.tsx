import React from 'react';
import { ProductItem, ProductColor, LogoState } from '../types/mockup';
import { ProductMockupSvg } from './ProductMockupSvg';
import { ArrowRight, Layers } from 'lucide-react';

interface MultiProductPreviewProps {
  products: ProductItem[];
  currentColor: ProductColor;
  logo: LogoState;
  onSelectProduct: (product: ProductItem) => void;
}

export const MultiProductPreview: React.FC<MultiProductPreviewProps> = ({
  products,
  currentColor,
  logo,
  onSelectProduct,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Full Product Showcase
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Previewing <span className="text-slate-200 font-medium">"{logo.name}"</span> across all active merchandise templates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          // Find matching or default color for this product
          const color =
            product.colors.find((c) => c.id === currentColor.id) ||
            product.colors[0];

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/80 rounded-2xl p-4 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {product.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {product.category}
                  </span>
                </div>

                {/* SVG Render Stage */}
                <div className="w-full aspect-square bg-[#0B0F19] rounded-xl overflow-hidden p-2 border border-slate-800/80 relative flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                  <ProductMockupSvg
                    product={product}
                    color={color}
                    logo={logo}
                    showPrintBoundary={false}
                    isInteractive={false}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Color: {color.name}
                </span>
                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
