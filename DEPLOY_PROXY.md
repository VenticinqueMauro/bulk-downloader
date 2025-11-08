# Quick Start: Deploy Your Proxy

This guide will help you deploy the CORS proxy in **5 minutes**.

## Prerequisites

- A Vercel account (free): https://vercel.com/signup
- Git installed on your computer

## Step 1: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to proxy folder**:
   ```bash
   cd ../gemini-proxy
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

5. **Copy your URL** - You'll see something like:
   ```
   https://gemini-proxy-abc123.vercel.app
   ```

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new

2. Click "Import Git Repository"

3. Create a GitHub repo for the `gemini-proxy` folder

4. Import the repository in Vercel

5. Deploy (Vercel will auto-detect settings)

6. Copy your deployment URL from the dashboard

## Step 2: Configure the Extension

1. **Open** `bulk-downloader/services/geminiService.ts`

2. **Find line 49** (around there):
   ```typescript
   const PROXY_URL = ''; // Example: 'https://your-project.vercel.app/api/scrape'
   ```

3. **Update** with your Vercel URL:
   ```typescript
   const PROXY_URL = 'https://your-project-abc123.vercel.app/api/scrape';
   ```

   **Important**: Include `/api/scrape` at the end!

4. **Save** the file

## Step 3: Rebuild the Extension

```bash
cd bulk-downloader
npm run build
```

## Step 4: Test It!

1. **Reload** the extension in Chrome (`chrome://extensions/`)

2. **Open** the extension popup

3. **Try a scan** with a real URL (e.g., `https://example.com`)

4. **Check console** for logs:
   - ✅ `Successfully fetched...` = Working!
   - ❌ `Cannot connect to proxy...` = Check your PROXY_URL

## Troubleshooting

### "Cannot connect to proxy server"

- ✅ Check that PROXY_URL ends with `/api/scrape`
- ✅ Verify the proxy is deployed (visit the URL in your browser)
- ✅ Check Vercel dashboard for deployment errors

### "Rate limit exceeded"

- Wait 60 seconds (free tier limit: 30 requests/minute)
- Or upgrade your Vercel plan

### Proxy returns errors

- Check Vercel function logs in dashboard
- Verify the target URL is accessible
- Make sure you're not trying to access localhost/private IPs

## Verify Deployment

Test your proxy directly in the browser:

```
https://your-project.vercel.app/api/scrape?url=https://example.com
```

You should see the HTML content of example.com!

## Next Steps

- 🎉 Your extension now works with real URLs!
- 📊 Monitor usage in Vercel Dashboard
- 📈 Upgrade to Pro if you hit free tier limits

## Cost

- **Free tier**: 100GB bandwidth/month
- **Pro**: $20/month for unlimited

Most users will be fine with the free tier!

---

**Need help?** Check `PROXY_SETUP.md` for detailed documentation.
