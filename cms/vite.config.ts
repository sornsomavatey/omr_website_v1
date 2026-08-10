import { defineConfig, type UserConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

function cmsDevServerPlugin(): Plugin {
  const sseClients: any[] = [];

  return {
    name: 'cms-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Set CORS headers for real-time frontend integration
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // SSE Real-time Stream Endpoint
        if (req.url === '/api/cms/realtime-stream') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          sseClients.push(res);
          req.on('close', () => {
            const idx = sseClients.indexOf(res);
            if (idx !== -1) sseClients.splice(idx, 1);
          });
          return;
        }

        // Read JSON File
        if (req.url?.startsWith('/api/cms/read-json') && req.method === 'GET') {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const filename = urlObj.searchParams.get('filename') || '';
            const safeName = path.basename(filename);
            const targetDir = filename.startsWith('locales/')
              ? path.resolve(__dirname, '../Frontend/public/locales')
              : path.resolve(__dirname, '../Frontend/public/mocks');
            const targetPath = path.join(targetDir, safeName);

            if (!fs.existsSync(targetPath)) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: `File ${safeName} not found` }));
            }

            const content = fs.readFileSync(targetPath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            return res.end(content);
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        // Save JSON File
        if (req.url === '/api/cms/save-json' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, content } = JSON.parse(body);
              if (!filename || typeof filename !== 'string') {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Filename is required' }));
              }
              const safeName = path.basename(filename);
              const targetDir = filename.startsWith('locales/')
                ? path.resolve(__dirname, '../Frontend/public/locales')
                : path.resolve(__dirname, '../Frontend/public/mocks');
              
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }

              const targetPath = path.join(targetDir, safeName);
              const jsonStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
              fs.writeFileSync(targetPath, jsonStr, 'utf-8');

              // Broadcast real-time update to all connected frontend SSE clients
              const payload = JSON.stringify({ filename: safeName, content: typeof content === 'string' ? JSON.parse(content) : content, timestamp: Date.now() });
              sseClients.forEach((client) => {
                try {
                  client.write(`data: ${payload}\n\n`);
                } catch (e) {
                  // Client disconnected
                }
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: `Saved ${safeName} successfully to Frontend/public/` }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // Upload Image File
        if (req.url === '/api/cms/upload-image' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { fileName, fileData } = JSON.parse(body);
              if (!fileName || !fileData) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'fileName and fileData are required' }));
              }

              const safeName = path.basename(fileName);
              const uploadsDir = path.resolve(__dirname, '../Frontend/public/uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const base64Content = fileData.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Content, 'base64');
              const targetPath = path.join(uploadsDir, safeName);
              fs.writeFileSync(targetPath, buffer);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: `/uploads/${safeName}` }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig((): UserConfig => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      cmsDevServerPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3002,
      host: true,
    },
  };
});
