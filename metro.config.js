const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Proxy Ollama API requests to avoid CORS
config.server = {
  ...config.server,
  experimentalMiddleware: (app) => {
    app.use('/api/ollama', (req, res) => {
      const target = 'http://127.0.0.1:11434/v1';
      const url = target + req.url.replace('/api/ollama', '');
      const headers = { ...req.headers, host: '127.0.0.1:11434' };
      delete headers['origin'];
      delete headers['referer'];

      fetch(url, {
        method: req.method,
        headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      })
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(err => {
          console.error('Ollama proxy error:', err);
          res.status(500).json({ error: err.message });
        });
    });
  },
};

module.exports = config;