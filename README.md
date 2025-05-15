# Torrentio Proxy

A simple Node.js proxy server that forwards requests to torrentio.strem.fun and returns the responses.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## Deployment

### Option 1: Deploy to a VPS/Dedicated Server

1. Copy these files to your server
2. Install Node.js if not already installed
3. Run `npm install` to install dependencies
4. Set up a process manager like PM2:
   ```
   npm install -g pm2
   pm2 start server.js --name "torrentio-proxy"
   pm2 save
   pm2 startup
   ```

5. Configure Nginx as a reverse proxy:
   ```nginx
   server {
     listen 80;
     server_name marounvideoplayerfast.online;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

6. Set up SSL with Let's Encrypt:
   ```
   certbot --nginx -d marounvideoplayerfast.online
   ```

### Option 2: Deploy to a Platform as a Service (PaaS)

#### Heroku
1. Create a Procfile:
   ```
   web: node server.js
   ```
2. Push to Heroku:
   ```
   heroku create
   git push heroku main
   ```

#### Vercel/Netlify
Create a vercel.json or netlify.toml file for configuration.

## Usage

Once deployed, the API endpoints will be available at your domain:

- Manifest: https://marounvideoplayerfast.online/manifest.json
- All other torrentio endpoints will be proxied automatically 