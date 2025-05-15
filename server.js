const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Route for manifest.json
app.get('/manifest.json', async (req, res) => {
  try {
    // Fetch data from torrentio
    const response = await fetch('https://torrentio.strem.fun/manifest.json');
    const data = await response.json();
    
    // Customize the response if needed
    data.name = "MarounVideoPlayerFast";
    data.id = "com.maroun.videoplayerfast";
    data.description = "Proxy for streaming services";
    
    // Send the response back
    res.json(data);
  } catch (error) {
    console.error('Error fetching manifest:', error);
    res.status(500).json({ error: 'Failed to fetch manifest' });
  }
});

// General proxy for all other torrentio endpoints
app.all('*', async (req, res) => {
  try {
    const targetUrl = `https://torrentio.strem.fun${req.originalUrl}`;
    console.log(`Proxying request to: ${targetUrl}`);
    
    // Forward the request with the same method, headers, and body
    const options = {
      method: req.method,
      headers: {
        'Content-Type': req.get('Content-Type') || 'application/json',
        'User-Agent': req.get('User-Agent') || 'Maroun-Proxy/1.0',
      },
    };
    
    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      options.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(targetUrl, options);
    const contentType = response.headers.get('content-type');
    
    // Set the appropriate content type header
    if (contentType) {
      res.set('Content-Type', contentType);
    }
    
    // Forward the response status
    res.status(response.status);
    
    // Handle the response based on content type
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Manifest available at: http://localhost:${PORT}/manifest.json`);
}); 