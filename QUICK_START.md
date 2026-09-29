# ⚡ Quick Start Guide - Mitti-Mitra v2.0

> Get up and running in 5 minutes!

---

## 📋 Pre-requisites
- Node.js v18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Git installed

---

## 🚀 Step 1: Clone & Install (2 minutes)

```bash
# Clone the project
git clone https://github.com/yourorg/mitti-mitra.git
cd mitti-mitra

# Install dependencies
npm install

# Or use yarn/pnpm
yarn install
pnpm install
```

---

## ⚙️ Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local
nano .env.local  # or use your editor
```

**Minimum required** (to get started):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from [supabase.com](https://supabase.com):
1. Create free account
2. Create new project
3. Copy Project URL and Anon Key from settings

---

## 🔧 Step 3: Setup Database (1 minute)

```bash
# Option A: Use Supabase CLI (recommended)
npm install -g supabase
supabase link
supabase db push

# Option B: Manual (copy supabase/schema.sql to Supabase dashboard)
# 1. Go to Supabase dashboard
# 2. SQL Editor → New Query
# 3. Copy contents of supabase/schema.sql
# 4. Run it
```

---

## 🎨 Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

Visit: **http://localhost:5173**

🎉 **You're in!** Try these features:
- 🌱 Soil Health Testing
- 🍽️ Fertilizer Recommendations
- 💧 Water Management
- 🐛 Disease Detection
- 💰 Loan Finder
- 📡 IoT Sensors

---

## 📱 Test Features

### 1️⃣ Soil Health Testing
```
Go to: http://localhost:5173/features/soil-testing
1. Adjust NPK, pH, moisture sliders
2. Click "Analyze Soil"
3. See health score, recommendations, suitable crops
```

### 2️⃣ Disease Detection
```
Go to: http://localhost:5173/features/disease-detection
1. Select crop (rice, wheat, potato, etc.)
2. Upload or drag leaf image
3. Click "Detect Disease"
4. Get diagnosis + treatment options
```

### 3️⃣ Water Management
```
Go to: http://localhost:5173/features/water-management
1. Select crop
2. Enter farm size (1-50 hectares)
3. Click "Generate Schedule"
4. See irrigation plan + water savings
```

---

## 🚀 Deploy to Production

### Option A: Vercel (Easiest - 2 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# (or `vercel env add` command)
```

**Live in production!** ✨

### Option B: Docker (5 minutes)

```bash
# Build Docker image
docker build -t mitti-mitra .

# Setup environment
cp .env.example .env

# Run with compose
docker-compose up -d

# Access at: http://localhost:3000
```

---

## 🧪 Run Tests

```bash
# Unit tests
npm run test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Lint code
npm run lint
```

---

## 📚 Important Docs

Read these files in order:
1. 📖 [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - Detailed setup
2. 🚀 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment
3. 📊 [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - What was built
4. 🎯 [FEATURE_ROADMAP.md](FEATURE_ROADMAP.md) - Future plans

---

## 💡 Key Features

### 🌱 Soil Testing
View soil health score instantly with:
- NPK analysis
- pH recommendations
- Moisture monitoring
- Suitable crops

### 🍽️ Fertilizer AI
Get smart suggestions for:
- Current growth stage
- Soil deficiencies
- Cost estimation
- Full season scheduling

### 💧 Irrigation Planner
Optimize water with:
- ET-based scheduling
- Rainfall accounting
- Cost projections
- Method recommendations

### 🐛 Disease Detector
Identify diseases using:
- Image recognition (AI)
- Treatment protocols
- Prevention tips
- Urgency alerts

### 💰 Loan Tracker
Find government benefits:
- 4 loan schemes
- 4 subsidy programs
- EMI calculator
- Eligibility check

### 📡 IoT Dashboard
Monitor farm in real-time with:
- 7 sensor types
- 5 connectivity options
- Live alerts
- Historical trends

---

## 🎨 Customize Theme

All colors in `src/theme/agricultureTheme.ts`:

```typescript
// Change primary green to your preference
primary: {
  main: '#4CAF50',  // Edit this
  dark: '#2E7D32',
}

// Add your company colors
secondary: {
  main: '#FF9800',  // Orange
}

// Change typography
fontFamily: {
  primary: '"Poppins", sans-serif',
}
```

---

## 🔐 Security Essentials

Before deploying to production:

- [ ] Change default Supabase password
- [ ] Enable 2FA on Supabase account
- [ ] Rotate API keys monthly
- [ ] Enable HTTPS
- [ ] Set security headers
- [ ] Enable rate limiting
- [ ] Setup monitoring
- [ ] Regular backups

---

## 📞 Need Help?

### Quick Issues

**Blank page?**
- Check browser console (F12)
- Verify Supabase URL in `.env.local`
- Restart dev server: `npm run dev`

**Database errors?**
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Run schema setup again

**Images not loading?**
- Check image URLs are correct
- Verify Supabase Storage is enabled
- Check CORS settings

### Documentation
- 📖 [Full Setup Guide](SETUP_COMPLETE.md)
- 🚀 [Deployment Guide](DEPLOYMENT_GUIDE.md)
- 📊 [What's Implemented](IMPLEMENTATION_COMPLETE.md)

### Community
- 💬 GitHub Issues
- 📧 Email: support@mitti-mitra.com
- 🌐 Website: https://mitti-mitra.com

---

## 🎯 Next Actions

1. ✅ Clone & install
2. ✅ Setup Supabase
3. ✅ Run dev server
4. ✅ Test features
5. ✅ Deploy to production
6. ✅ Beta test with farmers
7. ✅ Gather feedback
8. ✅ Launch officially

---

## 🌟 Pro Tips

1. **Use VS Code** for best development experience
2. **Install Tailwind CSS Intellisense** extension
3. **Setup ESLint** in your editor
4. **Use dark mode** for less eye strain
5. **Keep `.env` file local** (don't commit!)
6. **Test mobile view** (Ctrl+Shift+M in browser)
7. **Check Lighthouse** for performance

---

## 📊 Project Size

| Item | Size |
|------|------|
| Source Code | ~10 MB |
| Node Modules | ~500 MB |
| Built App | ~150 KB |
| Database Schema | ~200 KB |
| Documentation | ~2 MB |

---

## ⏱️ Timeline

| Step | Time |
|------|------|
| Clone & Install | 2 min |
| Configure | 1 min |
| DB Setup | 1 min |
| Start Dev | 1 min |
| **Total** | **5 min** |

Then deploy in another 5-10 minutes! 🚀

---

## 🎉 Success Checklist

- [ ] Dev server running at localhost:5173
- [ ] Can see soil health testing page
- [ ] Can upload image for disease detection
- [ ] Water management generates schedule
- [ ] Loans page shows available schemes
- [ ] IoT sensors page loads
- [ ] No console errors
- [ ] Ready to deploy!

---

## 🚀 Final Step: Deploy

```bash
# Production build
npm run build

# Test production build locally
npm run preview

# Deploy to Vercel
vercel --prod

# Or Docker
docker-compose up -d
```

**Congratulations! 🎊 Your Mitti-Mitra app is live!**

---

**Need Quick Recap?**
```bash
# Clone
git clone <repo> && cd mitti-mitra

# Setup
npm install && cp .env.example .env.local

# Edit .env.local with your Supabase keys

# Run
npm run dev

# Deploy
vercel --prod
```

**Done! 🌾**

---

*Built for farmers. Powered by AI. Ready for production.* ✨
