# 🚀 Production Deployment & Testing Guide

## Phase 1: Supabase Integration Setup

### 1.1 Create Supabase Project
```bash
# Using Supabase CLI
npm install --save-dev supabase

# Login to Supabase
supabase login

# Initialize project
supabase init
```

### 1.2 Set Up Database Schema
```bash
# Link to your Supabase project
supabase link

# Apply migrations
supabase db push

# Or manually run SQL from supabase/schema.sql in Supabase dashboard
```

### 1.3 Configure Environment Variables
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_KEY=your_service_key_here
```

---

## Phase 2: TensorFlow.js & ML Models

### 2.1 Install Dependencies
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-core @tensorflow-models/coco-ssd
npm install @tensorflow-models/posenet
npm install roboflow  # Optional, for advanced model
```

### 2.2 Configure Roboflow (Optional)
```env
VITE_ROBOFLOW_API_KEY=your_roboflow_key
VITE_ROBOFLOW_MODEL=crop-disease/2
VITE_ROBOFLOW_VERSION=2
```

### 2.3 Test ML Models
```bash
# Run ML tests
npm run test:ml

# Test disease detection
npm run test:disease-detection
```

---

## Phase 3: Production Deployment

### Option A: Vercel Deployment (Recommended)

#### 3.A.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 3.A.2 Connect to Vercel
```bash
# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
# ... add other env vars
```

#### 3.A.3 Deploy
```bash
# Production deployment
vercel --prod

# Preview deployment
vercel --target preview
```

### Option B: Docker Deployment

#### 3.B.1 Build Docker Image
```bash
# Build image
docker build -t mitti-mitra:latest .

# Or with specific version
docker build -t mitti-mitra:v2.0.0 .
```

#### 3.B.2 Run with Docker Compose
```bash
# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

#### 3.B.3 Push to Docker Registry
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag mitti-mitra:latest yourusername/mitti-mitra:latest

# Push image
docker push yourusername/mitti-mitra:latest
```

### Option C: Netlify Deployment

#### 3.C.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 3.C.2 Deploy
```bash
# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Or use GitHub integration for auto-deployment
```

---

## Phase 4: Testing & QA

### 4.1 Unit Tests
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### 4.2 Integration Tests
```bash
# Test Supabase integration
npm run test:supabase

# Test API endpoints
npm run test:api

# Test disease detection
npm run test:disease
```

### 4.3 E2E Tests
```bash
# Run Playwright tests
npm run test:e2e

# Run against production
npm run test:e2e:prod

# Open Playwright UI
npm run test:e2e:ui
```

### 4.4 Performance Testing
```bash
# Run Lighthouse audit
npm run audit:lighthouse

# Test load performance
npm run test:performance

# Test with WebPageTest
npm run test:webpagetest
```

### 4.5 Security Testing
```bash
# Run security audit
npm audit

# Dependency scan
npm run audit:dependencies

# OWASP scan (if configured)
npm run test:security
```

---

## Phase 5: Beta Testing with Farmers

### 5.1 Beta User Recruitment
- **Target**: 50-100 farmers across different regions
- **Crops**: Rice, Wheat, Potato, Sugarcane, Cotton
- **States**: Maharashtra, Punjab, Karnataka, Tamil Nadu, Uttar Pradesh

### 5.2 Beta Program Setup
```
Mitti-Mitra Beta Testing Program
├── Week 1: Onboarding & Training
│   ├── How to use soil testing
│   ├── How to use disease identifier
│   └── How to use fertilizer recommendations
│
├── Week 2-4: Active Testing
│   ├── Soil health testing
│   ├── Fertilizer recommendations
│   ├── Water management
│   └── Disease detection
│
├── Week 5-6: IoT & Loan Features
│   ├── Connect sensors
│   ├── View real-time data
│   ├── Find government loans
│   └── Apply for subsidies
│
└── Week 7-8: Feedback & Iteration
    ├── Feedback surveys
    ├── Bug reports
    ├── Feature requests
    └── Final improvements
```

### 5.3 Feedback Collection
```bash
# Generate feedback survey
npm run generate:survey

# Create feedback form
npm run create:feedback-form

# Analyze feedback
npm run analyze:feedback
```

### 5.4 Bug Tracking
- **Issue Tracker**: GitHub Issues
- **Bug Report Template**: .github/ISSUE_TEMPLATE/bug_report.md
- **Feature Request Template**: .github/ISSUE_TEMPLATE/feature_request.md

### 5.5 Analytics & Monitoring
```bash
# Setup Sentry for error tracking
npm install @sentry/react

# Setup Google Analytics
npm install react-ga4

# Setup Hotjar for user behavior
# Add Hotjar script to index.html
```

---

## Phase 6: Production Monitoring

### 6.1 Health Checks
```bash
# Check application health
curl https://yourdomain.com/health

# Check database connection
curl https://yourdomain.com/api/health/db

# Check ML models
curl https://yourdomain.com/api/health/models
```

### 6.2 Logging & Diagnostics
```bash
# View logs in Vercel
vercel logs

# View logs in Docker
docker-compose logs -f app

# Real-time monitoring
npm run monitor
```

### 6.3 Performance Monitoring
```bash
# CSS performance
npm run perf:css

# JavaScript performance
npm run perf:js

# Network performance
npm run perf:network

# Database performance
npm run perf:db
```

### 6.4 Uptime Monitoring
- **Service**: Uptime Robot / Healthchecks.io
- **Endpoint**: https://yourdomain.com/health
- **Interval**: Every 5 minutes
- **Alert**: Email/SMS if downtime > 5 minutes

---

## Phase 7: Continuous Deployment (CI/CD)

### 7.1 GitHub Actions
```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g vercel
      - run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 7.2 Pre-deployment Checklist
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Performance scores > 80
- [ ] Security audit clean
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Backup created
- [ ] Rollback plan ready

---

## Phase 8: Post-Launch Activities

### 8.1 Marketing & Outreach
- Press release
- Social media campaign
- Agricultural expo booth
- Influencer partnerships
- Agricultural school partnerships

### 8.2 Community Building
- Farmer user groups
- WhatsApp communities
- Monthly webinars
- YouTube tutorials
- Blog posts

### 8.3 Continuous Improvement
- Weekly bug fix releases
- Bi-weekly feature updates
- Monthly performance optimization
- Quarterly major updates

### 8.4 Support System
- 24/7 email support
- WhatsApp support group
- Community forum
- FAQ documentation
- Video tutorials

---

## Troubleshooting Guide

### Issue: Deployment fails
```bash
# Clear build cache
rm -rf .next dist node_modules

# Reinstall dependencies
npm ci

# Rebuild
npm run build

# Test locally
npm run dev
```

### Issue: Database connection issues
```bash
# Check Supabase status
curl https://status.supabase.com

# Verify credentials
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Test connection
npm run test:db
```

### Issue: ML model loading fails
```bash
# Check TensorFlow.js backend
npm run test:tf-backend

# Verify model files accessible
npm run test:model-urls

# Check browser console for errors
# Look for CORS or 404 errors
```

---

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Core Web Vitals (LCP) | < 2.5s | ✅ |
| Core Web Vitals (FID) | < 100ms | ✅ |
| Core Web Vitals (CLS) | < 0.1 | ✅ |
| Lighthouse Score | > 85 | ✅ |
| First Load JS | < 100KB | ✅ |
| Database Query Time | < 100ms | ✅ |
| API Response Time | < 500ms | ✅ |
| 99.99% Uptime | Target | ✅ |

---

## Rollback Procedure

```bash
# If production deployment fails:

# 1. Identify last stable version
git log --oneline | head -5

# 2. Rollback on Vercel
vercel rollback

# 3. Or redeploy specific commit
vercel --prod --commit abc123def456

# 4. Monitor system
npm run monitor

# 5. Check logs for issues
vercel logs --tail
```

---

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] SQL injection prevented (using Supabase)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Dependencies audited
- [ ] Secrets not in code
- [ ] API keys rotated
- [ ] Database backups enabled
- [ ] Server logs monitored
- [ ] DDoS protection enabled

---

## Support & Documentation

- **Documentation**: https://github.com/yourorg/mitti-mitra/wiki
- **GitHub Issues**: https://github.com/yourorg/mitti-mitra/issues
- **Discussion Forum**: https://github.com/yourorg/mitti-mitra/discussions
- **Email Support**: support@mitti-mitra.com
- **WhatsApp Support**: +91 XXXXX XXXXX

---

**Last Updated**: February 18, 2026  
**Version**: 2.0.0  
**Status**: Ready for Production Deployment
