# Configuration

This folder contains all configuration files for the project.

## Files

### Build & Development
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - ESLint rules

### Deployment
- `vercel.json` - Vercel deployment configuration
- `Dockerfile` - Production Docker image
- `Dockerfile.dev` - Development Docker image
- `docker-compose.yml` - Docker Compose configuration

## Vite Configuration

```javascript
// Key settings in vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

## Docker Usage

### Development
```bash
docker-compose up
```

### Production Build
```bash
docker build -f config/Dockerfile -t ikshan-app .
```

## Vercel Deployment

The project is deployed on Vercel. Configuration in `vercel.json` handles:
- API routes mapping
- Build settings
- Environment variables

## Environment Variables

Required environment variables (set in `.env`):
```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL_NAME=gpt-4o-mini
VITE_GOOGLE_CLIENT_ID=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Notes

- Configuration files are copied here for organization
- Original files remain at root for build tools compatibility
- When updating configs, update both locations
