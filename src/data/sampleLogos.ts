export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
}

// Crisp vector SVG data URLs designed for optimal print preview on both light & dark products
const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'apex-athletics',
    name: 'Apex Athletic',
    category: 'Sport & Streetwear',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <defs>
          <linearGradient id="apex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
        </defs>
        <path d="M150 30 L270 240 L210 240 L150 120 L90 240 L30 240 Z" fill="url(#apex-grad)" stroke="#1E293B" stroke-width="4"/>
        <path d="M150 160 L185 240 L115 240 Z" fill="#F8FAFC"/>
        <text x="150" y="280" font-family="'Outfit', sans-serif" font-weight="800" font-size="28" fill="#0F172A" text-anchor="middle" letter-spacing="4">APEX LABS</text>
      </svg>
    `),
  },
  {
    id: 'aurora-coffee',
    name: 'Aurora Roastery',
    category: 'Food & Drink',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <circle cx="150" cy="150" r="135" fill="#FEF3C7" stroke="#78350F" stroke-width="6"/>
        <circle cx="150" cy="150" r="120" fill="none" stroke="#92400E" stroke-width="2" stroke-dasharray="6,4"/>
        <path d="M110 170 Q150 120 190 170 C190 190 110 190 110 170 Z" fill="#78350F"/>
        <path d="M150 100 Q160 80 150 65" stroke="#D97706" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M135 105 Q145 85 135 70" stroke="#D97706" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M165 105 Q175 85 165 70" stroke="#D97706" stroke-width="4" fill="none" stroke-linecap="round"/>
        <text x="150" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="18" fill="#78350F" text-anchor="middle" letter-spacing="2">AURORA COFFEE</text>
        <text x="150" y="245" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="3">ORGANIC ROASTERS</text>
      </svg>
    `),
  },
  {
    id: 'pioneer-outdoor',
    name: 'Pioneer Wild',
    category: 'Adventure & Outdoor',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <polygon points="150,20 270,90 270,220 150,285 30,220 30,90" fill="#064E3B" stroke="#047857" stroke-width="5"/>
        <polygon points="150,35 255,98 255,212 150,270 45,212 45,98" fill="#022C22"/>
        <path d="M80 200 L150 90 L220 200 Z" fill="#059669"/>
        <path d="M150 90 L185 145 L150 145 L170 175 L130 175 L150 145 Z" fill="#A7F3D0"/>
        <text x="150" y="245" font-family="'Outfit', sans-serif" font-weight="700" font-size="20" fill="#ECFDF5" text-anchor="middle" letter-spacing="3">PIONEER CO.</text>
      </svg>
    `),
  },
  {
    id: 'cyber-horizon',
    name: 'Horizon Wave',
    category: 'Tech & Music',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <defs>
          <linearGradient id="cyber-sun" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#F43F5E"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </linearGradient>
        </defs>
        <circle cx="150" cy="140" r="85" fill="url(#cyber-sun)"/>
        <rect x="65" y="140" width="170" height="6" fill="#090D16"/>
        <rect x="70" y="152" width="160" height="8" fill="#090D16"/>
        <rect x="80" y="166" width="140" height="10" fill="#090D16"/>
        <rect x="95" y="182" width="110" height="12" fill="#090D16"/>
        <text x="150" y="250" font-family="'Outfit', sans-serif" font-weight="800" font-size="24" fill="#06B6D4" text-anchor="middle" letter-spacing="4">HORIZON</text>
      </svg>
    `),
  },
  {
    id: 'botanica-organic',
    name: 'Botanica Studio',
    category: 'Lifestyle & Beauty',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <circle cx="150" cy="150" r="130" fill="none" stroke="#1E293B" stroke-width="2"/>
        <path d="M150 50 C210 100 230 180 150 240 C70 180 90 100 150 50 Z" fill="#0F766E"/>
        <path d="M150 50 L150 240" stroke="#CCFBF1" stroke-width="3"/>
        <path d="M150 110 Q190 120 180 150" stroke="#CCFBF1" stroke-width="2.5" fill="none"/>
        <path d="M150 140 Q110 150 120 180" stroke="#CCFBF1" stroke-width="2.5" fill="none"/>
        <path d="M150 170 Q180 180 170 200" stroke="#CCFBF1" stroke-width="2.5" fill="none"/>
        <text x="150" y="275" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="16" fill="#0F172A" text-anchor="middle" letter-spacing="4">BOTANICA</text>
      </svg>
    `),
  },
  {
    id: 'nova-labs',
    name: 'Nova Labs',
    category: 'Minimalist & Modern',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <path d="M90 150 C90 115 120 85 150 85 C180 85 210 115 210 150 C210 185 180 215 150 215 C120 215 90 185 90 150 Z" fill="none" stroke="#6366F1" stroke-width="18"/>
        <circle cx="150" cy="150" r="28" fill="#EC4899"/>
        <text x="150" y="270" font-family="'Outfit', sans-serif" font-weight="700" font-size="22" fill="#0F172A" text-anchor="middle" letter-spacing="3">NOVA</text>
      </svg>
    `),
  },
];
