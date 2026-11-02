import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Generous limit for high-resolution base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/**
 * Health check & capabilities info
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    models: ['gemini-3-pro-image-preview', 'gemini-3-pro-image', 'gemini-nano-banana-2.1'],
  });
});

/**
 * High-Quality Image Generation Endpoint
 * Generates photorealistic product mockup scenes using gemini-3-pro-image-preview (with 1K, 2K, 4K affordances)
 */
app.post('/api/mockup/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      model = 'gemini-3-pro-image-preview',
      imageSize = '1K',
      aspectRatio = '1:1',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A valid text prompt is required.' });
    }

    const ai = getAiClient();
    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const validAspects = ['1:1', '4:3', '16:9', '3:4', '9:16', '1:4', '4:1'];
    const selectedAspect = validAspects.includes(aspectRatio) ? aspectRatio : '1:1';

    // Model candidate attempts (primary requested: gemini-3-pro-image-preview, fallback to gemini-3-pro-image)
    const targetModel = model.trim();
    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: selectedAspect,
            imageSize: selectedSize,
          },
        },
      });
    } catch (primaryErr: any) {
      // If gemini-3-pro-image-preview fails with 404, fallback to gemini-3-pro-image
      if (primaryErr?.status === 404 || primaryErr?.message?.includes('not found')) {
        console.warn(`Model ${targetModel} not found, falling back to gemini-3-pro-image`);
        response = await ai.models.generateContent({
          model: 'gemini-3-pro-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: selectedAspect,
              imageSize: selectedSize,
            },
          },
        });
      } else {
        throw primaryErr;
      }
    }

    let imageUrl: string | null = null;
    let descriptionText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        descriptionText += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image was returned by the model.',
        details: descriptionText || 'Model returned text without image data.',
      });
    }

    return res.json({
      imageUrl,
      description: descriptionText,
      modelUsed: targetModel,
      imageSize: selectedSize,
      aspectRatio: selectedAspect,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Failed to generate image';
    return res.status(status).json({
      error: message,
      details: error?.error?.message || error?.toString(),
    });
  }
});

/**
 * Image Edit Endpoint
 * Uses gemini-nano-banana-2.1 to edit or blend images with text prompts
 */
app.post('/api/mockup/edit', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      imageBase64,
      mimeType = 'image/png',
      model = 'gemini-nano-banana-2.1',
      imageSize = '1K',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A text prompt describing the edit is required.' });
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Base image data (base64) is required for editing.' });
    }

    // Strip data URL header if passed
    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const ai = getAiClient();
    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const response = await ai.models.generateContent({
      model: model || 'gemini-nano-banana-2.1',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: selectedSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let descriptionText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        descriptionText += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No edited image was returned by the model.',
        details: descriptionText || 'Model returned text without image data.',
      });
    }

    return res.json({
      imageUrl,
      description: descriptionText,
      modelUsed: model || 'gemini-nano-banana-2.1',
    });
  } catch (error: any) {
    console.error('Error editing image:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Failed to edit image';
    return res.status(status).json({
      error: message,
      details: error?.error?.message || error?.toString(),
    });
  }
});

/**
 * Generate Brand Logo Endpoint
 * Creates high-quality vector-style logos and marks with transparent background look
 */
app.post('/api/mockup/generate-logo', async (req: Request, res: Response) => {
  try {
    const { prompt, style = 'minimal vector' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAiClient();
    const logoPrompt = `Minimalist modern graphic brand logo mark for: "${prompt}". Style: ${style}. Clean crisp edges, flat vector graphic insignia on solid pure white background, centered, professional merchandise apparel graphic design, high resolution, no text artifacts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: [{ text: logoPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '1K',
        },
      },
    });

    let imageUrl: string | null = null;
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No logo image generated' });
    }

    return res.json({ imageUrl });
  } catch (error: any) {
    console.error('Error generating logo:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate logo' });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MockupCraft Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
