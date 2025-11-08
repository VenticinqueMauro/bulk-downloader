# Proxy Backend Setup Guide

## Overview

Due to CORS (Cross-Origin Resource Sharing) restrictions, browser extensions cannot directly fetch content from arbitrary websites. To solve this, we need to implement a backend proxy service that will:

1. Receive URL requests from the extension
2. Fetch the HTML content from the target URL
3. Return the content to the extension with appropriate CORS headers

## Option 1: Vercel Serverless Function (Recommended)

Vercel offers a generous free tier and is easy to deploy.

### Setup Steps

1. **Create a new Vercel project**
   ```bash
   mkdir gemini-downloader-proxy
   cd gemini-downloader-proxy
   npm init -y
   npm install node-fetch
   ```

2. **Create the API endpoint**

   Create `api/scrape.js`:
   ```javascript
   import fetch from 'node-fetch';

   export default async function handler(req, res) {
     // Enable CORS
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

     // Handle preflight request
     if (req.method === 'OPTIONS') {
       return res.status(200).end();
     }

     const { url } = req.query;

     if (!url) {
       return res.status(400).json({ error: 'URL parameter is required' });
     }

     try {
       // Validate URL
       const targetUrl = new URL(url);

       // Fetch the content
       const response = await fetch(targetUrl.href, {
         headers: {
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
         },
         timeout: 15000 // 15 second timeout
       });

       if (!response.ok) {
         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
       }

       const html = await response.text();

       return res.status(200).send(html);
     } catch (error) {
       console.error('Error fetching URL:', error);
       return res.status(500).json({
         error: 'Failed to fetch URL',
         message: error.message
       });
     }
   }
   ```

3. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel deploy
   ```

4. **Update your extension**

   In `services/geminiService.ts`, update the `fetchUrlContent` function:
   ```typescript
   const PROXY_URL = 'https://your-project.vercel.app/api/scrape';

   const fetchUrlContent = async (url: string): Promise<string> => {
     const response = await fetch(`${PROXY_URL}?url=${encodeURIComponent(url)}`);

     if (!response.ok) {
       throw new Error(`Failed to fetch content via proxy: ${response.statusText}`);
     }

     return response.text();
   };
   ```

## Option 2: Cloudflare Workers

Cloudflare Workers also offers a generous free tier (100,000 requests/day).

### Setup Steps

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Create a new Worker project**
   ```bash
   wrangler init gemini-proxy
   cd gemini-proxy
   ```

3. **Create the worker script**

   Edit `src/index.js`:
   ```javascript
   export default {
     async fetch(request, env, ctx) {
       // Enable CORS
       const corsHeaders = {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET, OPTIONS',
         'Access-Control-Allow-Headers': 'Content-Type',
       };

       // Handle preflight
       if (request.method === 'OPTIONS') {
         return new Response(null, { headers: corsHeaders });
       }

       const url = new URL(request.url);
       const targetUrl = url.searchParams.get('url');

       if (!targetUrl) {
         return new Response('Missing url parameter', {
           status: 400,
           headers: corsHeaders
         });
       }

       try {
         const response = await fetch(targetUrl, {
           headers: {
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
           }
         });

         const html = await response.text();

         return new Response(html, {
           headers: {
             ...corsHeaders,
             'Content-Type': 'text/html'
           }
         });
       } catch (error) {
         return new Response(`Error: ${error.message}`, {
           status: 500,
           headers: corsHeaders
         });
       }
     },
   };
   ```

4. **Deploy**
   ```bash
   wrangler deploy
   ```

## Option 3: AWS Lambda + API Gateway

For production use with high traffic, AWS Lambda offers excellent scalability.

### Setup Steps

1. **Create Lambda function** in AWS Console
2. **Use Node.js runtime**
3. **Add the following code**:

   ```javascript
   const https = require('https');
   const http = require('http');

   exports.handler = async (event) => {
     const headers = {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'GET, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type',
     };

     if (event.httpMethod === 'OPTIONS') {
       return { statusCode: 200, headers, body: '' };
     }

     const targetUrl = event.queryStringParameters?.url;

     if (!targetUrl) {
       return {
         statusCode: 400,
         headers,
         body: JSON.stringify({ error: 'URL parameter required' })
       };
     }

     try {
       const html = await fetchUrl(targetUrl);
       return {
         statusCode: 200,
         headers: { ...headers, 'Content-Type': 'text/html' },
         body: html
       };
     } catch (error) {
       return {
         statusCode: 500,
         headers,
         body: JSON.stringify({ error: error.message })
       };
     }
   };

   function fetchUrl(url) {
     return new Promise((resolve, reject) => {
       const client = url.startsWith('https') ? https : http;

       client.get(url, (response) => {
         let data = '';
         response.on('data', chunk => data += chunk);
         response.on('end', () => resolve(data));
       }).on('error', reject);
     });
   }
   ```

4. **Create API Gateway** and link to Lambda
5. **Deploy and get the endpoint URL**

## Security Considerations

### Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// Example with Vercel
const rateLimit = new Map();

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 30;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip).filter(time => now - time < windowMs);

  if (requests.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  requests.push(now);
  rateLimit.set(ip, requests);

  // ... rest of the handler
}
```

### URL Validation

Always validate URLs to prevent SSRF attacks:

```javascript
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);

    // Block local/private IPs
    if (url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname.startsWith('192.168.') ||
        url.hostname.startsWith('10.') ||
        url.hostname.startsWith('172.16.')) {
      return false;
    }

    // Only allow http/https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
```

## Testing the Proxy

Once deployed, test your proxy:

```bash
# Replace with your actual proxy URL
curl "https://your-proxy.vercel.app/api/scrape?url=https://example.com"
```

## Integration with Extension

Update `services/geminiService.ts`:

```typescript
// Replace this constant with your deployed proxy URL
const PROXY_URL = 'https://your-proxy.vercel.app/api/scrape';

const fetchUrlContent = async (url: string): Promise<string> => {
  try {
    const response = await fetch(`${PROXY_URL}?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error(`Proxy returned ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return html;
  } catch (error) {
    console.error('Error fetching URL content:', error);
    throw new Error(`Failed to fetch content from URL: ${error.message}`);
  }
};
```

## Cost Estimates

| Platform | Free Tier | Cost After Free Tier |
|----------|-----------|---------------------|
| **Vercel** | 100GB bandwidth/month | $20/month for Pro |
| **Cloudflare Workers** | 100,000 requests/day | $5/10M requests |
| **AWS Lambda** | 1M requests/month | $0.20/1M requests |

## Troubleshooting

### CORS Errors
- Ensure `Access-Control-Allow-Origin: *` header is set
- Check that preflight OPTIONS requests are handled

### Timeout Errors
- Increase timeout settings in your proxy
- Some websites may take longer to respond

### 403/Blocked Requests
- Add a proper User-Agent header
- Some sites block automated requests - this is expected

## Next Steps

1. Choose your preferred platform
2. Deploy the proxy service
3. Update `PROXY_URL` in `geminiService.ts`
4. Remove the mock implementation
5. Test with real URLs

## Support

For issues or questions:
- Check the platform-specific documentation
- Review error logs in your deployment dashboard
- Test the proxy endpoint independently before integrating
