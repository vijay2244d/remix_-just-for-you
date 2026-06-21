import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import https from 'https';
import { Readable } from 'stream';

export default defineConfig(() => {
  return {
    base: process.env.VITE_BASE_PATH || './',
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'gdrive-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/gdrive/download')) {
              try {
                const query = req.url.split('?')[1] || '';
                const driveUrl = `https://drive.usercontent.google.com/download?${query}`;
                
                const headers: Record<string, string> = {
                  'Referer': 'https://drive.google.com/',
                };
                if (req.headers.range) {
                  headers['Range'] = req.headers.range;
                }
                
                const response = await fetch(driveUrl, { headers });
                
                res.statusCode = response.status;
                for (const [key, val] of response.headers.entries()) {
                  const lowerKey = key.toLowerCase();
                  if (['content-type', 'content-length', 'content-range', 'accept-ranges'].includes(lowerKey)) {
                    res.setHeader(lowerKey, val);
                  }
                }
                
                if (response.body) {
                  const nodeStream = Readable.fromWeb(response.body as any);
                  nodeStream.on('error', (err) => {
                    console.error('GDrive proxy stream error:', err);
                  });
                  res.on('close', () => {
                    nodeStream.destroy();
                  });
                  nodeStream.pipe(res);
                } else {
                  res.end();
                }
              } catch (err) {
                console.error('GDrive proxy error:', err);
                if (!res.headersSent) {
                  res.statusCode = 500;
                  res.end('Proxy Error');
                }
              }
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/gdrive': {
          target: 'https://drive.usercontent.google.com',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/gdrive/, ''),
          headers: {
            'Referer': 'https://drive.google.com/',
          },
          agent: new https.Agent({ keepAlive: true }),
        },
      },
    },
  };
});
