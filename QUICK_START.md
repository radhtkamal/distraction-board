# 🚀 Quick Start Guide

Your Distraction Board PWA is ready! Here's how to get started.

## ✅ What's Done

✓ Complete React + Vite PWA app  
✓ All 5 categories ready to use  
✓ Daily entries with date history  
✓ Export/backup functionality  
✓ Service worker for offline support  
✓ localStorage-based storage (free, no backend)  
✓ Production build ready

## 🏃 How to Run Locally

### Option 1: Development Mode (Hot Reload)

```bash
cd /Users/radhwanakamal/Documents/Obsidian\ Vault/2026/self/distraction-board
npm run dev
```

Then open your browser to `http://localhost:8080` (or whatever port appears in terminal)

### Option 2: Production Mode (Optimized)

```bash
cd /Users/radhwanakamal/Documents/Obsidian\ Vault/2026/self/distraction-board
npm run build
npm run preview
```

Then open the URL shown in terminal.

## 📱 Install on iPad

### Step 1: Access the App

- Open Safari on your iPad
- Go to `http://localhost:8080` (or your deployment URL)

### Step 2: Add to Home Screen

1. Tap the **Share** button (bottom or top of screen)
2. Scroll and select **"Add to Home Screen"**
3. Name it: "Distraction Board"
4. Tap **"Add"**

### Step 3: Done!

You now have an app icon on your iPad home screen. Tap it anytime to open the distraction board.

## 📊 Features You Have

### ✨ Five Categories

- ❤️ Relationships / Social
- 📚 School / Learning
- 💼 Work / Career
- 🧠 Emotional / Mental
- 🏠 Life Admin

### 🔄 Daily Workflow

1. **During work:** Tap "Add thought" → type → press Enter
2. **After work:** Review all entries → delete or clear as needed
3. **History:** Use date picker to see past entries anytime

### 💾 Data Features

- **Auto-saving:** Saves to localStorage instantly
- **Daily reset:** New day = new entries (past ones still accessible)
- **Export:** Click "Export" to download JSON backup
- **Offline:** Works without internet (service worker enabled)
- **Free:** No backend or subscriptions needed

## 🎯 First Time Setup

1. **First entry:** Open app → pick a category → click "Add thought"
2. **Quick capture:** Type 1-2 sentences, press Enter
3. **View history:** Use the date picker to jump to any day
4. **Export backup:** Click "Export" to download everything

## 📝 Tips for Best Results

✅ **Keep entries SHORT** (1-2 sentences max)  
✅ **Be SPECIFIC** ("Anxiety about deadline" not "Work stuff")  
✅ **Capture FAST** (15-30 seconds per entry)  
✅ **Review DAILY** (Same time each day works best)  
✅ **TRUST THE SYSTEM** (This is the key!)

## 🔧 Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Storage:** Browser localStorage (persistent)
- **PWA:** Service Worker + Web Manifest
- **Deploy:** Ready for Vercel, Netlify, or GitHub Pages

## 📦 What Each Folder Contains

```
distraction-board/
├── src/                    # React source code
│   ├── App.jsx            # Main app component
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom hooks (useStorage)
│   └── index.css          # Global Tailwind styles
├── public/                # PWA files
│   ├── manifest.json      # PWA metadata
│   └── sw.js              # Service worker
├── dist/                  # Production build (ready to deploy)
├── package.json           # Dependencies list
└── README.md              # Full documentation
```

## 🚢 Deploying (Optional)

Once you want to share it or access from iPad:

### Deploy to Vercel (Easiest)

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

Drag and drop the `dist/` folder to Netlify

### Deploy to GitHub Pages

Push to GitHub and enable Pages from the repo settings

## ❓ Troubleshooting

**"App won't start?"**

- Make sure you're in the right directory
- Run `npm install` again
- Try a different port: modify `vite.config.js`

**"Can't add entries?"**

- Check browser console (F12) for errors
- Clear browser cache and reload
- Make sure localStorage is enabled

**"PWA won't install on iPad?"**

- Must be HTTPS (localhost works in dev)
- Use Safari on iOS
- Check that manifest.json loads (check Network tab in DevTools)

**"Lost my data?"**

- Data is in browser localStorage
- Export regularly as backup
- Don't clear browser cache/data

## 📞 Need Help?

Check the full README.md for detailed information about:

- Design philosophy
- How to use the tool
- Export/backup process
- Browser compatibility

---

**You're all set!** 🎉

The app is built and ready. Just run `npm run dev` and start capturing those distracting thoughts!

Remember: **Capture = relief. Reviewing during work = sabotage. Trust the system.**
