import React from 'react';
import { ProductItem, ProductColor, LogoState } from '../types/mockup';

interface ProductMockupSvgProps {
  product: ProductItem;
  color: ProductColor;
  logo: LogoState;
  showPrintBoundary?: boolean;
  isInteractive?: boolean;
  onLogoMouseDown?: (e: React.MouseEvent) => void;
  onLogoTouchStart?: (e: React.TouchEvent) => void;
  canvasRef?: React.RefObject<SVGSVGElement | null>;
}

export const ProductMockupSvg: React.FC<ProductMockupSvgProps> = ({
  product,
  color,
  logo,
  showPrintBoundary = true,
  isInteractive = true,
  onLogoMouseDown,
  onLogoTouchStart,
  canvasRef,
}) => {
  const { printableArea } = product;
  const isDark = color.isDark;

  // Calculate logo position within the SVG viewBox (0 0 600 600)
  const zoneLeft = (printableArea.x / 100) * 600;
  const zoneTop = (printableArea.y / 100) * 600;
  const zoneWidth = (printableArea.width / 100) * 600;
  const zoneHeight = (printableArea.height / 100) * 600;

  // Logo center point in SVG units
  const logoCenterX = zoneLeft + (logo.x / 100) * zoneWidth;
  const logoCenterY = zoneTop + (logo.y / 100) * zoneHeight;

  // Base logo display size relative to zone width
  const baseSize = Math.min(zoneWidth, zoneHeight) * 0.75;
  const logoWidth = baseSize * logo.scale;
  const logoHeight = baseSize * logo.scale;

  // Blend mode map for SVG & CSS
  const getBlendStyle = (): React.CSSProperties => {
    let filter = '';
    if (logo.decalFinish === 'vintage') {
      filter = 'contrast(90%) brightness(95%) saturate(85%)';
    } else if (logo.decalFinish === 'gloss') {
      filter = 'contrast(115%) brightness(108%) drop-shadow(0 2px 4px rgba(0,0,0,0.25))';
    } else if (logo.decalFinish === 'embroidery') {
      filter = 'drop-shadow(1px 1px 1px rgba(0,0,0,0.45)) contrast(105%)';
    }

    return {
      mixBlendMode: logo.blendMode,
      opacity: logo.opacity / 100,
      filter: filter || undefined,
      transformOrigin: `${logoCenterX}px ${logoCenterY}px`,
      transform: `
        rotate(${logo.rotation}deg)
        scaleX(${logo.flipX ? -1 : 1})
        scaleY(${logo.flipY ? -1 : 1})
      `,
      cursor: isInteractive ? 'grab' : 'default',
    };
  };

  return (
    <svg
      ref={canvasRef}
      viewBox="0 0 600 600"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Studio Ground Shadow */}
        <radialGradient id="studio-floor-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Fabric Fold Lighting Gradients */}
        <linearGradient id="tshirt-fold-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.28" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
        </linearGradient>

        <linearGradient id="tshirt-fold-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
        </linearGradient>

        {/* Ceramic Mug Cylindrical Shading */}
        <linearGradient id="mug-cylinder-shading" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="12%" stopColor="#000000" stopOpacity="0.1" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="90%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </linearGradient>

        {/* Stainless Steel Tumbler Specular Highlight */}
        <linearGradient id="tumbler-specular" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="75%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>

        {/* Clip paths for products to contain prints cleanly */}
        <clipPath id="mug-body-clip">
          <path d="M 180 180 C 180 175 185 170 190 170 L 410 170 C 415 170 420 175 420 180 L 412 430 C 410 445 395 455 380 455 L 220 455 C 205 455 190 445 188 430 Z" />
        </clipPath>

        <clipPath id="tumbler-body-clip">
          <path d="M 215 170 L 385 170 L 368 470 C 367 480 358 488 348 488 L 252 488 C 242 488 233 480 232 470 Z" />
        </clipPath>

        <clipPath id="phonecase-clip">
          <rect x="180" y="80" width="240" height="440" rx="36" />
        </clipPath>

        <clipPath id="tote-body-clip">
          <path d="M 170 210 L 430 210 L 420 480 C 418 495 405 505 390 505 L 210 505 C 195 505 182 495 180 480 Z" />
        </clipPath>
      </defs>

      {/* 1. Backdrop Studio Shadow */}
      <ellipse cx="300" cy="525" rx="190" ry="24" fill="url(#studio-floor-shadow)" />

      {/* 2. Product Base Structure & Shading */}
      {product.renderType === 'tshirt' && (
        <g id="tshirt-product">
          {/* T-Shirt Silhouette */}
          <path
            d="M 220 115 
               C 250 145 350 145 380 115 
               L 470 180 
               L 425 245 
               L 385 220 
               L 388 490 
               C 388 498 382 505 374 505 
               L 226 505 
               C 218 505 212 498 212 490 
               L 215 220 
               L 175 245 
               L 130 180 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'}
            strokeWidth="1.5"
          />

          {/* Sleeve Stitch Lines */}
          <path d="M 425 245 L 385 220" stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'} strokeWidth="1.5" strokeDasharray="3,2" />
          <path d="M 175 245 L 130 180" stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'} strokeWidth="1.5" strokeDasharray="3,2" />

          {/* Collar Ribbing */}
          <path
            d="M 220 115 C 255 155 345 155 380 115 C 360 102 240 102 220 115 Z"
            fill={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}
            stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)'}
            strokeWidth="2"
          />
          {/* Inner Back Neck */}
          <path
            d="M 230 112 C 265 125 335 125 370 112 C 350 100 250 100 230 112 Z"
            fill={isDark ? '#0F172A' : '#CBD5E1'}
          />

          {/* Side Torso Folds & Shading */}
          <path
            d="M 215 220 Q 240 360 212 490 L 250 490 Q 260 360 240 220 Z"
            fill="url(#tshirt-fold-left)"
          />
          <path
            d="M 385 220 Q 360 360 388 490 L 350 490 Q 340 360 360 220 Z"
            fill="url(#tshirt-fold-right)"
          />

          {/* Subtle Fabric Chest Highlight */}
          <ellipse
            cx="300"
            cy="290"
            rx="95"
            ry="110"
            fill={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.3)'}
          />
          {/* Bottom Hem */}
          <path d="M 213 495 L 387 495" stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'} strokeWidth="1.5" strokeDasharray="3,2" />
        </g>
      )}

      {product.renderType === 'hoodie' && (
        <g id="hoodie-product">
          {/* Hoodie Body & Sleeves */}
          <path
            d="M 210 140 
               C 240 160 360 160 390 140 
               L 495 210 
               L 445 350 
               L 405 320 
               L 408 505 
               L 192 505 
               L 195 320 
               L 155 350 
               L 105 210 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'}
            strokeWidth="1.5"
          />

          {/* Heavy Hood Structure */}
          <path
            d="M 210 140 C 190 70 230 40 300 40 C 370 40 410 70 390 140 C 360 115 240 115 210 140 Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="2"
          />
          <path
            d="M 235 130 C 240 85 270 70 300 70 C 330 70 360 85 365 130 C 340 118 260 118 235 130 Z"
            fill={isDark ? '#0B0F19' : '#94A3B8'}
          />

          {/* Drawstrings */}
          <path d="M 270 120 Q 268 180 262 235" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 330 120 Q 332 175 338 230" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="262" cy="237" r="3.5" fill="#94A3B8" />
          <circle cx="338" cy="232" r="3.5" fill="#94A3B8" />

          {/* Kangaroo Pocket */}
          <path
            d="M 235 390 L 365 390 L 385 465 L 215 465 Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="2"
          />
          {/* Ribbed Bottom Band */}
          <rect x="192" y="480" width="216" height="25" fill={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.06)'} />
        </g>
      )}

      {product.renderType === 'mug' && (
        <g id="mug-product">
          {/* Mug Handle */}
          <path
            d="M 390 220 
               C 490 220 490 380 390 380 
               L 390 345 
               C 450 345 450 255 390 255 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'}
            strokeWidth="2"
          />
          {/* Mug Ceramic Body */}
          <path
            d="M 180 180 
               C 180 175 185 170 190 170 
               L 410 170 
               C 415 170 420 175 420 180 
               L 412 430 
               C 410 445 395 455 380 455 
               L 220 455 
               C 205 455 190 445 188 430 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="2"
          />

          {/* Mug Top Rim Opening */}
          <ellipse cx="300" cy="170" rx="110" ry="16" fill={color.hex} stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'} strokeWidth="2" />
          <ellipse cx="300" cy="170" rx="100" ry="12" fill={isDark ? '#0A0E17' : '#E2E8F0'} />

          {/* Ceramic Cylindrical Highlight & Shadow Overlay */}
          <rect x="180" y="170" width="240" height="285" fill="url(#mug-cylinder-shading)" clipPath="url(#mug-body-clip)" />
        </g>
      )}

      {product.renderType === 'tumbler' && (
        <g id="tumbler-product">
          {/* Tumbler Lid */}
          <rect x="225" y="130" width="150" height="25" rx="6" fill="#1E293B" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <rect x="240" y="122" width="40" height="10" rx="3" fill="#64748B" />
          <rect x="220" y="155" width="160" height="15" fill="#334155" />

          {/* Tumbler Body */}
          <path
            d="M 215 170 
               L 385 170 
               L 368 470 
               C 367 480 358 488 348 488 
               L 252 488 
               C 242 488 233 480 232 470 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'}
            strokeWidth="2"
          />

          {/* Metallic Specular Highlights */}
          <rect x="215" y="170" width="170" height="318" fill="url(#tumbler-specular)" clipPath="url(#tumbler-body-clip)" />
        </g>
      )}

      {product.renderType === 'totebag' && (
        <g id="totebag-product">
          {/* Tote Straps */}
          <path d="M 225 210 C 225 90 255 70 300 70 C 345 70 375 90 375 210" fill="none" stroke={color.hex} strokeWidth="18" strokeLinecap="round" />
          <path d="M 225 210 C 225 90 255 70 300 70 C 345 70 375 90 375 210" fill="none" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'} strokeWidth="18" strokeLinecap="round" />

          {/* Canvas Bag Body */}
          <path
            d="M 170 210 
               L 430 210 
               L 420 480 
               C 418 495 405 505 390 505 
               L 210 505 
               C 195 505 182 495 180 480 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="2"
          />

          {/* Canvas Texture Lines & Seams */}
          <path d="M 170 230 L 430 230" stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'} strokeWidth="2" strokeDasharray="4,3" />
          <path d="M 225 210 L 225 240" stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeWidth="3" />
          <path d="M 375 210 L 375 240" stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeWidth="3" />

          {/* Organic Fabric Folds */}
          <path d="M 200 240 Q 230 460 210 495" stroke="rgba(0,0,0,0.08)" strokeWidth="8" fill="none" />
          <path d="M 400 240 Q 370 460 390 495" stroke="rgba(0,0,0,0.12)" strokeWidth="8" fill="none" />
        </g>
      )}

      {product.renderType === 'phonecase' && (
        <g id="phonecase-product">
          {/* Phone Case Outer Shell */}
          <rect
            x="180"
            y="80"
            width="240"
            height="440"
            rx="36"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'}
            strokeWidth="3"
          />

          {/* Camera Bump */}
          <rect
            x="198"
            y="98"
            width="80"
            height="85"
            rx="18"
            fill={isDark ? '#000000' : '#1E293B'}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
          />
          {/* Lenses */}
          <circle cx="222" cy="120" r="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <circle cx="222" cy="120" r="8" fill="#1E293B" />
          <circle cx="254" cy="120" r="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <circle cx="254" cy="120" r="8" fill="#1E293B" />
          <circle cx="238" cy="155" r="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <circle cx="238" cy="155" r="8" fill="#1E293B" />
          {/* Flash & Sensor */}
          <circle cx="264" cy="150" r="4" fill="#FDE047" />

          {/* Subtle Corner Bevel Reflection */}
          <path
            d="M 210 84 L 390 84 C 408 84 416 92 416 110 L 416 490"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            fill="none"
          />
        </g>
      )}

      {product.renderType === 'hat' && (
        <g id="hat-product">
          {/* Snapback Crown */}
          <path
            d="M 180 320 
               C 170 170 230 110 300 110 
               C 370 110 430 170 420 320 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="2"
          />

          {/* Crown Seam Panels */}
          <path d="M 300 110 L 300 320" stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'} strokeWidth="1.5" />
          <path d="M 300 110 Q 230 210 200 320" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)'} strokeWidth="1.5" />
          <path d="M 300 110 Q 370 210 400 320" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)'} strokeWidth="1.5" />

          {/* Top Button */}
          <ellipse cx="300" cy="110" rx="9" ry="6" fill={color.hex} stroke={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)'} strokeWidth="1.5" />

          {/* Ventilation Eyelets */}
          <circle cx="250" cy="180" r="3" fill="none" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'} strokeWidth="1.5" />
          <circle cx="350" cy="180" r="3" fill="none" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'} strokeWidth="1.5" />

          {/* Flat Brim / Visor */}
          <path
            d="M 150 310 
               C 150 300 180 290 300 290 
               C 420 290 450 300 450 310 
               C 440 375 390 395 300 395 
               C 210 395 160 375 150 310 
               Z"
            fill={color.hex}
            stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'}
            strokeWidth="2"
          />
          {/* Brim Stitching Arcs */}
          <path d="M 180 325 C 220 370 380 370 420 325" fill="none" stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)'} strokeWidth="1" strokeDasharray="3,2" />
          <path d="M 195 338 C 230 378 370 378 405 338" fill="none" stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)'} strokeWidth="1" strokeDasharray="3,2" />
        </g>
      )}

      {/* 3. Printable Safe Boundary (Visual Guide) */}
      {showPrintBoundary && (
        <rect
          x={zoneLeft}
          y={zoneTop}
          width={zoneWidth}
          height={zoneHeight}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.5"
          pointerEvents="none"
        />
      )}

      {/* 4. The Interactive Placed Logo Layer */}
      {logo.src && (
        <g
          id="placed-logo-group"
          style={getBlendStyle()}
          onMouseDown={onLogoMouseDown}
          onTouchStart={onLogoTouchStart}
        >
          <image
            href={logo.src}
            x={logoCenterX - logoWidth / 2}
            y={logoCenterY - logoHeight / 2}
            width={logoWidth}
            height={logoHeight}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      )}

      {/* 5. Natural Ambient Studio Highlight on Top */}
      <rect
        x="0"
        y="0"
        width="600"
        height="600"
        fill="url(#studio-floor-shadow)"
        pointerEvents="none"
        opacity="0.08"
      />
    </svg>
  );
};
