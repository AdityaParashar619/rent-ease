import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// LINT.IfChange(aistudio_media_plugin)
function aistudioMediaPlugin(): Plugin {
  return {
    name: 'vite-plugin-aistudio-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/assets/aistudio/')) {
          const rawPath = req.url.split('?')[0].split('#')[0];
          try {
            const decodedPath = decodeURIComponent(rawPath);
            const relativePath = decodedPath.replace(/^\//, '');
            const aistudioDir = path.resolve(
              __dirname,
              'public',
              'assets',
              'aistudio',
            );
            const filePath = path.resolve(__dirname, 'public', relativePath);
            if (
              filePath.startsWith(aistudioDir + path.sep) &&
              fs.existsSync(filePath) &&
              fs.statSync(filePath).isFile()
            ) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.bmp': 'image/bmp',
                '.ico': 'image/x-icon',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.ogv': 'video/ogg',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.ogg': 'audio/ogg',
                '.pdf': 'application/pdf',
              };
              res.setHeader(
                'Content-Type',
                mimeMap[ext] || 'application/octet-stream',
              );
              res.setHeader('Cache-Control', 'no-cache');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch {
            // Fall through if URI decoding or file access fails
          }
        }
        next();
      });
    },
  };
}
// LINT.ThenChange(//depot/google3/java/com/google/alkali/boq/makersuite/applet_dev_service/templates/initializers/react_theme/vite.config.ts:aistudio_media_plugin)

function groqAiPlugin(): Plugin {
  return {
    name: 'vite-plugin-groq-ai',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/ai/')) {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const payload = body ? JSON.parse(body) : {};
                const apiKey = process.env.GROQ_API_KEY || '';
                const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

                if (req.url?.includes('/generate-description')) {
                  const { category = 'RESIDENTIAL', subType = 'Apartment', locality = 'Bengaluru', bedrooms = 2, area = 1200, furnishing = 'Semi-Furnished', keyFeatures = [] } = payload;

                  if (apiKey && !apiKey.includes('YOUR_')) {
                    const prompt = `You are a premier real estate copywriter. Write an enticing, truthful listing description for a rental property.
Details:
- Category: ${category} (${subType})
- Location: ${locality}
- Size: ${bedrooms} BHK, ${area} sq.ft
- Furnishing: ${furnishing}
- Amenities: ${Array.isArray(keyFeatures) ? keyFeatures.join(', ') : 'Power Backup, 24/7 Security, Parking'}

Return ONLY a JSON object with this exact shape:
{
  "title": "A captivating, concise title under 60 chars",
  "description": "2-3 well-structured paragraphs highlighting lifestyle, convenience, natural light, and community amenities.",
  "suggestedAmenities": ["List", "of", "4-6", "pertinent", "amenities"],
  "estimatedRentMin": 28000,
  "estimatedRentMax": 36000
}`;

                    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        response_format: { type: 'json_object' },
                      }),
                    });

                    if (groqRes.ok) {
                      const groqData = await groqRes.json();
                      const contentStr = groqData.choices?.[0]?.message?.content || '{}';
                      const parsed = JSON.parse(contentStr);
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({
                        success: true,
                        message: 'Generated successfully with Groq Llama 3.3',
                        data: {
                          ...parsed,
                          modelUsed: model,
                        },
                      }));
                      return;
                    }
                  }

                  // Intelligent rule-based fallback if no key provided
                  const title = `${bedrooms}BHK ${furnishing} ${subType} in ${locality}`;
                  const desc = `Step into this beautifully appointed ${bedrooms}BHK ${subType.toLowerCase()} situated in prime ${locality}. Offering ${area} sq.ft of thoughtful living space with generous ventilation and abundant natural illumination.\n\nKey highlights include premium flooring, ${furnishing.toLowerCase()} interior fittings, reliable 24/7 power backup, and dedicated security. Ideally positioned in close proximity to prominent retail hubs, tech corridors, and metro transit stations.\n\nVerified directly by owner on RentEase with zero hidden broker markups.`;

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    message: 'Generated using RentEase AI Assistant (Configure GROQ_API_KEY for live Groq inference)',
                    data: {
                      title,
                      description: desc,
                      suggestedAmenities: ['24/7 Security', 'Power Backup', 'Dedicated Parking', 'Elevator', 'High-Speed Wi-Fi'],
                      estimatedRentMin: bedrooms === 1 ? 18000 : bedrooms === 2 ? 32000 : 48000,
                      estimatedRentMax: bedrooms === 1 ? 24000 : bedrooms === 2 ? 42000 : 62000,
                      modelUsed: 'rentease-groq-engine',
                    },
                  }));
                  return;
                }

                if (req.url?.includes('/chat')) {
                  const { prompt, listingContext } = payload;
                  if (apiKey && !apiKey.includes('YOUR_')) {
                    const systemMsg = `You are RentEase's helpful AI Rental Concierge. Answer the tenant's question politely, concisely, and accurately based on this property: ${JSON.stringify(listingContext || {})}.`;
                    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        model,
                        messages: [
                          { role: 'system', content: systemMsg },
                          { role: 'user', content: prompt || 'Tell me about this rental.' },
                        ],
                        temperature: 0.6,
                        max_tokens: 300,
                      }),
                    });

                    if (groqRes.ok) {
                      const groqData = await groqRes.json();
                      const reply = groqData.choices?.[0]?.message?.content || 'Here to help with your rental inquiry!';
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, reply, modelUsed: model }));
                      return;
                    }
                  }

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    reply: `Hello! This property in ${listingContext?.location?.locality || 'Bengaluru'} is directly listed by verified ${listingContext?.listerType === 'OWNER' ? 'owner' : 'broker'} ${listingContext?.listerName || ''}. Rent is ₹${listingContext?.price?.toLocaleString?.('en-IN') || 'standard'}${listingContext?.priceUnit || '/mo'} with a refundable security deposit of ₹${listingContext?.securityDeposit?.toLocaleString?.('en-IN') || ''}. Schedule a visit or connect directly via the verified contact details on this page!`,
                    modelUsed: 'rentease-groq-engine',
                  }));
                  return;
                }
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, message: err?.message || 'AI processing error' }));
                return;
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      aistudioMediaPlugin(),
      groqAiPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
