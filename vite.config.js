import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Mock Netlify functions locally during `npm run dev`
function netlifyFunctionsPlugin() {
  return {
    name: 'netlify-functions-mock',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/.netlify/functions/')) {
          const functionName = req.url.split('/')[3].split('?')[0];
          const functionPath = path.resolve(__dirname, `netlify/functions/${functionName}.js`);
          
          if (fs.existsSync(functionPath)) {
            // Read body
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
              try {
                // Dynamically import the handler (add timestamp to bypass cache)
                const { handler } = await import(`file://${functionPath}?t=${Date.now()}`);
                
                // Construct fake Netlify event
                const event = {
                  httpMethod: req.method,
                  body: body || null,
                  queryStringParameters: {},
                };
                
                // Execute handler
                const result = await handler(event, {});
                
                res.statusCode = result.statusCode || 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(result.body);
              } catch (err) {
                console.error('Error executing mock netlify function:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Local function execution failed' }));
              }
            });
            return; // Don't call next()
          }
        }
        next();
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), netlifyFunctionsPlugin()],
})
