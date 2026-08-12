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

        // Serve /uploads/* static files directly in CMS
        if (req.url?.startsWith('/uploads/')) {
          const cleanPath = decodeURIComponent(req.url.split('?')[0]);
          const uploadsFilePath = path.join(__dirname, '../Frontend/public', cleanPath);
          if (fs.existsSync(uploadsFilePath)) {
            const stat = fs.statSync(uploadsFilePath);
            if (stat.isFile()) {
              if (cleanPath.endsWith('.mov')) res.setHeader('Content-Type', 'video/quicktime');
              else if (cleanPath.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
              else if (cleanPath.endsWith('.webm')) res.setHeader('Content-Type', 'video/webm');
              res.statusCode = 200;
              return fs.createReadStream(uploadsFilePath).pipe(res);
            }
          }
        }

        // Serve /src/assets/* static files directly in CMS
        if (req.url?.startsWith('/src/assets/')) {
          const cleanPath = decodeURIComponent(req.url.split('?')[0]);
          const relativeAssetPath = cleanPath.replace('/src/assets/', '');
          const assetFilePath = path.join(__dirname, '../Frontend/src/assets', relativeAssetPath);
          if (fs.existsSync(assetFilePath)) {
            const stat = fs.statSync(assetFilePath);
            if (stat.isFile()) {
              if (cleanPath.endsWith('.mov')) res.setHeader('Content-Type', 'video/quicktime');
              else if (cleanPath.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
              else if (cleanPath.endsWith('.webm')) res.setHeader('Content-Type', 'video/webm');
              res.statusCode = 200;
              return fs.createReadStream(assetFilePath).pipe(res);
            }
          }
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

              const base64Content = fileData.replace(/^data:[^;]+;base64,/, '');
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

        // Publish to Production Endpoint
        if (req.url === '/api/cms/publish-production' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const { commitMessage, items } = JSON.parse(body || '{}');
              const msg = commitMessage || 'cms: publish content updates to production';

              // Write all items to Frontend/public/
              if (Array.isArray(items)) {
                items.forEach((item: { filename: string; content: any }) => {
                  if (item.filename && item.content) {
                    const safeName = path.basename(item.filename);
                    const targetDir = item.filename.startsWith('locales/')
                      ? path.resolve(__dirname, '../Frontend/public/locales')
                      : path.resolve(__dirname, '../Frontend/public/mocks');
                    if (!fs.existsSync(targetDir)) {
                      fs.mkdirSync(targetDir, { recursive: true });
                    }
                    const targetPath = path.join(targetDir, safeName);
                    const jsonStr = typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2);
                    fs.writeFileSync(targetPath, jsonStr, 'utf-8');
                  }
                });
              }

              // Try local git commit & push if git repository exists
              let gitMsg = '';
              try {
                const rootDir = path.resolve(__dirname, '..');
                const execOpts = { cwd: rootDir, encoding: 'utf-8' as const };
                const { execSync } = require('child_process');
                execSync('git add Frontend/public/', execOpts);
                try {
                  execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, execOpts);
                  gitMsg = 'Committed to local Git.';
                } catch {
                  gitMsg = 'No new git changes to commit.';
                }
                try {
                  execSync('git push', execOpts);
                  gitMsg += ' Pushed to remote GitHub branch successfully!';
                } catch {
                  gitMsg += ' (Local commit ready, remote push pending)';
                }
              } catch (gitErr: any) {
                console.warn('Git command execution notice:', gitErr?.message);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: `Successfully saved ${items?.length || 0} CMS content file(s)! ${gitMsg}`
              }));
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
