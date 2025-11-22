# NotARobot.com - Production Deployment Checklist

## 🚀 Pre-Deployment Requirements

### ✅ Environment Variables (Required for Production)

Create these in your Vercel dashboard under Project Settings → Environment Variables:

#### Critical (Must Have)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=sk_live_... (production key)
STRIPE_WEBHOOK_SECRET=whsec_... (production webhook secret)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

#### AI Services
```
ANTHROPIC_API_KEY=sk-ant-... (production key)
GROQ_API_KEY=gsk_... (production key)
GROQ_API_KEY_PAID=gsk_... (backup key)
```

#### Optional (Recommended)
```
TELEGRAM_BOT_TOKEN=... (for rate limiting alerts)
TELEGRAM_CHAT_ID=... (for rate limiting alerts)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-... (for analytics)
```

### ✅ Supabase Setup

1. **Database Schema**: ✅ Already created
2. **RLS Policies**: ✅ Already configured
3. **Stripe Integration**: 
   - Configure Stripe webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Test webhook events in Stripe dashboard

### ✅ Stripe Configuration

1. **Production Mode**: Switch to live mode in Stripe dashboard
2. **Webhook Endpoint**: Add production webhook URL
3. **Price IDs**: Update with live price IDs in pricing page
4. **Domain**: Add your domain to Stripe settings

## 📋 Deployment Steps

### Step 1: Login to Vercel
```bash
npx vercel login
```

### Step 2: Link Project
```bash
npx vercel link
```

### Step 3: Set Environment Variables
Either:
- Use Vercel Dashboard (recommended)
- Or use CLI: `npx vercel env add`

### Step 4: Deploy
```bash
npx vercel --prod
```

### Step 5: Post-Deployment Tests
- [ ] Test all pages load
- [ ] Test user authentication
- [ ] Test payment flow (small amount)
- [ ] Test AI services
- [ ] Verify webhooks work
- [ ] Check error handling

## 🔧 Production Configuration

### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Next.js Configuration
Already configured for production in `next.config.js`

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enabled via `@vercel/analytics` package
- Track page views and performance

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay

## 🚨 Post-Deployment Checklist

### Security Verification
- [ ] All API endpoints require authentication
- [ ] Stripe webhooks are properly secured
- [ ] Environment variables are not exposed
- [ ] HTTPS is enforced
- [ ] RLS policies are working

### Performance Verification
- [ ] Page load times <3 seconds
- [ ] Core Web Vitals are good
- [ ] Images are optimized
- [ ] Bundle size is reasonable

### Functionality Verification
- [ ] User registration/login works
- [ ] Payment processing works
- [ ] AI services respond correctly
- [ ] Data persistence works
- [ ] Error pages are user-friendly

## 🔄 CI/CD Setup (Optional)

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support & Monitoring

### Monitoring Tools
- Vercel Analytics (built-in)
- Stripe Dashboard (for payments)
- Supabase Dashboard (for database)
- Google Analytics (for user behavior)

### Alert Setup
- Stripe payment failures
- High error rates
- Database connection issues
- API rate limiting

---

## 🎯 Ready to Deploy!

Once you've completed the pre-deployment requirements above, run:

```bash
npx vercel --prod
```

Your application will be live at a `vercel.app` domain, then you can:
1. Add custom domain
2. Configure DNS
3. Set up SSL (automatic with Vercel)
4. Test everything thoroughly

**Good luck! 🚀**
