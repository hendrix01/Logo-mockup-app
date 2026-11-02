import React from 'react';
import { ProductItem, ProductColor, ProductCategory } from '../types/mockup';
import { Check } from 'lucide-react';

interface ProductSelectorProps {
  products: ProductItem[];
  selectedProduct: ProductItem;
  selectedColor: ProductColor;
  onSelectProduct: (product: ProductItem) => void;
  onSelectColor: (color: ProductColor) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  selectedColor,
  onSelectProduct,
  onSelectColor,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<ProductCategory | 'all'>('all');

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'apparel', label: 'Apparel' },
    { id: 'drinkware', label: 'Drinkware' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts = products.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Category Filter Tabs */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 py-1.5 px-2 text-[11px] font-medium rounded-md transition-all whitespace-nowrap text-center ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredProducts.map((product) => {
          const isSelected = product.id === selectedProduct.id;
          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/50 border-slate-800/70 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                    {product.subtitle}
                  </p>
                </div>
                {isSelected && (
                  <span className="shrink-0 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Color Swatches Strip */}
              <div
                className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/60"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mr-1">
                  Colors:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {product.colors.map((c) => {
                    const isColorActive = isSelected && selectedColor.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (!isSelected) onSelectProduct(product);
                          onSelectColor(c);
                        }}
                        title={`${product.name} in ${c.name}`}
                        className={`w-4 h-4 rounded-full border transition-transform hover:scale-110 relative ${
                          isColorActive
                            ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-900 scale-110 border-white'
                            : 'border-white/20 hover:border-white/60'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Product Color Swatch Matrix Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300">
            Selected Colorway
          </span>
          <span className="text-[11px] font-mono text-indigo-300">
            {selectedColor.name}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {selectedProduct.colors.map((c) => {
            const isColorActive = selectedColor.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectColor(c)}
                title={c.name}
                className={`h-7 rounded-lg border flex items-center justify-center transition-all ${
                  isColorActive
                    ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 border-white scale-105'
                    : 'border-white/10 hover:border-white/40 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isColorActive && (
                  <Check
                    className={`w-3.5 h-3.5 stroke-[3] ${
                      c.isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
