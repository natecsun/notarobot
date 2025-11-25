# Google Search Console Setup Guide

## Step 1: Add Property to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Choose "URL prefix" and enter: `https://www.notarobot.com`
4. Click "Continue"

## Step 2: Verify Ownership

### Option A: HTML Meta Tag (Recommended)
1. In Search Console, select "HTML tag" verification method
2. Copy the verification code (looks like: `google1234567890abcdef`)
3. Add to your `.env.production` file:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google1234567890abcdef
   ```
4. Deploy the site
5. Click "Verify" in Search Console

### Option B: DNS Verification
1. Select "DNS record" verification
2. Add the TXT record to your domain's DNS settings
3. Wait for DNS propagation (can take up to 48 hours)
4. Click "Verify"

## Step 3: Submit Sitemap

1. In Search Console, go to "Sitemaps" in the left menu
2. Enter: `sitemap.xml`
3. Click "Submit"

Your sitemap is automatically generated at:
- https://www.notarobot.com/sitemap.xml

## Step 4: Request Indexing

For important pages, you can request immediate indexing:

1. Go to "URL Inspection" in Search Console
2. Enter the URL you want indexed
3. Click "Request Indexing"

Priority pages to index:
- https://www.notarobot.com/
- https://www.notarobot.com/services/resume
- https://www.notarobot.com/game
- https://www.notarobot.com/pricing
- https://www.notarobot.com/blog

## Step 5: Monitor Performance

After a few days, check:
- **Performance**: Search queries, clicks, impressions
- **Coverage**: Which pages are indexed
- **Enhancements**: Mobile usability, Core Web Vitals

## Troubleshooting

### Sitemap not found
Make sure the site is deployed and `/sitemap.xml` returns XML

### Pages not indexing
- Check robots.txt isn't blocking the page
- Ensure page has unique, valuable content
- Add internal links to the page

### Verification failing
- Clear Vercel cache and redeploy
- Wait a few minutes after deployment
- Try DNS verification as backup

## Current Status

- ✅ Sitemap generated: `/sitemap.xml`
- ✅ Robots.txt configured: `/robots.txt`
- ✅ Meta tags added to layout
- ⏳ Verification: Add your code to `.env.production`
- ⏳ Submit sitemap in Search Console
