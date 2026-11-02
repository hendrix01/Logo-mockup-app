# MockupCraft Studio

MockupCraft Studio is a feature-rich, interactive web application that allows users to upload logos, customize their placement on realistic product mockups (such as apparel, mugs, and accessories), preview multiple products simultaneously, and leverage Google Gemini AI to generate creative studio scenes and logo concepts.

---

## Features

- **Interactive Canvas & Mockups:** Position, scale, and rotate your custom logos onto a variety of product mockups in real-time.
- **Multi-Product Preview:** See your design previewed across multiple items simultaneously.
- **Inspector Panel:** Fine-tune adjustments, color overlays, blending modes, and scaling constraints.
- **Google Gemini AI Integration:** Generate AI-powered logo concepts and studio scene mockups.
- **Export Options:** Download or share high-resolution product mockups effortlessly.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide React
- **Backend/API:** Node.js, Express, TypeScript (with `@google/genai`)
- **Package Manager:** Bun / npm

---

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) or Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hendrix01/Logo-mockup-app.git
   cd Logo-mockup-app
   ```

2. Install dependencies:
   ```bash
   bun install
   # or npm install
   ```

3. Set up your environment variables:
   Copy `.env.example` to `.env` and add your Google AI Studio API key:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

---

## Running the Application

Start the development server:

```bash
bun run dev
# or npm run dev
```

The application will be running locally (typically on `http://localhost:3000` or the port specified by Vite/Express).

---

## Scripts

- `bun run dev` / `npm run dev` — Start the development server (Express + Vite).
- `bun run build` / `npm run build` — Build the application for production.
- `bun run start` / `npm run start` — Run the production server.
- `bun run lint` — Run TypeScript type checking.

---

## License

This project is open source and available under the [MIT License](LICENSE).
