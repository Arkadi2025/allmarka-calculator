# Deploy guide

## Vercel (recommended)
1. Push repository to GitHub.
2. Open Vercel and click **Add New Project**.
3. Import this repository.
4. Vercel will detect Vite automatically (using `vercel.json`).
5. Click **Deploy**.
6. After deploy, Vercel gives you a public URL.

## Netlify
1. Push repository to GitHub.
2. Open Netlify and click **Add new site** -> **Import an existing project**.
3. Select this repository.
4. Netlify uses settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**.
6. After deploy, Netlify gives you a public URL.

## Important note
If your environment blocks npm packages (403), deploy must be done from a CI/platform
that has normal access to npm registry.
